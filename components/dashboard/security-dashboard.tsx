"use client"

import type { ReactNode } from "react"
import { useState } from "react"
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

const chartGrid = "rgba(120, 170, 195, 0.24)"
const chartText = "#7f9db2"

function Panel({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-[0_8px_24px_rgba(0,40,70,0.18)]">
      <header className="flex items-center gap-3 border-b border-border/60 bg-card/80 px-4 py-3">
        <span className="flex gap-1">
          <i className="h-5 w-1 -skew-x-12 rounded-full bg-primary/70" />
          <i className="h-5 w-1 -skew-x-12 rounded-full bg-primary" />
          <i className="h-5 w-1 -skew-x-12 rounded-full bg-accent" />
        </span>
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
      </header>
      <div className="p-4">{children}</div>
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
    <div className="rounded-lg border border-border/60 bg-background/35 px-4 py-3">
      <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="size-4" style={{ color }} />
        <span>{label}</span>
      </div>

      <div className="flex items-baseline gap-1.5">
        <strong
          className="font-mono text-2xl font-semibold tracking-tight"
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
}: {
  data: { name?: string; month?: string; value: number }[]
  color: string
  label: string
}) {
  const dataKey = data[0]?.month ? "month" : "name"
  const categoryChart = dataKey === "name"

  return (
    <div>
      <div className="mb-2 text-xs text-muted-foreground">{label}</div>

      <div className="h-[175px]">
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
                background: "#102638",
                border: "1px solid #2b617c",
                borderRadius: 8,
                color: "#e8f4fa",
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

function ChinaSecurityMap() {
  const [selectedProvince, setSelectedProvince] = useState("")

  return (
    <div className="relative h-[300px] overflow-hidden rounded-lg border border-border/60 bg-background/45">
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
                  fill={selected ? "#20d5d8" : "#2477bd"}
                  fillOpacity={selected ? 1 : 0.72}
                  stroke="#071e35"
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

      <div className="pointer-events-none absolute right-3 top-3 rounded-md border border-border/60 bg-card/95 px-3 py-2 text-xs">
        {selectedProvince ? (
          <span className="text-accent">{selectedProvince}</span>
        ) : (
          <span className="text-muted-foreground">点击区域查看详情</span>
        )}
      </div>

      <div className="absolute bottom-3 left-3 rounded-md border border-border/60 bg-card/95 px-3 py-2 text-[11px] text-muted-foreground">
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
    <div className="rounded-lg border border-border/60 bg-background/35 px-3 py-3">
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
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-[1800px] px-4 pb-8 md:px-6">
        <section className="relative mb-4 overflow-hidden rounded-xl border border-border/60 bg-card px-6 py-7 text-center">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.14),transparent_62%)]" />

          <div className="relative">
            <div className="mb-2 flex items-center justify-center gap-2 text-sm text-accent">
              <span className="size-2 animate-pulse rounded-full bg-accent" />
              实时数据同步中 · 20:19:29
            </div>

            <h1 className="text-2xl font-semibold tracking-[0.08em] text-foreground md:text-3xl">
              网络安全驾驶舱
            </h1>

            <p className="mt-2 text-sm tracking-[0.16em] text-muted-foreground">
              安全防护 · 风险监测 · 合规管理 · 应急响应
            </p>
          </div>
        </section>

        <section className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-border/60 bg-card p-3">
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

        <section className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
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

        <div className="grid items-start gap-4 xl:grid-cols-[1fr_1.08fr_1fr]">
          <div className="min-w-0 space-y-4">
            <Panel title="网络安全综合能力">
              <ChartBox
                data={capabilityData}
                color="#25a8d2"
                label="各分行综合能力评分"
              />
            </Panel>

            <Panel title="检查发现问题">
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
            </Panel>

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

            <Panel title="检查问题分类">
              <ChartBox
                data={inspectionCategoryData}
                color="#7b91ed"
                label="问题分类统计"
              />
            </Panel>
          </div>

          <div className="min-w-0 space-y-4">
            <Panel title="网络安全综合能力视图">
              <ChinaSecurityMap />
            </Panel>

            <Panel title="网络安全管理指标">
              <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
                {securityManagementIndicators.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>

          <div className="min-w-0 space-y-4">
            <Panel title="网络安全考评">
              <ChartBox
                data={securityAssessmentData}
                color="#25c5c9"
                label="各分行考评结果"
              />
            </Panel>

            <Panel title="员工安全画像">
              <div className="grid grid-cols-2 gap-3">
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
            </Panel>

            <div className="grid grid-cols-2 gap-3">
              <Panel title="培训趋势">
                <ChartBox
                  data={trainingTrendData}
                  color="#25a8d2"
                  label="月度培训"
                />
              </Panel>

              <Panel title="违规趋势">
                <ChartBox
                  data={violationTrendData}
                  color="#d9953f"
                  label="月度违规"
                />
              </Panel>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}