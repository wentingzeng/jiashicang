"use client"

import { Database } from "lucide-react"
import useSWR from "swr"
import { PanelCard } from "@/components/dashboard/panel-card"
import { aiCockpitApi, findByName, rowsBySection } from "@/lib/ai-cockpit-api"

const PANEL_TITLE = "高质量数据集工程"

export function DatasetPanel() {
  const { data: rows = [] } = useSWR("ai-cockpit-overview", aiCockpitApi.overview)
  const panelRows = rowsBySection(rows, "工程建设", PANEL_TITLE)
  const row = findByName(panelRows, "建设完成度")

  return (
    <PanelCard icon={Database} title={PANEL_TITLE} bodyClassName="flex min-h-[112px] items-center justify-center p-2">
      <div className="flex w-full flex-col items-center justify-center gap-2 py-3">
        <div className="relative flex size-20 shrink-0 items-center justify-center rounded-full border-[7px] border-accent/15">
          <div className="absolute inset-0 rounded-full border-[7px] border-transparent border-t-accent border-r-accent" aria-hidden="true" />
          <span className="font-mono text-xl font-bold text-accent tabular-nums">{row ? String(row.data) : "-"}{row?.unit ?? "%"}</span>
        </div>
        <span className="text-xs font-normal leading-5 text-foreground">{row?.dataName ?? "高质量数据集建设完成度"}</span>
      </div>
    </PanelCard>
  )
}
