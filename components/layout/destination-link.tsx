"use client"

import { useLocale } from "next-intl"
import { Link } from "@/i18n/navigation"
import { destinations, destinationLabel, type DestinationId } from "@/lib/navigation"

/** A section destination, independent of history, answers or result payloads. */
export function DestinationLink({ destination, className = "parent-link" }: {
  destination: DestinationId
  className?: string
}) {
  const locale = useLocale()
  return <Link href={destinations[destination].href} prefetch={false} className={className}>
    {destinationLabel(destination, locale)}
  </Link>
}
