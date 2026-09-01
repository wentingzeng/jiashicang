"use client"

import { Users, CheckCircle2, Target, Clock, Award, Layers, type LucideIcon } from "lucide-react"
import useSWR from "swr"
import { Card } from "@/components/ui/card"
import { aiCockpitApi, rowsBySection, type AiCockpitRow } from "@/lib/ai-cockpit-api"

const cardIcons: LucideIcon[] = [Users, CheckCircle2, Target, Clock, Award, Layers]

function KpiCardItem({ row, index }: { row: AiCockpitRow; index: number }) {
  const Icon = cardIcons[index] ?? Layers

  return (
    <Card className="flex-row items-center gap-3 p-4 transition-colors hover:border-primary/40">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="truncate text-xs text-muted-foreground">{row.dataName}</span>
        <span className="flex items-baseline gap-1">
          <span className="font-mono text-xl font-bold text-foreground tabular-nums">{String(row.data)}</span>
          {row.unit && <span className="text-xs text-muted-foreground">{row.unit}</span>}
        </span>
      </div>
    </Card>
  )
}

export function KpiCards() {
  const { data: rows = [] } = useSWR("ai-cockpit-overview", aiCockpitApi.overview)
  const coreRows = rowsBySection(rows, "核心概览", "核心概览")
  const orderedRows = coreRows.slice(0, 6)
  const overviewRows = orderedRows.slice(0, 3)
  const teamRows = orderedRows.slice(3, 6)

  return (
    <section aria-label="核心指标" className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-6">
        <div className="flex flex-col gap-2 lg:col-span-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {overviewRows.map((row, index) => (
              <KpiCardItem key={row.metricCode} row={row} index={index} />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2 lg:col-span-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {teamRows.map((row, index) => (
              <KpiCardItem key={row.metricCode} row={row} index={index + 3} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
