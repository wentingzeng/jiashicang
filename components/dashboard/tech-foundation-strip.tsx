"use client"

import { Server, Zap, Boxes, Database, type LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { techFoundationGroups, type TechFoundationGroup, type TechStat } from "@/lib/mock-data"
import { useLiveValue } from "@/lib/use-live-value"

const iconMap: Record<TechFoundationGroup["icon"], LucideIcon> = {
  server: Server,
  zap: Zap,
  boxes: Boxes,
  database: Database,
}

function StatCell({ stat }: { stat: TechStat }) {
  const value = useLiveValue(stat.value, { volatility: 0.015 })
  return (
    <div className="flex flex-col gap-0.5">
      <span className="flex items-baseline gap-1">
        <span className="font-mono text-lg font-bold text-accent tabular-nums">
          {value.toFixed(stat.decimals ?? 0)}
        </span>
        <span className="text-[10px] text-muted-foreground/70">{stat.unit}</span>
      </span>
      <span className="text-[11px] leading-tight text-muted-foreground">{stat.label}</span>
    </div>
  )
}

function GroupPanel({ group }: { group: TechFoundationGroup }) {
  const Icon = iconMap[group.icon]
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border/60 bg-background/40 p-4">
      <div className="flex items-center gap-2">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-accent/15 text-accent">
          <Icon className="size-3.5" aria-hidden="true" />
        </span>
        <h4 className="text-xs font-semibold text-foreground">{group.title}</h4>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {group.stats.map((stat) => (
          <StatCell key={stat.label} stat={stat} />
        ))}
      </div>
    </div>
  )
}

export function TechFoundationStrip() {
  return (
    <Card className="gap-4 p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {techFoundationGroups.map((group) => (
          <GroupPanel key={group.key} group={group} />
        ))}
      </div>
    </Card>
  )
}
