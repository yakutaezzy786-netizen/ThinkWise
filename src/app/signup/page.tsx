import { signup } from '@/lib/supabase/actions'

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

  return (
    <div style={{ maxWidth: 400, margin: '4rem auto' }}>
      <h1>Sign Up</h1>
      {params.error && <p style={{ color: 'red' }}>{params.error}</p>}
      <form action={signup}>
        <input name="name" type="text" placeholder="Full Name" required style={{ display: 'block', margin: '8px 0', width: '100%' }} />
        <input name="email" type="email" placeholder="Email" required style={{ display: 'block', margin: '8px 0', width: '100%' }} />
        <input name="password" type="password" placeholder="Password" required minLength={6} style={{ display: 'block', margin: '8px 0', width: '100%' }} />
        <select name="grade" required style={{ display: 'block', margin: '8px 0', width: '100%' }}>
          <option value="">Select Grade</option>
          {Array.from({ length: 10 }, (_, i) => i + 1).map((g) => (
            <option key={g} value={g}>Grade {g}</option>
          ))}
        </select>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  )
}