"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import { HeroBanner } from "@/components/dashboard/hero-banner"
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps"

import {
  branchSecurityData,
  capabilityData,
  inspectionCategoryData,
  outstandingBranches,
  securityAssessmentData,
  securityManagementIndicators,
  securityOverview,
  trainingTrendData,
  violationTrendData,
  weakBranches,
} from "@/lib/security-data"

// 省级 GeoJSON：包含 34 个省级行政区，确保每个省份都有独立边界和点击区域。托管在本地以避免外部请求被拦截。
const chinaMapUrl = "/maps/china-provinces.json"

const chartGrid = "rgba(79, 112, 145, 0.18)"
const chartText = "#60758b"

function Panel({
  title,
  tone = "primary",
  bodyClassName,
  compact = false,
  className,
  children,
}: {
  title: string
  tone?: "primary" | "accent" | "chart-4"
  bodyClassName?: string
  compact?: boolean
  className?: string
  children: ReactNode
}) {
  const toneStyles = {
    primary: {
      header: "from-primary/12 via-card to-card",
      accent: "bg-primary/80",
      chip: "bg-primary/12 text-primary",
    },
    accent: {
      header: "from-accent/12 via-card to-card",
      accent: "bg-accent/80",
      chip: "bg-accent/12 text-accent",
    },
    "chart-4": {
      header: "from-chart-4/12 via-card to-card",
      accent: "bg-chart-4/80",
      chip: "bg-chart-4/12 text-chart-4",
    },
  }

  return (
    <section className={["overflow-hidden rounded-xl border border-border/70 bg-card/90 shadow-[0_8px_28px_oklch(0.35_0.06_240/8%)] backdrop-blur-sm", className].filter(Boolean).join(" ")}>
      <header
        className={[
          "relative flex items-center gap-3 border-b border-border/60",
          compact ? "px-3 py-2" : "px-4 py-3",
          "bg-gradient-to-r",
          toneStyles[tone].header,
        ].join(" ")}
      >
        <span className="flex items-center gap-1 opacity-75" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <i
              key={i}
              className={[
                "h-4 w-1 skew-x-[-18deg] rounded-sm",
                toneStyles[tone].accent,
              ].join(" ")}
            />
          ))}
        </span>
        <h2 className={compact ? "text-sm font-semibold tracking-wide text-foreground" : "text-base font-semibold tracking-wide text-foreground"}>
          {title}
        </h2>

        <span
          className={[
            compact
              ? "ml-auto rounded-full px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.18em]"
              : "ml-auto rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em]",
            toneStyles[tone].chip,
          ].join(" ")}
        >
          live
        </span>
      </header>
      <div className={bodyClassName ?? (compact ? "p-2.5" : "p-4")}>{children}</div>
    </section>
  )
}

function StatCard({
  label,
  value,
  unit,
  icon: Icon,
  color = "var(--primary)",
}: {
  label: string
  value: string | number
  unit: string
  icon: typeof ShieldCheck
  color?: string
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-gradient-to-br from-background/60 via-card/80 to-background/45 px-4 py-3 shadow-[0_8px_20px_rgba(16,30,46,0.16)]">
      <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="size-4" style={{ color }} />
        <span>{label}</span>
      </div>

      <div className="flex items-baseline gap-1.5">
        <strong
          className="font-mono text-2xl font-semibold tracking-tight tabular-nums"
          style={{ color }}
        >
          {value}
        </strong>
        <span className="text-xs text-muted-foreground">{unit}</span>
      </div>
    </div>
  )
}

