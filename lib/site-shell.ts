const IMMERSIVE_ROUTES = new Set(["/", "/world-stage-prototype"])

export function isImmersiveRoute(pathname: string) {
  return IMMERSIVE_ROUTES.has(pathname)
}
