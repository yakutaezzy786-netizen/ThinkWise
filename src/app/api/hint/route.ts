import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { selectExamples, formatExamplesForPrompt } from '@/lib/hint-examples'
import { SCOPE_INSTRUCTION, GUARDRAIL_SYSTEM_PROMPT, getHintModel } from '@/lib/prompts'
import { fetchNIM } from '@/lib/nim-fetch'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not logged in' }, { status: 401 })

  const { query, grade, subject } = await request.json()
  const examples = selectExamples(subject, 1, grade)
  const exampleBlock = formatExamplesForPrompt(examples)

  const systemPrompt = `You are a ${subject} tutor for a Grade ${grade} student.
Rules:
- NEVER state the final answer.
- This is a Level 1 hint: ask what they've tried, or ask a clarifying question about the problem.
- Keep language simple enough for Grade ${grade}.
${SCOPE_INSTRUCTION}

Here are examples of good vs. bad hints at this exact level, for similar problems:

${exampleBlock}`

  const hintResult = await fetchNIM(
    getHintModel(subject),
    [{ role: 'system', content: systemPrompt }, { role: 'user', content: query }],
    'hint'
  )
  if (!hintResult.ok) {
    const message = hintResult.status === 504 ? 'The AI is taking longer than usual to respond. Please try again in a moment.' : 'AI service returned an unexpected response'
    return NextResponse.json({ error: message }, { status: hintResult.status })
  }
  const draftHint = hintResult.data.choices[0].message.content

  const guardrailResult = await fetchNIM(
    process.env.GUARDRAIL_MODEL_NAME!,
    [
      { role: 'system', content: GUARDRAIL_SYSTEM_PROMPT },
      { role: 'user', content: `Question: ${query}\nDraft hint: ${draftHint}` },
    ],
    'guardrail',
    20000
  )
  if (!guardrailResult.ok) {
    const message = guardrailResult.status === 504 ? 'The AI is taking longer than usual to respond. Please try again in a moment.' : 'Guardrail check failed'
    return NextResponse.json({ error: message }, { status: guardrailResult.status })
  }

  let finalHint: string
  try {
    finalHint = JSON.parse(guardrailResult.data.choices[0].message.content).safeHint
  } catch {
    return NextResponse.json({ error: 'Guardrail response could not be verified' }, { status: 500 })
  }

  const { data: questionRow, error: questionError } = await supabase
    .from('questions').insert({ user_id: user.id, query_text: query, grade, subject, current_level: 1 }).select().single()
  if (questionError) return NextResponse.json({ error: 'Could not save question' }, { status: 500 })

  const { error: hintError } = await supabase.from('hints').insert({ question_id: questionRow.id, level: 1, hint_text: finalHint })
  if (hintError) return NextResponse.json({ error: 'Could not save hint' }, { status: 500 })

  return NextResponse.json({ hint: finalHint, questionId: questionRow.id })
}