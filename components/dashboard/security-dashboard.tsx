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

const chinaMapUrl = "/maps/china.json"

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

function CompactDetailTable({ rows, headers }: { rows: string[][]; headers: string[] }) {
  return <div className="max-h-44 overflow-auto rounded-md border border-border/60 bg-secondary/15"><table className="w-full table-fixed text-left text-[10px]"><thead className="sticky top-0 bg-card text-primary"><tr>{headers.map((header) => <th key={header} className="border-b border-border/60 px-2 py-1.5 font-semibold">{header}</th>)}</tr></thead><tbody className="divide-y divide-border/40">{rows.map((row, index) => <tr key={index} className={index % 2 ? "bg-card/50" : ""}>{row.map((cell, cellIndex) => <td key={cellIndex} className="truncate px-2 py-1.5 text-foreground/80">{cell}</td>)}</tr>)}</tbody></table></div>
}

function CapabilityBars({ data, label }: { data: { name: string; value: number }[]; label: string }) {
  const [details, setDetails] = useState(false)
  const metrics = data.slice(0, 6).map((item, index) => ({
    ...item,
    responsibility: Math.max(70, item.value - index * 1.2),
    notification: Math.max(66, item.value - 4 - index * 0.8),
    privacy: Math.max(62, item.value - 7 - index * 1.1),
    risk: Math.max(60, item.value - 10 - index * 1.3),
  }))
  return <div className="rounded-lg border border-border/50 bg-background/20 p-3"><button type="button" onClick={() => setDetails(!details)} className="mb-2 flex w-full items-center justify-between text-left text-xs text-muted-foreground hover:text-primary"><span>{label}</span><span>{details ? "返回图表" : "点击查看详情"}</span></button>{details ? <CompactDetailTable headers={["分行", "全年合计", "责任落实", "通知部署", "隐患整改"]} rows={metrics.map((item) => [item.name, item.value.toFixed(1), item.responsibility.toFixed(1), item.notification.toFixed(1), item.risk.toFixed(1)])} /> : <><div className="mb-2 flex items-center justify-between text-[10px] text-muted-foreground"><span>各分行综合能力评分</span><span>单位：分</span></div><div className="mb-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-muted-foreground"><span><i className="mr-1 inline-block size-2 rounded-sm bg-[#4ba8d8]" />全年合计</span><span><i className="mr-1 inline-block size-2 rounded-sm bg-[#42bdb7]" />责任落实</span><span><i className="mr-1 inline-block size-2 rounded-sm bg-[#e5b45c]" />通知部署</span><span><i className="mr-1 inline-block size-2 rounded-sm bg-[#8494d8]" />隐患整改</span></div><ResponsiveContainer width="100%" height={230}><BarChart data={metrics} margin={{ top: 8, right: 4, left: -18, bottom: 8 }}><CartesianGrid vertical={false} strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 9 }} tickFormatter={(value) => value.replace("分行", "")} interval={0} /><YAxis domain={[0, 100]} tick={{ fontSize: 9 }} /><Tooltip formatter={(value, name) => [Number(value).toFixed(1), name]} /><Bar dataKey="value" name="全年合计得分" fill="#4ba8d8" radius={[3, 3, 0, 0]} /><Bar dataKey="responsibility" name="压紧压实网络安全责任" fill="#42bdb7" radius={[3, 3, 0, 0]} /><Bar dataKey="notification" name="重要通知和工作部署落实情况及个人信息保护" fill="#e5b45c" radius={[3, 3, 0, 0]} /><Bar dataKey="risk" name="及时发现及整改网络安全风险隐患" fill="#8494d8" radius={[3, 3, 0, 0]} /></BarChart></ResponsiveContainer></>}</div>
}

