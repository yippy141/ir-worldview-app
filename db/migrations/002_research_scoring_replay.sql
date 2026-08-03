-- Versioned, pseudonymous research storage for offline scoring replay.
-- The replay tool reads research_answers and only upserts derived results.

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
  respondent_id uuid not null
    references research_respondents(respondent_id) on delete cascade,
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
  session_id uuid not null
    references research_sessions(session_id) on delete cascade,
  question_id text not null,
  primary_answer text,
  secondary_answer text,
  raw_numeric numeric,
  raw_json jsonb,
  primary key (session_id, question_id)
);

create table if not exists research_derived_results (
  session_id uuid not null
    references research_sessions(session_id) on delete cascade,
  scoring_version text not null,
  top_label text,
  runner_up text,
  profile_state text,
  family_scores jsonb,
  archetype_scores jsonb,
  dimension_scores jsonb,
  axis_scores jsonb,
  modifiers jsonb,
  summary text,
  created_at timestamptz not null default now(),
  primary key (session_id, scoring_version)
);

alter table research_derived_results
  add column if not exists scoring_version text;

update research_sessions
set scoring_version = concat('v', scoring_version)
where scoring_version in ('1', '2');

update research_derived_results as derived
set scoring_version = sessions.scoring_version
from research_sessions as sessions
where derived.session_id = sessions.session_id
  and derived.scoring_version is null;

alter table research_derived_results
  alter column scoring_version set not null;

alter table research_derived_results
  drop constraint if exists research_derived_results_pkey;

alter table research_derived_results
  add primary key (session_id, scoring_version);

create index if not exists idx_research_sessions_instrument
  on research_sessions(instrument, instrument_version);
create index if not exists idx_research_answers_question
  on research_answers(question_id);
create index if not exists idx_research_derived_results_version
  on research_derived_results(scoring_version);

alter table research_respondents enable row level security;
alter table research_sessions enable row level security;
alter table research_answers enable row level security;
alter table research_derived_results enable row level security;
