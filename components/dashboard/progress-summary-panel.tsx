"use client"

import { TrendingUp, Milestone, CheckCircle2, type LucideIcon } from "lucide-react"
import useSWR from "swr"
import { PanelCard } from "@/components/dashboard/panel-card"
import { aiCockpitApi, findByName, formatAiValue, rowsBySection } from "@/lib/ai-cockpit-api"

export function ProgressSummaryPanel() {
  const { data: rows = [] } = useSWR("ai-cockpit-overview", aiCockpitApi.overview)
  const panelRows = rowsBySection(rows, "核心概览", "总体进展")

  const overallRateRow = findByName(panelRows, "总体进度")
  const milestoneRateRow = findByName(panelRows, "关键里程碑达成率")
  const milestoneDoneRow =
    findByName(panelRows, "关键里程碑达成数") ?? findByName(panelRows, "已达成")
  const milestoneTotalRow =
    findByName(panelRows, "关键里程碑总数") ??
    findByName(panelRows, "目标总数") ??
    findByName(panelRows, "里程碑总数")

  const stats: { label: string; value: string; icon: LucideIcon }[] = [
    { label: overallRateRow?.dataName ?? "总体进度", value: overallRateRow ? formatAiValue(overallRateRow.data, overallRateRow.unit) : "-", icon: TrendingUp },
    { label: milestoneRateRow?.dataName ?? "关键里程碑达成率", value: milestoneRateRow ? formatAiValue(milestoneRateRow.data, milestoneRateRow.unit) : "-", icon: Milestone },
    {
      label: milestoneDoneRow?.dataName ?? "关键里程碑已达成",
      value: milestoneDoneRow && milestoneTotalRow
        ? `${milestoneDoneRow.data}/${milestoneTotalRow.data}${milestoneTotalRow.unit ? ` ${milestoneTotalRow.unit}` : ""}`
        : "-",
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
