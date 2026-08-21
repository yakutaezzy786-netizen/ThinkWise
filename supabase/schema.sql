-- Extends Supabase's built-in user accounts with app-specific fields
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  grade integer,
  guardian_consent boolean default false,
  created_at timestamptz default now()
);

-- One row per question a student asks
create table questions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  query_text text not null,
  grade integer not null,
  subject text not null,
  topic_tag text,
  current_level integer default 1,
  created_at timestamptz default now()
);

-- One row per hint actually given — builds the full escalation history
create table hints (
  id uuid primary key default gen_random_uuid(),
  question_id uuid references questions(id) on delete cascade not null,
  level integer not null,
  hint_text text not null,
  created_at timestamptz default now()
);

-- Row Level Security: a student can only ever touch their own data
alter table profiles enable row level security;
alter table questions enable row level security;
alter table hints enable row level security;

create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

create policy "Users can view own questions" on questions for select using (auth.uid() = user_id);
create policy "Users can insert own questions" on questions for insert with check (auth.uid() = user_id);

create policy "Users can view own hints" on hints for select using (
  exists (select 1 from questions where questions.id = hints.question_id and questions.user_id = auth.uid())
);

-- alter query to add name column to profiles table
alter table profiles add column name text;

-- Fix: profiles insert policy (missing originally — blocked signup's profile creation until caught in testing)
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- Fix: hints insert policy (missing originally — blocked hint saving until caught in testing)
create policy "Users can insert own hints" on hints for insert with check (
  exists (select 1 from questions where questions.id = hints.question_id and questions.user_id = auth.uid())
);

-- Needed for the "next hint" ladder to update current_level
create policy "Users can update own questions" on questions for update using (auth.uid() = user_id);

-- Level 4 reveal timestamp, for guardian/guide visibility logging
alter table questions add column answer_revealed_at timestamptz;