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
    techLevel: { level: "A类", score: 92, dimensions: [92, 88, 95, 90, 94, 86] },
    operationMetrics: [
      { label: "父系统数", value: 230, unit: "个", tone: "primary" },
      { label: "子系统数", value: 522, unit: "个", tone: "accent" },
      { label: "服务器主机数", value: 2299, unit: "台", tone: "primary" },
      { label: "网络设备数", value: 12460, unit: "个", tone: "accent" },
  { label: "分行办公终端数", value: 77343, unit: "个", tone: "chart-4" },
  { label: "专项数", value: 8075, unit: "条", tone: "chart-4" },
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
  { label: "专项数", value: 6490, unit: "条", tone: "chart-4" },
  { label: "存储数", value: 5892100, unit: "GB", tone: "primary" },
  { label: "CPU数", value: 4210, unit: "核", tone: "accent" },
    ],
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
  { label: "专项数", value: 5968, unit: "条", tone: "chart-4" },
  { label: "存储数", value: 4882100, unit: "GB", tone: "primary" },
  { label: "CPU数", value: 3510, unit: "核", tone: "accent" },
    ],
    innovation: { title: "年度计划数", value: 76, done: 60, remaining: 16 },
    cloud: { value: 24, total: 36, note: "广州分行上云与治理同步推进" },
    personnelTotal: 742,
    personnelDelta: "+4.8%",
    personnelRoles: [
      { label: "���发岗位", value: 160, tone: "primary" },
      { label: "运维岗位", value: 174, tone: "accent" },
      { label: "数据岗位", value: 108, tone: "chart-4" },
      { label: "架构岗位", value: 154, tone: "primary" },
      { label: "安全岗位", value: 56, tone: "accent" },
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
  { label: "专项数", value: 4511, unit: "条", tone: "chart-4" },
  { label: "存储数", value: 3568400, unit: "GB", tone: "primary" },
  { label: "CPU数", value: 2390, unit: "核", tone: "accent" },
    ],
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

