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
  LabelList,
} from "recharts"
import { PanelCard } from "@/components/dashboard/panel-card"
import { chartGridStroke, chartTooltip } from "@/lib/chart-utils"
import { hrPersonnelMix, hrPersonnelTotal, regionalPersonnel, unitPersonnel } from "@/lib/mock-data"

const maxUnitValue = Math.max(...unitPersonnel.map((u) => u.value))

export function HrPersonnelMix() {
  return (
    <PanelCard icon={UsersRound} title="研发人员构成" className="h-full">
      <div className="flex min-h-[190px] flex-col items-center gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full text-[12px] sm:w-[48%]">
          <ResponsiveContainer width="100%" height={190}>
            <PieChart>
              <Pie
                data={hrPersonnelMix}
                dataKey="value"
                nameKey="name"
                innerRadius={54}
                outerRadius={76}
                paddingAngle={4}
                strokeWidth={0}
              >
                {hrPersonnelMix.map((item) => (
                  <Cell key={item.name} fill={item.color} />
                ))}
              </Pie>
              <Tooltip 
                {...chartTooltip} 
                contentStyle={{ ...chartTooltip.contentStyle, fontSize: '12px' }}
                formatter={(value: any) => [`${Number(value).toFixed(2)}%`, "占比"]} 
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-3xl font-bold tabular-nums text-foreground tracking-tight">
              {hrPersonnelTotal.toLocaleString()}
            </span>
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">总人数</span>
          </div>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-[48%]">
          {hrPersonnelMix.map((item) => (
            <div
              key={item.name}
              className="group flex items-center gap-3 rounded-xl border border-border/60 bg-background/20 px-3 py-2 transition-all hover:border-primary/40 hover:bg-background/40"
            >
              <span className="size-3 shrink-0 rounded-full ring-4 ring-background shadow-sm" style={{ backgroundColor: item.color }} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{item.name}</p>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <strong className="font-mono text-lg font-bold tabular-nums text-foreground">{item.value.toFixed(1)}</strong>
                  <span className="text-xs text-muted-foreground">%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PanelCard>
  )
}

export function HrRegionalDistribution() {
  return (
    <PanelCard icon={BarChart3} title="各地区人员分布" className="h-full">
      <ResponsiveContainer width="100%" height={248}>
        <BarChart data={regionalPersonnel} margin={{ left: -10, right: 10, top: 15, bottom: 0 }}>
          <defs>
            <linearGradient id="regionBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity={1} />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity={0.65} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke={chartGridStroke} />
          <XAxis
            dataKey="name"
            tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontWeight: 500 }}
            axisLine={{ stroke: "var(--border)", strokeWidth: 1 }}
            tickLine={{ stroke: "var(--border)", strokeWidth: 1 }}
            interval={0}
            angle={-20}
            textAnchor="end"
            height={50}
          />
          <YAxis
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            axisLine={{ stroke: "var(--border)", strokeWidth: 1 }}
            tickLine={{ stroke: "var(--border)", strokeWidth: 1 }}
            width={45}
          />
          <Tooltip 
            {...chartTooltip} 
            contentStyle={{ ...chartTooltip.contentStyle, fontSize: '12px' }}
            cursor={{ fill: "var(--muted)", opacity: 0.35 }} 
          />
          <Bar dataKey="value" name="人数" fill="url(#regionBar)" radius={[4, 4, 0, 0]} maxBarSize={28}><LabelList dataKey="value" position="top" fill="var(--foreground)" fontSize={10} /></Bar>
        </BarChart>
      </ResponsiveContainer>
    </PanelCard>
  )
}

export function HrUnitDistribution() {
  return (
    <PanelCard icon={Building2} title="各单位人数" className="h-full" bodyClassName="h-[240px] overflow-y-auto pr-1 pb-0 font-[inherit]">
      <div className="flex flex-col gap-3.5">
        {unitPersonnel.map((unit) => {
          const width = (unit.value / maxUnitValue) * 100
          return (
            <div key={unit.name} className="group grid grid-cols-[1fr_auto] items-center gap-4">
              <div className="min-w-0">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                    {unit.name}
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-muted/80">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
              <span className="shrink-0 rounded-md bg-primary/12 px-2.5 py-1.5 font-mono text-sm font-bold tabular-nums text-primary">
                {unit.value}
              </span>
            </div>
          )
        })}
      </div>
    </PanelCard>
  )
}
