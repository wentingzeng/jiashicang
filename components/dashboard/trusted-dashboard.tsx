"use client"

import { useEffect, useMemo, useState } from "react"
import { BarChart3, ChevronUp } from "lucide-react"
import { HeroBanner } from "@/components/dashboard/hero-banner"

const colors = { blue: "#4ba8d8", violet: "#8494d8", teal: "#42bdb7", amber: "#e5b45c" }
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080"

type BranchProgress = { id: number; statYear: number; branchName: string; includedSystemCount: number; singleTrackCount: number; remainingCount: number; singleTrackRate: number | null }
type HeadquartersProgress = { id: number; statYear: number; departmentName: string; includedSystemCount: number; singleTrackCount: number; remainingCount: number; singleTrackRate: number | null }
type MainframeProgress = { id: number; statYear: number; organizationName: string; notOfflineCount: number; offlineCount: number; offlineRate: number | null }
type ProductReplacementProgress = { id: number; categoryName: string; replacedCount: number; unreplacedCount: number; totalCount: number; statYear: number }
type ApiState = { branch: BranchProgress[]; headquarters: HeadquartersProgress[]; mainframe: MainframeProgress[]; products: ProductReplacementProgress[]; loading: boolean; error: string | null; source: "mock" | "api" }

type ProgressRow = [string, number, number]
type ProductProgressRow = [string, number, number, number]

function numberOrZero(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0
}

function sortProgressRows(rows: ProgressRow[]): ProgressRow[] {
  return [...rows].sort((a, b) => b[1] - a[1] || b[2] - a[2])
}

function toProgressRows<T extends { remainingCount: number; includedSystemCount: number }>(rows: T[], name: (row: T) => string): ProgressRow[] {
  return sortProgressRows(rows.map((row) => [name(row), numberOrZero(row.includedSystemCount), numberOrZero(row.remainingCount)]))
}
const branchRows: Array<[string, number, number]> = [["南京分行", 9, 5], ["苏州分行", 6, 3], ["北京分行", 6, 4], ["上海分行", 5, 3], ["青岛分行", 5, 2], ["福州分行", 9, 6], ["深圳分行", 4, 2], ["西安分行", 6, 4]]
const headRows: Array<[string, number, number]> = [["公司金融部\n数字支撑室", 4, 2], ["绿色金融部\n临客部", 4, 0], ["普惠金融部\n村镇服务", 4, 0], ["机构业务部", 5, 1], ["国际业务部\n贸易行管", 24, 9], ["投资银行部", 2, 1], ["零售金融部\n消费者权益保护办公室", 23, 8]]
const productRows: Array<[string, number, number]> = [["操作系统", 420, 55.26], ["服务器", 180, 64.59], ["金融机具", 310, 38.64], ["数据库", 260, 73.04], ["中间件", 238, 58.4], ["网络设备", 225, 67.32], ["A4单色打印机", 198, 38.15], ["终端", 360, 61.2], ["存储", 142, 48.7]]
const productCategoryOrder = ["服务器", "操作系统", "数据库", "终端设备", "终端", "A4单色打印机", "金融机具", "中间件", "存储设备", "存储", "网络设备"]

function sortProductRows(rows: ProductProgressRow[]): ProductProgressRow[] {
  return [...rows].sort((a, b) => {
    const orderA = productCategoryOrder.indexOf(a[0])
    const orderB = productCategoryOrder.indexOf(b[0])
    const normalizedA = orderA === -1 ? productCategoryOrder.length : orderA
    const normalizedB = orderB === -1 ? productCategoryOrder.length : orderB
    return normalizedA - normalizedB
  })
}