for (const [key, label, grade, parentSystems, childSystems, cloudValue, planValue, personnelTotal] of additionalBranchData) {
  const source = branchData.nanjing
  const roleScale = personnelTotal / source.personnelTotal
  branchData[key] = {
    ...source,
    label,
    techLevel: { level: grade === "level-1" ? "A类" : grade === "level-2" ? "B类" : "C类", score: Math.round(76 + roleScale * 16), dimensions: [Math.round(70 + roleScale * 22), Math.round(68 + roleScale * 24), Math.round(72 + roleScale * 20), Math.round(65 + roleScale * 25), Math.round(74 + roleScale * 18), Math.round(69 + roleScale * 23)] },
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
    label: keys.length === 1 ? base.label : "筛选结果汇总",
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
      note: "当前筛选范围内系统上云进度",
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
      <span className="text-[15px] font-semibold tracking-wide">{title}</span>
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
        <div className="text-[11px] text-muted-foreground">{label}</div>
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
    <div className="rounded-[10px] px-2 py-2.5">
      <div className="flex items-start gap-2.5">
        <span className={cn("mt-1 h-2 w-2 rounded-full bg-gradient-to-r", className)} />
        <div className="min-w-0">
          <div className="text-[11px] text-foreground/75">{item.label}</div>
          <div className="mt-0.5 flex items-baseline gap-1.5">
            <span className="font-mono text-[18px] font-bold text-foreground">{item.value.toLocaleString()}</span>
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

function RingChart({ value, total, label }: { value: number; total: number; label: string }) {
  const percent = total > 0 ? Math.min((value / total) * 100, 100) : 0
  const dash = 283
  const offset = dash - (dash * percent) / 100

  return (
    <div className="relative h-[148px] w-[148px] shrink-0">
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
        <div className="text-[11px] text-muted-foreground">{label}</div>
        <div className="mt-1 font-mono text-[28px] font-black leading-none text-primary">{value}</div>
      </div>
      <div className="absolute right-1 top-2 text-[14px] text-muted-foreground">{Math.round(percent)}%</div>
    </div>
  )
}

function CloudCircle({ value }: { value: number }) {
  return (
    <div className="flex h-[148px] w-[148px] flex-col items-center justify-center rounded-full bg-gradient-to-br from-primary/15 via-accent/15 to-primary/5 shadow-[inset_0_0_0_10px_rgba(36,86,199,0.06),0_8px_20px_rgba(36,86,199,0.1)]">
      <Cloud className="mb-2 size-7 text-primary" aria-hidden="true" />
      <div className="font-mono text-[32px] font-black leading-none text-primary">{value}</div>
      <div className="mt-1 text-[11px] font-medium tracking-[0.12em] text-muted-foreground">上云系统数</div>
    </div>
  )
}

function GaugeMeter({ roomMode }: { roomMode: "central" | "disaster" }) {
  return (
    <div className="relative h-[118px] w-full max-w-[220px]">
      <svg viewBox="0 0 220 120" className="absolute inset-0 h-full w-full">
        <path d="M26 90 A84 84 0 0 1 194 90" fill="none" stroke="#d9e1ee" strokeWidth="10" strokeLinecap="round" />
        <path d="M26 90 A84 84 0 0 1 194 90" fill="none" stroke="url(#gaugeGrad)" strokeWidth="10" strokeLinecap="round" strokeDasharray="120 300" />
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2dc2be" />
            <stop offset="100%" stopColor="#f3c46b" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute left-1/2 top-[40%] -translate-x-1/2 text-center">
        <div className="text-[11px] text-muted-foreground">中心机房配套率</div>
        <div className="font-mono text-[24px] font-black text-primary">22.22%</div>
      </div>
      <div className="absolute left-[8px] bottom-3 text-[10px] text-muted-foreground">0</div>
<div className="absolute right-[8px] bottom-3 text-[10px] text-muted-foreground">40</div>
    </div>
  )
}

function RoleBar({ label, value, tone }: { label: string; value: number; tone: MetricTone }) {
  const maxValue = 250
  const width = Math.min((value / maxValue) * 100, 100)
  const fill =
    tone === "accent"
      ? "bg-gradient-to-r from-accent to-accent/80"
      : tone === "chart-4"
        ? "bg-gradient-to-r from-chart-4 to-chart-4/80"
        : "bg-gradient-to-r from-primary to-primary/80"

  return (
    <div className="grid gap-1.5">
      <div className="flex items-center justify-between gap-3 text-[12px]">
        <span className="truncate text-slate-700">{label}</span>
        <span className="font-mono font-bold text-primary">{value}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-[#e7edf8]">
        <div className={cn("h-full rounded-full", fill)} style={{ width: `${width}%` }} />
      </div>
    </div>
  )
}

function PanelCard({ title, icon, children, className }: { title: string; icon: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("h-full overflow-hidden rounded-xl border border-border/80 bg-card/90 shadow-[0_0_0_1px_oklch(0.72_0.15_220/6%),0_12px_40px_oklch(0_0_0/18%)] backdrop-blur-sm", className)}>
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
  const selected = rows.find((row) => row.key === selectedKey)?.data ?? rows[0]?.data
  const techLevel = selected?.techLevel ?? { level: "B类", score: 82, dimensions: [82, 78, 84, 80, 86, 76] }
  const points = techLevel.dimensions
  const dimensionLabels = ["基础设施", "安全能力", "数据治理", "应用研发", "运维管理", "创新能力"]
  const radarPoints = points.map((value, index) => {
    const angle = (Math.PI * 2 * index) / points.length - Math.PI / 2
    const radius = 18 + value * 0.42
    return `${80 + Math.cos(angle) * radius},${80 + Math.sin(angle) * radius}`
  }).join(" ")
  return (
    <PanelCard title="分行科技分级" icon={<Gauge className="size-4" />}>
      <div className="grid gap-3">
        <div className="rounded-lg border border-border/70 bg-background/40 p-2">
          <div className="flex justify-center">
            <svg viewBox="0 0 160 160" className="h-48 w-48" role="img" aria-label={`${selected?.label ?? "分行"}科技能力雷达图`}>
              {[30, 50, 70].map((radius) => <polygon key={radius} points={points.map((_, index) => { const angle = (Math.PI * 2 * index) / points.length - Math.PI / 2; return `${80 + Math.cos(angle) * radius},${80 + Math.sin(angle) * radius}` }).join(" ")} fill="none" stroke="currentColor" className="text-border" strokeWidth="1" />)}
              <polygon points={radarPoints} fill="rgba(45,194,190,0.28)" stroke="#2dc2be" strokeWidth="2" />
              {dimensionLabels.map((label, index) => { const angle = (Math.PI * 2 * index) / points.length - Math.PI / 2; const x = 80 + Math.cos(angle) * 72; const y = 80 + Math.sin(angle) * 72; return <text key={label} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-[6px] font-medium">{label}</text> })}
              <text x="80" y="76" textAnchor="middle" className="fill-primary font-mono text-[20px] font-bold">{techLevel.score}</text>
              <text x="80" y="92" textAnchor="middle" className="fill-muted-foreground text-[8px]">综合评分</text>
            </svg>
          </div>
          <div className="text-center text-[11px] text-muted-foreground">{selected?.label ?? "当前分行"} · {techLevel.level}</div>
        </div>
        <div className="overflow-hidden rounded-lg border border-border/70">
          <Table className="text-[11px]">
            <TableHeader className="bg-primary/10"><TableRow><TableHead>分行名称</TableHead><TableHead>科技等级</TableHead><TableHead className="text-right">综合评分</TableHead></TableRow></TableHeader>
            <TableBody>{rows.map(({ key, data }) => <TableRow key={key} onClick={() => onSelect(key)} className={cn("cursor-pointer", key === selectedKey && "bg-primary/10") }><TableCell className="py-2 font-medium">{data.label}</TableCell><TableCell className="py-2">{data.techLevel?.level ?? "B类"}</TableCell><TableCell className="py-2 text-right font-mono font-bold text-primary">{data.techLevel?.score ?? 82}</TableCell></TableRow>)}</TableBody>
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
  const [techSelectedKey, setTechSelectedKey] = useState("nanjing")
  const personnelPageSize = 6

  useEffect(() => {
    setSelectedBranch("all")
    setPersonnelPage(1)
  }, [selectedGrade])

  useEffect(() => {
    setPersonnelPage(1)
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
    .map((row) => ({ name: row.name, count: row.innovation, rate: row.total ? Math.round((row.innovation / row.total) * 100) : 0 }))
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
  const techRows = filteredKeys.map((key) => ({ key, data: branchData[key] }))
  const activeTechKey = techRows.some((row) => row.key === techSelectedKey) ? techSelectedKey : techRows[0]?.key ?? "nanjing"

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

            <div className="grid min-w-0 items-stretch gap-3 lg:grid-cols-[minmax(280px,0.42fr)_minmax(0,0.58fr)]">
              <TechLevelPanel rows={techRows} selectedKey={activeTechKey} onSelect={setTechSelectedKey} />

              <div className="grid min-w-0 gap-3 xl:grid-cols-1 xl:items-start">
              <PanelCard className="h-full" title="运维指标" icon={<Gauge className="size-4" />}>
                <div className="grid gap-y-1">
                  <div className="grid gap-x-2 md:grid-cols-3">
                    {current.operationMetrics.slice(0, 2).map((item) => <MetricTile key={item.label} item={item} />)}
                  </div>
                  <div className="grid gap-x-2 md:grid-cols-3">
                    {current.operationMetrics.slice(2, 5).map((item) => <MetricTile key={item.label} item={item} />)}
                  </div>
                  <div className="grid gap-x-2 md:grid-cols-3">
                    {current.operationMetrics.slice(5, 8).map((item) => <MetricTile key={item.label} item={item} />)}
                  </div>
                </div>

                <div className="mt-2 border-t border-dashed border-border/70 pt-3">

                  <div className="mt-3 grid gap-3 grid-cols-1">
                    <div onClick={(event) => { if ((event.target as HTMLElement).closest("button")) return; setRoomDetails((value) => !value) }} className="cursor-pointer rounded-[12px] border border-border/80 bg-card/80 px-3 py-3 shadow-[inset_0_1px_0_oklch(0.72_0.15_220/6%)]">
                      <div className="mb-2 text-[11px] text-muted-foreground">点击查看{selectedScopeLabel}中心机房建设模式及详情。</div>
                      <button type="button" onClick={() => setRoomDetails(!roomDetails)} className="mb-2 flex w-full items-center gap-2 text-left text-[12px] font-semibold text-slate-700 hover:text-primary">
                        <span className="inline-flex size-2 rounded-full bg-[#2456c7]" />共{detailRows.length}家分行纳入当前筛选范围
                      </button>
                      {roomDetails ? <div className="overflow-x-auto">
                        <table className="w-full min-w-[300px] text-left text-[11px]">
                          <thead className="text-muted-foreground"><tr><th className="pb-2 font-medium">分行名称</th><th className="pb-2 font-medium">中心机房建设方式</th><th className="pb-2 font-medium">启用时间</th></tr></thead>
                          <tbody>{detailRows.map((row, index) => <tr key={row.name} className="border-t border-border/50"><td className="py-1.5">{row.name}</td><td className="py-1.5">{index % 4 === 0 ? "租赁" : "自建"}</td><td className="py-1.5 font-mono">{2021 + (index % 4)}年</td></tr>)}</tbody>
                        </table>
                      </div> : <button type="button" onClick={() => setRoomDetails(true)} className="flex w-full items-center gap-3 text-left">
                        <div className="relative h-[98px] w-[122px] shrink-0"><svg viewBox="0 0 120 120" className="h-full w-full -rotate-90"><circle cx="60" cy="60" r="42" fill="none" stroke="#d9e1ee" strokeWidth="10" /><circle cx="60" cy="60" r="42" fill="none" stroke="#2456c7" strokeWidth="10" strokeLinecap="round" strokeDasharray="259 300" /><circle cx="60" cy="60" r="42" fill="none" stroke="#2dc2be" strokeWidth="10" strokeLinecap="round" strokeDasharray="41 300" strokeDashoffset="259" /></svg><div className="absolute inset-0 flex flex-col items-center justify-center text-center"><div className="font-mono text-[20px] font-black text-primary">{detailRows.length}</div><div className="text-[10px] text-slate-500">中心机房</div></div></div>
                        <div className="grid gap-2 text-[12px] text-foreground/75"><div><span className="mr-2 inline-flex size-2 rounded-full bg-[#2456c7]" />自建 <span className="font-mono text-primary">{Math.max(0, detailRows.length - 1)}</span></div><div><span className="mr-2 inline-flex size-2 rounded-full bg-[#2dc2be]" />租赁 <span className="font-mono text-primary">{detailRows.length ? 1 : 0}</span></div></div>
                      </button>}
                      <div className="mt-3 flex items-center justify-between rounded-[10px] border border-border/70 bg-background/70 px-3 py-2"><span className="text-[14px] font-bold text-muted-foreground">机柜数</span><span className="font-mono text-[14px] font-black text-primary">{(current.personnelTotal * 2).toLocaleString()} <small className="text-[11px] font-normal text-muted-foreground">个</small></span></div>
                    </div>

                    <div onClick={(event) => { if ((event.target as HTMLElement).closest("button")) return; setDisasterDetails((value) => !value) }} className="cursor-pointer grid gap-2 rounded-[12px] border border-border/80 bg-card/80 px-3 py-3 shadow-[inset_0_1px_0_oklch(0.72_0.15_220/6%)]">
                      <div className="text-[11px] text-muted-foreground">点击查看{selectedScopeLabel}中心机房建设模式及详情。</div>
                      <button type="button" onClick={() => setDisasterDetails(!disasterDetails)} className="w-full text-left text-[12px] font-semibold text-slate-700 transition-colors hover:text-primary">
                        <span className="mr-2 inline-flex size-2 rounded-full bg-[#2dc2be]" />其中{detailRows.length}家分行配备灾备机房
                      </button>
                      {disasterDetails ? <div className="grid gap-2 py-1 text-[11px] text-foreground/80"><div className="font-semibold text-primary">配备灾备机房的分行</div>{detailRows.map((row) => <div key={row.name} className="flex items-center justify-between border-t border-border/50 py-1.5"><span>{row.name}</span><span className="text-muted-foreground">已配备</span></div>)}</div> : <button type="button" onClick={() => setRoomMode(roomMode === "central" ? "disaster" : "central")} className="flex items-center justify-center" aria-label="查看灾备机房配套率"><GaugeMeter roomMode={roomMode} /></button>}
                    </div>
                  </div>

                </div>
              </PanelCard>

              <div className="grid min-w-0 gap-2">
                <div className="grid min-w-0 items-stretch gap-2 md:grid-cols-2 md:[&>*]:min-w-0">
                  <PanelCard className="h-full cursor-pointer" bodyClassName="p-3" title="信创改造" icon={<ShieldCheck className="size-4" />} onClick={() => setInnovationRanking((value) => !value)}>
                    <button type="button" onClick={(event) => { event.stopPropagation(); setInnovationRanking((value) => !value) }} className="w-full text-left" aria-label="切换信创改造完成度排行">
                    {innovationRanking ? <div className="py-1">
                      <ResponsiveContainer width="100%" height={210} minWidth={1} minHeight={1}>
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
                      <div className="text-center text-[10px] text-muted-foreground">信创部改造前十名完成度</div>
                    </div> : <div className="flex items-center justify-between gap-3">
                      <div className="flex flex-1 items-center justify-center">
                        <RingChart value={current.innovation.done} total={current.innovation.value} label="已完成" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between text-[12px] text-slate-600">
                          <span>已完成</span>
                          <span className="font-mono text-[22px] font-black text-primary">{current.innovation.done}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-[#e7edf8]">
                          <div className="h-full rounded-full bg-gradient-to-r from-[#2456c7] to-[#2dc2be]" style={{ width: `${(current.innovation.done / current.innovation.value) * 100}%` }} />
                        </div>
                        <div className="flex items-center justify-between text-[12px] text-slate-600">
                          <span>未完成</span>
                          <span className="font-mono text-[22px] font-black text-primary">{current.innovation.remaining}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-[#e7edf8]">
                          <div className="h-full rounded-full bg-gradient-to-r from-[#2dc2be] to-[#86e1de]" style={{ width: `${(current.innovation.remaining / current.innovation.value) * 100}%` }} />
                        </div>
                      </div>
                    </div>}
                    </button>
                    {!innovationRanking && <><div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-[#2456c7]" />已完成信创改造
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-[#2dc2be]" />未完成信创改造
                      </div>
                    </div>
                    <div className="mt-2 text-center text-[11px] text-slate-500">单击可查看信创改造完成度排序十名。</div></>}
                  </PanelCard>

                  <PanelCard className="h-full" bodyClassName="p-3" title="系统上云" icon={<Cloud className="size-4" />} onClick={() => setCloudRanking((value) => !value)}>
                    <button type="button" onClick={(event) => { event.stopPropagation(); setCloudRanking((value) => !value) }} className="w-full text-left" aria-label="切换上云系统前十名">
                    {cloudRanking ? <div className="grid gap-2 py-1">{cloudRows.map(({ name, count }, index) => <div key={name} className="grid grid-cols-[1.2fr_1fr_auto] items-center gap-2 text-[11px]"><span>{String(index + 1).padStart(2, "0")} {name}</span><span className="h-2 rounded-full bg-gradient-to-r from-accent to-primary" style={{ width: `${Math.max(20, Number(count) / Math.max(cloudRows[0]?.count ?? 1, 1) * 100)}%` }} /><strong className="font-mono text-primary">{count}</strong></div>)}</div> : <div className="flex flex-col items-center gap-2">
                      <CloudCircle value={current.cloud.value} />
                      <div className="text-center text-[12px] text-slate-500">{current.cloud.note}</div>
                      <div className="text-center text-[11px] text-muted-foreground">单击可查看上云系统前十名。</div></div>}
                    </button>
                  </PanelCard>
                </div>

                <PanelCard className="min-w-0 h-full" bodyClassName="min-w-0 p-3" title="科技人员数量" icon={<UsersRound className="size-4" />}>
                  <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] xl:[&>*]:min-w-0">
                    <div className="space-y-4">
                      <div className="rounded-[12px] border border-border/80 bg-card/80 px-4 pt-[19px] pb-[22px] shadow-[inset_0_1px_0_oklch(0.72_0.15_220/6%)]">
                        <div className="text-[12px] text-foreground/80">科技人员总数</div>
                        <div className="mt-2 flex items-end gap-2">
                          <span className="font-mono text-[34px] font-black leading-none text-primary">{current.personnelTotal}</span>
                          <span className="pb-1 text-[14px] text-muted-foreground">人</span>
                        </div>
                      </div>

                      <div className="rounded-[12px] border border-border/80 bg-card/80 px-4 py-4 shadow-[inset_0_1px_0_oklch(0.72_0.15_220/6%)]">
                        <div className="grid gap-3">
                          {current.personnelRoles.map((role) => (
                            <RoleBar key={role.label} label={role.label} value={role.value} tone={role.tone} />
                          ))}
                        </div>
                      </div>
                    </div>

<div className="min-w-0 overflow-hidden rounded-[12px] border border-border/80 bg-card/80 shadow-[inset_0_1px_0_oklch(0.72_0.15_220/6%)]">
	<div className="block w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain [WebkitOverflowScrolling:touch]">
                          <Table className="w-full min-w-[860px] table-fixed text-sm">
                          <TableHeader className="bg-gradient-to-r from-primary via-primary to-accent">
                            <TableRow className="border-transparent hover:bg-transparent">
                              <TableHead className="px-3 py-3 text-[12px] font-semibold text-foreground">分行名称</TableHead>
                              <TableHead className="px-3 py-3 text-center text-[12px] font-semibold text-foreground">研发</TableHead>
                              <TableHead className="px-3 py-3 text-center text-[12px] font-semibold text-foreground">运维</TableHead>
                              <TableHead className="px-3 py-3 text-center text-[12px] font-semibold text-foreground">架构</TableHead>
                              <TableHead className="px-3 py-3 text-center text-[12px] font-semibold text-foreground">创新</TableHead>
                              <TableHead className="px-3 py-3 text-center text-[12px] font-semibold text-foreground">数据</TableHead>
                              <TableHead className="px-3 py-3 text-center text-[12px] font-semibold text-foreground">安全</TableHead>
                              <TableHead className="px-3 py-3 text-center text-[12px] font-semibold text-foreground">管理</TableHead>
                              <TableHead className="px-3 py-3 text-center text-[12px] font-semibold text-foreground">干部</TableHead>
                              <TableHead className="px-3 py-3 text-center text-[12px] font-semibold text-foreground">总数</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {personnelRows.map((row, index) => (
                              <TableRow key={row.name} className={cn("border-border/60 hover:bg-primary/5", index % 2 === 1 && "bg-primary/3")}>
                                <TableCell className="px-3 py-3 font-medium text-foreground/90">{row.name}</TableCell>
                                <TableCell className="px-3 py-3 text-center font-mono text-foreground/80">{row.development}</TableCell>
                                <TableCell className="px-3 py-3 text-center font-mono text-foreground/80">{row.operations}</TableCell>
                                <TableCell className="px-3 py-3 text-center font-mono text-foreground/80">{row.architecture}</TableCell>
                                <TableCell className="px-3 py-3 text-center font-mono text-foreground/80">{row.innovation}</TableCell>
                                <TableCell className="px-3 py-3 text-center font-mono text-foreground/80">{row.data}</TableCell>
                                <TableCell className="px-3 py-3 text-center font-mono text-foreground/80">{row.security}</TableCell>
                                <TableCell className="px-3 py-3 text-center font-mono text-foreground/80">{row.management}</TableCell>
                                <TableCell className="px-3 py-3 text-center font-mono text-foreground/80">{Math.max(row.total - (row.development + row.operations + row.architecture + row.innovation + row.data + row.security + row.management), 0)}</TableCell>
                                <TableCell className="px-3 py-3 text-center">
                                  <span className="inline-flex min-w-[2.5rem] justify-center rounded-md bg-primary/10 px-2.5 py-1 font-mono text-[12px] font-bold text-primary">{row.total}</span>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      <div className="flex items-center justify-between border-t border-border/60 bg-card/80 px-4 py-2.5 text-[11px] text-muted-foreground">
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
                                className={`inline-flex size-5 items-center justify-center rounded-md text-[11px] font-semibold transition ${isActive ? "bg-primary text-foreground" : "bg-card text-muted-foreground ring-1 ring-border/80 hover:bg-primary/10"}`}
                              >
                                {page}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </PanelCard>
              </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
