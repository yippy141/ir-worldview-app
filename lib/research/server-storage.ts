import type {
  ResearchDeletionPayload,
  ResearchEventPayload,
  ResearchSubmissionPayload,
} from "@/lib/research/validation"

type ResearchStorageStatus =
  | { enabled: false; reason: "flag_disabled" | "missing_env" }
  | { enabled: true }

type DisabledResult = {
  ok: false
  disabled: true
  reason: "flag_disabled" | "missing_env"
}

type StorageResult =
  | DisabledResult
  | {
      ok: false
      disabled: false
      reason: "storage_adapter_not_configured"
    }

const requiredEnvVars = ["RESEARCH_STORAGE_URL", "RESEARCH_STORAGE_SERVICE_KEY"] as const

export function getResearchStorageStatus(env: NodeJS.ProcessEnv = process.env): ResearchStorageStatus {
  if (env.RESEARCH_STORAGE_ENABLED !== "true") {
    return { enabled: false, reason: "flag_disabled" }
  }

  const hasRequiredEnv = requiredEnvVars.every((key) => Boolean(env[key]))
  if (!hasRequiredEnv) {
    return { enabled: false, reason: "missing_env" }
  }

  return { enabled: true }
}

export async function storeResearchSubmission(
  _payload: ResearchSubmissionPayload,
): Promise<StorageResult> {
  const disabled = disabledResult()
  if (disabled) return disabled

  return adapterNotConfigured()
}

export async function storeResearchDeletionRequest(
  _payload: ResearchDeletionPayload,
): Promise<StorageResult> {
  const disabled = disabledResult()
  if (disabled) return disabled

  return adapterNotConfigured()
}

export async function storeResearchEvent(_payload: ResearchEventPayload): Promise<StorageResult> {
  const disabled = disabledResult()
  if (disabled) return disabled

  return adapterNotConfigured()
}

function disabledResult(): DisabledResult | undefined {
  const status = getResearchStorageStatus()
  if (status.enabled) return undefined
  return {
    ok: false,
    disabled: true,
    reason: status.reason,
  }
}

function adapterNotConfigured(): StorageResult {
  return {
    ok: false,
    disabled: false,
    reason: "storage_adapter_not_configured",
  }
}
