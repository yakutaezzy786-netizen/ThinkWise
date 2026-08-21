import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { SCOPE_INSTRUCTION } from '@/lib/prompts'

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

  // The actual gate: only unlocks after genuinely working through Levels 1, 2, and 3
  if (question.current_level < 3) {
    return NextResponse.json(
      { error: 'Full answer unlocks only after trying Levels 1 through 3 first' },
      { status: 403 }
    )
  }

    const systemPrompt = `You are a ${question.subject} tutor for a Grade ${question.grade} student.
The student has already worked through three hint levels and is still stuck.
Now clearly explain the full solution, step by step, ending with the final answer.
Keep language simple enough for Grade ${question.grade}. Be encouraging, not just correct.
${SCOPE_INSTRUCTION}`

  const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
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

  const data = await response.json()
  if (!response.ok) {
    return NextResponse.json({ error: data }, { status: response.status })
  }

  const fullAnswer = data.choices[0].message.content

  const { error: hintError } = await supabase
    .from('hints')
    .insert({ question_id: questionId, level: 4, hint_text: fullAnswer })

  if (hintError) {
    return NextResponse.json({ error: 'Could not save answer' }, { status: 500 })
  }

  const { error: updateError } = await supabase
    .from('questions')
    .update({ current_level: 4, answer_revealed_at: new Date().toISOString() })
    .eq('id', questionId)

  if (updateError) {
    return NextResponse.json({ error: 'Could not update question' }, { status: 500 })
  }

  return NextResponse.json({ answer: fullAnswer })
}