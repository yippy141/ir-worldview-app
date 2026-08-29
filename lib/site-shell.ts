import { STUDY_ROUTES } from "@/lib/v23-6/routes"

const IMMERSIVE_ROUTES = new Set<string>([
  "/",
  "/world-stage-prototype",
  ...STUDY_ROUTES,
])

export function isImmersiveRoute(pathname: string) {
  return IMMERSIVE_ROUTES.has(pathname)
}
