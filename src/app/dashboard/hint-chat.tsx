'use client'

import { useState } from 'react'

const buttonStyle: React.CSSProperties = {
  padding: '8px 16px',
  margin: '8px 8px 8px 0',
  border: '1px solid #666',
  borderRadius: 4,
  background: '#222',
  color: '#fff',
  cursor: 'pointer',
}

const fieldStyle: React.CSSProperties = {
  display: 'block',
  margin: '8px 0',
  width: '100%',
  padding: 8,
  border: '1px solid #666',
  borderRadius: 4,
  background: '#111',
  color: '#fff',
}

export default function HintChat({ grade }: { grade: number }) {
  const [subject, setSubject] = useState('Math')
  const [query, setQuery] = useState('')
  const [questionId, setQuestionId] = useState<string | null>(null)
  const [level, setLevel] = useState(1)
  const [hint, setHint] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function askQuestion(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const res = await fetch('/api/hint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, grade, subject }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError('Something went wrong. Please try again.'); return }
    setHint(data.hint)
    setQuestionId(data.questionId)
    setLevel(1)
  }

  async function callNext(regenerate: boolean) {
    if (!questionId) return
    setLoading(true)
    setError(null)
    const res = await fetch('/api/hint/next', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId, regenerate }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error || 'Could not get a hint.'); return }
    setHint(data.hint)
    setLevel(data.level)
  }

  async function revealAnswer() {
    if (!questionId) return
    setLoading(true)
    setError(null)
    const res = await fetch('/api/hint/reveal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error || 'Could not reveal the answer.'); return }
    setHint(data.answer)
    setLevel(4)
  }

  function askNewQuestion() {
    setQuery(''); setHint(null); setQuestionId(null); setLevel(1); setError(null)
  }

  return (
    <div>
      {!hint ? (
        <form onSubmit={askQuestion}>
          <select value={subject} onChange={(e) => setSubject(e.target.value)} style={fieldStyle}>
            <option value="Math">Math</option>
            <option value="Science">Science</option>
          </select>
          <textarea value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Type your question here..." required rows={3} style={fieldStyle} />
          <button type="submit" disabled={loading} style={buttonStyle}>{loading ? 'Thinking...' : 'Ask'}</button>
        </form>
      ) : (
        <div>
          <p><strong>You asked:</strong> {query}</p>
          <p><strong>Level {level} Hint:</strong> {hint}</p>

          {level < 4 && (
            <button onClick={() => callNext(true)} disabled={loading} style={buttonStyle}>
              {loading ? 'Thinking...' : "Still don't get it? Try again"}
            </button>
          )}
          {level < 4 && level < 3 && (
            <button onClick={() => callNext(false)} disabled={loading} style={buttonStyle}>
              {loading ? 'Thinking...' : 'Still stuck? Next hint'}
            </button>
          )}
          {level >= 3 && level < 4 && (
            <button onClick={revealAnswer} disabled={loading} style={buttonStyle}>Show full answer</button>
          )}
          <button onClick={askNewQuestion} style={buttonStyle}>Ask a different question</button>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}