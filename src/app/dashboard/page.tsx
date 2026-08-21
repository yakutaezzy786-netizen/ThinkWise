import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import HintChat from './hint-chat'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('grade, name')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return <div style={{ maxWidth: 600, margin: '2rem auto' }}>Profile not found.</div>
  }

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>Welcome{profile.name ? `, ${profile.name}` : ''}!</h1>
      <p>Grade {profile.grade}</p>
      <HintChat grade={profile.grade} />
    </div>
  )
}