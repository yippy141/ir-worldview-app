export const BETA_PARTICIPATION_URL_ENV = "V22_5_BETA_PARTICIPATION_URL"
export const BETA_NAVIGATION_FLAG_ENV = "V22_5_BETA_NAV_ENABLED"

export function getBetaParticipationUrl(
  value: string | undefined = process.env.V22_5_BETA_PARTICIPATION_URL,
): string | null {
  const candidate = value?.trim()
  if (!candidate) return null

  try {
    const url = new URL(candidate)
    if (url.protocol !== "https:" || url.username || url.password) return null
    return url.toString()
  } catch {
    return null
  }
}

export function betaNavigationEnabled(
  value: string | undefined = process.env.V22_5_BETA_NAV_ENABLED,
): boolean {
  return value?.trim().toLowerCase() === "true"
}

export type BetaNavigationItem = {
  href: "/beta"
  labelKey: "nav.beta"
}

export function getBetaNavigationItem(
  enabled: boolean,
): BetaNavigationItem | null {
  return enabled ? { href: "/beta", labelKey: "nav.beta" } : null
}
