"use client"

import { Database } from "lucide-react"
import { PanelCard } from "@/components/dashboard/panel-card"
import { datasetProgress } from "@/lib/mock-data"
import { useLiveValue } from "@/lib/use-live-value"

export function DatasetPanel() {
  const value = useLiveValue(datasetProgress.value, { volatility: 0.03 })

  return (
    <PanelCard icon={Database} title={datasetProgress.title} bodyClassName="flex min-h-[112px] items-center justify-center p-2">
      <div className="flex w-full flex-col items-center justify-center gap-2 py-3">
        <div className="relative flex size-20 shrink-0 items-center justify-center rounded-full border-[7px] border-accent/15">
          <div className="absolute inset-0 rounded-full border-[7px] border-transparent border-t-accent border-r-accent" aria-hidden="true" />
          <span className="font-mono text-xl font-bold text-accent tabular-nums">{value.toFixed(0)}%</span>
        </div>
        <span className="text-xs font-normal leading-5 text-foreground">高质量数据集建设完成度</span>
      </div>
    </PanelCard>
  )
}
