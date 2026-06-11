import type {
    AiArchetypeKey,
    AiAxisKey,
    AiAxisScores,
    GeopoliticsModifier,
    PaceModifier,
    RiskLens,
} from "@/lib/ai-governance-types"
import { decodeUrlPayload, encodeUrlPayload } from "@/lib/url-payload"

export type AiSharePayload = {
    v: 1
    as: [number, number, number, number, number, number, number, number]
    ak: AiArchetypeKey
    nk: AiArchetypeKey
    rl: RiskLens
    pm: PaceModifier
    gm: GeopoliticsModifier
}

export const AI_PAYLOAD_AXIS_ORDER: AiAxisKey[] = [
    "riskHorizon",
    "deploymentPace",
    "oversight",
    "geopolitics",
    "openness",
    "militaryRole",
    "legitimacy",
    "humanFuture",
]

export function encodeAiPayload(payload: AiSharePayload): string {
    return encodeUrlPayload(payload)
}

export function decodeAiPayload(encoded: string): AiSharePayload | null {
    const parsed = decodeUrlPayload(encoded)

    if (!isAiSharePayload(parsed)) {
        return null
    }

    return parsed
}

export function aiAxisScoresToArray(
    scores: AiAxisScores,
): [number, number, number, number, number, number, number, number] {
    return AI_PAYLOAD_AXIS_ORDER.map((key) =>
        Number(scores[key].toFixed(2)),
    ) as [number, number, number, number, number, number, number, number]
}

export function aiPayloadToAxisScores(payload: AiSharePayload): AiAxisScores {
    const [rh, dp, ov, gp, op, mr, lg, hf] = payload.as

    return {
        riskHorizon: rh,
        deploymentPace: dp,
        oversight: ov,
        geopolitics: gp,
        openness: op,
        militaryRole: mr,
        legitimacy: lg,
        humanFuture: hf,
    }
}

function isAiSharePayload(value: unknown): value is AiSharePayload {
    if (typeof value !== "object" || value === null) {
        return false
    }

    const candidate = value as Partial<AiSharePayload>

    return (
        candidate.v === 1 &&
        isAxisScoreTuple(candidate.as) &&
        isAiArchetypeKey(candidate.ak) &&
        isAiArchetypeKey(candidate.nk) &&
        isRiskLens(candidate.rl) &&
        isPaceModifier(candidate.pm) &&
        isGeopoliticsModifier(candidate.gm)
    )
}

function isAxisScoreTuple(value: unknown): value is AiSharePayload["as"] {
    return (
        Array.isArray(value) &&
        value.length === AI_PAYLOAD_AXIS_ORDER.length &&
        value.every((score) => typeof score === "number" && Number.isFinite(score) && score >= 1 && score <= 7)
    )
}

function isAiArchetypeKey(value: unknown): value is AiArchetypeKey {
    return (
        value === "precautionarySteward" ||
        value === "strategicCompetitor" ||
        value === "coordinationArchitect" ||
        value === "democraticGuardrailist" ||
        value === "stateCapacityBuilder" ||
        value === "openEcosystemBuilder"
    )
}

function isRiskLens(value: unknown): value is RiskLens {
    return (
        value === "Present-harms first" ||
        value === "Mixed risk lens" ||
        value === "Frontier-risk first"
    )
}

function isPaceModifier(value: unknown): value is PaceModifier {
    return (
        value === "Deployment-first" ||
        value === "Threshold guardrails" ||
        value === "Precaution-first"
    )
}

function isGeopoliticsModifier(value: unknown): value is GeopoliticsModifier {
    return (
        value === "Competition-first" ||
        value === "Competitive hedger" ||
        value === "Coordination-first"
    )
}
