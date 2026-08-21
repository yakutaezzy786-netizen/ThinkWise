'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const grade = formData.get('grade') as string

  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`)
  }

  if (data.user) {
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      name,
      grade: parseInt(grade),
      guardian_consent: false,
    })

    if (profileError) {
      redirect(`/signup?error=${encodeURIComponent(profileError.message)}`)
    }
  }

  redirect('/dashboard')
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/dashboard')
}

export async function provideConsent(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const guardianName = formData.get('guardianName') as string
  const guardianEmail = formData.get('guardianEmail') as string

  const { error } = await supabase
    .from('profiles')
    .update({
      guardian_consent: true,
      guardian_name: guardianName,
      guardian_email: guardianEmail,
    })
    .eq('id', user.id)

  if (error) {
    redirect(`/consent?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/dashboard')
}