const smallMachineRows: Array<[string, number, number]> = [["南京", 328, 86], ["苏州", 286, 74], ["北京", 240, 62], ["上海", 178, 48], ["其他", 120, 36]]
const headMachineRows: Array<[string, number, number]> = [["科技运维中心", 150, 42], ["银行合作中心", 110, 28], ["信用卡中心", 68, 16]]
const branchMachineRows: Array<[string, number, number]> = [["南京分行", 86, 22], ["苏州分行", 72, 18], ["北京分行", 104, 26], ["上海分行", 88, 24], ["深圳分行", 76, 19], ["广州分行", 54, 13], ["成都分行", 31, 8], ["西安分行", 26, 6]]
const machineOverview = { head: { total: 358, done: 30 }, branch: { total: 537, done: 136 } }
const annualHeadRows: Array<[string, number, number]> = [["公司金融部", 18, 5], ["运营管理部", 14, 3], ["科技运维中心", 22, 6], ["风险管理部", 12, 2]]
const annualBranchRows: Array<[string, number, number]> = [["南京分行", 24, 7], ["苏州分行", 21, 5], ["北京分行", 18, 4], ["上海分行", 16, 3], ["深圳分行", 14, 2]]
const annualOverview = { head: { done: 66, total: 120 }, branch: { done: 93, total: 180 } }

function Panel({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`overflow-visible rounded-lg border border-border/80 bg-card shadow-sm ${className}`}>
      <header className="flex items-center gap-2 border-b border-border/70 bg-secondary/50 px-3 py-1.5">
        <span className="flex size-5 items-center justify-center rounded-md bg-primary/10 text-primary">
          <BarChart3 className="size-3" />
        </span>
        <h2 className="text-sm font-bold">{title}</h2>
      </header>
      <div className="p-2.5">{children}</div>
    </section>
  )
}

function StatCard({ label, value, sub, color = colors.blue }: { label: string; value: string; sub: string; color?: string }) {
  return (
    <div className="rounded-lg bg-secondary/40 px-3 py-2">
      <p className="text-xs font-semibold text-foreground">{label}</p>
      <p className="mt-0.5 truncate font-mono text-lg font-black" style={{ color }}>
        {value}
      </p>
      <p className="truncate text-[11px] text-muted-foreground">{sub}</p>
    </div>
  )
}

function RingStat({ label, ratio, value, sub, color = colors.blue }: { label: string; ratio: number; value: string; sub: string; color?: string }) {
  const c = 2 * Math.PI * 30
  return (
    <div className="flex items-center gap-2.5 rounded-lg bg-secondary/40 px-2.5 py-2">
      <div className="relative size-12 shrink-0">
        <svg viewBox="0 0 72 72" className="size-full -rotate-90">
          <circle cx="36" cy="36" r="30" fill="none" stroke="currentColor" strokeWidth="8" className="text-secondary" />
          <circle cx="36" cy="36" r="30" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - ratio / 100)} />
        </svg>
        <strong className="absolute inset-0 flex items-center justify-center font-mono text-sm font-bold" style={{ color }}>
          {ratio.toFixed(0)}%
        </strong>
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-foreground">{label}</p>
        <p className="truncate font-mono text-base font-black" style={{ color }}>
          {value}
        </p>
        <p className="truncate text-[11px] text-muted-foreground">{sub}</p>
      </div>
    </div>
  )
}

function ModificationRing({ title, ratio, done, undone, color }: { title: string; ratio: number; done: string; undone: string; color: string }) {
  const c = 2 * Math.PI * 30
  return (
    <div className="flex items-center gap-2.5 rounded-lg bg-secondary/40 px-2.5 py-2">
      <div className="flex min-w-16 flex-col items-start gap-1">
        <p className="text-xs font-semibold text-foreground">{title}</p>
        <div className="relative size-12 shrink-0">
          <svg viewBox="0 0 72 72" className="size-full -rotate-90">
            <circle cx="36" cy="36" r="30" fill="none" stroke="currentColor" strokeWidth="8" className="text-secondary" />
            <circle cx="36" cy="36" r="30" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - ratio / 100)} />
          </svg>
          <strong className="absolute inset-0 flex items-center justify-center font-mono text-sm font-bold" style={{ color }}>
            {ratio.toFixed(0)}%
          </strong>
        </div>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-foreground">已改造</p>
        <p className="font-mono text-base font-black" style={{ color }}>{done}</p>
        <p className="text-[11px] text-muted-foreground">未改造 {undone}</p>
      </div>
    </div>
  )
}

