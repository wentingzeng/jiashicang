"use client"

import { TrendingUp, Milestone, CheckCircle2, type LucideIcon } from "lucide-react"
import { PanelCard } from "@/components/dashboard/panel-card"
import { overallProgress } from "@/lib/mock-data"
import { useLiveValue } from "@/lib/use-live-value"

export function ProgressSummaryPanel() {
  const overallRate = useLiveValue(overallProgress.overallRate, { volatility: 0.02 })

  const stats: { label: string; value: string; icon: LucideIcon }[] = [
    { label: "总体进度", value: `${overallRate.toFixed(1)}%`, icon: TrendingUp },
    { label: "关键里程碑达成率", value: `${overallProgress.milestoneRate}%`, icon: Milestone },
    {
      label: "关键里程碑已达成",
      value: `${overallProgress.milestoneDone}/${overallProgress.milestoneTotal}`,
      icon: CheckCircle2,
    },
  ]

  return (
    <PanelCard icon={TrendingUp} title="总体进展" className="h-fit" bodyClassName="flex min-h-[190px] items-center p-4">
      <div className="grid w-full grid-cols-3 items-center gap-2">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="relative flex min-h-24 flex-col items-center justify-center gap-1.5 overflow-hidden rounded-lg border border-border/60 bg-gradient-to-b from-secondary/50 to-background/40 px-2 py-3 text-center"
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 50% 0%, oklch(0.75 0.14 195 / 22%), transparent 65%)",
                }}
                aria-hidden="true"
              />
              <span className="relative flex size-7 items-center justify-center rounded-full bg-accent/15 text-accent">
                <Icon className="size-3.5" aria-hidden="true" />
              </span>
              <span className="relative font-mono text-2xl font-bold text-accent tabular-nums">{stat.value}</span>
              <span className="relative text-xs text-muted-foreground">{stat.label}</span>
            </div>
          )
        })}
      </div>
    </PanelCard>
  )
}
