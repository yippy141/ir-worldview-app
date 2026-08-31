// Development-only prototype routes follow the same full-bleed shell as the
// root and World Stage. They fail closed in production at the route itself.
const IMMERSIVE_ROUTES = new Set([
  "/",
  "/world-stage",
  "/world-stage-prototype",
  "/dev/product-refoundation",
])
// The product re-foundation prototype is English-only, so it renders no
// locale control rather than floating one over its composition.
const IMMERSIVE_SELF_LANGUAGE_ROUTES = new Set([
  "/",
  "/world-stage",
  "/dev/product-refoundation",
])

export function isImmersiveRoute(pathname: string) {
  return IMMERSIVE_ROUTES.has(pathname)
}

export function immersiveRouteOwnsLanguageControl(pathname: string) {
  return IMMERSIVE_SELF_LANGUAGE_ROUTES.has(pathname)
}
