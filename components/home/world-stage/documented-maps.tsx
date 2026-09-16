import { DocumentedGlobe } from "@/components/home/root/documented-globe"
import { DOCUMENTED_GLOBE_VISUAL } from "@/lib/root/orthographic"
import { getDocumentedGlobeScenes } from "@/lib/world-stage/documented-globe-scenes"
import type { Locale } from "@/i18n/routing"

export function DocumentedMaps({ locale }: { locale: Locale }) {
  const chinese = locale === "zh-Hans"
  return <section id="membership-maps" className="documented-membership" aria-labelledby="membership-heading" data-mode="documented">
    <h2 id="membership-heading">{chinese ? "有来源的成员资格地图" : "Documented membership maps"}</h2>
    <p>{chinese ? "欧盟与北约成员资格，以及2020年RCEP签署记录。每个场景都有各自的日期、图例和来源。" : "EU and NATO membership, and the 2020 RCEP signing. Each scene has its own date, literal key and sources."}</p>
    <DocumentedGlobe visual={DOCUMENTED_GLOBE_VISUAL} scenes={getDocumentedGlobeScenes(locale)} chinese={chinese} />
  </section>
}
