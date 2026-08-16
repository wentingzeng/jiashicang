"use client"

import { Database } from "lucide-react"
import { PanelCard } from "@/components/dashboard/panel-card"
import { Progress } from "@/components/ui/progress"
import { datasetProgress } from "@/lib/mock-data"
import { useLiveValue } from "@/lib/use-live-value"

export function DatasetPanel() {
  const value = useLiveValue(datasetProgress.value, { volatility: 0.03 })

  return (
    <PanelCard icon={Database} title={datasetProgress.title}>
      <div className="flex h-full flex-col justify-center gap-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{datasetProgress.label}</span>
          <span className="font-mono font-semibold text-accent tabular-nums">{value.toFixed(0)}%</span>
        </div>
        <Progress value={value} />
      </div>
    </PanelCard>
  )
}
