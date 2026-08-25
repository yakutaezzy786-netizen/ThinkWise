import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { SCOPE_INSTRUCTION, getHintModel } from '@/lib/prompts'
import { fetchNIM } from '@/lib/nim-fetch'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not logged in' }, { status: 401 })

  const { questionId } = await request.json()
  const { data: question, error: questionError } = await supabase.from('questions').select('*').eq('id', questionId).single()
  if (questionError || !question) return NextResponse.json({ error: 'Question not found' }, { status: 404 })

  if (question.current_level < 3) {
    return NextResponse.json({ error: 'Full answer unlocks only after trying Levels 1 through 3 first' }, { status: 403 })
  }

  const systemPrompt = `You are a ${question.subject} tutor for a Grade ${question.grade} student.
The student has already worked through three hint levels and is still stuck.
Now clearly explain the full solution, step by step, ending with the final answer.
Keep language simple enough for Grade ${question.grade}. Be encouraging, not just correct.
${SCOPE_INSTRUCTION}`

  const result = await fetchNIM(
    getHintModel(question.subject),
    [{ role: 'system', content: systemPrompt }, { role: 'user', content: question.query_text }],
    'hint/reveal'
  )
  if (!result.ok) {
    const message = result.status === 504 ? 'The AI is taking longer than usual to respond. Please try again in a moment.' : 'AI service returned an unexpected response'
    return NextResponse.json({ error: message }, { status: result.status })
  }

  const fullAnswer = result.data.choices[0].message.content

  const { error: hintError } = await supabase.from('hints').insert({ question_id: questionId, level: 4, hint_text: fullAnswer })
  if (hintError) return NextResponse.json({ error: 'Could not save answer' }, { status: 500 })

  const { error: updateError } = await supabase.from('questions').update({ current_level: 4, answer_revealed_at: new Date().toISOString() }).eq('id', questionId)
  if (updateError) return NextResponse.json({ error: 'Could not update question' }, { status: 500 })

  return NextResponse.json({ answer: fullAnswer })
}