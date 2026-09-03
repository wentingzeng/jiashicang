"use client"

import type { ReactNode } from "react"
import { useEffect, useMemo, useState } from "react"
import useSWR from "swr"
import { HeroBanner } from "@/components/dashboard/hero-banner"
import {
  AlertTriangle,
  CheckCircle2,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
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
import { geoMercator } from "d3-geo"

import {
  securityApi,
  toCapabilityData,
  toIndicatorLabels,
  toProblemData,
  toTrainingData,
  toViolationData,
  toFujianCityData,
  toRankingBranches,
  toRepairRate,
  toTotalProblems,
  normalizeRatio,
  type BranchScore,
  type SecurityNetworkCapabilityDetail,
  type SecurityNetworkCapabilityCategory,
  type SecurityIndicator,
  type InspectionProblem,
  type BranchRanking,
  type TrainingStat,
} from "@/lib/security-api"

// 省级 GeoJSON：包含 34 个省级行政区，确保每个省份都有独立边界和点击区域。托管在本地以避免外部请求被拦截。
// 注意：不要切换为"_full"版本的数据源——它在每个省份要素中都内嵌了一份用于南海诸岛示意框的固定像素坐标，
// 这些坐标不是真实经纬度，一旦参与地理投影会导致全部省份坐标计算错乱、整张地图不可见。
// 南海诸岛改为下方的装饰性小图（SouthSeaIslandsInset）单独绘制，不再依赖地图数据源本身。
 const chinaMapUrl = "/maps/china-provinces.json"
 const fujianMapUrl = "/maps/fujian-cities.json"


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
  compact = false,
}: {
  label: string
  value: string | number
  unit: string
  icon: typeof ShieldCheck
  color?: string
  compact?: boolean
}) {
  return (
  <div className={["rounded-xl border border-border/60 bg-gradient-to-br from-background/60 via-card/80 to-background/45 shadow-[0_8px_20px_rgba(16,30,46,0.16)]", compact ? "flex items-center justify-between gap-2 px-2 py-1.5" : "px-4 py-3"].join(" ")}>
      <div className={["flex items-center gap-1.5 text-muted-foreground", compact ? "mb-0 text-sm" : "mb-2 text-xs"].join(" ")}>
        <Icon className={compact ? "size-3" : "size-4"} style={{ color }} />
        <span>{label}</span>
      </div>

      <div className="flex items-baseline gap-1.5">
        <strong
          className={compact ? "font-mono text-lg font-semibold tracking-tight tabular-nums" : "font-mono text-2xl font-semibold tracking-tight tabular-nums"}
          style={{ color }}
        >
          {value}
        </strong>
        <span className={compact ? "text-[10px] text-muted-foreground" : "text-xs text-muted-foreground"}>{unit}</span>
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
  data: { name: string; value: number }[]
  color: string
  label: string
  height?: number
}) {
  const maxValue = Math.max(...data.map((item) => item.value), 1)

  return (
    <div className="flex flex-col rounded-lg border border-border/50 bg-background/20 px-2 pb-2 pt-2" style={{ height: `${height}px` }}>
      <div className="mb-1 flex h-5 shrink-0 items-center justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className="font-mono text-[10px]">单位：人次</span>
      </div>
      <div className="flex min-h-0 flex-1 items-end gap-1.5 overflow-x-auto pb-1">
        {data.map((item) => {
          const barHeight = Math.max((item.value / maxValue) * (height - 80), 8)
          return (
            <div key={item.name} className="group flex w-10 shrink-0 flex-col items-center justify-end gap-1" title={`${item.name}：${item.value.toLocaleString()}人次`}>
              <span className="whitespace-nowrap font-mono text-[9px] text-muted-foreground opacity-100">{item.value.toLocaleString()}</span>
              <div className="w-full rounded-t-md transition-all group-hover:brightness-110" style={{ height: `${barHeight}px`, minHeight: 8, background: `linear-gradient(180deg, ${color}, ${color}99)` }} />
              <span className="max-w-[3.5rem] truncate text-[10px] text-muted-foreground">{item.name.replace("分行", "")}</span>
            </div>
          )
        })}
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
<div className="rounded-lg border border-border/50 bg-background/20 px-3 pb-3 pt-[26px]">
                      <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span>单位：分</span>
      </div>
      <div className="flex flex-col gap-2.5" style={{ minHeight: height }}>
        {data.map((item, index) => (
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

function CompactDetailTable({ rows, headers, className = "", height = 204 }: { rows: string[][]; headers: string[]; className?: string; height?: number }) {
  return <div className={`overflow-hidden rounded-lg border border-border/50 bg-card text-[8px] shadow-sm ${className}`} style={{ height, maxHeight: height }}><div className="h-full min-h-0 overflow-y-auto overflow-x-hidden"><table className="w-full table-fixed border-separate border-spacing-0 text-left"><thead><tr>{headers.map((header, index) => <th key={header} className={`sticky top-0 z-30 border-b border-primary/20 px-2 py-1.5 font-semibold ${index === 0 ? "w-[78%] bg-card text-foreground" : "w-[22%] bg-primary text-primary-foreground text-center"}`}>{header}</th>)}</tr></thead><tbody className="divide-y divide-border/30">{rows.map((row, index) => <tr key={index} className={index % 2 ? "bg-muted/20" : "bg-card/40"}>{row.map((cell, cellIndex) => <td key={cellIndex} className={`${cellIndex === 0 ? "whitespace-normal text-foreground" : "text-center font-mono font-semibold text-primary"} px-2 py-2 leading-4`}>{cell}</td>)}</tr>)}</tbody></table></div></div>
}

function getBranchScore(item: Record<string, unknown>, ...keys: string[]) {
  const normalized = Object.entries(item).reduce<Record<string, unknown>>((result, [key, value]) => {
    result[key.replace(/[_-]/g, "").toLowerCase()] = value
    return result
  }, {})
  for (const key of keys) {
    const normalizedKey = key.replace(/[_-]/g, "").toLowerCase()
    const matchedKey = Object.keys(normalized).find((candidate) => candidate === normalizedKey || candidate.startsWith(normalizedKey) || candidate.endsWith(normalizedKey))
    const value = matchedKey ? normalized[matchedKey] : undefined
    if (value !== undefined && value !== null && value !== "") {
      const parsed = Number(String(value).replace(/[%人次分]/g, ""))
      if (Number.isFinite(parsed)) return parsed
    }
  }
  return 0
}

function CapabilityBars({ data, label, selectedInstitutionType }: { data: { name: string; value: number; rankByAllBranches?: number | null; rankByBranchLevel?: number | null; branchLevel?: string; [key: string]: unknown }[]; label: string; selectedInstitutionType: string }) {
  const [selectedBranch, setSelectedBranch] = useState<string | null>(selectedInstitutionType === "全部机构" ? null : selectedInstitutionType)
  const [showAll, setShowAll] = useState(true)
  useEffect(() => {
  setSelectedBranch(selectedInstitutionType === "全部机构" ? null : selectedInstitutionType)
  setShowAll(selectedInstitutionType === "全部机构")
  }, [selectedInstitutionType, data])
  const metrics = data.map((item) => ({
    ...item,
    value: Number(item.totalScore ?? item.value ?? 0),
    responsibility: Number(item.securityResourceScore ?? getBranchScore(item, "securityResourceScore")),
    notification: Number(item.cybersecurityAssessmentScore ?? getBranchScore(item, "cybersecurityAssessmentScore")),
    risk: Number(item.cybersecurityInspectionScore ?? getBranchScore(item, "cybersecurityInspectionScore")),
    research: Number(item.employeeSecurityScore ?? getBranchScore(item, "employeeSecurityScore")),
    integrated: Number(item.personalInformationScore ?? getBranchScore(item, "personalInformationScore")),
    highlights: Number(item.securityInnovationScore ?? getBranchScore(item, "securityInnovationScore")),
    deductions: Number(item.securityIncidentScore ?? getBranchScore(item, "securityIncidentScore")),
  }))
  const rankedMetrics = [...metrics].sort((a, b) => b.value - a.value)
  const visibleMetrics = selectedBranch || showAll ? rankedMetrics : [...rankedMetrics.slice(0, 3), ...rankedMetrics.slice(-3)]
  const topMetrics = rankedMetrics.slice(0, 3)
  const bottomMetrics = rankedMetrics.slice(-3)
  const renderBar = (item: typeof metrics[number]) => <button key={item.name} type="button" onClick={() => setSelectedBranch(item.name)} className="grid w-full grid-cols-[72px_1fr_42px] items-center gap-2 text-left text-[10px] hover:bg-primary/5"><span className="truncate text-muted-foreground">{item.name.replace("分行", "")}</span><span className="h-3 overflow-hidden rounded-full bg-primary/10"><span className="block h-full rounded-full bg-gradient-to-r from-[#4ba8d8] to-[#42bdb7]" style={{ width: `${item.value}%` }} /></span><span className="text-right font-mono tabular-nums text-foreground">{item.value.toFixed(2)}</span></button>
    return <div className="flex h-full min-h-0 flex-col rounded-lg border border-border/50 bg-background/20 p-3"><div className="mb-3 flex items-center justify-between text-xs text-muted-foreground"><span className="text-sm font-medium text-foreground/80">{label}</span>{selectedBranch ? <span>点击分行查看各项得分</span> : <button type="button" onClick={() => setShowAll(!showAll)} className="text-sm font-medium text-primary transition-colors hover:underline">{showAll ? "" : "点击查看全部分行"}</button>}</div>{selectedBranch ? <div className="flex min-h-0 flex-1 flex-col overflow-hidden"><div className="mb-2 flex shrink-0 items-center justify-between rounded-lg border border-primary/15 bg-primary/5 px-3 py-2"><span className="text-xs font-semibold text-foreground">{selectedBranch} · 各项得分</span><button type="button" onClick={() => { setSelectedBranch(null); setShowAll(true) }} className="rounded-md border border-primary/20 bg-card px-2 py-1 text-[10px] font-medium text-primary transition-colors hover:bg-primary/10">返回总览</button></div><div className="min-h-0 flex-1 overflow-y-auto overscroll-contain rounded-xl"><CompactDetailTable height={500} className="rounded-xl bg-card/90 text-[11px] shadow-md" headers={["指标", "得分"]} rows={(() => { const item = metrics.find((entry) => entry.name === selectedBranch); return item ? [["网络安全综合能力总分", item.value.toFixed(2)], ["安全资源保障能力", item.responsibility.toFixed(2)], ["网络安全考评", item.notification.toFixed(2)], ["网络安全检查", item.risk.toFixed(2)], ["员工安全管理能力", item.research.toFixed(2)], ["个人信息保护能力", item.integrated.toFixed(2)], ["安全创新能力（加分项）", item.highlights.toFixed(2)], ["安全事件（扣分项）", item.deductions.toFixed(2)]] : []})()} /></div></div> : <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">{showAll ? <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden"><div className="mb-1 shrink-0 text-[10px] text-muted-foreground">全部分行综合能力</div><div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">{rankedMetrics.map((item, index) => <button key={item.name} type="button" onClick={() => setSelectedBranch(item.name)} className="grid w-full grid-cols-[20px_72px_1fr_42px] items-center gap-2 py-2.5 text-left text-[11px] hover:bg-primary/5"><span className="font-mono text-muted-foreground">{String(index + 1).padStart(2, "0")}</span><span className="truncate text-foreground/80">{item.name.replace("分行", "")}</span><span className="h-2 overflow-hidden rounded-full bg-primary/10"><span className="block h-full rounded-full bg-gradient-to-r from-[#4ba8d8] to-[#42bdb7]" style={{ width: `${item.value}%` }} /></span><strong className="text-right font-mono tabular-nums text-foreground">{item.value.toFixed(2)}</strong></button>)}</div></div> : <div className="space-y-2">
<div><div className="mb-1 text-sm font-bold tracking-wide text-primary">前三名：</div><div className="space-y-1.5">{topMetrics.map(renderBar)}</div></div><div><div className="mb-1 text-sm font-bold tracking-wide text-primary">后三名：</div><div className="space-y-1.5">{bottomMetrics.map(renderBar)}</div></div></div>}</div>} </div>
/* legacy chart body removed */
/*<span><i className="mr-1 inline-block size-2 rounded-sm bg-[#42bdb7]" />责任落实</span><span><i className="mr-1 inline-block size-2 rounded-sm bg-[#e5b45c]" />通知部署</span><span><i className="mr-1 inline-block size-2 rounded-sm bg-[#8494d8]" />隐患整改</span></div><ResponsiveContainer width="100%" height={230}><BarChart data={metrics} margin={{ top: 8, right: 4, left: -18, bottom: 8 }}><CartesianGrid vertical={false} strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 9 }} tickFormatter={(value) => value.replace("分行", "")} interval={0} /><YAxis domain={[0, 100]} tick={{ fontSize: 9 }} /><Tooltip content={({ active, payload, label }) => active && payload?.length ? <div className="rounded-lg border border-border/50 bg-card/95 px-2 py-1.5 text-[9px] shadow-md"><div className="mb-1 font-medium text-foreground">{label}</div>{payload.map((entry) => <div key={String(entry.dataKey)} className="flex items-center justify-between gap-3 leading-4"><span className="max-w-44 truncate text-muted-foreground">{entry.name}</span><strong className="font-mono text-foreground">{Number(entry.value).toFixed(1)}</strong></div>)}</div> : null} /><Bar dataKey="value" name="全年合计得分" fill="#4ba8d8" radius={[3, 3, 0, 0]} /><Bar dataKey="responsibility" name="压����压实网络安全责任" fill="#42bdb7" radius={[3, 3, 0, 0]} /><Bar dataKey="notification" name="重要通知和工作部署落实情况及个人信�����保护" fill="#e5b45c" radius={[3, 3, 0, 0]} /><Bar dataKey="risk" name="及���发现及整改网络安全风险隐患" fill="#8494d8" radius={[3, 3, 0, 0]} /></BarChart></ResponsiveContainer></>}</div>
*/
}

function CategoryBars({ data, label, color = "#42bdb7" }: { data: { name: string; value: number }[]; label: string; color?: string }) {
  return <div className="rounded-lg border border-border/50 bg-background/20 p-3"><div className="mb-3 text-sm font-medium text-foreground/80">{label}</div><div className="grid grid-cols-4 gap-2">{data.map((item, index) => <div key={item.name} className="flex items-center justify-between gap-2 rounded-md border border-border/40 bg-card/50 px-2.5 py-1.5"><div className="flex min-w-0 items-center gap-2"><span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: index % 2 ? color : "#4ba8d8" }} /><span className="truncate text-sm text-foreground/80">{item.name}</span></div><div className="font-mono text-xl font-bold leading-none text-foreground">{item.value}</div></div>)}</div></div>
}

function AssessmentBars({ data }: { data: { name: string; value: number; [key: string]: unknown }[] }) {
  // 该面板对应 security_branch_scores 表（网络安全考评），排名与展开条目均按
  // annualTotalScore（网络安全全年合计总分）排序和展示，各分项使用该表的真实字段名。
  const sorted = [...data]
    .map((item) => ({
      ...item,
      shortName: item.name.replace("分行", ""),
      responsibilityScore: getBranchScore(item, "networkSecurityResponsibility"),
      notificationScore: getBranchScore(item, "notificationAndPersonalInfo"),
      riskScore: getBranchScore(item, "riskDiscoveryAndRectification"),
      developmentScore: getBranchScore(item, "developmentSecurity"),
      integratedScore: getBranchScore(item, "integratedSecurityOperations"),
      highlightsScore: getBranchScore(item, "branchHighlightsAndContribution"),
      deductionsScore: getBranchScore(item, "otherDeductions"),
      totalScore: Number(item.value ?? item.annualTotalScore ?? 0),
    }))
    .sort((a, b) => b.totalScore - a.totalScore)
  const [details, setDetails] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null)
  const selected = sorted.find((item) => item.name === selectedBranch)
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col rounded-xl border border-border/50 bg-card/30 p-2">
      <div className="mb-1 flex shrink-0 items-center justify-between">
        <span className="text-[11px] text-muted-foreground">点击分行查看各项考评得分</span>
        <button type="button" onClick={() => { setDetails(!details); setSelectedBranch(null) }} className="text-[11px] text-muted-foreground transition-colors hover:text-primary">
          {details ? "返回总览" : "查看完整排名"}
        </button>
      </div>
      {selected ? (
        <div className="min-h-0 flex-1 overflow-y-auto rounded-xl border border-border/50 bg-card shadow-md p-2">
          <div className="mb-2 flex items-center justify-between rounded-lg border border-primary/15 bg-primary/5 px-3 py-2">
            <span className="text-sm font-semibold text-foreground">{selected.name} · 各项得分</span>
            <button type="button" onClick={() => setSelectedBranch(null)} className="rounded-md border border-primary/20 bg-card px-2 py-1 text-[10px] font-medium text-primary">返回考评</button>
          </div>
          <CompactDetailTable height={180} className="rounded-xl bg-card/90 text-[11px] shadow-md" headers={["考评项目", "得分"]} rows={[["压实网络安全责任", selected.responsibilityScore.toFixed(2)], ["网络安全重要通知和工作部署落实情况及个人信息保护", selected.notificationScore.toFixed(2)], ["及时发现及整改网络安全风险隐患", selected.riskScore.toFixed(2)], ["研发安全", selected.developmentScore.toFixed(2)], ["总分行一体化安全运营落实情况", selected.integratedScore.toFixed(2)], ["分行网络安全工作亮点、集团贡献情况", selected.highlightsScore.toFixed(2)], ["其他扣分项", selected.deductionsScore.toFixed(2)], ["网络安全全年合计总分", selected.totalScore.toFixed(2)]]} />
        </div>
      ) : details ? (
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain rounded-xl border border-border/50 bg-card shadow-md">
          <table className="w-full border-separate border-spacing-0 text-left text-[11px]"><thead className="sticky top-0 z-30 bg-primary text-primary-foreground"><tr><th className="w-16 px-3 py-2 font-semibold">排名</th><th className="px-3 py-2 font-semibold">分行</th><th className="w-24 px-3 py-2 text-right font-semibold">考评得分</th></tr></thead><tbody className="divide-y divide-border/30">{sorted.map((item, index) => <tr key={item.name} className={index % 2 ? "bg-muted/20" : "bg-card/40"}><td className="px-3 py-2 font-mono text-muted-foreground">{String(index + 1).padStart(2, "0")}</td><td className="px-3 py-2 text-foreground">{item.name}</td><td className="px-3 py-2 text-right font-mono text-[11px] font-normal text-primary">{item.value.toFixed(2)}</td></tr>)}</tbody></table>
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto rounded-lg border border-border/50 bg-background/20 px-3 py-2"><div className="flex flex-col gap-2.5">{sorted.map((item) => <button type="button" key={item.name} onClick={() => setSelectedBranch(item.name)} className="grid w-full grid-cols-[4.5rem_1fr_3.5rem] items-center gap-2 text-left hover:bg-primary/5"><span className="truncate text-[11px] text-muted-foreground" title={item.name}>{item.shortName}</span><div className="h-3 overflow-hidden rounded-full bg-muted/60"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.max((item.value / 100) * 100, 4)}%` }} /></div><span className="text-right font-mono text-[11px] font-semibold text-primary">{item.value.toFixed(2)}分</span></button>)}</div></div>
      )}
    </div>
  )
}

// 城市/分行名称 -> 省级行政区映射，覆盖全国主要城市，确保每个分行都能在地图上正确着色。
const CITY_TO_PROVINCE: Record<string, string> = {
  北京: "北京",
  天津: "天津",
  上海: "上海",
  重庆: "重庆",
  石家庄: "河北",
  唐山: "河北",
  太原: "山西",
  大同: "山西",
  呼和浩特: "内蒙古",
  包头: "内蒙古",
  沈阳: "辽宁",
  大连: "辽宁",
  长春: "吉林",
  哈尔滨: "黑龙江",
  南京: "江苏",
  苏州: "江苏",
  无锡: "江苏",
  杭州: "浙江",
  宁波: "浙江",
  温州: "浙江",
  合肥: "安徽",
  芜湖: "安徽",
  福州: "福建",
  厦门: "福建",
  泉州: "福建",
  南昌: "江西",
  济南: "山东",
  青岛: "山��",
  烟台: "山东",
  郑州: "河南",
  洛阳: "河南",
  武汉: "湖北",
  宜昌: "湖北",
  长沙: "湖南",
  广州: "广东",
  深圳: "广东",
  珠海: "广东",
  东莞: "广东",
  佛山: "广东",
  南宁: "广西",
  桂林: "广西",
  海口: "海南",
  三亚: "海南",
  成都: "四川",
  绵阳: "四川",
  贵阳: "贵州",
  昆明: "��南",
  拉萨: "西藏",
  西安: "陕西",
  兰州: "甘肃",
  西宁: "青海",
  银川: "宁夏",
  乌鲁木齐: "新疆",
  香港: "香港",
  澳门: "澳门",
  台北: "台湾",
}

const branchProvinceMap: Record<string, string> = Object.fromEntries(
  Object.entries(CITY_TO_PROVINCE).map(([city, province]) => [`${city}分行`, province]),
)

function ChinaSecurityMap({ data, selectedInstitutionType, fujianCityScores, assessmentYear, onDrillChange }: { data: { name: string; value: number; rankByAllBranches?: number | null; rankByBranchLevel?: number | null; branchLevel?: string }[]; selectedInstitutionType: string; fujianCityScores: { name: string; value: number; rankByAllBranches?: number | null; rankByBranchLevel?: number | null; branchLevel?: string }[]; assessmentYear: string; onDrillChange?: (drilled: boolean) => void }) {
  const provinceForBranch = (name: string) => {
    const shortName = name.replace(/分行$/u, "")
    return branchProvinceMap[name] ?? CITY_TO_PROVINCE[shortName] ?? shortName
  }
  const [selectedProvince, setSelectedProvince] = useState(selectedInstitutionType === "全部机构" ? "" : provinceForBranch(selectedInstitutionType))
  const [isFujianDetail, setIsFujianDetail] = useState(false)
  const [scoreThreshold, setScoreThreshold] = useState(() => Math.max(...data.map((item) => item.value)))
  useEffect(() => {
    setSelectedProvince(selectedInstitutionType === "全部机构" ? "" : provinceForBranch(selectedInstitutionType))
    setScoreThreshold(Math.max(...data.map((item) => item.value), 0))
  }, [selectedInstitutionType, data])
  const normalizeRegion = (name: string) => name.replace(/(省|市|自治区|特别��政区)$/u, "").replace(/(壮族|回族|维吾尔)$/u, "")
  const selectedItem = isFujianDetail ? fujianCityScores.find((item) => normalizeRegion(item.name) === normalizeRegion(selectedProvince)) : data.find((item) => normalizeRegion(selectedProvince).includes(normalizeRegion(provinceForBranch(item.name))) || normalizeRegion(provinceForBranch(item.name)).includes(normalizeRegion(selectedProvince)))
  const scores = data.map((item) => item.value)
  const minScore = Math.min(...scores)
  const maxScore = Math.max(...scores)
  const scoreColor = (score: number) => {
    const ratio = (score - minScore) / Math.max(maxScore - minScore, 1)
    const light = Math.round(77 - ratio * 45)
    return `hsl(204 58% ${light}%)`
  }

  return (
    <div className="relative h-[700px] overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br from-background/45 via-background/20 to-card/90">
      {isFujianDetail && <button type="button" onClick={() => { setIsFujianDetail(false); setSelectedProvince(""); onDrillChange?.(false) }} className="absolute left-3 top-3 z-20 rounded-md border border-border/70 bg-card/95 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition-colors hover:border-primary/50 hover:text-primary">返回全国地图</button>}
      <ComposableMap
        width={800}
        height={900}
        projection="geoMercator"
        projectionConfig={isFujianDetail ? { center: [118.3, 26.0], scale: 4200 } : { center: [104.3, 35.9], scale: 750 }}
        className="h-full w-full"
        suppressHydrationWarning
      >
        <Geographies key={isFujianDetail ? "fujian-cities" : "china-provinces"} geography={isFujianDetail ? fujianMapUrl : chinaMapUrl}>
          {({ geographies }) =>
            geographies.map((geo, index) => {
              const province = geo.properties?.name || geo.properties?.NAME || geo.properties?.省份 || geo.properties?.市 || `区域${index + 1}`

              const regionItem = isFujianDetail ? fujianCityScores.find((item) => normalizeRegion(item.name) === normalizeRegion(province)) : data.find((item) => normalizeRegion(provinceForBranch(item.name)) === normalizeRegion(province))

              const provinceItem = regionItem
              const selected = selectedProvince === province || (selectedInstitutionType !== "���部机构" && normalizeRegion(province) === normalizeRegion(provinceForBranch(selectedInstitutionType)))

              return (
                <Geography
                  key={`${geo.rsmKey}-${index}`}
                  geography={geo}
                  onClick={() => {
                    if (isFujianDetail) {
                      setSelectedProvince(province)
                    } else if (normalizeRegion(province) === "福建") {
                      setIsFujianDetail(true)
                      setSelectedProvince("福建省")
                      onDrillChange?.(true)
                    } else {
                      setSelectedProvince(province)
                    }
                  }}
                  fill={selected ? "#0f8f9b" : (() => { const score = provinceItem?.value; return score !== undefined && score <= scoreThreshold ? scoreColor(score) : "#d8e0e7" })()}
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

      <div className="absolute right-3 top-3 z-20 w-48 rounded-lg border border-border/60 bg-card/95 px-2.5 py-2 shadow-sm">
        <div className="mb-1.5 flex items-center justify-between text-[10px] font-medium text-foreground"><span>全年合计得分</span><span className="font-mono text-primary">≤ {scoreThreshold.toFixed(1)}</span></div>
        <div className="relative h-4">
          <div className="absolute inset-x-0 top-1.5 h-2 rounded-full bg-gradient-to-r from-[hsl(204_58%_77%)] via-[hsl(204_58%_58%)] to-[hsl(204_58%_32%)]" aria-hidden="true" />
          <input aria-label="调整地图显示的最��分数" type="range" min={minScore} max={maxScore} step="0.1" value={scoreThreshold} onChange={(event) => setScoreThreshold(Number(event.target.value))} className="absolute inset-0 h-4 w-full cursor-pointer appearance-none bg-transparent accent-primary" />
        </div>
        <div className="mt-1 flex items-center justify-between font-mono text-[9px] text-muted-foreground"><span>最低分 {minScore.toFixed(2)}</span><span>最高分 {maxScore.toFixed(2)}</span></div>
      </div>

      <div className="pointer-events-none absolute bottom-8 right-2 z-30 min-w-56 rounded-lg border border-primary/20 bg-card px-2.5 py-2 text-[11px] shadow-md">
        {selectedProvince && selectedItem ? (() => { const rank = "rankByAllBranches" in selectedItem ? selectedItem.rankByAllBranches : null; const category = "branchLevel" in selectedItem ? selectedItem.branchLevel : ""; const categoryRank = "rankByBranchLevel" in selectedItem ? selectedItem.rankByBranchLevel : null; return <div className="grid gap-1.5"><div className="mb-1 border-b border-border/60 pb-1.5 text-xs font-semibold text-foreground">{selectedProvince}</div><div className="grid grid-cols-[1fr_auto] gap-x-5 gap-y-1 text-muted-foreground"><span>网络安全综合能力总分</span><strong className="font-mono text-[11px] font-semibold text-primary">{selectedItem.value.toFixed(2)}</strong><span>{assessmentYear}年排名（按全行）</span><strong className="font-mono text-foreground">{String(rank ?? "-")}</strong><span>类别</span><strong className="text-foreground">{String(category || "-")}</strong><span>{assessmentYear}年排名（按等级行）</span><strong className="font-mono text-foreground">{String(categoryRank ?? "-")}</strong></div></div> })() : <span className="text-muted-foreground">{isFujianDetail ? "点击地市查看安全能力得分" : "点击省份查看安全能力得分"}</span>}
      </div>

      {!isFujianDetail && (() => {
        const projection = geoMercator().center([104.3, 35.9]).scale(750).translate([400, 450])
        const p = (lon: number, lat: number): [number, number] => {
          const point = projection([lon, lat]) ?? [0, 0]
          return [Number(point[0].toFixed(4)), Number(point[1].toFixed(4))]
        }
        // 十段线（即"九段线"官方现行版本，2013年起在东侧增补台湾以东一段）真实经纬度坐标
        // 数据来源：自然资源部标准地图矢量数据（geojson.cn 公开镜像）
        const nineDashSegments: [number, number][][] = [
          [
            [109.51763678906526, 16.360467782665847],
            [109.72339159230361, 16.05587198177934],
            [109.8780414893003, 15.766823920473868],
            [109.96506402665503, 15.526031073258686],
            [109.98526818797363, 15.335615618596712],
          ],
          [
            [110.48331454715199, 12.431407837351566],
            [110.48240767589328, 12.085792287259398],
            [110.45136562643113, 11.863835000833953],
            [110.25652028695671, 11.393616070326182],
          ],
          [
            [108.3388949586325, 7.26656318024262],
            [108.30727608084116, 6.727803403200289],
            [108.35631901989032, 6.112648053307836],
          ],
          [
            [111.94112275674237, 3.553559321848772],
            [112.40151782268552, 3.646409974664658],
            [112.92104341055976, 3.845112027649191],
          ],
          [
            [115.69079809651517, 7.29016984601141],
            [116.4095482213759, 8.137962397303875],
          ],
          [
            [118.63503455703679, 11.080904139262175],
            [118.85587024190139, 11.457907321145406],
            [119.10128629647166, 12.062751715859875],
            [119.12181771101825, 12.135585760471585],
          ],
          [
            [119.60808384544805, 18.143451232827125],
            [119.91075760817219, 18.77194701315816],
            [120.11918953031866, 19.117669954512905],
          ],
          [
            [121.40591812413318, 20.8001943859176],
            [122.12216430894797, 21.716094829922323],
          ],
          [
            [122.80328441666389, 23.665545127578547],
            [123.00481138309124, 24.74934291726869],
          ],
          [
            [119.16836075308866, 15.107448879733406],
            [119.16981236678279, 15.755038547478351],
            [119.17823197590195, 16.265658015720753],
          ],
        ]
        // 每一段本身即为互不相连的独立短笔画（刻度线），仅取首尾两点绘制一条直线
        const dashSegments = nineDashSegments.map((seg) => {
          const [sLon, sLat] = seg[0]
          const [eLon, eLat] = seg[seg.length - 1]
          const [sx, sy] = p(sLon, sLat)
          const [ex, ey] = p(eLon, eLat)
          return { sx, sy, ex, ey }
        })
        const islandGroups: [number, number][] = [
          // 东沙群��
          [116.72, 20.7],
          // 西沙群岛
          [112.33, 16.83],
          [111.6, 16.5],
          [112.0, 16.05],
          [111.2, 17.1],
          // 中��群岛���含黄岩岛）
          [114.0, 15.5],
          [113.6, 15.0],
          [117.8, 15.4],
          // 南沙群岛
          [113.5, 10.0],
          [112.5, 9.0],
          [114.5, 9.5],
          [113.8, 10.5],
          [111.5, 8.0],
          [113.0, 7.5],
          [112.5, 6.5],
          [109.8, 7.5],
          [111.5, 4.3],
          [110.5, 5.8],
          [114.5, 11.0],
        ]
        return (
          <svg viewBox="0 0 800 900" className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            {dashSegments.map((seg, i) => (
              <line key={i} x1={seg.sx} y1={seg.sy} x2={seg.ex} y2={seg.ey} stroke="#64748b" strokeWidth={1.4} strokeLinecap="round" />
            ))}
            {islandGroups.map((pt, i) => {
              const [x, y] = p(pt[0], pt[1])
              return <circle key={i} cx={x} cy={y} r={1.6} fill="#64748b" />
            })}
          </svg>
        )
      })()}

    </div>
  )
}

function BranchList({
  title,
  data,
  color,
  compact = false,
}: {
  title: string
  data: string[]
  color: string
  compact?: boolean
}) {
  return (
    <div className={compact ? "rounded-xl border border-border/60 bg-card/75 p-2 shadow-sm" : "rounded-xl border border-border/60 bg-card/75 p-3 shadow-sm"}>
      <div className={compact ? "mb-1.5 flex items-center justify-between gap-2" : "mb-3 flex items-center justify-between gap-2"}>
        <div className="text-sm font-semibold text-foreground">{title}</div>
      </div>
      <div className={compact ? "grid grid-cols-3 gap-1" : "grid gap-1.5"}>
        {data.map((name, index) => (
          <div key={name} className={compact ? "flex min-w-0 items-center gap-1 rounded-lg bg-muted/45 px-1.5 py-1" : "flex items-center gap-2 rounded-lg bg-muted/45 px-2.5 py-2"}>
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-bold text-background" style={{ backgroundColor: color }}>{index + 1}</span>
            <span className={compact ? "truncate text-sm text-foreground" : "truncate text-base text-foreground"}>{name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function CapabilityCategoryRadar({ data }: { data: SecurityNetworkCapabilityCategory[] }) {
  const dimensions = [
    { key: "securityResourceScore", label: "资源保障" },
    { key: "cybersecurityAssessmentScore", label: "网络考评" },
    { key: "cybersecurityInspectionScore", label: "网络检查" },
    { key: "employeeSecurityScore", label: "员工安全" },
    { key: "personalInformationScore", label: "个人信息" },
    { key: "securityInnovationScore", label: "安全创新" },
  ] as const
  const radarData = dimensions.map(({ key, label }) => Object.fromEntries([
    ["metric", label],
    ...data.map((item) => [item.category, Number(item[key] ?? 0)]),
  ]))
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null)
  const colors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"]
  const selectedValues = selectedMetric ? radarData.find((row) => row.metric === selectedMetric) : null
  return <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border/50 bg-card p-2">
    <div className="flex shrink-0 items-center justify-between px-2 text-xs text-muted-foreground"><span>类别综合能力雷达图</span><span>{data.length ? data.map((item) => item.category).join("、") : "暂无数据"}</span></div>
    <div className="relative h-[270px] min-h-[270px] w-full min-w-0 shrink-0 overflow-hidden"><ResponsiveContainer width="100%" height={270}><RadarChart data={radarData} outerRadius="55%" onClick={(state) => { if (state?.activeLabel) setSelectedMetric(String(state.activeLabel)) }}><PolarGrid fill="none" stroke="hsl(var(--border))" strokeOpacity={0.72} strokeWidth={1} /><PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fontWeight: 500, fill: "hsl(var(--muted-foreground))" }} tickLine={false} /><PolarRadiusAxis angle={90} domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tick={{ fontSize: 10, fontWeight: 500, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} /><Tooltip formatter={(value, name) => [Number(value).toFixed(2), name]} labelFormatter={(label) => `指标：${label}`} />{data.map((item, index) => <Radar key={item.category} name={item.category} dataKey={item.category} stroke={colors[index % colors.length]} fill={colors[index % colors.length]} fillOpacity={0.1} strokeOpacity={0.62} strokeWidth={1.4} dot={{ r: 2, fill: colors[index % colors.length], fillOpacity: 0.75, strokeWidth: 0 }} activeDot={{ r: 4 }} />)}</RadarChart></ResponsiveContainer>{selectedValues && <div className="pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 rounded-md border border-border/60 bg-card/95 px-2 py-1 text-[10px] text-foreground shadow-sm">{selectedMetric}：{data.map((item) => `${item.category} ${Number(selectedValues[item.category] ?? 0).toFixed(2)}`).join(" · ")}</div>}</div>
    <div className="flex min-h-0 flex-wrap items-center justify-center gap-x-4 gap-y-1 px-2 pb-1 text-[10px] text-muted-foreground" aria-label="雷达图图例">{data.map((item, index) => <span key={item.category} className="inline-flex items-center gap-1 whitespace-nowrap"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} aria-hidden="true" />{item.category}</span>)}</div>
  </div>
}

export function SecurityDashboard() {
  const [selectedYear, setSelectedYear] = useState("2025")
  const [selectedInstitutionType, setSelectedInstitutionType] = useState("全部机构")
  const [isCapabilityDrilled, setIsCapabilityDrilled] = useState(false)
  const { data: capabilityDetails = [], error: capabilityDetailsError } = useSWR<SecurityNetworkCapabilityDetail[]>(["security-network-capability-details"], () => securityApi.networkCapabilityDetails())
  const { data: capabilityCategories = [] } = useSWR<SecurityNetworkCapabilityCategory[]>(["security-network-capability-categories"], () => securityApi.networkCapabilityCategories())
  const { data: branches = [], error: branchesError } = useSWR<BranchScore[]>(["security-branches", selectedYear], () => securityApi.branches(selectedYear))
  const { data: indicators = [], error: indicatorsError } = useSWR<SecurityIndicator[]>(["security-indicators", selectedYear], () => securityApi.indicators(selectedYear))
  const { data: problems = [], error: problemsError } = useSWR<InspectionProblem[]>(["security-problems", selectedYear], () => securityApi.problems(selectedYear))
  const { data: rankings = [], error: rankingsError } = useSWR<BranchRanking[]>(["security-rankings", selectedYear], () => securityApi.rankings(selectedYear))
  const { data: training = [], error: trainingError } = useSWR<TrainingStat[]>(["security-training", selectedYear], () => securityApi.training(selectedYear))
  const years = useMemo(() => [...new Set(branches.map((row) => String(row.assessmentYear)))].sort().reverse(), [branches])
  const institutions = useMemo(() => [...new Set(branches.map((row) => row.branchName))], [branches])
  const filteredBranches = selectedInstitutionType === "全部机构" ? branches : branches.filter((row) => row.branchName === selectedInstitutionType)
  const capabilityRows = capabilityDetails.length > 0
    ? capabilityDetails.map((row) => ({ ...row, name: row.branchName, value: Number(row.totalScore ?? 0), branchLevel: row.category }))
    : toCapabilityData(branches)
  const filteredCapability = selectedInstitutionType === "全部机构" ? capabilityRows : capabilityRows.filter((row) => row.name === selectedInstitutionType)
  const normalizeBranchName = (name: string) => name.replace(/分行$/u, "")
  // 省份归一化：去掉"省/市/自治区/特别行政区"等行政区划后缀，便于与地图 geo 数据的省份名对齐。
  const normalizeProvinceName = (raw: string) =>
    raw
      .replace(/(壮族|回族|维吾尔)?自治区$/u, "")
      .replace(/特别行政区$/u, "")
      .replace(/省$/u, "")
      .replace(/市$/u, "")
  const branchRankByName = new Map(branches.map((row) => [normalizeBranchName(row.branchName), row]))
  // 分行 -> 省份的权威映射直接来自后端 security_branch_scores 表的真实 province 字段，
  // 不再靠猜测的城市名单，避免地图漏色或福建下钻匹配不到分行。
  const branchProvinceFromData = new Map(
    branches.filter((row) => row.province).map((row) => [normalizeBranchName(row.branchName), normalizeProvinceName(row.province)]),
  )
  const provinceForCapabilityRow = (name: string) =>
    branchProvinceFromData.get(normalizeBranchName(name)) ?? branchProvinceMap[name] ?? CITY_TO_PROVINCE[normalizeBranchName(name)] ?? normalizeBranchName(name)
  // 地图数据直接来源于 security_network_capability_detail（网络安全综合能力明细表），
  // 省份匹配则优先使用 branches 表的真实 province 字段，避免分行命名不一致导致分数丢失或归零。
  const mapData = capabilityDetails.length > 0
    ? [...new Map(capabilityRows.map((row) => {
        const province = normalizeProvinceName(row.province)
        const legacyBranch = branchRankByName.get(normalizeBranchName(row.name))
        return [province, { name: province, value: Number(row.value ?? 0), rankByAllBranches: legacyBranch?.rankByAllBranches ?? null, rankByBranchLevel: legacyBranch?.rankByBranchLevel ?? null, branchLevel: row.branchLevel }]
      })).values()]
    : [...new Map(branches.map((row) => [normalizeProvinceName(row.province), { name: normalizeProvinceName(row.province), value: Number(row.annualTotalScore ?? 0), rankByAllBranches: row.rankByAllBranches, rankByBranchLevel: row.rankByBranchLevel, branchLevel: row.branchLevel }])).values()]
  const filteredTraining = toTrainingData(training.filter((row) => selectedInstitutionType === "全部机构" || row.unitName === selectedInstitutionType))
  const filteredViolations = toViolationData(training.filter((row) => selectedInstitutionType === "全部机构" || row.unitName === selectedInstitutionType))
  const filteredOutstanding = toRankingBranches(rankings, "excellent")
  const filteredWeak = toRankingBranches(rankings, "poor")
  const selectedScore = filteredCapability.length === 1 ? filteredCapability[0].value : 0
  const securityOverview = { totalScore: selectedScore, ranking: filteredBranches[0]?.rankByAllBranches ?? 0, repairRate: 99.7, inspectionIssues: problems.reduce((sum, item) => sum + Number(item.problemCount || 0), 0), trainingPeople: filteredTraining.reduce((sum, item) => sum + item.value, 0), violationPeople: filteredViolations.reduce((sum, item) => sum + item.value, 0) }
  const securityManagementIndicators = toIndicatorLabels(indicators)
  const inspectionCategoryData = toProblemData(problems)
  const fujianCityScores = capabilityDetails.length > 0
    ? capabilityDetails
        .filter((row) => normalizeProvinceName(row.province) === "福建")
        .map((row) => {
          const legacyBranch = branches.find((branch) => branch.city === row.city || branch.branchName === row.branchName)
          return {
            name: row.city,
            value: Number(row.totalScore ?? 0),
            branchLevel: row.category,
            rankByAllBranches: legacyBranch?.rankByAllBranches ?? null,
            rankByBranchLevel: legacyBranch?.rankByBranchLevel ?? null,
          }
        })
    : toFujianCityData(branches)
  const hasError = branchesError || indicatorsError || problemsError || rankingsError || trainingError
  if (hasError) {
    return <main className="min-h-screen bg-background p-6 text-foreground"><div className="mx-auto max-w-3xl rounded-xl border border-destructive/30 bg-card p-6 text-sm text-destructive">安全数据接口读取失败，请确认本地后端已启动，并检查 `NEXT_PUBLIC_API_BASE_URL` 配置。</div></main>
  }
  if (capabilityDetailsError) {
    return <main className="min-h-screen bg-background p-6 text-foreground"><div className="mx-auto max-w-3xl rounded-xl border border-destructive/30 bg-card p-6 text-sm text-destructive">网络安全综合能力明细接口（/api/security/network-capability/details）读取失败，请确认本地后端已启动。错误信息：{String(capabilityDetailsError?.message ?? capabilityDetailsError)}</div></main>
  }

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <div className="relative mx-auto max-w-[1800px] px-4 pb-8 md:px-6">
        <HeroBanner
          title="网络安全驾驶舱"
          subtitle="安全防护 · 风险监测 · 合规管理 · 应急响应"
        />

        <section className="mb-6 flex flex-wrap items-center gap-2 rounded-xl border border-border/60 bg-card/80 p-3 shadow-[0_12px_28px_rgba(9,19,32,0.15)] backdrop-blur-sm lg:flex-nowrap">
          <label className="flex min-w-0 flex-1 items-center gap-3 whitespace-nowrap rounded-md border border-border/60 bg-background/35 px-3 py-2 text-sm">
            <span className="shrink-0 whitespace-nowrap text-muted-foreground">考评年度</span>
            <select value={selectedYear} onChange={(event) => setSelectedYear(event.target.value)} className="min-w-0 w-full bg-transparent text-foreground outline-none">
              {years.map((year) => <option key={year}>{year}</option>)}
            </select>
          </label>

          <label className="flex min-w-0 flex-1 items-center gap-3 whitespace-nowrap rounded-md border border-border/60 bg-background/35 px-3 py-2 text-sm">
            <span className="shrink-0 whitespace-nowrap font-medium text-foreground">分行名称</span>
            <select value={selectedInstitutionType} onChange={(event) => setSelectedInstitutionType(event.target.value)} className="min-w-0 w-full bg-transparent text-foreground outline-none">
              <option>全部机构</option>
              {institutions.map((name) => <option key={name}>{name}</option>)}
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

        <Panel title="网络安全管理指标" tone="primary" bodyClassName="p-3">
          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-6">
            {securityManagementIndicators.map((item, index) => {
              const [label, value] = item.split("：")
              return (
                <div key={item} className="min-w-0 rounded-lg border border-border/50 bg-background/25 p-3 shadow-sm">
                  <div className="mb-2 flex min-h-10 items-start gap-2 text-sm leading-5 text-foreground/80">
                    <span className="mt-1.5 size-2 shrink-0 rounded-full bg-accent" />
                    <span>{label}</span>
                  </div>
                  <strong className={`font-mono text-xl tabular-nums ${index < 2 ? "text-accent" : "text-primary"}`}>{value}</strong>
                </div>
              )
            })}
          </div>
        </Panel>

        <div className="mt-5 grid items-start gap-2 lg:grid-cols-3 lg:grid-rows-[420px_380px]">
          <section className="order-1 flex min-h-0 min-w-0 flex-col gap-4 lg:row-start-1 lg:row-span-2 lg:col-start-1 lg:self-stretch">
            <Panel title={isCapabilityDrilled || selectedInstitutionType !== "全部机构" ? "网络安全综合能力" : "网络安全综合能力视图"} tone="accent" className="flex h-full min-h-0 flex-col" bodyClassName="flex min-h-0 flex-1 flex-col p-4">
              {isCapabilityDrilled || selectedInstitutionType !== "全部机构" ? (
                <div className="flex min-h-0 flex-1 flex-col">
                  <div className="min-h-0 flex-1 overflow-hidden">
                    <CapabilityBars data={filteredCapability} label="各分行综合能力得分" selectedInstitutionType={selectedInstitutionType} />
                  </div>
                  <button
                    type="button"
                    onClick={() => { setIsCapabilityDrilled(false); setSelectedInstitutionType("全部机构") }}
                    className="mt-3 w-full rounded-md border border-border/60 bg-muted/30 px-3 py-2 text-center text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                  >
                    返回综合力视图
                  </button>
                </div>
              ) : (
                <div className="min-h-0 flex-1"><ChinaSecurityMap data={mapData} fujianCityScores={fujianCityScores} selectedInstitutionType={selectedInstitutionType} assessmentYear={selectedYear} /></div>
              )}
              {!isCapabilityDrilled && selectedInstitutionType === "全部机构" && (
                <button
                  type="button"
                  onClick={() => setIsCapabilityDrilled(true)}
                  className="mt-3 w-full rounded-md border border-primary/25 bg-primary/5 px-3 py-2 text-center text-xs font-semibold text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  点击查看详情
                </button>
              )}
            </Panel>
          </section>

          <section className="order-2 flex h-full min-h-0 min-w-0 flex-col self-stretch lg:row-start-1 lg:col-start-3">
          <Panel title="员工安全画像" tone="primary" className="flex h-full min-h-0 w-full flex-col" bodyClassName="flex min-h-0 flex-1 flex-col p-2.5">
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-1.5">
                <StatCard
                  label="安全培训人次"
                  value={training.reduce((sum, row) => sum + Number(row.safetyTrainingCount || 0), 0).toLocaleString()}
                  unit="人次"
                  icon={Users}
                  color="var(--primary)"
                  compact
                />
                <StatCard
                  label="违规记分人次"
                  value={securityOverview.violationPeople}
                  unit="人次"
                  icon={AlertTriangle}
                  color="#e9ad43"
                  compact
                />
              </div>
              <div className="grid min-h-0 flex-1 grid-cols-1 gap-2">
                <div className="flex min-w-0 h-[150px] flex-col rounded-lg border border-border/50 bg-background/20 px-2 pb-1 pt-2"><div className="mb-1 flex h-5 shrink-0 items-center justify-between text-xs text-muted-foreground"><span>安全培训覆盖率</span><span className="font-mono text-[10px]">单位：%</span></div><div className="min-h-0 flex-1 w-full overflow-x-auto"><div style={{ minWidth: `${Math.max(training.length * 56, 360)}px`, height: "100%" }}><ResponsiveContainer width="100%" height="100%"><BarChart width={Math.max(training.length * 56, 360)} data={[...training].sort((a, b) => normalizeRatio(b.safetyTrainingCoverage) - normalizeRatio(a.safetyTrainingCoverage)).map((row) => ({ name: row.unitName.replace("分行", ""), value: normalizeRatio(row.safetyTrainingCoverage) }))} margin={{ top: 12, right: 10, bottom: 0, left: -18 }}><CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis dataKey="name" tick={{ fontSize: 10, dy: 3 }} tickLine={false} axisLine={false} /><YAxis domain={[70, 100]} ticks={[70, 80, 90, 100]} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} /><Tooltip formatter={(value) => [`${value}%`, "覆盖率"]} /><Bar dataKey="value" fill="#25a8d2" radius={[3, 3, 0, 0]} /></BarChart></ResponsiveContainer></div></div></div>
                <div className="min-w-0"><ChartBox
                  data={filteredViolations}
                  color="#d9953f"
                  label="违规记分人次"
                  height={150}
                /></div>
              </div>
            </div>
          </Panel>

          </section>

          <Panel title="网络安全考评" tone="accent" className="order-4 flex h-full min-h-0 w-full flex-col lg:row-start-2 lg:col-start-2" bodyClassName="flex min-h-0 flex-1 flex-col overflow-hidden p-2">
            <AssessmentBars data={filteredBranches.map((row) => ({
              ...row,
              name: row.branchName,
              value: Number(row.annualTotalScore ?? 0),
            }))} />
          </Panel>

          <Panel title="类别综合能力" tone="accent" className="order-3 flex h-full min-h-0 flex-col self-stretch overflow-hidden lg:row-start-1 lg:col-start-2" bodyClassName="flex min-h-0 flex-1 flex-col overflow-hidden p-3">
            <div className="min-h-0 flex-1 overflow-hidden">
              <CapabilityCategoryRadar data={capabilityCategories} />
            </div>
          </Panel>

          <Panel title="检查发现问题" tone="accent" className="order-5 flex h-full min-h-0 flex-col self-start lg:row-start-2 lg:col-start-3" bodyClassName="flex flex-col gap-4 p-3">
                <div className="grid gap-3">
                  <div className="grid grid-cols-2 gap-2">
                    <StatCard
                      compact
                      label="发现问题"
                      value={securityOverview.inspectionIssues}
                      unit="项"
                      icon={AlertTriangle}
                      color="#e9ad43"
                    />
                    <StatCard
                      compact
                      label="问题整改率"
                      value={securityOverview.repairRate}
                      unit="%"
                      icon={CheckCircle2}
                      color="var(--accent)"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <BranchList title="表现突出的三家分行" data={filteredOutstanding} color="var(--accent)" compact />
                    <BranchList title="表现较差的三家分行" data={filteredWeak} color="#e9ad43" compact />
                  </div>
                </div>


                <div className="min-h-0 flex-1 text-base"><CategoryBars data={inspectionCategoryData} color="#42bdb7" label="检查问题分类" /></div>
              </Panel>
        </div>
      </div>
    </main>
  )
}
