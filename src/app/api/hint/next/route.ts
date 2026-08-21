import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { selectExamples, formatExamplesForPrompt } from '@/lib/hint-examples'
import { SCOPE_INSTRUCTION, LEVEL_INSTRUCTIONS, GUARDRAIL_SYSTEM_PROMPT, getHintModel } from '@/lib/prompts'
import { safeParseJSON } from '@/lib/nim-fetch'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not logged in' }, { status: 401 })

  const { questionId, regenerate } = await request.json()

  const { data: question, error: questionError } = await supabase
    .from('questions').select('*').eq('id', questionId).single()
  if (questionError || !question) return NextResponse.json({ error: 'Question not found' }, { status: 404 })

  if (!regenerate && question.current_level >= 3) {
    return NextResponse.json({ error: 'Already at the highest available hint level' }, { status: 400 })
  }

  const targetLevel = (regenerate ? question.current_level : question.current_level + 1) as 1 | 2 | 3

  const { data: previousHints } = await supabase
    .from('hints').select('*').eq('question_id', questionId).order('level', { ascending: false }).limit(1)
  const lastHint = previousHints?.[0]?.hint_text ?? null

  const examples = selectExamples(question.subject, targetLevel, question.grade)
  const exampleBlock = formatExamplesForPrompt(examples)

  const contextLine = regenerate
    ? `The student saw this exact hint and STILL didn't understand it: "${lastHint}". Give a genuinely different explanation — a different angle, wording, or analogy. Don't just reword the same idea.`
    : `The student already received this hint and is still stuck: "${lastHint}". Don't just repeat it — go further.`

  const systemPrompt = `You are a ${question.subject} tutor for a Grade ${question.grade} student.
Rules:
- NEVER state the final answer.
- ${LEVEL_INSTRUCTIONS[targetLevel]}
- Keep language simple enough for Grade ${question.grade}.
- ${contextLine}
${SCOPE_INSTRUCTION}

Here are examples of good vs. bad hints at this exact level, for similar problems:

${exampleBlock}`

  const modelToUse = getHintModel(question.subject)
  console.log(`[hint/next] subject=${question.subject} -> model=${modelToUse}`)

  const hintResponse = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.NVIDIA_NIM_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: modelToUse,
      messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: question.query_text }],
    }),
  })
  const hintData = await safeParseJSON(hintResponse, 'hint/next')
  if (!hintResponse.ok || !hintData) {
    return NextResponse.json({ error: 'AI service returned an unexpected response' }, { status: 502 })
  }
  const draftHint = hintData.choices[0].message.content

  const guardrailResponse = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.NVIDIA_NIM_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: process.env.GUARDRAIL_MODEL_NAME,
      messages: [
        { role: 'system', content: GUARDRAIL_SYSTEM_PROMPT },
        { role: 'user', content: `Question: ${question.query_text}\nDraft hint: ${draftHint}` },
      ],
    }),
  })
  const guardrailData = await safeParseJSON(guardrailResponse, 'guardrail')
  if (!guardrailResponse.ok || !guardrailData) {
    return NextResponse.json({ error: 'Guardrail check failed' }, { status: 500 })
  }

  let finalHint: string
  try {
    finalHint = JSON.parse(guardrailData.choices[0].message.content).safeHint
  } catch {
    return NextResponse.json({ error: 'Guardrail response could not be verified' }, { status: 500 })
  }

  const { error: hintError } = await supabase
    .from('hints').insert({ question_id: questionId, level: targetLevel, hint_text: finalHint })
  if (hintError) return NextResponse.json({ error: 'Could not save hint' }, { status: 500 })

  if (!regenerate) {
    const { error: updateError } = await supabase
      .from('questions').update({ current_level: targetLevel }).eq('id', questionId)
    if (updateError) return NextResponse.json({ error: 'Could not update question level' }, { status: 500 })
  }

  return NextResponse.json({ hint: finalHint, level: targetLevel })
}