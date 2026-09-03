"use client"

import { UserCog } from "lucide-react"
import useSWR from "swr"
import { PanelCard } from "@/components/dashboard/panel-card"
import { aiCockpitApi, rowsBySection } from "@/lib/ai-cockpit-api"

export function PersonnelPanel() {
  const { data: rows = [] } = useSWR("ai-cockpit-overview", aiCockpitApi.overview)
  const statRows = rowsBySection(rows, "工程建设", "人员与制度")

  return (
    <PanelCard icon={UserCog} title="人员与制度">
      <div className="grid grid-cols-2 gap-2">
        {statRows.map((row, index) => (
          <div
            key={row.metricCode}
            className={`flex min-w-0 flex-col px-3 py-2 ${index === 2 ? "col-span-2" : ""}`}
          >
            <span className="font-mono text-lg font-bold leading-6 text-foreground tabular-nums">{String(row.data)}</span>
            <span className="mt-0.5 text-[11px] leading-tight text-muted-foreground">{row.dataName}</span>
            {row.unit && <span className="text-[10px] leading-tight text-muted-foreground/70">{"单位：" + row.unit}</span>}
          </div>
        ))}
      </div>
    </PanelCard>
  )
}
