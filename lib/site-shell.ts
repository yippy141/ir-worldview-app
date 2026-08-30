const IMMERSIVE_ROUTES = new Set(["/", "/world-stage", "/world-stage-prototype"])
const IMMERSIVE_SELF_LANGUAGE_ROUTES = new Set(["/", "/world-stage"])

export function isImmersiveRoute(pathname: string) {
  return IMMERSIVE_ROUTES.has(pathname)
}

export function immersiveRouteOwnsLanguageControl(pathname: string) {
  return IMMERSIVE_SELF_LANGUAGE_ROUTES.has(pathname)
}
