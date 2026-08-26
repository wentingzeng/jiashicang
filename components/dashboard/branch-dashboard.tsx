"use client"

import { useEffect, useState, type ReactNode } from "react"
import { ArrowUpRight, ChevronDown, Cloud, Gauge, ShieldCheck, UsersRound } from "lucide-react"
import { Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TopNav } from "@/components/dashboard/top-nav"
import { HeroBanner } from "@/components/dashboard/hero-banner"
import { useLiveClock } from "@/lib/use-live-value"
import { cn } from "@/lib/utils"

type MetricTone = "primary" | "accent" | "chart-4"

type MetricItem = {
  label: string
  value: number
  unit: string
  tone: MetricTone
}

type RowItem = {
  name: string
  development: number
  operations: number
  architecture: number
  innovation: number
  data: number
  security: number
  management: number
  total: number
}

type BranchData = {
  label: string
  quickStats: Array<{ label: string; value: number; suffix: string }>
  techLevel?: { level: string; score: number; dimensions: number[] }
  operationMetrics: MetricItem[]
  innovation: { title: string; value: number; done: number; remaining: number }
  cloud: { value: number; total: number; note: string }
  personnelTotal: number
  personnelDelta: string
  personnelRoles: Array<{ label: string; value: number; tone: MetricTone }>
  tableRows: RowItem[]
}

const gradeOptions = [
  { key: "all", label: "全部等级" },
  { key: "level-1", label: "一级分行" },
  { key: "level-2", label: "二级分行" },
  { key: "level-3", label: "三级分行" },
]

const branchOptions = [
  { key: "all", label: "全部分行" },
  { key: "nanjing", label: "南京分行" },
  { key: "hangzhou", label: "杭州分行" },
  { key: "guangzhou", label: "广州分行" },
  { key: "fuzhou", label: "福州分行" },
  { key: "wuhan", label: "武汉分行" },
  { key: "beijing", label: "北京分行" },
  { key: "shanghai", label: "上海分行" },
  { key: "shenzhen", label: "深圳分行" },
  { key: "chengdu", label: "成都分行" },
  { key: "xian", label: "西安分行" },
]

