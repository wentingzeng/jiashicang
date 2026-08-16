"use client"

import { Cpu, BookOpenText, type LucideIcon } from "lucide-react"
import { PanelCard } from "@/components/dashboard/panel-card"
import type { MetricPanel } from "@/lib/mock-data"
import { useLiveValue } from "@/lib/use-live-value"

const iconMap: Record<string, LucideIcon> = {
  model: Cpu,
  knowledge: BookOpenText,
}

function MetricItem({ item }: { item: MetricPanel["items"][number] }) {
  const value = useLiveValue(item.value, { volatility: 0.02 })
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-lg font-bold text-foreground tabular-nums">
        {value.toFixed(item.decimals ?? 0)}
      </span>
      <span className="text-[11px] leading-tight text-muted-foreground">
        {item.label}
        <br />
        <span className="text-[10px] text-muted-foreground/70">{"单位：" + item.unit}</span>
      </span>
    </div>
  )
}

export function MetricPanelCard({ panel }: { panel: MetricPanel }) {
  const Icon = iconMap[panel.key] ?? Cpu
  return (
    <PanelCard icon={Icon} title={panel.title}>
      <div className="grid grid-cols-2 gap-3">
        {panel.items.map((item) => (
          <MetricItem key={item.label} item={item} />
        ))}
      </div>
    </PanelCard>
  )
}
