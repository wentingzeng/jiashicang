"use client"

import { BriefcaseBusiness, LineChart as LineIcon, TrendingUp, PieChart as PieIcon } from "lucide-react"
import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  ComposedChart,
} from "recharts"
import { PanelCard } from "@/components/dashboard/panel-card"
import { cn } from "@/lib/utils"
import { chartGridStroke, chartTooltip } from "@/lib/chart-utils"
import { businessLineDistribution, monthlyTaskTrend, rdDurationTrend, rdOverviewStats } from "@/lib/mock-data"
import { useLiveValue } from "@/lib/use-live-value"

const ROSE_INNER = 20
const ROSE_MAX_OUTER = 72
const ROSE_MAX_VALUE = Math.max(...businessLineDistribution.map((d) => d.value))
const ROSE_GAP_DEG = 2

export function BusinessLinePanel() {
  const n = businessLineDistribution.length
  const angleStep = 360 / n

  return (
    <PanelCard icon={PieIcon} title="各业务条线分布" bodyClassName="p-3">
      <div className="flex items-center gap-3">
        <div className="w-[42%] shrink-0">
          <ResponsiveContainer width="100%" height={168}>
            <PieChart>
              {businessLineDistribution.map((item, i) => {
                const startAngle = 90 - i * angleStep
                const endAngle = startAngle - angleStep + ROSE_GAP_DEG
                const outerRadius = ROSE_INNER + (item.value / ROSE_MAX_VALUE) * (ROSE_MAX_OUTER - ROSE_INNER)
                return (
                  <Pie
                    key={item.name}
                    data={[item]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={ROSE_INNER}
                    outerRadius={outerRadius}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    stroke="none"
                    fill={item.color}
                  />
                )
              })}
              <Tooltip {...chartTooltip} formatter={(value: number, _n: string, entry: { payload?: { name?: string } }) => [`${value}%`, entry?.payload?.name ?? "占比"]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid min-w-0 flex-1 grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
          {businessLineDistribution.map((item) => (
            <div key={item.name} className="flex min-w-0 items-center gap-1.5">
              <span className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="min-w-0 truncate text-muted-foreground">{item.name}</span>
              <span className="ml-auto shrink-0 font-mono text-foreground">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </PanelCard>
  )
}

const [buildingTotal, deliveredTotal, buildingProjects, buildingSpecials, deliveredProjects, deliveredSpecials] =
  rdOverviewStats

function LiveStatValue({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const live = useLiveValue(value, { volatility: 0.008, intervalMs: 5000 })
  return <>{live.toFixed(decimals)}</>
}

function StatGroup({
  title,
  total,
  project,
  special,
  tone,
}: {
  title: string
  total: (typeof rdOverviewStats)[number]
  project: (typeof rdOverviewStats)[number]
  special: (typeof rdOverviewStats)[number]
  tone: "primary" | "accent"
}) {
  const isAccent = tone === "accent"

  return (
    <div
      className={cn(
        "rounded-lg border px-3 py-2.5",
        isAccent ? "border-accent/25 bg-accent/5" : "border-primary/25 bg-primary/5",
      )}
    >
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className={cn("text-[11px] font-semibold", isAccent ? "text-accent" : "text-primary")}>{title}</span>
        <span className="truncate text-[10px] text-muted-foreground">{total.label}</span>
      </div>
      <p className={cn("font-mono text-2xl font-bold leading-none tabular-nums", isAccent ? "text-accent" : "text-primary")}>
        <LiveStatValue value={total.value} />
        <span className="ml-1 text-xs font-normal text-muted-foreground">{total.unit}</span>
      </p>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        <div className="rounded-md border border-border/50 bg-background/40 px-2 py-1.5">
          <p className="text-[10px] leading-tight text-muted-foreground">{project.label}</p>
          <p className="mt-0.5 font-mono text-base font-semibold tabular-nums text-foreground">
            <LiveStatValue value={project.value} />
          </p>
        </div>
        <div className="rounded-md border border-border/50 bg-background/40 px-2 py-1.5">
          <p className="text-[10px] leading-tight text-muted-foreground">{special.label}</p>
          <p className="mt-0.5 font-mono text-base font-semibold tabular-nums text-foreground">
            <LiveStatValue value={special.value} />
          </p>
        </div>
      </div>
    </div>
  )
}

export function RdStatsPanel() {
  return (
    <PanelCard icon={BriefcaseBusiness} title="项目概况" bodyClassName="p-3">
      <div className="grid gap-2 sm:grid-cols-2">
        <StatGroup
          title="在建"
          total={buildingTotal}
          project={buildingProjects}
          special={buildingSpecials}
          tone="primary"
        />
        <StatGroup
          title="投产"
          total={deliveredTotal}
          project={deliveredProjects}
          special={deliveredSpecials}
          tone="accent"
        />
      </div>
    </PanelCard>
  )
}

const legendDot = (color: string) => (
  <span className="inline-flex size-2 rounded-full" style={{ backgroundColor: color }} />
)

export function RdOverviewSummaryRow() {
  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)]">
      <BusinessLinePanel />
      <RdStatsPanel />
    </div>
  )
}

export function MonthlyTaskTrendPanel() {
  return (
    <PanelCard icon={TrendingUp} title="在建项目及专项任务 · 双月度趋势" accent="accent" bodyClassName="p-3">
      <div className="mb-2 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-2">{legendDot("var(--primary)")}公司在建项目及专项任务</span>
        <span className="flex items-center gap-2">{legendDot("var(--accent)")}公司当年已投产项目及专项任务</span>
      </div>
      <ResponsiveContainer width="100%" height={190}>
        <ComposedChart data={monthlyTaskTrend} margin={{ left: -12, right: 8, top: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="buildingArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.25} />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke={chartGridStroke} />
          <XAxis dataKey="month" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} width={32} />
          <Tooltip {...chartTooltip} />
          <Area type="monotone" dataKey="building" fill="url(#buildingArea)" stroke="none" />
          <Line type="monotone" dataKey="building" name="在建项目及专项任务" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 2.5, fill: "var(--primary)" }} activeDot={{ r: 4 }} />
          <Line type="monotone" dataKey="delivered" name="已投产项目及专项任务" stroke="var(--accent)" strokeWidth={2.5} dot={{ r: 2.5, fill: "var(--accent)" }} activeDot={{ r: 4 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </PanelCard>
  )
}

export function DurationTrendPanel() {
  return (
    <PanelCard icon={LineIcon} title="项目研发时长" accent="accent" bodyClassName="p-3">
      <div className="mb-2 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-2">{legendDot("var(--primary)")}顺序项目研发时长</span>
        <span className="flex items-center gap-2">{legendDot("var(--accent)")}累计平均研发时长</span>
      </div>
      <ResponsiveContainer width="100%" height={190}>
        <LineChart data={rdDurationTrend} margin={{ left: -12, right: 8, top: 8, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={chartGridStroke} />
          <XAxis dataKey="month" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} width={32} unit="天" />
          <Tooltip {...chartTooltip} />
          <Line type="monotone" dataKey="project" name="顺序项目研发时长" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 2, fill: "var(--primary)" }} />
          <Line type="monotone" dataKey="agile" name="累计平均研发时长" stroke="var(--accent)" strokeWidth={2} strokeDasharray="6 4" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </PanelCard>
  )
}
