"use client"

import { Bot, CheckCircle2 } from "lucide-react"
import useSWR from "swr"
import { PanelCard } from "@/components/dashboard/panel-card"
import { aiCockpitApi, rowsBySection } from "@/lib/ai-cockpit-api"

export function AgentProgressPanel() {
  const { data: rows = [] } = useSWR("ai-cockpit-overview", aiCockpitApi.overview)
  const agentRows = rowsBySection(rows, "核心概览", "超级智能体建设情况")

  return (
    <PanelCard icon={Bot} title="超级智能体建设情况" className="h-fit" bodyClassName="flex min-h-[190px] items-center p-4">
      <div className="grid w-full grid-cols-2 items-center gap-4">
        {agentRows.map((row) => (
          <div
            key={row.metricCode}
            className="flex min-h-24 flex-col justify-between rounded-lg border border-border/60 bg-secondary/35 p-3"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs leading-5 text-muted-foreground">{row.dataName}</span>
              <CheckCircle2 className="size-4 shrink-0 text-accent" aria-hidden="true" />
            </div>
            <div className="flex items-end justify-between gap-2">
              <span className="font-mono text-2xl font-bold text-accent tabular-nums">
                {String(row.data)}
                {row.unit ?? "%"}
              </span>
              <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">建设中</span>
            </div>
          </div>
        ))}
      </div>
    </PanelCard>
  )
}
