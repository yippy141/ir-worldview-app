export const ROOT_DESTINATION_IDS = [
  "inventory",
  "world-stage",
  "atlas",
  "perspective-runs",
  "profile",
] as const

export type RootDestinationId = (typeof ROOT_DESTINATION_IDS)[number]

export type RootDestination = Readonly<{
  id: RootDestinationId
  href: string
  greatCircle: Readonly<{
    tilt: number
    azimuth: number
  }>
}>

export const ROOT_DESTINATIONS = [
  {
    id: "inventory",
    href: "/quiz",
    greatCircle: { tilt: 90, azimuth: 24 },
  },
  {
    id: "world-stage",
    href: "/world-stage",
    greatCircle: { tilt: 0, azimuth: 0 },
  },
  {
    id: "atlas",
    href: "/explore",
    greatCircle: { tilt: 23.44, azimuth: -18 },
  },
  {
    id: "perspective-runs",
    href: "/perspectives",
    greatCircle: { tilt: 66.56, azimuth: 42 },
  },
  {
    id: "profile",
    href: "/profile",
    greatCircle: { tilt: -35, azimuth: -48 },
  },
] as const satisfies readonly RootDestination[]

export const DEFAULT_ROOT_DESTINATION_ID: RootDestinationId = "inventory"

export function getRootDestination(id: RootDestinationId): RootDestination {
  const destination = ROOT_DESTINATIONS.find((candidate) => candidate.id === id)
  if (!destination) throw new Error(`Unknown root destination: ${id}`)
  return destination
}
