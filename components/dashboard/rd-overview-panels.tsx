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
    <PanelCard icon={PieIcon} title="当年承建需求计划各业务条线分布" bodyClassName="p-2">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="mx-auto w-[160px] shrink-0 sm:mx-0">
          <ResponsiveContainer width="100%" height={180}>
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
              <Tooltip 
                {...chartTooltip} 
                contentStyle={{ ...chartTooltip.contentStyle, fontSize: '12px' }}
                formatter={(value: any, name: any, entry: any) => [`${value}%`, entry?.payload?.name ?? "占比"]} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid min-w-0 flex-1 grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
          {businessLineDistribution.map((item) => (
            <div key={item.name} className="flex min-w-0 items-center gap-2 rounded-md border border-border/30 bg-muted/20 px-2.5 py-1.5 transition-colors hover:border-primary/30">
              <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="min-w-0 truncate text-muted-foreground">{item.name}</span>
              <span className="ml-auto shrink-0 font-mono font-bold text-foreground">{item.value}%</span>
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
        "relative overflow-hidden rounded-xl border p-3 transition-all hover:shadow-lg",
        isAccent 
          ? "border-accent/25 bg-gradient-to-br from-accent/10 to-transparent hover:border-accent/40" 
          : "border-primary/25 bg-gradient-to-br from-primary/10 to-transparent hover:border-primary/40",
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className={cn("text-sm font-bold uppercase tracking-wider", isAccent ? "text-accent" : "text-primary")}>
          {title}
        </span>
        <div className={cn("rounded-full px-2.5 py-1 text-xs font-medium", isAccent ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary")}>
          {total.label}
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <p className={cn("font-mono text-4xl font-bold leading-none tabular-nums tracking-tight", isAccent ? "text-accent" : "text-primary")}>
          <LiveStatValue value={total.value} />
        </p>
        <span className="text-sm font-medium text-muted-foreground">{total.unit}</span>
      </div>
      
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-border/40 bg-background/30 p-3 transition-colors hover:bg-background/50">
          <p className="text-xs font-medium text-muted-foreground mb-1.5">{project.label}</p>
          <p className="font-mono text-xl font-bold tabular-nums text-foreground">
            <LiveStatValue value={project.value} />
          </p>
        </div>
        <div className="rounded-lg border border-border/40 bg-background/30 p-3 transition-colors hover:bg-background/50">
          <p className="text-xs font-medium text-muted-foreground mb-1.5">{special.label}</p>
          <p className="font-mono text-xl font-bold tabular-nums text-foreground">
            <LiveStatValue value={special.value} />
          </p>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className={cn(
        "absolute -right-6 -top-6 size-24 rounded-full blur-3xl opacity-20",
        isAccent ? "bg-accent" : "bg-primary"
      )} />
    </div>
  )
}

export function RdStatsPanel() {
  return (
    <PanelCard icon={BriefcaseBusiness} title="项目概况" bodyClassName="p-2">
      <div className="grid gap-3 sm:grid-cols-2">
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
    <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
      <BusinessLinePanel />
      <RdStatsPanel />
    </div>
  )
}

export function MonthlyTaskTrendPanel() {
  return (
    <PanelCard icon={TrendingUp} title="在建项目及专项任务数月度趋势" accent="accent" bodyClassName="p-2">
      <div className="mb-3 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-2">{legendDot("var(--primary)")}公司在建项目及专项任务</span>
        <span className="flex items-center gap-2">{legendDot("var(--accent)")}公司当年已投产项目及专项任务</span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart data={monthlyTaskTrend} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="buildingArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.25} />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke={chartGridStroke} />
          <XAxis dataKey="month" tick={{ fill: "var(--muted-foreground)", fontSize: 9 }} axisLine={{ stroke: "var(--border)", strokeWidth: 1 }} tickLine={{ stroke: "var(--border)", strokeWidth: 1 }} />
          <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 9 }} axisLine={{ stroke: "var(--border)", strokeWidth: 1 }} tickLine={{ stroke: "var(--border)", strokeWidth: 1 }} width={45} />
          <Tooltip {...chartTooltip} contentStyle={{ ...chartTooltip.contentStyle, fontSize: '12px' }} />
          <Area type="monotone" dataKey="building" fill="url(#buildingArea)" stroke="none" />
          <Line type="monotone" dataKey="building" name="在建项目及专项任务" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 3, fill: "var(--primary)" }} activeDot={{ r: 5 }} />
          <Line type="monotone" dataKey="delivered" name="已投产项目及专项任务" stroke="var(--accent)" strokeWidth={2.5} dot={{ r: 3, fill: "var(--accent)" }} activeDot={{ r: 5 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </PanelCard>
  )
}

export function DurationTrendPanel() {
  return (
    <PanelCard icon={LineIcon} title="项目研发时长" accent="accent" bodyClassName="p-2">
      <div className="mb-3 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-2">{legendDot("var(--primary)")}顺序项目研发时长均值</span>
        <span className="flex items-center gap-2">{legendDot("var(--accent)")}敏捷项目研发时长均值</span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={rdDurationTrend} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={chartGridStroke} />
          <XAxis dataKey="month" tick={{ fill: "var(--muted-foreground)", fontSize: 9 }} axisLine={{ stroke: "var(--border)", strokeWidth: 1 }} tickLine={{ stroke: "var(--border)", strokeWidth: 1 }} />
          <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 9 }} axisLine={{ stroke: "var(--border)", strokeWidth: 1 }} tickLine={{ stroke: "var(--border)", strokeWidth: 1 }} width={50} unit="天" />
          <Tooltip {...chartTooltip} contentStyle={{ ...chartTooltip.contentStyle, fontSize: '12px' }} />
          <Line type="monotone" dataKey="project" name="顺序项目研发时长均值" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 3, fill: "var(--primary)" }} />
          <Line type="monotone" dataKey="agile" name="敏捷项目研发时长均值" stroke="var(--accent)" strokeWidth={2} strokeDasharray="6 4" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </PanelCard>
  )
}
