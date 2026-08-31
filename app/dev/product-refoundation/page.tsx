import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProductRefoundationPrototype } from "@/components/dev/product-refoundation/product-refoundation"
import { getPrototypeConfig } from "@/lib/dev/product-refoundation/areas"
import { ROOT_GLOBE_VISUAL } from "@/lib/root/orthographic"

export const metadata: Metadata = {
  title: "Product re-foundation prototype",
  description:
    "A development-only prototype of one public name, one four-area public architecture, and one first-use screen.",
  robots: { index: false, follow: false },
}

// Case availability depends on an editorial date window, so the prototype
// reads it per request rather than freezing a stale label into a build.
export const dynamic = "force-dynamic"

export default function ProductRefoundationPrototypePage() {
  if (process.env.NODE_ENV === "production") notFound()

  const referenceDate = new Date().toISOString().slice(0, 10)

  return (
    <ProductRefoundationPrototype
      config={getPrototypeConfig(referenceDate)}
      visual={ROOT_GLOBE_VISUAL}
    />
  )
}
