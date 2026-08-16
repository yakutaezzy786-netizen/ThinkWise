import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { selectExamples, formatExamplesForPrompt } from '@/lib/hint-examples'

export async function POST(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Not logged in' }, { status: 401 })
  }

  const { questionId } = await request.json()

  const { data: question, error: questionError } = await supabase
    .from('questions')
    .select('*')
    .eq('id', questionId)
    .single()

  if (questionError || !question) {
    return NextResponse.json({ error: 'Question not found' }, { status: 404 })
  }

  if (question.current_level >= 3) {
    return NextResponse.json({ error: 'Already at the highest available hint level' }, { status: 400 })
  }

  const { data: previousHints } = await supabase
    .from('hints')
    .select('*')
    .eq('question_id', questionId)
    .order('level', { ascending: false })
    .limit(1)

  const lastHint = previousHints?.[0]?.hint_text ?? null
  const newLevel = question.current_level + 1

  const examples = selectExamples(question.subject, newLevel as 2 | 3, question.grade)
  const exampleBlock = formatExamplesForPrompt(examples)

  const levelInstructions: Record<number, string> = {
    2: 'This is a Level 2 hint: nudge toward the relevant concept, without solving the step for them.',
    3: 'This is a Level 3 hint: give a worked example on a SIMILAR but DIFFERENT problem — never use their exact numbers, and never reuse the same numbers shown in the examples below either. Invent your own fresh numbers.',
  }

  const systemPrompt = `You are a ${question.subject} tutor for a Grade ${question.grade} student.
Rules:
- NEVER state the final answer.
- ${levelInstructions[newLevel]}
- Keep language simple enough for Grade ${question.grade}.
- The student already received this hint and is still stuck: "${lastHint}". Don't just repeat it — go further.

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
        { role: 'user', content: question.query_text },
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
        { role: 'user', content: `Question: ${question.query_text}\nDraft hint: ${draftHint}` },
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

  const { error: hintError } = await supabase
    .from('hints')
    .insert({ question_id: questionId, level: newLevel, hint_text: finalHint })

  if (hintError) {
    return NextResponse.json({ error: 'Could not save hint' }, { status: 500 })
  }

  const { error: updateError } = await supabase
    .from('questions')
    .update({ current_level: newLevel })
    .eq('id', questionId)

  if (updateError) {
    return NextResponse.json({ error: 'Could not update question level' }, { status: 500 })
  }

  return NextResponse.json({ hint: finalHint, level: newLevel })
}