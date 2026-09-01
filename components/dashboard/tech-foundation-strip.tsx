"use client"

import { Server, Zap, Boxes, Database, type LucideIcon } from "lucide-react"
import useSWR from "swr"
import { Card } from "@/components/ui/card"
import { aiCockpitApi, type AiCockpitRow } from "@/lib/ai-cockpit-api"

type TechGroupDef = { key: string; title: string; icon: LucideIcon }

const techGroupDefs: TechGroupDef[] = [
  { key: "compute", title: "智算基础设施", icon: Server },
  { key: "serving", title: "模型服务能力", icon: Zap },
  { key: "models", title: "模型矩阵", icon: Boxes },
  { key: "assets", title: "数据与资产", icon: Database },
]

function StatCell({ row }: { row: AiCockpitRow }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="flex items-baseline gap-1">
        <span className="font-mono text-lg font-bold text-accent tabular-nums">{String(row.data)}</span>
        {row.unit && <span className="text-[10px] text-muted-foreground/70">{row.unit}</span>}
      </span>
      <span className="text-[11px] leading-tight text-muted-foreground">{row.dataName}</span>
    </div>
  )
}

function GroupPanel({ group, rows }: { group: TechGroupDef; rows: AiCockpitRow[] }) {
  const Icon = group.icon
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border/60 bg-background/40 p-4">
      <div className="flex items-center gap-2">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-accent/15 text-accent">
          <Icon className="size-3.5" aria-hidden="true" />
        </span>
        <h4 className="text-xs font-semibold text-foreground">{group.title}</h4>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {rows.map((row) => (
          <StatCell key={row.metricCode} row={row} />
        ))}
      </div>
    </div>
  )
}

export function TechFoundationStrip() {
  const { data: rows = [] } = useSWR("ai-cockpit-overview", aiCockpitApi.overview)
  const foundationRows = rows.filter((row) => row.section === "技术底座")
  const groupedRows = foundationRows.reduce<Record<string, AiCockpitRow[]>>((groups, row) => {
    const key = row.subSection || "技术底座"
    ;(groups[key] ??= []).push(row)
    return groups
  }, {})
  const groups = Object.entries(groupedRows).slice(0, 4).map(([title, groupRows], index) => ({
    ...(techGroupDefs[index] ?? { key: `foundation-${index}`, icon: Database }),
    title,
    rows: groupRows,
  }))

  return (
    <Card className="gap-4 p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {groups.map((group) => (
          <GroupPanel key={group.key} group={group} rows={group.rows} />
        ))}
      </div>
    </Card>
  )
}
