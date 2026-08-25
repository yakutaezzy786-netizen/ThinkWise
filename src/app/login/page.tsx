import { login } from '@/lib/supabase/actions'
import Button from '@/components/Button'
import Card from '@/components/Card'
import { TextInput } from '@/components/Field'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-ink mb-1">Welcome back</h1>
        <p className="text-ink-soft mb-6">Log in to keep working through your questions.</p>

        {params.error && (
          <p className="text-caution text-sm mb-4 bg-caution/10 border border-caution/30 rounded-lg px-3 py-2">
            {params.error}
          </p>
        )}

        <form action={login} className="flex flex-col gap-3">
          <TextInput name="email" type="email" placeholder="Email" required />
          <TextInput name="password" type="password" placeholder="Password" required />
          <Button type="submit" className="mt-2 w-full">Log In</Button>
        </form>
      </Card>
    </div>
  )
}