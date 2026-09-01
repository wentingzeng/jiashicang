"use client"

import { AlertTriangle, ArrowUpRight, CircleAlert } from "lucide-react"
import useSWR from "swr"
import { PanelCard } from "@/components/dashboard/panel-card"
import { aiCockpitApi, rowsBySection } from "@/lib/ai-cockpit-api"

export function HighlightsPanel() {
  const { data: rows = [] } = useSWR("ai-cockpit-overview", aiCockpitApi.overview)
  const highlightRows = rowsBySection(rows, "核心概览", "重点关注")

  return (
    <PanelCard icon={AlertTriangle} title="重点关注" bodyClassName="flex h-full flex-col p-3">
      {highlightRows.length === 0 ? (
        <p className="flex flex-1 items-center justify-center text-xs text-muted-foreground">暂无重点关注事项</p>
      ) : (
        <ul className="flex flex-col gap-1">
          {highlightRows.map((row) => (
            <li key={row.metricCode} className="flex min-w-0 items-center gap-2 rounded-lg border border-border/70 bg-secondary/35 px-2 py-1">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                <CircleAlert className="size-3" aria-hidden="true" />
              </span>
              <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                <div className="flex min-w-0 flex-col gap-0">
                  <span className="truncate text-xs font-medium leading-4 text-foreground">{row.dataName}</span>
                  <span className="text-[11px] leading-4 text-muted-foreground">{row.dataMeaning ?? String(row.data)}</span>
                </div>
                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground/60" aria-hidden="true" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </PanelCard>
  )
}
