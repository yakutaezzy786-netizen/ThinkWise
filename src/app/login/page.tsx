import { login } from '@/lib/supabase/actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

  return (
    <div style={{ maxWidth: 400, margin: '4rem auto' }}>
      <h1>Log In</h1>
      {params.error && <p style={{ color: 'red' }}>{params.error}</p>}
      <form action={login}>
        <input name="email" type="email" placeholder="Email" required style={{ display: 'block', margin: '8px 0', width: '100%' }} />
        <input name="password" type="password" placeholder="Password" required style={{ display: 'block', margin: '8px 0', width: '100%' }} />
        <button type="submit">Log In</button>
      </form>
    </div>
  )
}