function CoreBars() {
  const rows: Array<[string, number, number]> = [["对公核心", 66, 531], ["零售存款", 663, 1031], ["总账核算", 664, 859]]
  const ACTUAL = "#63b3ed"
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-end text-[10px] text-muted-foreground">
        <span className="font-medium">实际天数 / 计划天数</span>
      </div>
      {rows.map(([label, actual, plan]) => {
        const ratio = Math.max((actual / plan) * 100, 22)
        return (
          <div key={label}>
            <div className="mb-0.5 flex items-center justify-between text-xs font-bold text-foreground">
              <span>{label}</span>
              <span className="font-mono text-[10px] font-semibold text-muted-foreground">{actual.toLocaleString()} / {plan.toLocaleString()}</span>
            </div>
            <div className="h-5 w-full overflow-hidden rounded-md bg-secondary/50">
              <div className="flex h-full items-center rounded-md px-2 font-mono text-[11px] font-bold text-white" style={{ width: `${ratio}%`, background: ACTUAL }}>
                {((actual / plan) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ProductBars({ rows }: { rows: ProductProgressRow[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const DONE = "#7dd3fc"
  const UNDONE = "#e8f4fd"
  const plotWidth = 760
  const plotHeight = 260
  const left = 58
  const right = 12
  const top = 12
  const bottom = 48
  const innerWidth = plotWidth - left - right
  const innerHeight = plotHeight - top - bottom
  const maxTotal = Math.max(...rows.map(([, amount, replaced, unreplaced]) => Math.max(numberOrZero(amount), numberOrZero(replaced) + numberOrZero(unreplaced))), 1)
  const ticks = [maxTotal, maxTotal / 2, 0]
  const format = (value: number) => Math.round(value).toLocaleString()

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end gap-3 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1.5"><i className="inline-block size-2.5 rounded-full" style={{ background: DONE }} />已替代</span>
        <span className="flex items-center gap-1.5"><i className="inline-block size-2.5 rounded-full" style={{ background: UNDONE }} />未替代</span>
      </div>
      <div className="relative overflow-visible">
        <svg viewBox={`0 0 ${plotWidth} ${plotHeight}`} className="h-auto min-h-[240px] w-full min-w-[680px] overflow-visible" role="img" aria-label="产品替代进度">
          {ticks.map((tick) => {
            const y = top + innerHeight - (tick / maxTotal) * innerHeight
            return (
              <g key={tick}>
                <line x1={left} x2={plotWidth - right} y1={y} y2={y} stroke="currentColor" strokeDasharray="3 3" className="text-border" />
                <text x={left - 8} y={y + 3} textAnchor="end" className="fill-muted-foreground text-[10px]">{format(tick)}</text>
              </g>
            )
          })}
          <line x1={left} x2={plotWidth - right} y1={top + innerHeight} y2={top + innerHeight} stroke="currentColor" className="text-border" />
          {rows.map(([name, amount, replaced, unreplaced], index) => {
            const safeAmount = numberOrZero(amount)
            const safeReplaced = numberOrZero(replaced)
            const safeUnreplaced = numberOrZero(unreplaced)
            const total = Math.max(safeAmount, safeReplaced + safeUnreplaced)
            const barHeight = (total / maxTotal) * innerHeight
            const replacedHeight = (safeReplaced / maxTotal) * innerHeight
            const x = left + ((index + 0.5) / Math.max(rows.length, 1)) * innerWidth
            const width = Math.min(40, innerWidth / Math.max(rows.length, 1) * 0.55)
            const baseY = top + innerHeight
            const ratio = total > 0 ? (safeReplaced / total) * 100 : 0
            return (
              <g key={name} onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}>
                <rect x={x - width / 2} y={baseY - barHeight} width={width} height={barHeight} rx="5" fill={UNDONE} />
                <rect x={x - width / 2} y={baseY - replacedHeight} width={width} height={replacedHeight} rx="5" fill={DONE} />
                {(() => {
                  const unreplacedHeight = barHeight - replacedHeight
                  const isPriorityCategory = /数据库|存储设备|存储/.test(name)
                  const replacedLabelY = isPriorityCategory
                    ? baseY - replacedHeight / 2 + 4
                    : baseY - replacedHeight - 4
                  const unreplacedLabelY = isPriorityCategory
                    ? baseY - replacedHeight - unreplacedHeight / 2 + (isPriorityCategory && /存储设备|存储/.test(name) ? -2 : 4)
                    : baseY - barHeight - 4
                  const replacedLabelClass = /数据库|存储设备|存储/.test(name)
                    ? "fill-slate-900 text-[9px] font-semibold"
                    : isPriorityCategory
                      ? "fill-white text-[9px] font-semibold"
                      : "fill-slate-700 text-[10px] font-semibold"
                  return (
                    <>
                      {(replacedHeight >= 10 || (isPriorityCategory && safeReplaced > 0)) && (
                        <text x={x} y={isPriorityCategory ? replacedLabelY : Math.max(top + 10, replacedLabelY)} textAnchor="middle" className={replacedLabelClass}>{format(safeReplaced)}</text>
                      )}
                      {(unreplacedHeight >= 10 || (isPriorityCategory && safeUnreplaced > 0)) && (
                        <text x={x} y={isPriorityCategory ? unreplacedLabelY : Math.max(top + 10, unreplacedLabelY)} textAnchor="middle" className={isPriorityCategory ? "fill-slate-700 text-[9px] font-semibold" : "fill-slate-700 text-[10px] font-semibold"}>{format(safeUnreplaced)}</text>
                      )}
                    </>
                  )
                })()}
                <text x={x} y={baseY + 20} textAnchor="middle" className="fill-muted-foreground text-[10px]">{name}</text>
              </g>
            )
          })}
          {hoveredIndex !== null && rows[hoveredIndex] && (() => {
            const [name, amount, replaced, unreplaced] = rows[hoveredIndex]
            const safeAmount = numberOrZero(amount)
            const safeReplaced = numberOrZero(replaced)
            const safeUnreplaced = numberOrZero(unreplaced)
            const total = Math.max(safeAmount, safeReplaced + safeUnreplaced)
            const ratio = total > 0 ? (safeReplaced / total) * 100 : 0
            const x = left + ((hoveredIndex + 0.5) / Math.max(rows.length, 1)) * innerWidth
            const barHeight = (total / maxTotal) * innerHeight
            const tooltipX = Math.max(100, Math.min(plotWidth - 100, x))
            const tooltipY = Math.max(18, top + innerHeight - barHeight - 8)
            return (
              <g transform={`translate(${tooltipX} ${tooltipY})`} pointerEvents="none">
                <rect x="-94" y="-4" width="188" height="86" rx="6" fill="white" stroke="#d7e2ea" strokeWidth="1" />
                <text x="-82" y="12" className="fill-foreground text-[10px] font-semibold">{name}</text>
                <text x="-82" y="28" className="fill-foreground text-[10px]">已替代：{format(safeReplaced)}</text>
                <text x="-82" y="44" className="fill-foreground text-[10px]">未替代：{format(safeUnreplaced)}</text>
                <text x="-82" y="60" className="fill-foreground text-[10px]">替代率：{ratio.toFixed(1)}%</text>
                <text x="-82" y="76" className="fill-foreground text-[10px]">总数量：{format(total)}</text>
              </g>
            )
          })()}
        </svg>
      </div>
    </div>
  )
}

function SmallMachineChart({ rows }: { rows: Array<[string, number, number]> }) {
  const UNDONE = "#63b3ed"
  const DONE = "#38b2ac"
  const max = Math.max(...rows.map(([, total]) => numberOrZero(total)), 0)
  const tickStep = max <= 10 ? 2 : max <= 50 ? 10 : max <= 200 ? 50 : 100
  const niceMax = Math.max(tickStep, Math.ceil(max / tickStep) * tickStep)
  const chartHeight = 96
  const ticks = [0, niceMax / 2, niceMax]
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-end gap-3 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <i className="inline-block size-2.5 rounded-full" style={{ background: UNDONE }} />
          未下线
        </span>
        <span className="flex items-center gap-1.5">
          <i className="inline-block size-2.5 rounded-full" style={{ background: DONE }} />
          已下线
        </span>
      </div>
      <div className="flex gap-2">
        <div className="flex flex-col justify-between text-right text-[9px] text-muted-foreground" style={{ height: chartHeight }}>
          {ticks.slice().reverse().map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <div className="relative border-l border-b border-border" style={{ height: chartHeight }}>
            {ticks.map((t) => (
              <div key={t} className="absolute left-0 right-0 border-t border-dashed border-border/50" style={{ bottom: `${(t / niceMax) * 100}%` }} />
            ))}
            <div className="absolute inset-0 flex items-end justify-around px-3">
              {rows.map(([name, total, done]) => {
                const barHeight = Math.max(8, (total / niceMax) * chartHeight)
                const doneHeight = (done / total) * barHeight
                return (
                  <div key={name} className="group relative flex flex-col items-center">
                    <div className="pointer-events-none absolute bottom-full z-20 mb-2 hidden w-28 -translate-x-1/2 rounded-md border border-border bg-card p-2 text-[10px] leading-4 text-foreground shadow-lg group-hover:block">
                      <p className="font-semibold">{name}</p>
                      <p>总数：{total}</p>
                      <p>已�����线：{done}</p>
                      <p>未下线：{total - done}</p>
                    </div>
                    <span className="mb-1 font-mono text-[11px] font-bold text-foreground">{total}</span>
                    <div className="flex w-9 flex-col justify-end overflow-hidden rounded-t-lg" style={{ height: `${barHeight}px` }}>
                      <div style={{ height: `${barHeight - doneHeight}px`, background: UNDONE }} />
                      <div className="flex items-end justify-center pb-0.5" style={{ height: `${doneHeight}px`, background: DONE }}>
                        <span className="font-mono text-[10px] font-bold text-white">{done}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="flex justify-around px-3 pt-1">
            {rows.map(([name]) => (
              <span key={name} className="text-[10px] font-semibold text-muted-foreground">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function MachineOverview({ onSelect, head, branch }: { onSelect: (view: "head" | "branch") => void; head: { done: number; total: number }; branch: { done: number; total: number } }) {
  return (
    <div className="grid gap-2 md:grid-cols-2">
      <button type="button" onClick={() => onSelect("head")} className="text-left transition hover:opacity-90">
        <RingStat label="总行小型机下线进展" ratio={(head.done / Math.max(1, head.total)) * 100} value={`${head.done}`} sub={`未下线 ${head.total - head.done}`} color={colors.blue} />
        <p className="mt-1 text-[11px] text-muted-foreground">点击查看详情</p>
      </button>
      <button type="button" onClick={() => onSelect("branch")} className="text-left transition hover:opacity-90">
        <RingStat label="分行小型机下线进展" ratio={(branch.done / Math.max(1, branch.total)) * 100} value={`${branch.done}`} sub={`未下线 ${branch.total - branch.done}`} color={colors.teal} />
        <p className="mt-1 text-[11px] text-muted-foreground">点击查看详情</p>
      </button>
    </div>
  )
}

function ProgressPair({
  items,
  onSelect,
}: {
  items: Array<{ label: string; done: number; total: number; color: string; view: "head" | "branch" | "annual-head" | "annual-branch" }>
  onSelect: (view: "head" | "branch" | "annual-head" | "annual-branch") => void
}) {
  return (
    <div className="grid gap-2 md:grid-cols-2">
      {items.map((item) => {
        const ratio = item.total > 0 ? (item.done / item.total) * 100 : 0
        return (
          <button key={item.label} type="button" onClick={() => onSelect(item.view)} className="rounded-lg bg-secondary/40 px-2.5 py-2 text-left transition hover:bg-secondary/60">
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="truncate text-xs font-semibold text-foreground">{item.label}</span>
              <span className="shrink-0 font-mono text-xs font-bold" style={{ color: item.color }}>{ratio.toFixed(0)}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full" style={{ width: `${ratio}%`, background: item.color }} />
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">已完成 {item.done} / {item.total}</p>
            <p className="mt-1 text-[11px] font-semibold text-primary/75">点击查看详情</p>
          </button>
        )
      })}
    </div>
  )
}

function DetailTable({ title, rows, branch, onBack }: { title: string; rows: Array<[string, number, number]>; branch?: boolean; onBack: () => void }) {
  return (
    <div className="flex flex-col gap-2">
      <button type="button" onClick={onBack} className="flex w-fit items-center gap-1 rounded-md border border-border/70 bg-secondary/40 px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:bg-secondary/70">
        <ChevronUp className="size-3.5 -rotate-90" />
        返回{title}
      </button>
      <div className="mx-auto max-h-[420px] w-full max-w-[620px] overflow-y-auto rounded-xl border border-primary/20 bg-background/70 shadow-sm">
        <table className="w-full table-fixed text-left text-[11px]">
          <thead className="sticky top-0 z-20 border-b border-primary/15 bg-background text-primary shadow-[0_2px_4px_rgba(15,23,42,0.06)]">
            <tr>
              <th className="w-12 px-2 py-2 font-bold">序号</th>
              <th className="px-2 py-2 font-bold">{branch ? "分行名称" : "所属部门"}</th>
              <th className="w-20 px-2 py-2 text-right font-bold">总数</th>
              <th className="w-20 px-2 py-2 text-right font-bold">剩余</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {rows.map(([name, total, remaining], i) => (
              <tr key={name} className="transition-colors odd:bg-card/60 hover:bg-primary/5">
                <td className="px-2 py-2 align-middle font-mono text-muted-foreground">{String(i + 1).padStart(2, "0")}</td>
                <td className="whitespace-pre-line px-2 py-2 align-middle font-semibold text-foreground">{name}</td>
                <td className="px-2 py-2 text-right align-middle font-mono font-semibold text-foreground">{total.toLocaleString()}</td>
                <td className="px-2 py-2 text-right align-middle font-mono font-semibold text-muted-foreground">{remaining.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function TrustedDashboard() {
  const [systemView, setSystemView] = useState<null | "head" | "branch" | "annual-head" | "annual-branch">(null)
  const [machineView, setMachineView] = useState<null | "head" | "branch">(null)
  const [api, setApi] = useState<ApiState>({ branch: [], headquarters: [], mainframe: [], products: [], loading: true, error: null, source: "mock" })

  useEffect(() => {
    const controller = new AbortController()
    const fetchData = async () => {
      try {
        const [branchResponse, headquartersResponse, mainframeResponse, productsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/trusted/branch-system-progress?statYear=2026`, { signal: controller.signal }),
          fetch(`${API_BASE_URL}/api/trusted/headquarters-system-progress?statYear=2026`, { signal: controller.signal }),
          fetch(`${API_BASE_URL}/api/trusted/mainframe-offline-progress?statYear=2026`, { signal: controller.signal }),
          fetch(`${API_BASE_URL}/api/trusted/product-replacement-progress?statYear=2026`, { signal: controller.signal }),
        ])
        if (!branchResponse.ok || !headquartersResponse.ok || !mainframeResponse.ok || !productsResponse.ok) throw new Error("信创接口请求失败")
        const [branchJson, headquartersJson, mainframeJson, productsJson] = await Promise.all([
          branchResponse.json(), headquartersResponse.json(), mainframeResponse.json(), productsResponse.json(),
        ])
        const branch = branchJson.data ?? []
        const headquarters = headquartersJson.data ?? []
        const mainframe = mainframeJson.data ?? []
        const products = productsJson.data ?? []
        const hasApiData = branch.length > 0 || headquarters.length > 0 || mainframe.length > 0 || products.length > 0
        setApi({ branch, headquarters, mainframe, products, loading: false, error: hasApiData ? null : "接口返回为空，当前显示页面默认数据", source: hasApiData ? "api" : "mock" })
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return
        setApi((current) => ({ ...current, loading: false, source: "mock", error: "信创接口未连接，当前显示 Mock 数据" }))
      }
    }
    void fetchData()
    return () => controller.abort()
  }, [])

  const branchRowsFromApi = useMemo(() => toProgressRows(api.branch, (row) => row.branchName), [api.branch])
  const headquartersRowsFromApi = useMemo(() => toProgressRows(api.headquarters, (row) => row.departmentName), [api.headquarters])
  const mainframeRowsFromApi = useMemo(() => api.mainframe.map((row) => [row.organizationName, numberOrZero(row.notOfflineCount) + numberOrZero(row.offlineCount), numberOrZero(row.offlineCount)] as ProgressRow), [api.mainframe])
  const branchMainframeRows = useMemo(() => mainframeRowsFromApi.filter(([name]) => name !== "总行"), [mainframeRowsFromApi])
  const headquartersMainframeRows = useMemo(() => mainframeRowsFromApi.filter(([name]) => name === "总行"), [mainframeRowsFromApi])
  const branchSystemTotals = useMemo(() => api.source === "api" ? api.branch.reduce((sum, row) => ({ done: sum.done + numberOrZero(row.singleTrackCount), total: sum.total + numberOrZero(row.includedSystemCount) }), { done: 0, total: 0 }) : { done: 35, total: 50 }, [api.branch, api.source])
  const headquartersSystemTotals = useMemo(() => api.source === "api" ? api.headquarters.reduce((sum, row) => ({ done: sum.done + numberOrZero(row.singleTrackCount), total: sum.total + numberOrZero(row.includedSystemCount) }), { done: 0, total: 0 }) : { done: 38, total: 68 }, [api.headquarters, api.source])
  const mainframeHead = api.mainframe.find((row) => row.organizationName === "总行")
  const mainframeBranchTotals = api.mainframe.filter((row) => row.organizationName !== "总行").reduce((sum, row) => ({ done: sum.done + numberOrZero(row.offlineCount), total: sum.total + numberOrZero(row.offlineCount) + numberOrZero(row.notOfflineCount) }), { done: 0, total: 0 })
  const mainframeHeadTotals = mainframeHead ? { done: numberOrZero(mainframeHead.offlineCount), total: numberOrZero(mainframeHead.offlineCount) + numberOrZero(mainframeHead.notOfflineCount) } : { done: 0, total: 0 }
  const productRowsFromApi = useMemo(() => api.products.map((row) => [row.categoryName, numberOrZero(row.totalCount), numberOrZero(row.replacedCount), numberOrZero(row.unreplacedCount)] as ProductProgressRow), [api.products])

  const useApiData = api.source === "api"
  const systemHeadRows = sortProgressRows(useApiData ? headquartersRowsFromApi : headRows)
  const systemBranchRows = sortProgressRows(useApiData ? branchRowsFromApi : branchRows)
  const machineHeadRows = useApiData ? headquartersMainframeRows : headMachineRows
  const machineBranchRows = useApiData ? branchMainframeRows : branchMachineRows
  const productDisplayRows = sortProductRows(useApiData ? productRowsFromApi : productRows.map(([name, total, replacedRate]) => [name, total, Math.round(total * replacedRate / 100), total - Math.round(total * replacedRate / 100)] as ProductProgressRow))
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-[1800px] px-4 pb-5 md:px-6">
        <HeroBanner title="信创管理驾驶舱" subtitle="信创改造 · 国产替代 · 系统适配 · 平稳迁移" />
        <div className="grid items-stretch gap-3 lg:grid-cols-2">
          <div className="flex min-w-0 flex-col gap-3">
            <div className="flex h-full flex-col rounded-xl border-2 border-primary/70 bg-card p-2.5">
              <div className="mb-2 border-b border-border pb-1.5">
                <h1 className="text-base font-black text-primary">系统改造</h1>
              </div>
              {systemView ? (
                <DetailTable
                  key={`system-detail-${systemView}`}
                  title={systemView === "head" ? "总行系统改造进展明细" : systemView === "branch" ? "分行系统改造进展明细" : systemView === "annual-head" ? "总行年度完成明细" : "分行年度完成明细"}
                  rows={systemView === "head" ? systemHeadRows : systemView === "branch" ? systemBranchRows : systemView === "annual-head" ? annualHeadRows : annualBranchRows}
                  branch={systemView === "branch" || systemView === "annual-branch"}
                  onBack={() => setSystemView(null)}
                />
              ) : (
                <div className="flex flex-col gap-6">
                  <Panel title="一般系统信创进度">
                    <div className="grid gap-2 md:grid-cols-2">
                      <div className="rounded-lg border border-border/70 bg-card p-2">
                        <RingStat
                          label="已单轨"
  ratio={(412 / 626) * 100}
  value="412"
  sub="总计 626 个系统"
  color={colors.blue}
                        />
                        <div className="mt-2 border-t border-border/60 pt-2">
                          <ProgressPair
                            onSelect={setSystemView}
                            items={[
                              { label: "总行系统进展", done: headquartersSystemTotals.done, total: headquartersSystemTotals.total, color: colors.blue, view: "head" },
                              { label: "分行系统进展", done: branchSystemTotals.done, total: branchSystemTotals.total, color: colors.teal, view: "branch" },
                            ]}
                          />
                        </div>
                      </div>
                      <div className="rounded-lg border border-border/70 bg-card p-2">
                        <RingStat
                          label="2026年任务进度"
  ratio={(58 / 235) * 100}
  value="58"
  sub="总计 235 个系统"
  color={colors.violet}
                        />
                        <div className="mt-2 border-t border-border/60 pt-2">
                          <ProgressPair
                            onSelect={setSystemView}
                            items={[
                              { label: "总行任务进度", done: annualOverview.head.done, total: annualOverview.head.total, color: colors.violet, view: "annual-head" },
                              { label: "分行任务进度", done: annualOverview.branch.done, total: annualOverview.branch.total, color: colors.amber, view: "annual-branch" },
                            ]}
                          />
                        </div>
                      </div>
                    </div>
                  </Panel>
                  <Panel title="核心系统信创进度">
                    <CoreBars />
                  </Panel>
                </div>
              )}
            </div>
            <div className="rounded-xl border-2 border-primary/70 bg-card p-2.5">
              <div className="mb-2 border-b border-border pb-1.5">
                <h2 className="text-base font-black text-primary">国密改造和密评进度</h2>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
<ModificationRing title="密评工作" ratio={30} done="30" undone="70" color={colors.amber} />
  <ModificationRing title="国密改造" ratio={31.25} done="25" undone="55" color={colors.teal} />
              </div>
            </div>
          </div>
          <div className="flex min-w-0 flex-col gap-3">
            <div className="flex h-full flex-col rounded-xl border-2 border-primary/70 bg-card p-2.5">
              <div className="mb-2 border-b border-border pb-1.5">
                <h2 className="text-base font-black text-primary">产品替代</h2>
              </div>
              <div className="flex flex-col gap-4">
                <Panel title="产品替代进度">
                  <ProductBars rows={productDisplayRows} />
                </Panel>
                <Panel title="麒麟界面推广进度">
                  <div className="grid gap-2 md:grid-cols-2">
                    <RingStat label="已推广" ratio={(16.68 / (16.68 + 68.58)) * 100} value="16,680" sub="未推广 68,580" color={colors.violet} />
                    <RingStat label="年度已推广" ratio={(16.68 / (16.68 + 37.24)) * 100} value="16,680" sub="年度未推广 37,240" color={colors.violet} />
                  </div>
                </Panel>
                <Panel title="小型机下线进展">
                  {machineView ? (
                    <div className="flex flex-col gap-2">
                      <button type="button" onClick={() => setMachineView(null)} className="flex w-fit items-center gap-1 rounded-md border border-border/70 bg-secondary/40 px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:bg-secondary/70">
                        <ChevronUp className="size-3.5 -rotate-90" />
                        返回小型机下线进展
                      </button>
                      <p className="text-xs font-semibold text-foreground">{machineView === "head" ? "总行各部门下线进展" : "分行各部门下线进展"}</p>
                      <SmallMachineChart rows={machineView === "head" ? machineHeadRows : machineBranchRows} />
                    </div>
                  ) : (
                    <MachineOverview onSelect={setMachineView} head={mainframeHeadTotals} branch={mainframeBranchTotals} />
                  )}
                </Panel>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default TrustedDashboard
