import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { selectExamples, formatExamplesForPrompt } from '@/lib/hint-examples'

export async function POST(request: Request) {
  const supabase = await createClient()

  // Confirm someone's actually logged in before saving anything under their name
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Not logged in' }, { status: 401 })
  }

  const { query, grade, subject } = await request.json()

  const examples = selectExamples(subject, 1, grade)
  const exampleBlock = formatExamplesForPrompt(examples)

  const systemPrompt = `You are a ${subject} tutor for a Grade ${grade} student.
Rules:
- NEVER state the final answer.
- This is a Level 1 hint: ask what they've tried, or ask a clarifying question about the problem.
- Keep language simple enough for Grade ${grade}.

Here are examples of good vs. bad hints at this exact level, for similar problems:

${exampleBlock}`

  const hintResponse = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.NVIDIA_NIM_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.HINT_MODEL_NAME,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: query },
      ],
    }),
  })

  const hintData = await hintResponse.json()
  if (!hintResponse.ok) {
    return NextResponse.json({ error: hintData }, { status: hintResponse.status })
  }
  const draftHint = hintData.choices[0].message.content

  const guardrailResponse = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.NVIDIA_NIM_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.GUARDRAIL_MODEL_NAME,
      messages: [
        {
          role: 'system',
          content: `You check tutoring hints for leaked answers. Given a question and a draft hint, respond with ONLY valid JSON, nothing else: {"leaksAnswer": true or false, "safeHint": "the hint text, rewritten to remove the answer if needed, otherwise unchanged"}`,
        },
        { role: 'user', content: `Question: ${query}\nDraft hint: ${draftHint}` },
      ],
    }),
  })

  const guardrailData = await guardrailResponse.json()
  if (!guardrailResponse.ok) {
    return NextResponse.json({ error: 'Guardrail check failed' }, { status: 500 })
  }

  let finalHint: string
  try {
    finalHint = JSON.parse(guardrailData.choices[0].message.content).safeHint
  } catch {
    return NextResponse.json({ error: 'Guardrail response could not be verified' }, { status: 500 })
  }

  // === NEW: save the question, then the hint against it ===
  const { data: questionRow, error: questionError } = await supabase
    .from('questions')
    .insert({ user_id: user.id, query_text: query, grade, subject, current_level: 1 })
    .select()
    .single()

  if (questionError) {
    return NextResponse.json({ error: 'Could not save question' }, { status: 500 })
  }

  const { error: hintError } = await supabase
    .from('hints')
    .insert({ question_id: questionRow.id, level: 1, hint_text: finalHint })

  if (hintError) {
    return NextResponse.json({ error: 'Could not save hint' }, { status: 500 })
  }

  return NextResponse.json({ hint: finalHint, questionId: questionRow.id })
}