#!/usr/bin/env node

/**
 * Replay stored Foundation answers with an immutable scoring version.
 *
 * Usage:
 *   npm run replay:scoring -- v2
 *   npm run replay:scoring -- v2 --allow-quarantined-sessions
 */

import { pathToFileURL } from "node:url"
import { resolve } from "node:path"
import { db } from "@/lib/db"
import {
  replayScoring,
  type ReplayDerivedResult,
  type ResearchAnswerRow,
  type ScoringReplayStore,
} from "@/lib/research/scoring-replay"
import { SCORING_VERSION_NAMES } from "@/lib/scoring/versions"

type DatabaseResearchAnswerRow = Record<string, unknown> & {
  session_id: string
  mode: string | null
  instrument_version: string
  source_scoring_version: string
  baseline_top_label: string | null
  question_id: string
  primary_answer: string | null
  secondary_answer: string | null
  raw_numeric: string | number | null
  raw_json: unknown
}

export const SELECT_RESEARCH_ANSWERS = `
  select
    sessions.session_id::text,
    sessions.mode,
    sessions.instrument_version,
    sessions.scoring_version as source_scoring_version,
    baseline.top_label as baseline_top_label,
    answers.question_id,
    answers.primary_answer,
    answers.secondary_answer,
    answers.raw_numeric,
    answers.raw_json
  from research_sessions as sessions
  join research_respondents as respondents
    on respondents.respondent_id = sessions.respondent_id
  join research_answers as answers
    on answers.session_id = sessions.session_id
  left join research_derived_results as baseline
    on baseline.session_id = sessions.session_id
   and baseline.scoring_version = sessions.scoring_version
  where sessions.instrument = 'foundation'
    and sessions.completion_status = 'completed'
    and respondents.research_consent is true
    and respondents.consent_version is not null
    and btrim(respondents.consent_version) <> ''
    and sessions.consent_version = respondents.consent_version
  order by sessions.session_id, answers.question_id
`

const UPSERT_DERIVED_RESULTS = `
  with replay_input as (
    select *
    from jsonb_to_recordset($1::jsonb) as input(
      session_id text,
      scoring_version text,
      top_label text,
      runner_up text,
      family_scores jsonb,
      dimension_scores jsonb,
      modifiers jsonb,
      summary text
    )
  )
  insert into research_derived_results (
    session_id,
    scoring_version,
    top_label,
    runner_up,
    family_scores,
    dimension_scores,
    modifiers,
    summary
  )
  select
    session_id::uuid,
    scoring_version,
    top_label,
    runner_up,
    family_scores,
    dimension_scores,
    modifiers,
    summary
  from replay_input
  on conflict (session_id, scoring_version)
  do update set
    top_label = excluded.top_label,
    runner_up = excluded.runner_up,
    family_scores = excluded.family_scores,
    dimension_scores = excluded.dimension_scores,
    modifiers = excluded.modifiers,
    summary = excluded.summary
  where (
    research_derived_results.top_label,
    research_derived_results.runner_up,
    research_derived_results.family_scores,
    research_derived_results.dimension_scores,
    research_derived_results.modifiers,
    research_derived_results.summary
  ) is distinct from (
    excluded.top_label,
    excluded.runner_up,
    excluded.family_scores,
    excluded.dimension_scores,
    excluded.modifiers,
    excluded.summary
  )
`

const databaseStore: ScoringReplayStore = {
  async readRawAnswers() {
    const rows = await db.query<DatabaseResearchAnswerRow>(
      SELECT_RESEARCH_ANSWERS,
    )

    return rows.map((row): ResearchAnswerRow => ({
      sessionId: row.session_id,
      mode: row.mode,
      instrumentVersion: row.instrument_version,
      sourceScoringVersion: row.source_scoring_version,
      baselineTopLabel: row.baseline_top_label,
      questionId: row.question_id,
      primaryAnswer: row.primary_answer,
      secondaryAnswer: row.secondary_answer,
      rawNumeric: row.raw_numeric,
      rawJson: row.raw_json,
    }))
  },

  async writeDerivedResults(rows: readonly ReplayDerivedResult[]) {
    if (rows.length === 0) return

    await db.query(UPSERT_DERIVED_RESULTS, [
      JSON.stringify(
        rows.map((row) => ({
          session_id: row.sessionId,
          scoring_version: row.scoringVersion,
          top_label: row.topLabel,
          runner_up: row.runnerUp,
          family_scores: row.familyScores,
          dimension_scores: row.dimensionScores,
          modifiers: row.modifiers,
          summary: row.summary,
        })),
      ),
    ])
  },
}

async function main() {
  const { scoringVersion, allowQuarantinedSessions } =
    parseReplayCliArguments(process.argv.slice(2))
  if (!db.isConfigured) {
    throw new Error("DATABASE_URL is required for scoring replay.")
  }

  const report = await replayScoring(scoringVersion, databaseStore)
  console.log(
    `Rescored ${report.rescoredSessions} sessions with ${scoringVersion}; ` +
    `${report.changedFamilyLabels} changed family label; ` +
    `${report.quarantinedSessions.length} quarantined.`,
  )
  for (const failure of report.quarantinedSessions) {
    console.error(
      `Quarantined ${failure.sessionId}: ${failure.reason}`,
    )
  }
  enforceReplayQuarantinePolicy(report, allowQuarantinedSessions)
}

export function parseReplayCliArguments(args: readonly string[]): {
  scoringVersion: (typeof SCORING_VERSION_NAMES)[number]
  allowQuarantinedSessions: boolean
} {
  const allowFlag = "--allow-quarantined-sessions"
  const unknownFlags = args.filter(
    (argument) => argument.startsWith("-") && argument !== allowFlag,
  )
  const versions = args.filter((argument) => !argument.startsWith("-"))

  if (unknownFlags.length > 0) {
    throw new Error(`Unknown scoring replay flag: ${unknownFlags[0]}.`)
  }
  if (
    versions.length !== 1 ||
    !SCORING_VERSION_NAMES.includes(
      versions[0] as (typeof SCORING_VERSION_NAMES)[number],
    )
  ) {
    throw new Error(
      `Pass exactly one scoring version: ${SCORING_VERSION_NAMES.join(", ")}.`,
    )
  }

  return {
    scoringVersion:
      versions[0] as (typeof SCORING_VERSION_NAMES)[number],
    allowQuarantinedSessions: args.includes(allowFlag),
  }
}

export function enforceReplayQuarantinePolicy(
  report: { quarantinedSessions: readonly unknown[] },
  allowQuarantinedSessions: boolean,
) {
  if (
    report.quarantinedSessions.length > 0 &&
    !allowQuarantinedSessions
  ) {
    throw new Error(
      `Scoring replay quarantined ${report.quarantinedSessions.length} ` +
        `session(s). Review the failures before rerunning with ` +
        `--allow-quarantined-sessions.`,
    )
  }
}

function isMainModule() {
  const entryPoint = process.argv[1]
  return Boolean(
    entryPoint &&
    pathToFileURL(resolve(entryPoint)).href === import.meta.url,
  )
}

if (isMainModule()) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  })
}
