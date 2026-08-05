import type {
    AiArchetypeKey,
    AiAxisKey,
    AiAxisScores,
    GeopoliticsModifier,
    PaceModifier,
    RiskLens,
} from "@/lib/ai-governance-types"
import {
    AI_GOVERNANCE_V21_TUPLE,
    getAiGovernanceVersion,
    type AiGovernanceVersion,
} from "@/lib/ai-governance-versions"
import { decodeUrlPayload, encodeUrlPayload } from "@/lib/url-payload"

type AiShareFields = {
    as: [number, number, number, number, number, number, number, number]
    ak: AiArchetypeKey
    nk: AiArchetypeKey
    rl: RiskLens
    pm: PaceModifier
    gm: GeopoliticsModifier
}

export type AiSharePayloadV1 = AiShareFields & {
    v: 1
}

export type AiSharePayloadV2 = AiShareFields & {
    v: 2
    /** Item-bank/content version. */
    bv: number
    /** Scoring implementation version. */
    sv: number
}

export type AiSharePayload = AiSharePayloadV1 | AiSharePayloadV2

export type ResolvedAiPayload = AiGovernanceVersion & {
    payload: AiSharePayload
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
    if (!resolveDecodedAiPayload(payload)) {
        throw new TypeError("Cannot encode an unsupported AI Governance payload.")
    }
    return encodeUrlPayload(payload)
}

export function decodeAiPayload(encoded: string): AiSharePayload | null {
    return resolveAiPayload(encoded)?.payload ?? null
}

export function resolveAiPayload(encoded: string): ResolvedAiPayload | null {
    return resolveDecodedAiPayload(decodeUrlPayload(encoded))
}

function resolveDecodedAiPayload(value: unknown): ResolvedAiPayload | null {
    if (!isAiShareFields(value)) return null
    const candidate = value as AiShareFields & {
        v?: unknown
        bv?: unknown
        sv?: unknown
    }

    if (candidate.v === 1) {
        const version = getAiGovernanceVersion(
            AI_GOVERNANCE_V21_TUPLE.bankVersion,
            AI_GOVERNANCE_V21_TUPLE.scoringVersion,
        )
        if (!version) return null
        return {
            ...version,
            payload: {
                v: 1,
                as: candidate.as,
                ak: candidate.ak,
                nk: candidate.nk,
                rl: candidate.rl,
                pm: candidate.pm,
                gm: candidate.gm,
            },
        }
    }

    if (
        candidate.v !== 2 ||
        !Number.isInteger(candidate.bv) ||
        !Number.isInteger(candidate.sv)
    ) return null

    const version = getAiGovernanceVersion(
        candidate.bv as number,
        candidate.sv as number,
    )
    if (!version) return null
    return {
        ...version,
        payload: {
            v: 2,
            bv: version.bankVersion,
            sv: version.scoringVersion,
            as: candidate.as,
            ak: candidate.ak,
            nk: candidate.nk,
            rl: candidate.rl,
            pm: candidate.pm,
            gm: candidate.gm,
        },
    }
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

function isAiShareFields(value: unknown): value is AiShareFields {
    if (typeof value !== "object" || value === null) {
        return false
    }

    const candidate = value as Partial<AiShareFields>

    return (
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
