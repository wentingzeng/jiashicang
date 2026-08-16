import { HeroBanner } from "@/components/dashboard/hero-banner"
import { KpiCards } from "@/components/dashboard/kpi-cards"

export function OverviewSection() {
  return (
    <div className="flex flex-col gap-4">
      <HeroBanner />
      <KpiCards />
    </div>
  )
}