const branchData: Record<string, BranchData> = {
  nanjing: {
    label: "南京分行",
    quickStats: [
      { label: "重点分行", value: 12, suffix: "家" },
      { label: "接入系统", value: 328, suffix: "个" },
      { label: "治理项", value: 86, suffix: "项" },
    ],
    techLevel: { level: "3A", score: 92, dimensions: [92, 88, 95, 90, 94] },
    operationMetrics: [
      { label: "父系统数", value: 230, unit: "个", tone: "primary" },
      { label: "子系统数", value: 522, unit: "个", tone: "accent" },
      { label: "服务器主机数", value: 2299, unit: "台", tone: "primary" },
      { label: "网络设备数", value: 12460, unit: "个", tone: "accent" },
  { label: "分行办公终端数", value: 77343, unit: "个", tone: "chart-4" },
  { label: "专线数", value: 8075, unit: "条", tone: "chart-4" },
  { label: "存储数", value: 7608310, unit: "GB", tone: "primary" },
  { label: "CPU数", value: 5987, unit: "核", tone: "accent" },
    ],
    innovation: { title: "年度计划数", value: 95, done: 81, remaining: 14 },
    cloud: { value: 33, total: 48, note: "单台式与双台式上云系统占比" },
    personnelTotal: 928,
    personnelDelta: "+6.3%",
    personnelRoles: [
      { label: "研发岗位", value: 200, tone: "primary" },
      { label: "运维岗位", value: 207, tone: "accent" },
      { label: "数据岗位", value: 134, tone: "chart-4" },
      { label: "架构岗位", value: 201, tone: "primary" },
      { label: "安全岗位", value: 82, tone: "accent" },
      { label: "科技管理干部", value: 46, tone: "chart-4" },
      { label: "创新岗位", value: 38, tone: "primary" },
    ],
    tableRows: [
      { name: "南京分行", development: 19, operations: 5, architecture: 1, innovation: 0, data: 3, security: 2, management: 29, total: 59 },
      { name: "苏州分行", development: 16, operations: 12, architecture: 0, innovation: 0, data: 8, security: 3, management: 10, total: 49 },
      { name: "无锡分行", development: 11, operations: 9, architecture: 0, innovation: 0, data: 12, security: 4, management: 2, total: 38 },
      { name: "常州分行", development: 9, operations: 2, architecture: 2, innovation: 2, data: 5, security: 2, management: 22, total: 44 },
      { name: "南通分行", development: 7, operations: 6, architecture: 0, innovation: 1, data: 4, security: 2, management: 8, total: 28 },
    ],
  },
  hangzhou: {
    label: "杭州分行",
    quickStats: [
      { label: "重点分行", value: 10, suffix: "家" },
      { label: "接入系统", value: 286, suffix: "个" },
      { label: "治理项", value: 74, suffix: "项" },
    ],
    operationMetrics: [
      { label: "父系统数", value: 198, unit: "个", tone: "primary" },
      { label: "子系统数", value: 480, unit: "个", tone: "accent" },
      { label: "服务器主机数", value: 1864, unit: "台", tone: "primary" },
      { label: "网络设备数", value: 10902, unit: "台", tone: "accent" },
  { label: "分行办公终端数", value: 1360, unit: "台", tone: "chart-4" },
  { label: "专线数", value: 6490, unit: "条", tone: "chart-4" },
  { label: "存储数", value: 5892100, unit: "GB", tone: "primary" },
  { label: "CPU数", value: 4210, unit: "核", tone: "accent" },
    ],
    techLevel: { level: "2A", score: 84, dimensions: [82, 92, 75, 88, 85] },
    innovation: { title: "年度计划数", value: 82, done: 67, remaining: 15 },
    cloud: { value: 28, total: 41, note: "杭州分行系统上云推进进度" },
    personnelTotal: 804,
    personnelDelta: "+5.2%",
    personnelRoles: [
      { label: "研发岗位", value: 172, tone: "primary" },
      { label: "运维岗位", value: 186, tone: "accent" },
      { label: "数据岗位", value: 121, tone: "chart-4" },
      { label: "架构岗位", value: 168, tone: "primary" },
      { label: "安全岗位", value: 61, tone: "accent" },
      { label: "科技管理干部", value: 34, tone: "chart-4" },
      { label: "创新岗位", value: 28, tone: "primary" },
    ],
    tableRows: [
      { name: "杭州分行", development: 18, operations: 10, architecture: 1, innovation: 0, data: 4, security: 2, management: 21, total: 56 },
      { name: "宁波分行", development: 14, operations: 11, architecture: 0, innovation: 1, data: 6, security: 2, management: 9, total: 43 },
      { name: "绍兴分行", development: 10, operations: 8, architecture: 0, innovation: 0, data: 5, security: 2, management: 7, total: 32 },
      { name: "嘉兴分行", development: 8, operations: 4, architecture: 0, innovation: 0, data: 3, security: 1, management: 6, total: 22 },
      { name: "湖州分行", development: 7, operations: 3, architecture: 0, innovation: 0, data: 2, security: 1, management: 5, total: 18 },
    ],
  },
  guangzhou: {
    label: "广州分行",
    quickStats: [
      { label: "重点分行", value: 9, suffix: "家" },
      { label: "接入系统", value: 264, suffix: "个" },
      { label: "治理项", value: 69, suffix: "项" },
    ],
    operationMetrics: [
      { label: "父系统数", value: 176, unit: "个", tone: "primary" },
      { label: "子系统数", value: 438, unit: "个", tone: "accent" },
      { label: "服务器主机数", value: 1712, unit: "台", tone: "primary" },
      { label: "网络设备数", value: 9914, unit: "台", tone: "accent" },
  { label: "分行办公终端数", value: 1220, unit: "台", tone: "chart-4" },
  { label: "专线数", value: 5968, unit: "条", tone: "chart-4" },
  { label: "存储数", value: 4882100, unit: "GB", tone: "primary" },
  { label: "CPU数", value: 3510, unit: "核", tone: "accent" },
    ],
    techLevel: { level: "3B", score: 70, dimensions: [65, 78, 58, 72, 76] },
    innovation: { title: "年度计划数", value: 76, done: 60, remaining: 16 },
    cloud: { value: 24, total: 36, note: "广州分行上云与治理同步推进" },
    personnelTotal: 742,
    personnelDelta: "+4.8%",
    personnelRoles: [
      { label: "研发岗位", value: 160, tone: "primary" },
      { label: "运维岗位", value: 174, tone: "accent" },
      { label: "数据岗位", value: 108, tone: "chart-4" },
      { label: "架构岗位", value: 154, tone: "primary" },
      { label: "安全岗位", value: 56, tone: "accent" },
      { label: "科技管理干部", value: 31, tone: "chart-4" },
      { label: "创新岗位", value: 26, tone: "primary" },
    ],
    tableRows: [
      { name: "广州分行", development: 17, operations: 8, architecture: 1, innovation: 1, data: 4, security: 2, management: 18, total: 51 },
      { name: "深圳分行", development: 15, operations: 10, architecture: 1, innovation: 0, data: 5, security: 3, management: 14, total: 48 },
      { name: "佛山分行", development: 11, operations: 7, architecture: 0, innovation: 0, data: 3, security: 2, management: 8, total: 31 },
      { name: "东莞分行", development: 8, operations: 5, architecture: 0, innovation: 0, data: 2, security: 1, management: 7, total: 23 },
      { name: "珠海分行", development: 6, operations: 4, architecture: 0, innovation: 0, data: 1, security: 1, management: 5, total: 17 },
    ],
  },
  fuzhou: {
    label: "福州分行",
    quickStats: [
      { label: "重点分行", value: 7, suffix: "家" },
      { label: "接入系统", value: 203, suffix: "个" },
      { label: "治理项", value: 58, suffix: "项" },
    ],
    operationMetrics: [
      { label: "父系统数", value: 138, unit: "个", tone: "primary" },
      { label: "子系统数", value: 322, unit: "个", tone: "accent" },
      { label: "服务器主机数", value: 1286, unit: "台", tone: "primary" },
      { label: "网络设备数", value: 7420, unit: "台", tone: "accent" },
  { label: "分行办公终端数", value: 890, unit: "台", tone: "chart-4" },
  { label: "专线数", value: 4511, unit: "条", tone: "chart-4" },
  { label: "存储数", value: 3568400, unit: "GB", tone: "primary" },
  { label: "CPU数", value: 2390, unit: "核", tone: "accent" },
    ],
    techLevel: { level: "2B", score: 91, dimensions: [90, 94, 85, 95, 93] },
    innovation: { title: "年度计划数", value: 58, done: 44, remaining: 14 },
    cloud: { value: 18, total: 27, note: "福州分行系统纳管情况" },
    personnelTotal: 536,
    personnelDelta: "+3.9%",
    personnelRoles: [
      { label: "研发岗位", value: 112, tone: "primary" },
      { label: "运维岗位", value: 126, tone: "accent" },
      { label: "数据岗位", value: 78, tone: "chart-4" },
      { label: "架构岗位", value: 109, tone: "primary" },
      { label: "安全岗位", value: 42, tone: "accent" },
      { label: "科技管理干部", value: 24, tone: "chart-4" },
      { label: "创新岗位", value: 20, tone: "primary" },
    ],
    tableRows: [
      { name: "福州分行", development: 14, operations: 6, architecture: 0, innovation: 0, data: 3, security: 1, management: 14, total: 38 },
      { name: "厦门分行", development: 10, operations: 5, architecture: 0, innovation: 0, data: 2, security: 1, management: 9, total: 27 },
      { name: "泉州分行", development: 9, operations: 4, architecture: 0, innovation: 1, data: 2, security: 1, management: 7, total: 24 },
      { name: "漳州分行", development: 6, operations: 3, architecture: 0, innovation: 0, data: 1, security: 1, management: 5, total: 16 },
      { name: "龙岩分行", development: 5, operations: 2, architecture: 0, innovation: 0, data: 1, security: 1, management: 4, total: 13 },
    ],
  },
}

const additionalBranchData: Array<[string, string, string, number, number, number, number, number]> = [
  ["wuhan", "武汉分行", "level-1", 214, 506, 31, 42, 876],
  ["beijing", "北京分行", "level-1", 246, 590, 39, 51, 1042],
  ["shanghai", "上海分行", "level-1", 238, 562, 36, 47, 986],
  ["shenzhen", "深圳分行", "level-2", 192, 448, 29, 38, 812],
  ["chengdu", "成都分行", "level-2", 164, 386, 25, 32, 698],
  ["xian", "西安分行", "level-3", 126, 298, 18, 24, 524],
]

const fixedTechLevels: Record<string, { level: string; score: number; dimensions: number[] }> = {
  wuhan: { level: "1A", score: 77, dimensions: [70, 84, 68, 80, 82] },
  beijing: { level: "3C", score: 77, dimensions: [76, 80, 70, 82, 78] },
  shanghai: { level: "2C", score: 81, dimensions: [80, 85, 74, 86, 82] },
  shenzhen: { level: "1B", score: 68, dimensions: [66, 74, 60, 70, 72] },
  chengdu: { level: "1C", score: 63, dimensions: [60, 68, 55, 64, 66] },
  xian: { level: "1C", score: 60, dimensions: [58, 66, 52, 62, 64] },
}

