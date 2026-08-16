"use client"

import { BarChart3, Building2, UsersRound } from "lucide-react"
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import { PanelCard } from "@/components/dashboard/panel-card"
import { chartGridStroke, chartTooltip } from "@/lib/chart-utils"
import { hrPersonnelMix, hrPersonnelTotal, regionalPersonnel, unitPersonnel } from "@/lib/mock-data"

const maxUnitValue = Math.max(...unitPersonnel.map((u) => u.value))

export function HrPersonnelMix() {
  return (
    <PanelCard icon={UsersRound} title="现有人员信息图">
      <div className="flex min-h-56 flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-[52%]">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={hrPersonnelMix}
                dataKey="value"
                nameKey="name"
                innerRadius={58}
                outerRadius={86}
                paddingAngle={2}
                strokeWidth={0}
              >
                {hrPersonnelMix.map((item) => (
                  <Cell key={item.name} fill={item.color} />
                ))}
              </Pie>
              <Tooltip {...chartTooltip} formatter={(value: number) => [`${value.toFixed(2)}%`, "占比"]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-2xl font-bold tabular-nums text-foreground">{hrPersonnelTotal.toLocaleString()}</span>
            <span className="text-[11px] text-muted-foreground">总人数</span>
          </div>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-[44%]">
          {hrPersonnelMix.map((item) => (
            <div
              key={item.name}
              className="flex items-center gap-2.5 rounded-lg border border-border/60 bg-background/40 px-3 py-2.5 transition-colors hover:border-primary/30"
            >
              <span className="size-2.5 shrink-0 rounded-full ring-2 ring-background" style={{ backgroundColor: item.color }} />
              <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">{item.name}</span>
              <strong className="shrink-0 font-mono text-sm tabular-nums text-foreground">{item.value.toFixed(2)}%</strong>
            </div>
          ))}
        </div>
      </div>
    </PanelCard>
  )
}

export function HrRegionalDistribution() {
  return (
    <PanelCard icon={BarChart3} title="各地区人员分布">
      <ResponsiveContainer width="100%" height={248}>
        <BarChart data={regionalPersonnel} margin={{ left: -8, right: 4, top: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="regionBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity={1} />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity={0.65} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke={chartGridStroke} />
          <XAxis
            dataKey="name"
            tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            interval={0}
            angle={-28}
            textAnchor="end"
            height={48}
          />
          <YAxis
            tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={36}
          />
          <Tooltip {...chartTooltip} cursor={{ fill: "var(--muted)", opacity: 0.35 }} />
          <Bar dataKey="value" name="人数" fill="url(#regionBar)" radius={[4, 4, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </PanelCard>
  )
}

export function HrUnitDistribution() {
  return (
    <PanelCard icon={Building2} title="各单位人数" bodyClassName="max-h-[248px] overflow-y-auto pr-1">
      <div className="flex flex-col gap-2.5">
        {unitPersonnel.map((unit) => {
          const width = (unit.value / maxUnitValue) * 100
          return (
            <div key={unit.name} className="group grid grid-cols-[1fr_auto] items-center gap-3">
              <div className="min-w-0">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="truncate text-xs text-muted-foreground transition-colors group-hover:text-foreground">
                    {unit.name}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted/80">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
              <span className="shrink-0 rounded-md bg-primary/12 px-2 py-1 font-mono text-xs font-semibold tabular-nums text-primary">
                {unit.value}
              </span>
            </div>
          )
        })}
      </div>
    </PanelCard>
  )
}
