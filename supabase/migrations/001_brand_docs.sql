-- BrandFrame: brand_docs table
-- Run this in the Supabase SQL Editor

create table if not exists brand_docs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  company_name text not null,
  inputs      jsonb not null,
  outputs     jsonb not null,
  created_at  timestamptz not null default now()
);

-- Index for dashboard queries
create index if not exists brand_docs_user_id_idx
  on brand_docs (user_id, created_at desc);

-- Row Level Security: users can only access their own docs
alter table brand_docs enable row level security;

create policy "Users can read own docs"
  on brand_docs for select
  using (auth.uid() = user_id);

create policy "Users can insert own docs"
  on brand_docs for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own docs"
  on brand_docs for delete
  using (auth.uid() = user_id);