for (const [key, label, grade, parentSystems, childSystems, cloudValue, planValue, personnelTotal] of additionalBranchData) {
  const source = branchData.nanjing
  const roleScale = personnelTotal / source.personnelTotal
  branchData[key] = {
    ...source,
    label,
    techLevel: fixedTechLevels[key] ?? { level: "1C", score: 60, dimensions: [60, 60, 60, 60, 60] },
    quickStats: source.quickStats.map((stat, index) => ({ ...stat, value: Math.round(stat.value * roleScale) })),
    operationMetrics: source.operationMetrics.map((metric, index) => ({
      ...metric,
      value: index === 0 ? parentSystems : index === 1 ? childSystems : Math.round(metric.value * roleScale),
    })),
    innovation: { title: "年度计划数", value: planValue, done: Math.max(1, planValue - Math.round(planValue * 0.18)), remaining: Math.round(planValue * 0.18) },
    cloud: { value: cloudValue, total: cloudValue + Math.round(cloudValue * 0.45), note: `${label}系统上云推进情况` },
    personnelTotal,
    personnelDelta: `+${(3.2 + roleScale * 2.8).toFixed(1)}%`,
    personnelRoles: source.personnelRoles.map((role) => ({ ...role, value: Math.round(role.value * roleScale) })),
    tableRows: [{
      name: label,
      development: Math.round(19 * roleScale),
      operations: Math.round(5 * roleScale),
      architecture: Math.max(1, Math.round(roleScale)),
      innovation: Math.max(0, Math.round(planValue * 0.04)),
      data: Math.round(3 * roleScale),
      security: Math.max(1, Math.round(2 * roleScale)),
      management: Math.round(29 * roleScale),
      total: personnelTotal,
    }],
  }
}

const branchGrades: Record<string, string> = {
  nanjing: "level-1",
  hangzhou: "level-1",
  guangzhou: "level-2",
  fuzhou: "level-3",
  wuhan: "level-1",
  beijing: "level-1",
  shanghai: "level-1",
  shenzhen: "level-2",
  chengdu: "level-2",
  xian: "level-3",
}

function sumBy<T>(items: T[], getValue: (item: T) => number) {
  return items.reduce((sum, item) => sum + getValue(item), 0)
}

function toBranchRow(branch: BranchData): RowItem {
  const getMetric = (label: string) => branch.operationMetrics.find((metric) => metric.label === label)?.value ?? 0
  return {
    name: branch.label,
    development: branch.personnelRoles[0]?.value ?? 0,
    operations: branch.personnelRoles[1]?.value ?? 0,
    architecture: branch.personnelRoles[3]?.value ?? 0,
    innovation: branch.innovation.done,
    data: branch.personnelRoles[2]?.value ?? 0,
    security: branch.personnelRoles[4]?.value ?? 0,
    management: branch.quickStats[2]?.value ?? 0,
    total: branch.personnelTotal,
  }
}

function aggregateBranchData(keys: string[]): BranchData {
  const rows = keys.map((key) => branchData[key])
  const base = rows[0] ?? branchData.nanjing
  const operationMetrics = base.operationMetrics.map((metric, index) => ({
    ...metric,
    value: sumBy(rows, (row) => row.operationMetrics[index]?.value ?? 0),
  }))
  const personnelRoles = base.personnelRoles.map((role, index) => ({
    ...role,
    value: sumBy(rows, (row) => row.personnelRoles[index]?.value ?? 0),
  }))
  const tableRows = rows.map(toBranchRow)
  return {
    ...base,
    label: keys.length === 1 ? base.label : "筛选结������������������汇总",
    quickStats: base.quickStats.map((stat, index) => ({ ...stat, value: sumBy(rows, (row) => row.quickStats[index]?.value ?? 0) })),
    operationMetrics,
    innovation: {
      ...base.innovation,
      value: sumBy(rows, (row) => row.innovation.value),
      done: sumBy(rows, (row) => row.innovation.done),
      remaining: sumBy(rows, (row) => row.innovation.remaining),
    },
    cloud: {
      ...base.cloud,
      value: sumBy(rows, (row) => row.cloud.value),
      total: sumBy(rows, (row) => row.cloud.total),
      note: "当前筛选系统上云进度",
    },
    personnelTotal: sumBy(rows, (row) => row.personnelTotal),
    personnelDelta: "—",
    personnelRoles,
    tableRows,
  }
}

