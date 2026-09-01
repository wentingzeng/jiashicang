"use client"

import { Cpu, BookOpenText, type LucideIcon } from "lucide-react"
import useSWR from "swr"
import { PanelCard } from "@/components/dashboard/panel-card"
import { aiCockpitApi, rowsBySection, type AiCockpitRow } from "@/lib/ai-cockpit-api"

const iconMap: Record<string, LucideIcon> = {
  model: Cpu,
  knowledge: BookOpenText,
}

function MetricItem({ row }: { row: AiCockpitRow }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-lg font-bold text-foreground tabular-nums">{String(row.data)}</span>
      <span className="text-[11px] leading-tight text-muted-foreground">
        {row.dataName}
        <br />
        {row.unit && <span className="text-[10px] text-muted-foreground/70">{"单位：" + row.unit}</span>}
      </span>
    </div>
  )
}

export function MetricPanelCard({ panel }: { panel: { key: string; title: string } }) {
  const { data: rows = [] } = useSWR("ai-cockpit-overview", aiCockpitApi.overview)
  const panelRows = rowsBySection(rows, "工程建设", panel.title)
  const Icon = iconMap[panel.key] ?? Cpu
  return (
    <PanelCard icon={Icon} title={panel.title}>
      <div className="grid grid-cols-2 gap-3">
        {panelRows.map((row) => (
          <MetricItem key={row.metricCode} row={row} />
        ))}
      </div>
    </PanelCard>
  )
}
