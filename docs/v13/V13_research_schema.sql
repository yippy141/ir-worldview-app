-- V13 research schema for opt-in, pseudonymous or de-identified response storage.
-- Review before running in production. This is starter SQL, not legal advice.
-- Raw answer records are not truly anonymous and should only be inserted
-- through first-party server-side routes after explicit research consent.

create table if not exists research_respondents (
  respondent_id uuid primary key,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz,
  research_consent boolean not null default false,
  consent_version text,
  source text
);

create table if not exists research_sessions (
  session_id uuid primary key,
  respondent_id uuid not null references research_respondents(respondent_id) on delete cascade,
  instrument text not null,
  instrument_version text not null,
  scoring_version text not null,
  consent_version text not null,
  mode text,
  app_version text,
  started_at timestamptz,
  completed_at timestamptz,
  completion_status text not null default 'completed',
  duration_seconds integer,
  created_at timestamptz not null default now()
);

create table if not exists research_answers (
  session_id uuid not null references research_sessions(session_id) on delete cascade,
  question_id text not null,
  primary_answer text,
  secondary_answer text,
  raw_numeric numeric,
  raw_json jsonb,
  primary key (session_id, question_id)
);

create table if not exists research_derived_results (
  session_id uuid primary key references research_sessions(session_id) on delete cascade,
  top_label text,
  runner_up text,
  profile_state text,
  family_scores jsonb,
  archetype_scores jsonb,
  dimension_scores jsonb,
  axis_scores jsonb,
  modifiers jsonb,
  summary text,
  created_at timestamptz not null default now()
);

create table if not exists research_events (
  event_id uuid primary key,
  respondent_id uuid,
  session_id uuid,
  event_name text not null,
  route text,
  instrument text,
  app_version text,
  meta jsonb,
  created_at timestamptz not null default now()
);

create table if not exists research_contact_opt_in (
  respondent_id uuid primary key references research_respondents(respondent_id) on delete cascade,
  email text not null,
  purpose text not null,
  created_at timestamptz not null default now()
);

create table if not exists research_deletion_requests (
  deletion_request_id uuid primary key,
  respondent_id uuid,
  session_id uuid,
  contact_email text,
  status text not null default 'received',
  notes text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists research_feedback (
  feedback_id uuid primary key,
  respondent_id uuid,
  session_id uuid,
  message text not null,
  route text,
  created_at timestamptz not null default now()
);

create index if not exists idx_research_sessions_respondent on research_sessions(respondent_id);
create index if not exists idx_research_sessions_instrument on research_sessions(instrument, instrument_version);
create index if not exists idx_research_events_name on research_events(event_name, created_at);
create index if not exists idx_research_answers_question on research_answers(question_id);

-- If using Supabase or another managed Postgres service, enable RLS and only
-- insert from server-side service credentials. Never expose service role keys
-- to the browser.

alter table research_respondents enable row level security;
alter table research_sessions enable row level security;
alter table research_answers enable row level security;
alter table research_derived_results enable row level security;
alter table research_events enable row level security;
alter table research_contact_opt_in enable row level security;
alter table research_deletion_requests enable row level security;
alter table research_feedback enable row level security;