function ChartBox({
  data,
  color,
  label,
  height = 175,
}: {
  data: { name?: string; month?: string; value: number }[]
  color: string
  label: string
  height?: number
}) {
  const dataKey = data[0]?.month ? "month" : "name"
  const categoryChart = dataKey === "name"

  return (
    <div className="rounded-lg border border-border/50 bg-background/20 p-3">
      <div className="mb-2 text-xs text-muted-foreground">{label}</div>

      <div style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 8,
              right: 8,
              left: -22,
              bottom: categoryChart ? 35 : 4,
            }}
          >
            <defs>
              <linearGradient id={`area-${label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.28} />
                <stop offset="100%" stopColor={color} stopOpacity={0.04} />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              stroke={chartGrid}
              strokeDasharray="3 4"
            />

            <XAxis
              dataKey={dataKey}
              axisLine={{ stroke: chartGrid }}
              tickLine={false}
              angle={categoryChart ? -32 : 0}
              textAnchor={categoryChart ? "end" : "middle"}
              interval={categoryChart ? 0 : "preserveStartEnd"}
              tick={{ fill: chartText, fontSize: 10 }}
            />

            <YAxis
              axisLine={{ stroke: chartGrid }}
              tickLine={false}
              tick={{ fill: chartText, fontSize: 10 }}
            />

            <Tooltip
              cursor={{ stroke: color, strokeOpacity: 0.3 }}
              contentStyle={{
                background: "#ffffff",
                border: "1px solid #d8e3ee",
                borderRadius: 8,
                color: "#24364b",
                fontSize: 12,
              }}
              labelStyle={{ color: "#b4d1dd" }}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill={`url(#area-${label})`}
              dot={false}
              activeDot={{
                r: 4,
                fill: color,
                stroke: "#e8f4fa",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function RankedBars({
  data,
  label,
  color = "#4ba8d8",
  height = 190,
}: {
  data: { name: string; value: number }[]
  label: string
  color?: string
  height?: number
}) {
  const max = Math.max(...data.map((item) => item.value), 1)

  return (
    <div className="rounded-lg border border-border/50 bg-background/20 p-3">
      <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span>单位：分</span>
      </div>
      <div className="flex flex-col gap-2.5" style={{ minHeight: height }}>
        {data.slice(0, 8).map((item, index) => (
          <div key={item.name} className="grid grid-cols-[20px_72px_1fr_42px] items-center gap-2 text-[11px]">
            <span className="font-mono text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
            <span className="truncate text-foreground/80">{item.name.replace("分行", "")}</span>
            <div className="h-2 overflow-hidden rounded-full bg-primary/10"><div className="h-full rounded-full" style={{ width: `${(item.value / max) * 100}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }} /></div>
            <strong className="text-right font-mono tabular-nums text-foreground">{item.value}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}

function CompactDetailTable({ rows, headers, className = "" }: { rows: string[][]; headers: string[]; className?: string }) {
  return <div className={`max-h-24 overflow-auto rounded-lg border border-border/50 bg-card/70 text-[8px] shadow-sm ${className}`}><table className="w-full table-fixed text-left"><thead className="sticky top-0 z-10"><tr>{headers.map((header, index) => <th key={header} className={`border-b border-primary/20 px-2 py-1.5 font-semibold ${index === 0 ? "w-[78%] bg-primary/10 text-foreground" : "w-[22%] bg-primary text-primary-foreground text-center"}`}>{header}</th>)}</tr></thead><tbody className="divide-y divide-border/30">{rows.map((row, index) => <tr key={index} className={index % 2 ? "bg-muted/20" : "bg-card/40"}>{row.map((cell, cellIndex) => <td key={cellIndex} className={`${cellIndex === 0 ? "whitespace-normal text-foreground" : "text-center font-mono font-semibold text-primary"} px-2 py-2 leading-4`}>{cell}</td>)}</tr>)}</tbody></table></div>
}

function CapabilityBars({ data, label }: { data: { name: string; value: number }[]; label: string }) {
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null)
  const metrics = data.map((item, index) => ({
    ...item,
    responsibility: Math.max(70, item.value - index * 1.2),
    notification: Math.max(66, item.value - 4 - index * 0.8),
    privacy: Math.max(62, item.value - 7 - index * 1.1),
    risk: Math.max(60, item.value - 10 - index * 1.3),
    research: Math.max(58, item.value - 12 - index * 1.5),
    integrated: Math.max(60, item.value - 8 - index * 1.1),
    highlights: Math.max(55, item.value - 14 - index * 1.4),
    deductions: Math.min(8, 1 + index * 0.6),
  }))
  return <div className="rounded-lg border border-border/50 bg-background/20 p-3"><div className="mb-2 flex items-center justify-between text-xs text-muted-foreground"><span>{label}</span><span>{selectedBranch ? "点击分行查看详情" : "点击分行"}</span></div>{selectedBranch ? <div><div className="mb-2 flex items-center justify-between rounded-lg border border-primary/15 bg-primary/5 px-3 py-2"><span className="text-xs font-semibold text-foreground">{selectedBranch} · 指标详情</span><button type="button" onClick={() => setSelectedBranch(null)} className="rounded-md border border-primary/20 bg-card px-2 py-1 text-[10px] font-medium text-primary transition-colors hover:bg-primary/10">返回总览</button></div><CompactDetailTable className="max-h-72 rounded-xl bg-card/90 text-[11px] shadow-md" headers={["指标", "得分"]} rows={(() => { const item = metrics.find((entry) => entry.name === selectedBranch); return item ? [["全年合计得分", item.value.toFixed(1)], ["压紧压实网络安全责任", item.responsibility.toFixed(1)], ["网络安全重要通知和工作部署落实情况及个人信息保护", item.notification.toFixed(1)], ["及时发现及整改网络安全隐患", item.risk.toFixed(1)], ["研发安全", item.research.toFixed(1)], ["总分行一体化安全运行落实情况", item.integrated.toFixed(1)], ["分行网络安全工作亮点及集团贡献情况", item.highlights.toFixed(1)], ["其他扣分项", item.deductions.toFixed(1)] ] : []})()} /></div> : <div className="max-h-64 space-y-2 overflow-y-auto pr-1">{metrics.map((item) => <button key={item.name} type="button" onClick={() => setSelectedBranch(item.name)} className="grid w-full grid-cols-[72px_1fr_42px] items-center gap-2 text-left text-[10px] hover:bg-primary/5"><span className="truncate text-muted-foreground">{item.name.replace("分行", "")}</span><span className="h-3 overflow-hidden rounded-full bg-primary/10"><span className="block h-full rounded-full bg-gradient-to-r from-[#4ba8d8] to-[#42bdb7]" style={{ width: `${item.value}%` }} /></span><strong className="text-right font-mono font-normal text-foreground">{item.value.toFixed(1)}</strong></button>)}</div>} </div>
/* legacy chart body removed */
/*<span><i className="mr-1 inline-block size-2 rounded-sm bg-[#42bdb7]" />责任落实</span><span><i className="mr-1 inline-block size-2 rounded-sm bg-[#e5b45c]" />通知部署</span><span><i className="mr-1 inline-block size-2 rounded-sm bg-[#8494d8]" />隐患整改</span></div><ResponsiveContainer width="100%" height={230}><BarChart data={metrics} margin={{ top: 8, right: 4, left: -18, bottom: 8 }}><CartesianGrid vertical={false} strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 9 }} tickFormatter={(value) => value.replace("分行", "")} interval={0} /><YAxis domain={[0, 100]} tick={{ fontSize: 9 }} /><Tooltip content={({ active, payload, label }) => active && payload?.length ? <div className="rounded-lg border border-border/50 bg-card/95 px-2 py-1.5 text-[9px] shadow-md"><div className="mb-1 font-medium text-foreground">{label}</div>{payload.map((entry) => <div key={String(entry.dataKey)} className="flex items-center justify-between gap-3 leading-4"><span className="max-w-44 truncate text-muted-foreground">{entry.name}</span><strong className="font-mono text-foreground">{Number(entry.value).toFixed(1)}</strong></div>)}</div> : null} /><Bar dataKey="value" name="全年合计得分" fill="#4ba8d8" radius={[3, 3, 0, 0]} /><Bar dataKey="responsibility" name="压紧压实网络安全责任" fill="#42bdb7" radius={[3, 3, 0, 0]} /><Bar dataKey="notification" name="重要通知和工作部署落实情况及个人信息保护" fill="#e5b45c" radius={[3, 3, 0, 0]} /><Bar dataKey="risk" name="及时发现及整改网络安全风险隐患" fill="#8494d8" radius={[3, 3, 0, 0]} /></BarChart></ResponsiveContainer></>}</div>
*/
}

function CategoryBars({ data, label, color = "#42bdb7" }: { data: { name: string; value: number }[]; label: string; color?: string }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const [details, setDetails] = useState(false)
  return <div className="rounded-lg border border-border/50 bg-background/20 p-3"><button type="button" onClick={() => setDetails(!details)} className="mb-3 flex w-full items-center justify-between text-left text-xs text-muted-foreground hover:text-primary"><span>{label}</span><span>{details ? "返回概览" : `共 ${total} 项 · 点击查看详情`}</span></button>{details ? <CompactDetailTable headers={["问题分类", "数量"]} rows={data.map((item) => [item.name, String(item.value)])} /> : <div className="grid grid-cols-2 gap-2">{data.map((item, index) => <div key={item.name} className="rounded-md border border-border/40 bg-card/50 p-2.5"><div className="flex items-center justify-between gap-2"><span className="truncate text-[11px] text-foreground/80">{item.name}</span><span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: index % 2 ? color : "#4ba8d8" }} /></div><div className="mt-1 font-mono text-xl font-bold text-foreground">{item.value}</div></div>)}</div>}</div>
}

function AssessmentBars({ data }: { data: { name: string; value: number }[] }) {
  const sorted = [...data].sort((a, b) => b.value - a.value).slice(0, 12).map((item) => ({ ...item, shortName: item.name.replace("分行", "") }))
  const [details, setDetails] = useState(false)
  return <div className="h-[300px] rounded-xl border border-border/50 bg-background/20 p-3"><button type="button" onClick={() => setDetails(!details)} className="mb-3 flex w-full items-center justify-between rounded-lg border border-primary/15 bg-primary/5 px-3 py-2 text-left text-xs text-muted-foreground hover:text-primary"><span className="font-semibold text-foreground">网络安全考评</span><span>{details ? "返回总览" : "点击查看详情"}</span></button>{details ? <div className="h-52 overflow-y-auto rounded-xl border border-border/50 bg-card/90 shadow-md"><table className="w-full text-left text-[11px]"><thead className="sticky top-0 z-10 bg-primary text-primary-foreground"><tr><th className="w-16 px-3 py-2 font-semibold">排名</th><th className="px-3 py-2 font-semibold">分行</th><th className="w-24 px-3 py-2 text-right font-semibold">考评得分</th></tr></thead><tbody className="divide-y divide-border/30">{sorted.map((item, index) => <tr key={item.name} className={index % 2 ? "bg-muted/20" : "bg-card/40"}><td className="px-3 py-2 font-mono text-muted-foreground">{String(index + 1).padStart(2, "0")}</td><td className="px-3 py-2 text-foreground">{item.name}</td><td className="px-3 py-2 text-right font-mono font-semibold text-primary">{item.value.toFixed(2)}</td></tr>)}</tbody></table></div> : <div className="h-52 space-y-2 overflow-y-auto pr-1">{sorted.map((item, index) => <div key={item.name} className="grid grid-cols-[20px_58px_1fr_48px] items-center gap-2 text-[11px]"><span className="font-mono text-muted-foreground">{String(index + 1).padStart(2, "0")}</span><span className="truncate text-foreground/80">{item.shortName}</span><div className="h-3 overflow-hidden rounded-full bg-accent/10"><div className="h-full rounded-full bg-[#e5b45c]" style={{ width: `${item.value}%` }} /></div><strong className="text-right font-mono tabular-nums text-foreground">{item.value.toFixed(2)}</strong></div>)}</div>}</div>
}

function ChinaSecurityMap() {
  const [selectedProvince, setSelectedProvince] = useState("")
  const normalizeRegion = (name: string) => name.replace(/(省|市|自治区|特别行政区)$/u, "").replace(/(壮族|回族|维吾尔)$/u, "")
  const selectedItem = branchSecurityData.find((item) => normalizeRegion(selectedProvince).includes(normalizeRegion(item.name)) || normalizeRegion(item.name).includes(normalizeRegion(selectedProvince)))
  const scores = branchSecurityData.map((item) => item.value)
  const minScore = Math.min(...scores)
  const maxScore = Math.max(...scores)
  const scoreColor = (score: number) => {
    const ratio = (score - minScore) / Math.max(maxScore - minScore, 1)
    const light = Math.round(77 - ratio * 45)
    return `hsl(204 58% ${light}%)`
  }

  return (
    <div className="relative h-[540px] overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br from-background/45 via-background/20 to-card/90">
      <ComposableMap
        width={800}
        height={740}
        projection="geoMercator"
        projectionConfig={{
          center: [104.3, 35.9],
          scale: 750,
        }}
        className="h-full w-full"
      >
        <Geographies geography={chinaMapUrl}>
          {({ geographies }) =>
            geographies.map((geo, index) => {
              const province =
                geo.properties?.name ||
                geo.properties?.NAME ||
                geo.properties?.省份 ||
                `区域${index + 1}`

              const selected = selectedProvince === province

              return (
                <Geography
                  key={`${geo.rsmKey}-${index}`}
                  geography={geo}
                  onClick={() => setSelectedProvince(province)}
                  fill={selected ? "#13a8a8" : scoreColor(branchSecurityData.find((item) => normalizeRegion(province).includes(normalizeRegion(item.name)) || normalizeRegion(item.name).includes(normalizeRegion(province)))?.value ?? minScore)}
                  fillOpacity={selected ? 1 : 0.9}
                  stroke="#ffffff"
                  strokeWidth={0.8}
                  style={{
                    default: {
                      outline: "none",
                      cursor: "pointer",
                    },
                    hover: {
                      fill: "#20d5d8",
                      fillOpacity: 1,
                      outline: "none",
                      cursor: "pointer",
                    },
                    pressed: {
                      fill: "#20d5d8",
                      outline: "none",
                    },
                  }}
                />
              )
            })
          }
        </Geographies>
      </ComposableMap>

      <div className="pointer-events-none absolute bottom-0 right-2 min-w-56 rounded-lg border border-primary/20 bg-card/95 px-2.5 py-2 text-[11px] shadow-md">
        {selectedProvince && selectedItem ? (() => { const rank = [...branchSecurityData].sort((a, b) => b.value - a.value).findIndex((item) => item.name === selectedItem.name) + 1; const category = selectedItem.value >= 90 ? "一等行" : selectedItem.value >= 82 ? "二等行" : "三等行"; const categoryRank = [...branchSecurityData].filter((item) => category === "一等行" ? item.value >= 90 : category === "二等行" ? item.value >= 82 && item.value < 90 : item.value < 82).sort((a, b) => b.value - a.value).findIndex((item) => item.name === selectedItem.name) + 1; return <div className="grid gap-1.5"><div className="mb-1 border-b border-border/60 pb-1.5 text-xs font-semibold text-foreground">{selectedProvince}</div><div className="grid grid-cols-[1fr_auto] gap-x-5 gap-y-1 text-muted-foreground"><span>网络安全全年合计得分</span><strong className="font-mono text-[11px] font-semibold text-primary">{selectedItem.value.toFixed(2)}</strong><span>2025年排名（按全行）</span><strong className="font-mono text-foreground">{rank}</strong><span>类别</span><strong className="text-foreground">{category}</strong><span>2025年排名（按等级行）</span><strong className="font-mono text-foreground">{categoryRank}</strong></div></div> })() : <span className="text-muted-foreground">点击省份查看安全能力得分</span>}
      </div>

    </div>
  )
}

function BranchList({
  title,
  data,
  color,
}: {
  title: string
  data: string[]
  color: string
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-gradient-to-br from-background/35 via-card/80 to-background/45 px-3 py-3 shadow-[0_8px_18px_rgba(16,30,46,0.12)]">
      <div className="mb-2 text-xs text-muted-foreground">{title}</div>
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {data.map((name) => (
          <span key={name} className="text-sm" style={{ color }}>
            {name}
          </span>
        ))}
      </div>
    </div>
  )
}

export function SecurityDashboard() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <div className="relative mx-auto max-w-[1800px] px-4 pb-8 md:px-6">
        <HeroBanner
          title="网络安全驾驶舱"
          subtitle="安全防护 · 风险监测 · 合规管理 · 应急响应"
        />

        <section className="mb-6 flex flex-wrap items-center gap-2 rounded-xl border border-border/60 bg-card/80 p-3 shadow-[0_12px_28px_rgba(9,19,32,0.15)] backdrop-blur-sm">
          <label className="flex min-w-44 flex-1 items-center gap-3 rounded-md border border-border/60 bg-background/35 px-3 py-2 text-sm">
            <span className="text-muted-foreground">考评年度</span>
            <select className="w-full bg-transparent text-foreground outline-none">
              <option>2025</option>
              <option>2024</option>
            </select>
          </label>

          <label className="flex min-w-52 flex-1 items-center gap-3 rounded-md border border-border/60 bg-background/35 px-3 py-2 text-sm">
            <span className="text-muted-foreground">机构类别</span>
            <select className="w-full bg-transparent text-foreground outline-none">
              <option>全部机构</option>
              <option>分行</option>
            </select>
          </label>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm text-primary-foreground transition hover:bg-primary/90"
          >
            <Search className="size-4" />
            查询
          </button>
        </section>

        <section className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="综合安全能力得分"
            value={securityOverview.totalScore}
            unit="分"
            icon={ShieldCheck}
            color="var(--primary)"
          />

          <StatCard
            label="网络安全检查问题"
            value={securityOverview.inspectionIssues}
            unit="项"
            icon={AlertTriangle}
            color="#e9ad43"
          />

          <StatCard
            label="检查问题整改率"
            value={securityOverview.repairRate}
            unit="%"
            icon={CheckCircle2}
            color="var(--accent)"
          />

          <StatCard
            label="全行安全排名"
            value={securityOverview.ranking}
            unit="名"
            icon={BarChart3}
            color="#8b9cff"
          />
        </section>

        <div className="grid items-stretch gap-5 xl:grid-cols-3 xl:auto-rows-fr">
          <section className="flex h-full min-h-0 min-w-0 flex-col gap-4">
              <Panel title="网络安全综合能力" tone="primary">
                <CapabilityBars data={capabilityData} label="各分行综合能力评分" />
              </Panel>

              <Panel title="员工安全画像" tone="primary" bodyClassName="p-3">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2.5">
                    <StatCard
                      label="安全培训人次"
                      value={securityOverview.trainingPeople}
                      unit="人次"
                      icon={Users}
                      color="var(--primary)"
                    />
                    <StatCard
                      label="违规记分人次"
                      value={securityOverview.violationPeople}
                      unit="人次"
                      icon={AlertTriangle}
                      color="#e9ad43"
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <ChartBox
                      data={trainingTrendData}
                      color="#25a8d2"
                      label="培训趋势"
                      height={125}
                    />
                    <ChartBox
                      data={violationTrendData}
                      color="#d9953f"
                      label="违规趋势"
                      height={125}
                    />
                  </div>
                </div>
              </Panel>
          </section>

          <section className="flex h-full min-h-0 min-w-0 flex-col gap-4">
              <Panel title="网络安全综合能力视图" tone="accent">
                <ChinaSecurityMap />
              </Panel>

              <Panel title="网络安全管理指标" tone="primary" className="flex flex-1 flex-col">
                <div className="flex-1">
                <ul className="space-y-2.5 text-sm leading-6 text-muted-foreground">
                  {securityManagementIndicators.map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                </div>
              </Panel>
          </section>

          <section className="flex h-full min-h-0 min-w-0 flex-col gap-4">
              <Panel title="网络安全考评" tone="chart-4" compact bodyClassName="p-2.5">
                <AssessmentBars data={securityAssessmentData} />
              </Panel>

              <Panel title="检查发现问题" tone="accent" bodyClassName="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <StatCard
                    label="发现问题"
                    value={securityOverview.inspectionIssues}
                    unit="项"
                    icon={AlertTriangle}
                    color="#e9ad43"
                  />
                  <StatCard
                    label="问题整改率"
                    value={securityOverview.repairRate}
                    unit="%"
                    icon={CheckCircle2}
                    color="var(--accent)"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <BranchList
                    title="表现突出的三家分行"
                    data={outstandingBranches}
                    color="var(--accent)"
                  />
                  <BranchList
                    title="表现较差的三家分行"
                    data={weakBranches}
                    color="#e9ad43"
                  />
                </div>

                <CategoryBars data={inspectionCategoryData} color="#42bdb7" label="检查问题分类" />
              </Panel>
          </section>
        </div>
      </div>
    </main>
  )
}
