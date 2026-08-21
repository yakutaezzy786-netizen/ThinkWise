import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { provideConsent } from '@/lib/supabase/actions'

export default async function ConsentPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('guardian_consent, name')
    .eq('id', user.id)
    .single()

  if (profile?.guardian_consent) {
    redirect('/dashboard')
  }

  return (
    <div style={{ maxWidth: 500, margin: '4rem auto', padding: '0 1rem' }}>
      <h1>Parent/Guardian Consent Needed</h1>
      <p>Before {profile?.name || 'this student'} can start using ThinkWise, a parent or guardian needs to review and approve this.</p>

      <h3>What we collect</h3>
      <ul>
        <li>Name, email, and grade</li>
        <li>Questions asked, and the hints given in response</li>
      </ul>

      <h3>What we don&apos;t do</h3>
      <ul>
        <li>No advertising, ever</li>
        <li>No tracking or profiling this student for any purpose beyond the tutoring itself</li>
      </ul>

      {params.error && <p style={{ color: 'red' }}>{params.error}</p>}

      <form action={provideConsent}>
        <p><strong>Parent/Guardian, please confirm below:</strong></p>
        <input name="guardianName" type="text" placeholder="Your full name" required style={{ display: 'block', margin: '8px 0', width: '100%', padding: 8 }} />
        <input name="guardianEmail" type="email" placeholder="Your email" required style={{ display: 'block', margin: '8px 0', width: '100%', padding: 8 }} />
        <button type="submit" style={{ padding: '8px 16px', margin: '8px 0' }}>
          I am this student&apos;s parent/guardian, and I approve
        </button>
      </form>
    </div>
  )
}