function CategoryBars({ data, label, color = "#42bdb7" }: { data: { name: string; value: number }[]; label: string; color?: string }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const [details, setDetails] = useState(false)
  return <div className="rounded-lg border border-border/50 bg-background/20 p-3"><button type="button" onClick={() => setDetails(!details)} className="mb-3 flex w-full items-center justify-between text-left text-xs text-muted-foreground hover:text-primary"><span>{label}</span><span>{details ? "返回概览" : `共 ${total} 项 · 点击查看详情`}</span></button>{details ? <CompactDetailTable headers={["问题分类", "数量", "占比"]} rows={data.map((item) => [item.name, String(item.value), `${Math.round((item.value / Math.max(total, 1)) * 100)}%`])} /> : <div className="grid grid-cols-2 gap-2">{data.map((item, index) => <div key={item.name} className="rounded-md border border-border/40 bg-card/50 p-2.5"><div className="flex items-center justify-between gap-2"><span className="truncate text-[11px] text-foreground/80">{item.name}</span><span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: index % 2 ? color : "#4ba8d8" }} /></div><div className="mt-1 font-mono text-xl font-bold text-foreground">{item.value}</div><div className="mt-1 text-[10px] text-muted-foreground">占比 {Math.round((item.value / Math.max(total, 1)) * 100)}%</div></div>)}</div>}</div>
}

function AssessmentBars({ data }: { data: { name: string; value: number }[] }) {
  const sorted = [...data].sort((a, b) => b.value - a.value).slice(0, 8).map((item) => ({ ...item, shortName: item.name.replace("分行", "") }))
  const [details, setDetails] = useState(false)
  return <div className="rounded-lg border border-border/50 bg-background/20 p-3"><button type="button" onClick={() => setDetails(!details)} className="mb-2 flex w-full items-center justify-between text-left text-xs text-muted-foreground hover:text-primary"><span>网络安全考评</span><span>{details ? "返回图表" : "横轴：得分 · 点击查看详情"}</span></button>{details ? <CompactDetailTable headers={["排名", "分行", "考评得分"]} rows={sorted.map((item, index) => [String(index + 1), item.name, item.value.toFixed(2)])} /> : <ResponsiveContainer width="100%" height={180}><BarChart data={sorted} layout="vertical" margin={{ top: 4, right: 24, left: 0, bottom: 4 }}><CartesianGrid horizontal={false} strokeDasharray="3 3" /><XAxis type="number" domain={[0, 100]} tick={{ fontSize: 9 }} /><YAxis dataKey="shortName" type="category" width={48} tick={{ fontSize: 9 }} /><Tooltip formatter={(value) => [`${Number(value).toFixed(2)} 分`, "考评得分"]} /><Bar dataKey="value" name="考评得分" fill="#e5b45c" radius={[0, 4, 4, 0]} label={{ position: "right", fontSize: 9, fill: "currentColor" }} /></BarChart></ResponsiveContainer>}</div>
}

function ChinaSecurityMap() {
  const [selectedProvince, setSelectedProvince] = useState("")

  return (
    <div className="relative h-[300px] overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br from-background/45 via-background/20 to-card/90">
      <ComposableMap
        width={800}
        height={390}
        projection="geoMercator"
        projectionConfig={{
          center: [105, 35],
          scale: 530,
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
                  fill={selected ? "#13a8a8" : "#4d8fca"}
                  fillOpacity={selected ? 1 : 0.62}
                  stroke="#ffffff"
                  strokeWidth={0.7}
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

      <div className="pointer-events-none absolute right-3 top-3 rounded-md border border-border/60 bg-card/95 px-3 py-2 text-xs shadow-sm">
        {selectedProvince ? (
          <span className="text-accent">{selectedProvince}</span>
        ) : (
          <span className="text-muted-foreground">点击区域查看详情</span>
        )}
      </div>

      <div className="absolute bottom-3 left-3 rounded-md border border-border/60 bg-card/95 px-3 py-2 text-[11px] text-muted-foreground shadow-sm">
        <div className="mb-1 text-foreground">安全能力得分</div>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-20 rounded-full bg-gradient-to-r from-primary to-accent" />
          <span>60.29</span>
          <span>96.26</span>
        </div>
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
        </div>
      </div>
    </main>
  )
}
