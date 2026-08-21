"use client"

import { Users, CheckCircle2, Target, Clock, Award, Layers, type LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { kpiCards, type KpiCard } from "@/lib/mock-data"
import { useLiveValue } from "@/lib/use-live-value"

const iconMap: Record<KpiCard["icon"], LucideIcon> = {
  users: Users,
  check: CheckCircle2,
  target: Target,
  clock: Clock,
  award: Award,
  layers: Layers,
}

function KpiCardItem({ card }: { card: KpiCard }) {
  const Icon = iconMap[card.icon]
  const liveValue = useLiveValue(card.value, { volatility: 0.01 })
  const decimals = card.decimals ?? 0
  const displayValue = liveValue.toFixed(decimals)

  return (
    <Card className="flex-row items-center gap-3 p-4 transition-colors hover:border-primary/40">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="truncate text-xs text-muted-foreground">{card.label}</span>
        <span className="flex items-baseline gap-1">
          <span className="font-mono text-xl font-bold text-foreground tabular-nums">{displayValue}</span>
          {card.unit && <span className="text-xs text-muted-foreground">{card.unit}</span>}
        </span>
      </div>
    </Card>
  )
}

export function KpiCards() {
  const overviewCards = kpiCards.filter((card) => card.group === "overview")
  const teamCards = kpiCards.filter((card) => card.group === "team")

  return (
    <section aria-label="核心指标" className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-6">
        <div className="flex flex-col gap-2 lg:col-span-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {overviewCards.map((card) => (
              <KpiCardItem key={card.key} card={card} />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2 lg:col-span-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {teamCards.map((card) => (
              <KpiCardItem key={card.key} card={card} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