function SectionHeader({ title, icon }: { title: string; icon: ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-t-[10px] bg-[#2456c7] px-4 py-2.5 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]">
      <span className="flex size-6 items-center justify-center rounded-full bg-white/12 ring-1 ring-white/20">{icon}</span>
      <span className="text-[16px] font-semibold tracking-wide">{title}</span>
    </div>
  )
}

function SelectBox({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (next: string) => void
  options: Array<{ key: string; label: string }>
}) {
  return (
    <label className="flex min-w-0 flex-1 items-center gap-3 rounded-[6px] border border-border/80 bg-card/90 px-4 py-3 shadow-[0_0_0_1px_oklch(0.72_0.15_220/6%),0_10px_28px_oklch(0_0_0/10%)]">
      <div className="min-w-0 flex-1">
        <div className="text-[12px] text-muted-foreground">{label}</div>
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="mt-1 w-full appearance-none bg-transparent pr-6 text-sm font-semibold text-foreground outline-none"
        >
          {options.map((option) => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <ChevronDown className="size-4 shrink-0 text-slate-500" aria-hidden="true" />
    </label>
  )
}

function MetricTile({ item }: { item: MetricItem }) {
  const className =
    item.tone === "accent"
      ? "from-accent to-accent/70"
      : item.tone === "chart-4"
        ? "from-chart-4 to-chart-4/70"
        : "from-primary to-primary/80"

  return (
    <div className="rounded-[10px] px-2 py-1.5">
      <div className="flex items-start gap-2">
        <span className={cn("mt-1 h-1.5 w-1.5 rounded-full bg-gradient-to-r", className)} />
        <div className="min-w-0">
          <div className="text-[12px] text-foreground/75">{item.label}</div>
          <div className="mt-0.5 flex items-baseline gap-1.5">
            <span className="font-mono text-[16px] font-bold text-foreground">{item.value.toLocaleString()}</span>
            <span className="text-[10px] text-muted-foreground">{item.unit}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function DotLegend({ color, text }: { color: string; text: string }) {
  return (
    <div className="flex items-center gap-2 text-[12px] text-slate-600">
      <span className="inline-flex size-2 rounded-full" style={{ backgroundColor: color }} />
      <span>{text}</span>
    </div>
  )
}

function RingChart({ value, total, label, displayValue = value }: { value: number; total: number; label: string; displayValue?: number }) {
  const percent = total > 0 ? Math.min((value / total) * 100, 100) : 0
  const dash = 283
  const offset = dash - (dash * percent) / 100

  return (
    <div className="relative h-[104px] w-[104px] shrink-0">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90 drop-shadow-[0_5px_10px_rgba(36,86,199,0.14)]">
        <circle cx="60" cy="60" r="49" fill="none" stroke="#edf2f8" strokeWidth="13" />
        <circle cx="60" cy="60" r="49" fill="none" stroke="#d5e0ef" strokeWidth="2" />
        <circle cx="60" cy="60" r="45" fill="none" stroke="#d8e1ef" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={dash}
          strokeDashoffset={offset}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2381df" />
            <stop offset="100%" stopColor="#2dc2be" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="text-[12px] text-muted-foreground">{label}</div>
        <div className="mt-0.5 font-mono text-[20px] font-black leading-none text-primary">{displayValue}</div>
      </div>
      <div className="absolute right-0.5 top-1 text-[12px] text-muted-foreground">{Math.round(percent)}%</div>
    </div>
  )
}

function CloudCircle({ value }: { value: number }) {
  return (
    <div className="flex h-[104px] w-[104px] flex-col items-center justify-center rounded-full bg-gradient-to-br from-primary/15 via-accent/15 to-primary/5 shadow-[inset_0_0_0_10px_rgba(36,86,199,0.06),0_8px_20px_rgba(36,86,199,0.1)]">
      <Cloud className="mb-1 size-5 text-primary" aria-hidden="true" />
      <div className="font-mono text-[22px] font-black leading-none text-primary">{value}</div>
      <div className="mt-1 text-[10px] font-medium tracking-[0.1em] text-muted-foreground">上云系统数</div>
    </div>
  )
}

function GaugeMeter({ roomMode, percentage = 22.22 }: { roomMode: "central" | "disaster"; percentage?: number }) {
  const safePercentage = Math.max(0, Math.min(100, percentage))
  const gaugeLength = 264
  const progressLength = (safePercentage / 100) * gaugeLength

  return (
    <div className="relative h-[86px] w-full max-w-[180px]">
      <svg viewBox="0 0 220 120" className="absolute inset-0 h-full w-full">
        <path d="M26 90 A84 84 0 0 1 194 90" fill="none" stroke="#d9e1ee" strokeWidth="10" strokeLinecap="round" />
        <path d="M26 90 A84 84 0 0 1 194 90" fill="none" stroke="url(#gaugeGrad)" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${progressLength} ${gaugeLength}`} />
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2dc2be" />
            <stop offset="100%" stopColor="#f3c46b" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute left-1/2 top-[38%] -translate-x-1/2 text-center">
  <div className="text-[12px] text-muted-foreground">灾备机房配套率</div>
  <div className="font-mono text-[19px] font-black text-primary">{safePercentage.toFixed(2)}%</div>
  <div className="text-[10px] text-slate-500">点击查看详情</div>

      </div>
      <div className="absolute left-[6px] bottom-2 text-[10px] text-muted-foreground">0</div>
<div className="absolute right-[6px] bottom-2 text-[10px] text-muted-foreground">40</div>
    </div>
  )
}

function RoleBar({ label, value, tone, maxValue }: { label: string; value: number; tone: MetricTone; maxValue: number }) {
  const width = maxValue > 0 ? Math.min((value / maxValue) * 100, 100) : 0
  const fill =
    tone === "accent"
      ? "bg-gradient-to-r from-accent to-accent/80"
      : tone === "chart-4"
        ? "bg-gradient-to-r from-chart-4 to-chart-4/80"
        : "bg-gradient-to-r from-primary to-primary/80"

  return (
  <div className="space-y-1 text-[12px]">
  <div className="flex items-center justify-between gap-2">
  <span className="truncate text-slate-700">{label}</span>
  <span className="shrink-0 font-mono font-bold text-primary">{value}</span>
  </div>
  <div className="h-2 overflow-hidden rounded-full bg-[#e7edf8]">
  <div className={cn("h-full rounded-full", fill)} style={{ width: `${width}%` }} />
  </div>
  </div>
  )
}

function PanelCard({ title, icon, children, className, onClick }: { title: string; icon: ReactNode; children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <section onClick={onClick} className={cn("h-full overflow-hidden rounded-xl border border-border/80 bg-card/90 shadow-[0_0_0_1px_oklch(0.72_0.15_220/6%),0_12px_40px_oklch(0_0_0/18%)] backdrop-blur-sm", className)}>
      <div className="relative flex items-center gap-3 border-b border-border/60 bg-gradient-to-r from-primary/12 via-card to-card px-4 py-3">
        <div className="flex items-center gap-1 opacity-70" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-4 w-1 skew-x-[-18deg] rounded-sm bg-primary/80" />
          ))}
        </div>
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">{icon}</span>
        <span className="min-w-0 flex-1 truncate text-sm font-semibold tracking-wide text-foreground">{title}</span>
      </div>
      <div className="p-4">{children}</div>
    </section>
  )
}

function TechLevelPanel({ rows, selectedKey, onSelect }: { rows: Array<{ key: string; data: BranchData }>; selectedKey: string; onSelect: (key: string) => void }) {
  const [activeDim, setActiveDim] = useState<number | null>(null)
  const dimensionLabels = ["科技治理", "风险安全", "研发创新", "运维管理", "数据管理"]
  const selectedRow = rows.find((row) => row.key === selectedKey)
  const isAverage = !selectedRow
  const selected = selectedRow?.data
  const averageDimensions = dimensionLabels.map((_, index) => {
    if (rows.length === 0) return 0
    const total = rows.reduce((sum, row) => sum + (row.data.techLevel?.dimensions?.[index] ?? 0), 0)
    return Math.round(total / rows.length)
  })
  const points = isAverage ? averageDimensions : (selected?.techLevel?.dimensions.slice(0, 5) ?? [82, 78, 84, 80, 86])
  const displayLabel = isAverage ? "全部分行（平均值）" : selected?.label ?? "当前分行"
  const displayLevel = isAverage ? null : selected?.techLevel?.level ?? "B类"

  useEffect(() => {
    setActiveDim(null)
  }, [selectedKey])

  const vertexCoords = points.map((value, index) => {
    const angle = (Math.PI * 2 * index) / points.length - Math.PI / 2
    const radius = 18 + value * 0.42
    return { x: 110 + Math.cos(angle) * radius, y: 90 + Math.sin(angle) * radius }
  })
  const radarPoints = vertexCoords.map((point) => `${point.x},${point.y}`).join(" ")

  return (
<PanelCard title="分行科技分级" icon={<Gauge className="size-4" />}>
  <div className="grid gap-3">
        <div className="grid grid-cols-3 gap-2">
          {[
            {
              tier: "3级",
              panel: "border-primary/20 bg-primary/[0.06]",
              chip: "bg-primary text-primary-foreground",
              items: [
                { label: "3A", count: 1 },
                { label: "3B", count: 1 },
                { label: "3C", count: 1 },
              ],
            },
            {
              tier: "2级",
              panel: "border-accent/25 bg-accent/[0.08]",
              chip: "bg-accent text-accent-foreground",
              items: [
                { label: "2A", count: 1 },
                { label: "2B", count: 1 },
                { label: "2C", count: 1 },
              ],
            },
            {
              tier: "1级",
              panel: "border-chart-4/25 bg-chart-4/[0.08]",
              chip: "bg-chart-4 text-background",
              items: [
                { label: "1A", count: 1 },
                { label: "1B", count: 1 },
                { label: "1C", count: 2 },
              ],
            },
          ].map(({ tier, panel, chip, items }) => (
            <div key={tier} className={cn("rounded-lg border p-2", panel)}>
              <div className="mb-1.5 text-center text-[12px] font-semibold text-muted-foreground">{tier}</div>
              <div className="flex flex-col gap-1">
                {items.map(({ label, count }) => (
                  <div key={label} className="flex items-center justify-between rounded-md bg-card px-1.5 py-1 shadow-sm">
                    <span className={cn("inline-flex h-5 min-w-8 items-center justify-center rounded-md px-1.5 font-mono text-[12px] font-bold", chip)}>
                      {label}
                    </span>
                    <span className="font-mono text-sm font-black leading-none text-foreground">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-border/70 bg-background/40 p-2">
          <div className="flex justify-center">
            <svg viewBox="0 0 220 180" className="h-48 w-64" role="img" aria-label={`${displayLabel}科技能力雷达图`}>
              {[30, 50, 70].map((radius) => <polygon key={radius} points={points.map((_, index) => { const angle = (Math.PI * 2 * index) / points.length - Math.PI / 2; return `${110 + Math.cos(angle) * radius},${90 + Math.sin(angle) * radius}` }).join(" ")} fill="none" stroke="currentColor" className="text-border" strokeWidth="1" />)}
              <polygon points={radarPoints} fill="rgba(45,194,190,0.28)" stroke="#2dc2be" strokeWidth="2" />
              {dimensionLabels.map((label, index) => {
                const angle = (Math.PI * 2 * index) / points.length - Math.PI / 2
                const x = 110 + Math.cos(angle) * 84
                const y = 90 + Math.sin(angle) * 84
                const isActive = activeDim === index
                return (
                  <text
                    key={label}
                    x={x}
                    y={y}
                    textAnchor={index === 1 || index === 2 ? "start" : index === 3 || index === 4 ? "end" : "middle"}
                    dominantBaseline="middle"
                    onClick={() => setActiveDim(index)}
                    className={cn("cursor-pointer text-[10px] font-medium", isActive ? "fill-primary font-bold" : "fill-foreground")}
                  >
                    {label}
                  </text>
                )
              })}
              {vertexCoords.map((point, index) => (
                <circle
                  key={`vertex-${index}`}
                  cx={point.x}
                  cy={point.y}
                  r={activeDim === index ? 4.5 : 3}
                  fill={activeDim === index ? "#f3c46b" : "#2dc2be"}
                  stroke="white"
                  strokeWidth="1"
                  className="cursor-pointer"
                  onClick={() => setActiveDim(index)}
                />
              ))}
              {activeDim === null ? (
                <text x="110" y="94" textAnchor="middle" className="fill-muted-foreground text-[8px]">点击指标查看分值</text>
              ) : (
                <>
                  <text x="110" y="82" textAnchor="middle" className="fill-primary font-mono text-[20px] font-bold">{points[activeDim]}</text>
                  <text x="110" y="98" textAnchor="middle" className="fill-muted-foreground text-[8px]">{dimensionLabels[activeDim]}</text>
                </>
              )}
            </svg>
          </div>
          <div className="text-center text-[12px] text-muted-foreground">{displayLabel}{displayLevel ? ` · ${displayLevel}` : ""} · 点击雷达图或表头查看单项指标</div>
        </div>
        <div className="max-h-[268px] overflow-auto rounded-lg border border-border/70">
          <Table className="min-w-[560px] text-[12px]">
            <TableHeader className="bg-primary/10">
              <TableRow>
                <TableHead className="px-1.5 py-1.5">分行名称</TableHead>
                <TableHead className="px-1.5 py-1.5">科技等级</TableHead>
                {dimensionLabels.map((label, index) => (
                  <TableHead
                    key={label}
                    onClick={() => setActiveDim(index)}
                    className={cn("cursor-pointer px-1 py-1.5 text-center", activeDim === index && "bg-primary/20 text-primary")}
                  >
                    {label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>{rows.map(({ key, data }) => <TableRow key={key} onClick={() => onSelect(key)} className={cn("cursor-pointer", key === selectedKey && "bg-primary/10") }><TableCell className="whitespace-nowrap px-1.5 py-1.5 font-medium">{data.label}</TableCell><TableCell className="whitespace-nowrap px-1.5 py-1.5"><Badge variant="outline" className="border-primary/30 bg-primary/10 px-1.5 py-0 font-mono text-[12px] font-bold text-primary">{data.techLevel?.level ?? "B类"}</Badge></TableCell>{(data.techLevel?.dimensions ?? [82, 78, 84, 80, 86]).slice(0, 5).map((value, index) => <TableCell key={`${key}-${index}`} className={cn("px-1 py-1.5 text-center font-mono text-foreground/80", activeDim === index && "bg-primary/10 text-primary")}>{value}</TableCell>)}</TableRow>)}</TableBody>
          </Table>
        </div>
      </div>
    </PanelCard>
  )
}

export function BranchDashboard() {
  const now = useLiveClock()
  const [selectedGrade, setSelectedGrade] = useState("all")
  const [selectedBranch, setSelectedBranch] = useState("all")
  const [roomMode, setRoomMode] = useState<"central" | "disaster">("central")
  const [roomDetails, setRoomDetails] = useState(false)
  const [disasterDetails, setDisasterDetails] = useState(false)
  const [innovationRanking, setInnovationRanking] = useState(false)
  const [cloudRanking, setCloudRanking] = useState(false)
  const [personnelPage, setPersonnelPage] = useState(1)
  const [personnelDetails, setPersonnelDetails] = useState(false)
  const [techSelectedKey, setTechSelectedKey] = useState("all")
  const personnelPageSize = 6

  useEffect(() => {
    setSelectedBranch("all")
    setPersonnelPage(1)
  }, [selectedGrade])

  useEffect(() => {
    setPersonnelPage(1)
    // 分行科技分级始终展示完整分行数据，不受右侧筛选条件影响。
    setTechSelectedKey("all")
  }, [selectedBranch])

  const filteredKeys = Object.keys(branchData).filter((key) => {
    if (selectedBranch !== "all") return key === selectedBranch
    return selectedGrade === "all" || branchGrades[key] === selectedGrade
  })
  const selectedData = selectedBranch !== "all"
    ? branchData[selectedBranch] ?? branchData.nanjing
    : null
  const current = selectedData
    ? { ...selectedData, tableRows: [toBranchRow(selectedData)] }
    : aggregateBranchData(filteredKeys)
  const personnelPageCount = Math.max(1, Math.ceil(current.tableRows.length / personnelPageSize))
  const personnelRows = current.tableRows.slice(
    (personnelPage - 1) * personnelPageSize,
    personnelPage * personnelPageSize,
  )
  const liveTime = now ? now.toTimeString().slice(0, 8) : "--:--:--"
  const scopedRows = selectedBranch !== "all"
    ? current.tableRows.filter((row) => row.name === current.label || row.name.endsWith(current.label.replace("分行", "")))
    : Array.from(new Map(current.tableRows.map((row) => [row.name, row])).values())
  const detailRows = selectedBranch !== "all" ? scopedRows.slice(0, 1) : scopedRows.slice(0, 10)
  const innovationRows = [...scopedRows]
    .map((row) => {
      const branch = branchData[Object.keys(branchData).find((key) => branchData[key].label === row.name) ?? ""]
      const required = branch?.innovation.value ?? row.innovation
      const done = branch?.innovation.done ?? row.innovation
      return { name: row.name, count: done, rate: required ? Math.round((done / required) * 100) : 0 }
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
  const cloudRows = selectedBranch !== "all"
    ? [{ name: current.label, count: current.cloud.value }]
    : [...scopedRows]
      .map((row) => ({ name: row.name, count: Math.max(0, Math.round((current.cloud.value / Math.max(current.personnelTotal, 1)) * row.total)) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  const selectedScopeLabel = selectedBranch !== "all"
    ? branchOptions.find((option) => option.key === selectedBranch)?.label ?? current.label
    : selectedGrade !== "all"
      ? gradeOptions.find((option) => option.key === selectedGrade)?.label ?? "筛选范围"
      : "全部分行"
  // 左侧分行科技分级是独立总览，始终展示全部分行，不受等级或分行筛选影响。
  const techRows = Object.keys(branchData).map((key) => ({ key, data: branchData[key] }))
  const activeTechKey = techRows.some((row) => row.key === techSelectedKey) ? techSelectedKey : "all"
  // Use one shared maximum from the active filter scope so every role is comparable.
  // For a single branch, this is that branch's largest role count; for a group,
  // it is the largest role count in the aggregated filtered data.
  const personnelRoleMax = Math.max(1, ...current.personnelRoles.map((role) => role.value))

  return (
    <main className="min-h-screen w-full max-w-full overflow-x-hidden bg-background text-foreground selection:bg-primary/30">
      <div
        className="pointer-events-none fixed inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 10% 0%, oklch(0.72 0.15 220 / 12%), transparent 40%), radial-gradient(circle at 90% 10%, oklch(0.75 0.14 195 / 10%), transparent 35%), radial-gradient(circle at 50% 100%, oklch(0.65 0.12 280 / 8%), transparent 30%)",
        }}
        aria-hidden="true"
      />

      <TopNav />

      <div className="relative mx-auto flex w-full min-w-0 max-w-[1720px] flex-col gap-6 overflow-hidden px-4 py-6 md:px-8 lg:px-10">
        <HeroBanner title="分行管理驾驶舱" subtitle="分行科技画像 · 运维监控 · 信创建设 · 系统上云" />

        <section aria-labelledby="branch-overview-title" className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex min-w-0 flex-col gap-5">
            <div className="grid min-w-0 gap-3 pt-1 md:grid-cols-2 md:[&>*]:min-w-0 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <SelectBox label="请选择等级" value={selectedGrade} onChange={setSelectedGrade} options={gradeOptions} />
              <SelectBox label="请选择分行" value={selectedBranch} onChange={setSelectedBranch} options={branchOptions} />
            </div>

            <div className="grid min-w-0 items-stretch gap-3 lg:grid-cols-[minmax(240px,0.34fr)_minmax(0,0.66fr)]">
              <div className="order-2 min-w-0 lg:col-start-1 lg:row-start-1 lg:row-span-2">
                <TechLevelPanel rows={techRows} selectedKey={activeTechKey} onSelect={setTechSelectedKey} />
              </div>

              <div className="order-1 grid min-w-0 items-start gap-3 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:grid-cols-2 lg:grid-rows-[248px_248px_auto]">
              <PanelCard className="order-3 h-full lg:col-span-2 lg:col-start-1 lg:row-start-3" title="运维指标" icon={<Gauge className="size-4" />}>
                <div className="grid gap-2 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,0.9fr)_minmax(0,0.9fr)] lg:divide-x lg:divide-dashed lg:divide-border/70">
                  <div className="grid grid-cols-2 gap-1.5">
                    {current.operationMetrics.slice(0, 6).map((item) => <MetricTile key={item.label} item={item} />)}
                  </div>

                  <div onClick={(event) => { if ((event.target as HTMLElement).closest("button")) return; setRoomDetails((value) => !value) }} className="flex h-[210px] cursor-pointer flex-col overflow-hidden rounded-[12px] border border-border/80 bg-card/80 px-3 py-2 shadow-[inset_0_1px_0_oklch(0.72_0.15_220/6%)] lg:ml-2">
                    <div className="mb-1 flex items-center justify-between"><span className="text-[14px] font-bold text-foreground">中心机房</span><span className="text-[10px] text-muted-foreground">建设模式</span></div>
                    <button type="button" onClick={() => setRoomDetails(!roomDetails)} className="mb-1.5 flex min-h-7 w-full items-center gap-2 text-left text-[12px] font-semibold leading-4 text-slate-700 hover:text-primary">
                      <span className="inline-flex size-2 rounded-full bg-[#2456c7]" />共{detailRows.length}家分行配备中心机房
                    </button>
                    {roomDetails ? <div className="max-h-[142px] overflow-auto overscroll-contain [WebkitOverflowScrolling:touch]">
                      <table className="w-full min-w-[300px] text-left text-[12px]">
                        <thead className="text-muted-foreground"><tr><th className="pb-2 font-medium">分行名称</th><th className="pb-2 font-medium">中心机房建设方式</th><th className="pb-2 font-medium">启用时间</th></tr></thead>
                        <tbody>{detailRows.map((row, index) => <tr key={row.name} className="border-t border-border/50"><td className="py-1.5">{row.name}</td><td className="py-1.5">{index % 4 === 0 ? "租赁" : "自建"}</td><td className="py-1.5 font-mono">{2021 + (index % 4)}年</td></tr>)}</tbody>
                      </table>
                    </div> : <button type="button" onClick={() => setRoomDetails(true)} className="flex w-full items-center gap-3 text-left">
                      <div className="relative h-[76px] w-[96px] shrink-0"><svg viewBox="0 0 120 120" className="h-full w-full -rotate-90"><circle cx="60" cy="60" r="42" fill="none" stroke="#d9e1ee" strokeWidth="10" /><circle cx="60" cy="60" r="42" fill="none" stroke="#2456c7" strokeWidth="10" strokeLinecap="round" strokeDasharray="259 300" /><circle cx="60" cy="60" r="42" fill="none" stroke="#2dc2be" strokeWidth="10" strokeLinecap="round" strokeDasharray="41 300" strokeDashoffset="259" /></svg><div className="absolute inset-0 flex flex-col items-center justify-center text-center"><div className="font-mono text-[16px] font-black text-primary">{detailRows.length}</div></div></div>
                      <div className="grid gap-1.5 text-[12px] text-foreground/75"><div><span className="mr-2 inline-flex size-2 rounded-full bg-[#2456c7]" />自建 <span className="font-mono text-primary">{Math.max(0, detailRows.length - 1)}</span></div><div><span className="mr-2 inline-flex size-2 rounded-full bg-[#2dc2be]" />租赁 <span className="font-mono text-primary">{detailRows.length ? 1 : 0}</span></div></div>
                    </button>}
                    <div className="mt-1 text-center text-[11px] text-muted-foreground">点击查看详情</div>
                    <div className="mt-auto flex min-h-9 items-center justify-between rounded-[10px] border border-border/70 bg-background/70 px-3 py-1.5"><span className="text-[12px] font-bold text-muted-foreground">机柜数</span><span className="font-mono text-[13px] font-black text-primary">{(current.personnelTotal * 2).toLocaleString()} <small className="text-[12px] font-normal text-muted-foreground">个</small></span></div>
                  </div>

                  <div onClick={(event) => { if ((event.target as HTMLElement).closest("button")) return; setDisasterDetails((value) => !value) }} className="flex h-[210px] cursor-pointer flex-col gap-1.5 overflow-hidden rounded-[12px] border border-border/80 bg-card/80 px-3 py-2 shadow-[inset_0_1px_0_oklch(0.72_0.15_220/6%)] lg:ml-2">
                    <div className="mb-1 flex items-center justify-between"><span className="text-[14px] font-bold text-foreground">灾备机房</span><span className="text-[10px] text-muted-foreground">配套情况</span></div>
                    <button type="button" onClick={() => setDisasterDetails(!disasterDetails)} className="mb-1.5 min-h-7 w-full text-left text-[12px] font-semibold leading-4 text-slate-700 transition-colors hover:text-primary">
                      <span className="mr-2 inline-flex size-2 rounded-full bg-[#2dc2be]" />其中{detailRows.length}家分行配备灾备机房
                    </button>
                    {disasterDetails ? <div className="max-h-[150px] overflow-y-auto overscroll-contain grid gap-2 py-1 text-[12px] text-foreground/80 [WebkitOverflowScrolling:touch]"><div className="font-semibold text-primary">配备灾备机房的分行</div>{detailRows.map((row) => <div key={row.name} className="flex items-center justify-between border-t border-border/50 py-1.5"><span>{row.name}</span><span className="text-muted-foreground">已配备</span></div>)}</div> : <button type="button" onClick={() => setRoomMode(roomMode === "central" ? "disaster" : "central")} className="mt-3 flex items-center justify-center" aria-label="查看灾备机房配套率"><GaugeMeter roomMode={roomMode} /></button>}
                  </div>
                </div>
              </PanelCard>

              <div className="order-2 col-start-2 row-start-1 row-span-2 grid h-[512px] min-w-0 items-stretch gap-2 grid-cols-1 md:[&>*]:min-w-0">
                  <PanelCard className="h-[248px] cursor-pointer overflow-hidden" bodyClassName="p-2.5" title="信创改造" icon={<ShieldCheck className="size-4" />} onClick={() => setInnovationRanking((value) => !value)}>
                    <button type="button" onClick={(event) => { event.stopPropagation(); setInnovationRanking((value) => !value) }} className="w-full text-left" aria-label="切换信创改���完成度排行">
                    {innovationRanking ? <div className="max-h-[160px] overflow-y-auto overflow-x-hidden overscroll-contain py-1 [WebkitOverflowScrolling:touch]">
                      <ResponsiveContainer width="100%" height={160} minWidth={1} minHeight={1}>
                        <ComposedChart data={innovationRows} margin={{ top: 20, right: 8, left: -18, bottom: 8 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                          <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} interval={0} angle={-25} textAnchor="end" height={42} />
                          <YAxis yAxisId="count" domain={[0, 4]} ticks={[0, 1, 2, 3, 4]} tick={{ fontSize: 10 }} />
                          <YAxis yAxisId="rate" orientation="right" domain={[0, 100]} ticks={[0, 50, 100]} tickFormatter={(value) => `${value}%`} tick={{ fontSize: 10 }} />
                          <Tooltip formatter={(value, name) => [name === "rate" ? `${value}%` : value, name === "rate" ? "改造完成率" : "已完成改造数量"]} />
                          <Legend wrapperStyle={{ fontSize: 10 }} formatter={(value) => value === "count" ? "已完成改造数量" : "改造完成率"} />
                          <Bar yAxisId="count" dataKey="count" name="count" fill="#2dc2be" radius={[3, 3, 0, 0]} label={{ position: "top", fontSize: 10 }} />
                          <Line yAxisId="rate" type="monotone" dataKey="rate" name="rate" stroke="#e68a4a" strokeWidth={2} dot={{ r: 3, fill: "#e68a4a" }} label={{ position: "top", fontSize: 10, formatter: (value: number) => `${value}%` }} />
                        </ComposedChart>
                      </ResponsiveContainer>
                      <div className="text-center text-[12px] text-muted-foreground">信创部改造前十名完成度</div>
                    </div> : <div className="flex items-center justify-between gap-2.5">
                      <div className="flex flex-1 items-center justify-center">
                        <RingChart value={current.innovation.done} total={current.innovation.done + current.innovation.remaining} displayValue={current.innovation.done + current.innovation.remaining} label="计划总数" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between text-[12px] text-slate-600">
                          <span>已完成</span>
                          <span className="font-mono text-[19px] font-black text-primary">{current.innovation.done}</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-[#e7edf8]">
                          <div className="h-full rounded-full bg-gradient-to-r from-[#2456c7] to-[#2dc2be]" style={{ width: `${(current.innovation.done / current.innovation.value) * 100}%` }} />
                        </div>
                        <div className="flex items-center justify-between text-[12px] text-slate-600">
                          <span>未完成</span>
                          <span className="font-mono text-[19px] font-black text-primary">{current.innovation.remaining}</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-[#e7edf8]">
                          <div className="h-full rounded-full bg-gradient-to-r from-[#2dc2be] to-[#86e1de]" style={{ width: `${(current.innovation.remaining / current.innovation.value) * 100}%` }} />
                        </div>
                      </div>
                    </div>}
                    </button>
                    {!innovationRanking && <><div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-[12px] text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-[#2456c7]" />已完成信创改造
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-[#2dc2be]" />未完成信创改造
                      </div>
                    </div>
                    <div className="mt-1 text-center text-[12px] text-slate-500">单击可查看信创改造完成度排序十名。</div></>}
                  </PanelCard>

                  <PanelCard className="h-[248px] overflow-hidden" bodyClassName="p-2.5" title="系统上云" icon={<Cloud className="size-4" />} onClick={() => setCloudRanking((value) => !value)}>
                    <button type="button" onClick={(event) => { event.stopPropagation(); setCloudRanking((value) => !value) }} className="w-full text-left" aria-label="切换上云系统前十名">
                    {cloudRanking ? <div className="max-h-[166px] overflow-y-auto overflow-x-hidden overscroll-contain grid gap-2 py-1 [WebkitOverflowScrolling:touch]">{cloudRows.map(({ name, count }, index) => <div key={name} className="grid grid-cols-[1.2fr_1fr_auto] items-center gap-2 text-[12px]"><span>{String(index + 1).padStart(2, "0")} {name}</span><span className="h-2 rounded-full bg-gradient-to-r from-accent to-primary" style={{ width: `${Math.max(20, Number(count) / Math.max(cloudRows[0]?.count ?? 1, 1) * 100)}%` }} /><strong className="font-mono text-primary">{count}</strong></div>)}</div> : <div className="flex flex-col items-center gap-1.5">
                      <CloudCircle value={current.cloud.value} />
                      <div className="text-center text-[12px] text-muted-foreground">单击可查看上云系统前十名。</div></div>}
                    </button>
                  </PanelCard>
              </div>

              <PanelCard className="order-1 col-start-1 row-start-1 row-span-2 h-[512px] min-w-0 cursor-pointer" bodyClassName="min-w-0 p-1.5" title="科技人员数量" icon={<UsersRound className="size-4" />} onClick={() => setPersonnelDetails((value) => !value)}>
                  <div className="grid min-w-0 gap-2">
                    {!personnelDetails && <div className="grid gap-2 rounded-[10px] border border-border/80 bg-card/80 px-3 py-2.5 shadow-[inset_0_1px_0_oklch(0.72_0.15_220/6%)]">
                      <div className="relative overflow-hidden rounded-[10px] border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-accent/10 px-4 py-3">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="text-[12px] font-medium tracking-wide text-muted-foreground">当前筛选科技人员</div>
                            <div className="mt-1 flex items-baseline gap-1.5">
                              <span className="font-mono text-[32px] font-black leading-none tracking-tight text-primary">{current.personnelTotal}</span>
                              <span className="text-[14px] font-semibold text-primary/80">人</span>
                            </div>
                          </div>
                          <div className="mt-1 rounded-full bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary">人员总览</div>
                        </div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-primary/10">
                          <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${Math.min(100, Math.max(12, Number(current.personnelTotal) / Math.max(...personnelRows.map((row) => row.total), 1) * 100))}%` }} />
                        </div>
                      </div>
                      <div className="grid gap-3">
                        {current.personnelRoles.map((role) => (
                          <RoleBar
                            key={role.label}
                            label={role.label}
                            value={role.value}
                            tone={role.tone}
                            maxValue={personnelRoleMax}
                          />
                        ))}
                      </div>
                      <div className="pt-1 text-center text-[11px] text-muted-foreground">点击查看详情</div>
                    </div>}

{personnelDetails && <div className="min-w-0 overflow-hidden rounded-[12px] border border-border/80 bg-card/80 shadow-[inset_0_1px_0_oklch(0.72_0.15_220/6%)]">
	<div className="block h-[190px] max-h-[190px] w-full min-w-0 max-w-full overflow-x-auto overflow-y-auto overscroll-contain [WebkitOverflowScrolling:touch]">
                          <Table className="min-w-[700px] text-[12px]">
                          <TableHeader className="bg-gradient-to-r from-primary via-primary to-accent">
                            <TableRow className="border-transparent hover:bg-transparent">
                              <TableHead className="px-2 py-2 text-[12px] font-semibold text-foreground">分行名称</TableHead>
                              <TableHead className="px-1.5 py-1 text-center text-[12px] font-semibold text-foreground">研发</TableHead>
                              <TableHead className="px-1.5 py-1 text-center text-[12px] font-semibold text-foreground">运维</TableHead>
                              <TableHead className="px-1.5 py-1 text-center text-[12px] font-semibold text-foreground">架构</TableHead>
                              <TableHead className="px-1.5 py-1 text-center text-[12px] font-semibold text-foreground">创新</TableHead>
                              <TableHead className="px-1.5 py-1 text-center text-[12px] font-semibold text-foreground">数据</TableHead>
                              <TableHead className="px-1.5 py-1 text-center text-[12px] font-semibold text-foreground">安全</TableHead>
                              <TableHead className="px-1.5 py-1 text-center text-[12px] font-semibold text-foreground">管理</TableHead>
                              <TableHead className="px-1.5 py-1 text-center text-[12px] font-semibold text-foreground">干部</TableHead>
                              <TableHead className="px-1.5 py-1 text-center text-[12px] font-semibold text-foreground">总数</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {personnelRows.map((row, index) => (
                              <TableRow key={row.name} className={cn("border-border/60 hover:bg-primary/5", index % 2 === 1 && "bg-primary/3")}>
                                <TableCell className="px-1.5 py-1.5 font-medium text-[12px] text-foreground/90">{row.name}</TableCell>
                                <TableCell className="px-1.5 py-1.5 text-center font-mono text-foreground/80">{row.development}</TableCell>
                                <TableCell className="px-1.5 py-1.5 text-center font-mono text-foreground/80">{row.operations}</TableCell>
                                <TableCell className="px-1.5 py-1.5 text-center font-mono text-foreground/80">{row.architecture}</TableCell>
                                <TableCell className="px-1.5 py-1.5 text-center font-mono text-foreground/80">{row.innovation}</TableCell>
                                <TableCell className="px-1.5 py-1.5 text-center font-mono text-foreground/80">{row.data}</TableCell>
                                <TableCell className="px-1.5 py-1.5 text-center font-mono text-foreground/80">{row.security}</TableCell>
                                <TableCell className="px-1.5 py-1.5 text-center font-mono text-foreground/80">{row.management}</TableCell>
                                <TableCell className="px-1.5 py-1.5 text-center font-mono text-foreground/80">{Math.max(row.total - (row.development + row.operations + row.architecture + row.innovation + row.data + row.security + row.management), 0)}</TableCell>
                                <TableCell className="px-1.5 py-1.5 text-center">
                                  <span className="inline-flex min-w-[2.5rem] justify-center rounded-md bg-primary/10 px-2 py-1 font-mono text-[12px] font-bold text-primary">{row.total}</span>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      <div className="flex items-center justify-between border-t border-border/60 bg-card/80 px-3 py-1.5 text-[12px] text-muted-foreground">
                        <span>每页显示 6 条分行数据</span>
                        <div className="flex items-center gap-1.5" aria-label="科技人员数量分页">
                          {Array.from({ length: personnelPageCount }, (_, index) => {
                            const page = index + 1
                            const isActive = personnelPage === page
                            return (
                              <button
                                key={page}
                                type="button"
                                aria-label={`第 ${page} 页`}
                                aria-current={isActive ? "page" : undefined}
                                onClick={() => setPersonnelPage(page)}
                                className={`inline-flex size-5 items-center justify-center rounded-md text-[12px] font-semibold transition ${isActive ? "bg-primary text-foreground" : "bg-card text-muted-foreground ring-1 ring-border/80 hover:bg-primary/10"}`}
                              >
                                {page}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                      </div>}
                  </div>
                </PanelCard>
              </div>
              </div>
            </div>
        </section>
      </div>
    </main>
  )
}
