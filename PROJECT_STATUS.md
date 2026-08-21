# ThinkWise — Project Status

Last updated: 2026-08-15 (Stage 4 complete)

## What this is
AI-powered hint-based tutor for Indian Grade 1–10 students, Math & Science.
Core rule: never give a direct answer — a 4-level hint ladder guides students instead.
Team: Shabbir Gangardiwala & Yakuta Ezzy, guided by Paresh Patel Sir, Government Polytechnic.
Deadline: submission window Oct 1–30, 2026.

## Tech stack (final, settled — do not reintroduce Supabase-alternatives or InfinityFree)
- Frontend + Backend: Next.js 16.3.0 + TypeScript, App Router, `src/` directory
- Database + Auth: Supabase (Mumbai region), new publishable/secret key system (not legacy anon/service_role)
- AI: NVIDIA NIM API — three model roles, each a separate env var (see below)
- Hosting: Vercel (blocked as of this writing — repo is under Yakuta's personal GitHub account, and Vercel requires the account that owns the repo to do the first import; not yet done)

## Environment variables (names only — real values live in `.env.local`, never commit them)
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SECRET_KEY
NVIDIA_NIM_API_KEY
HINT_MODEL_NAME=nvidia/nemotron-3-ultra-550b-a55b
GUARDRAIL_MODEL_NAME=nvidia/nemotron-3.5-lightning-30b-a3b
MATH_MODEL_NAME=deepseek-ai/deepseek-v4-pro # defined, NOT yet wired into any route

## Database schema (`supabase/schema.sql` — keep this file in sync with real changes made directly in Supabase's SQL Editor; it has drifted before)
- `profiles` (id, name, grade, guardian_consent, created_at) — RLS: select/update/insert, own row only
- `questions` (id, user_id, query_text, grade, subject, topic_tag, current_level, answer_revealed_at, created_at) — RLS: select/insert/update, own rows only
- `hints` (id, question_id, level, hint_text, created_at) — RLS: select/insert, scoped via parent question's user_id

## What's built and confirmed working (tested live, not just written)
- **Auth**: signup (with name/grade/consent-placeholder), login, session refresh via proxy.ts — all tested end-to-end
- **Hint generation** (`src/app/api/hint/route.ts`): Level 1 only, saves question + hint to Supabase, requires login
- **Ladder escalation** (`src/app/api/hint/next/route.ts`): Levels 2–3, references prior hint text, blocks past Level 3
- **Full reveal** (`src/app/api/hint/reveal/route.ts`): Level 4, gated behind `current_level >= 3`, no guardrail (by design — see reasoning in code comments), logs `answer_revealed_at`
- **Guardrail check**: runs on every Level 1–3 hint before it's returned; fails closed (blocks rather than guesses) if the check itself errors
- **Few-shot examples** (`src/lib/hint-examples.ts`): 120 hand-written good/bad examples, Math+Science × Levels 1–3 × 10 grades, auto-selected by subject/level/closest-grade

## Known issues / things to watch
- `HINT_MODEL_NAME`'s original model (Llama 4 Maverick) was deprecated mid-project — model names are env vars specifically so this is a one-line fix, not a code change
- Level 3 hints can lean too heavily on the exact numbers in the few-shot examples rather than inventing fresh ones (seen directly in testing: model reused "30+10" verbatim from the example bank) — one-line prompt fix identified, not yet applied
- `MATH_MODEL_NAME` is defined but unused — the Math/Science conditional model swap is still a real to-do
- Vercel deployment blocked on repo ownership (see stack notes above)

## Not built yet, on purpose
- `/dashboard` — signup/login redirect here; genuinely doesn't exist, 404 is expected until real content lands
- Any UI beyond raw signup/login forms — every hint-engine endpoint above is tested only via curl/browser console, not through an actual interface yet
- Photo input, rate limiting, topic auto-tagging

## Next planned step
Stage 5 — build the actual chat UI on top of the four working API endpoints above.