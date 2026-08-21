"use client"

import { Database, Sparkles } from "lucide-react"
import { PanelCard } from "@/components/dashboard/panel-card"
import { datasetProgress } from "@/lib/mock-data"
import { useLiveValue } from "@/lib/use-live-value"

export function DatasetPanel() {
  const value = useLiveValue(datasetProgress.value, { volatility: 0.03 })

  return (
    <PanelCard icon={Database} title={datasetProgress.title}>
      <div className="flex min-h-28 items-center gap-4 rounded-lg border border-border/60 bg-secondary/35 p-3">
        <div className="relative flex size-20 shrink-0 items-center justify-center rounded-full border-[7px] border-accent/15">
          <div className="absolute inset-0 rounded-full border-[7px] border-transparent border-t-accent border-r-accent" aria-hidden="true" />
          <span className="font-mono text-lg font-bold text-accent tabular-nums">{value.toFixed(0)}%</span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-accent" aria-hidden="true" />
            <span className="text-sm font-semibold text-foreground">数据建设进度</span>
          </div>
          <span className="text-xs leading-5 text-muted-foreground">{datasetProgress.label}</span>
          <span className="text-[10px] text-muted-foreground/70">持续沉淀高质量可用数据</span>
        </div>
      </div>
    </PanelCard>
  )
}
