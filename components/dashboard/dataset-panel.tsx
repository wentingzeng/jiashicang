"use client"

import { Database } from "lucide-react"
import { PanelCard } from "@/components/dashboard/panel-card"
import { datasetProgress } from "@/lib/mock-data"
import { useLiveValue } from "@/lib/use-live-value"

export function DatasetPanel() {
  const value = useLiveValue(datasetProgress.value, { volatility: 0.03 })

  return (
    <PanelCard icon={Database} title={datasetProgress.title} bodyClassName="flex min-h-[112px] items-center justify-center p-2">
      <div className="flex w-full items-center justify-center gap-3 rounded-lg border border-border/60 bg-secondary/35 p-1.5">
        <div className="relative flex size-14 shrink-0 items-center justify-center rounded-full border-[5px] border-accent/15">
          <div className="absolute inset-0 rounded-full border-[5px] border-transparent border-t-accent border-r-accent" aria-hidden="true" />
          <span className="font-mono text-lg font-bold text-accent tabular-nums">{value.toFixed(0)}%</span>
        </div>
        <span className="max-w-36 text-xs font-normal leading-5 text-foreground">高质量数据集建设完成度</span>
      </div>
    </PanelCard>
  )
}
