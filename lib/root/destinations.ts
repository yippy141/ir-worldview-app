import { navigationSections } from "@/lib/navigation"

/** Root groups use the same destination registry as child-page directories. */
export const ROOT_DESTINATIONS = navigationSections
export type RootDestinationId = (typeof ROOT_DESTINATIONS)[number]["id"]
export const ROOT_DESTINATION_IDS = ROOT_DESTINATIONS.map(group => group.id)
