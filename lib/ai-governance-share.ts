import {
    AiArchetypeKey,
    AiAxisKey,
    AiAxisScores,
    GeopoliticsModifier,
    PaceModifier,
    RiskLens,
} from "@/lib/ai-governance-types"

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
    const json = JSON.stringify(payload)
    return btoa(json).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
}

export function decodeAiPayload(encoded: string): AiSharePayload | null {
    try {
        const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/")
        const json = atob(base64)
        const parsed = JSON.parse(json)

        if (
            parsed.v !== 1 ||
            !Array.isArray(parsed.as) ||
            parsed.as.length !== 8 ||
            !parsed.ak ||
            !parsed.nk ||
            !parsed.rl ||
            !parsed.pm ||
            !parsed.gm
        ) {
            return null
        }

        return parsed as AiSharePayload
    } catch {
        return null
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