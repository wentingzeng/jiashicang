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

function toProgressRows<T extends { remainingCount: number; includedSystemCount: number }>(rows: T[], name: (row: T) => string): ProgressRow[] {
  return rows.map((row) => [name(row), numberOrZero(row.includedSystemCount), numberOrZero(row.remainingCount)])
}
const branchRows: Array<[string, number, number]> = [["南京分行", 9, 5], ["苏州分行", 6, 3], ["北京分行", 6, 4], ["上海分行", 5, 3], ["青岛分行", 5, 2], ["福州分行", 9, 6], ["深圳分行", 4, 2], ["西安分行", 6, 4]]
const headRows: Array<[string, number, number]> = [["公司金融部\n数字支撑室", 4, 2], ["绿色金融部\n临客部", 4, 0], ["普惠金融部\n村镇服务", 4, 0], ["机构业务部", 5, 1], ["国际业务部\n贸易行管", 24, 9], ["投资银行部", 2, 1], ["零售金融部\n消费者权益保护办公室", 23, 8]]
const productRows: Array<[string, number, number]> = [["操作系统", 420, 55.26], ["服务器", 180, 64.59], ["金融机具", 310, 38.64], ["数据库", 260, 73.04], ["中间件", 238, 58.4], ["网络设备", 225, 67.32], ["A4单色打印机", 198, 38.15], ["终端", 360, 61.2], ["存储", 142, 48.7]]
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
  const DONE = "#7dd3fc"
  const UNDONE = "#e8f4fd"
  const plotWidth = 760
  const plotHeight = 220
  const left = 58
  const right = 12
  const top = 12
  const bottom = 42
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
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${plotWidth} ${plotHeight}`} className="h-auto min-h-[240px] w-full min-w-[680px]" role="img" aria-label="其他关键品类产品存量替代进度">
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
              <g key={name} className="group">
                <title>{`${name}：总计 ${format(total)}，已替代 ${format(safeReplaced)}，未替代 ${format(safeUnreplaced)}，替代率 ${ratio.toFixed(1)}%`}</title>
                <rect x={x - width / 2} y={baseY - barHeight} width={width} height={barHeight} rx="5" fill={UNDONE} />
                <rect x={x - width / 2} y={baseY - replacedHeight} width={width} height={replacedHeight} rx="5" fill={DONE} />
                {replacedHeight >= 18 && (
                  <text x={x} y={baseY - replacedHeight / 2 + 3} textAnchor="middle" className="fill-sky-950 text-[9px] font-semibold">{format(safeReplaced)}</text>
                )}
                {barHeight - replacedHeight >= 18 && (
                  <text x={x} y={baseY - replacedHeight - (barHeight - replacedHeight) / 2 + 3} textAnchor="middle" className="fill-slate-700 text-[9px] font-semibold">{format(safeUnreplaced)}</text>
                )}
                {replacedHeight < 18 && safeReplaced > 0 && (
                  <text x={x - width / 2 - 4} y={baseY - replacedHeight / 2 + 3} textAnchor="end" className="fill-sky-950 text-[9px] font-semibold">{format(safeReplaced)}</text>
                )}
                {barHeight - replacedHeight < 18 && safeUnreplaced > 0 && (
                  <text x={x + width / 2 + 4} y={baseY - replacedHeight - Math.max(8, (barHeight - replacedHeight) / 2) + 3} textAnchor="start" className="fill-slate-700 text-[9px] font-semibold">{format(safeUnreplaced)}</text>
                )}
                <text x={x} y={plotHeight - 16} textAnchor="middle" className="fill-muted-foreground text-[10px]">{name}</text>
                <foreignObject x={Math.max(4, Math.min(plotWidth - 148, x - 74))} y={Math.max(4, baseY - barHeight - 88)} width="144" height="80" className="pointer-events-none opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="rounded-md border border-border bg-card p-2 text-left text-[10px] leading-4 text-foreground shadow-lg">
                    <div className="font-semibold">{name}</div>
                    <div>已替代：{format(safeReplaced)}</div>
                    <div>未替代：{format(safeUnreplaced)}</div>
                    <div>替代率：{ratio.toFixed(1)}%</div>
                    <div>总数量：{format(total)}</div>
                  </div>
                </foreignObject>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}

function SmallMachineChart({ rows }: { rows: Array<[string, number, number]> }) {
  const UNDONE = "#63b3ed"
  const DONE = "#38b2ac"
  const max = Math.max(...rows.map(([, total]) => numberOrZero(total)), 0)
  const niceMax = Math.max(180, Math.ceil(max / 180) * 180)
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
                      <p>已下线：{done}</p>
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
      <div className="max-h-[420px] overflow-y-auto rounded-md border border-border/60">
        <table className="w-full text-left text-xs">
          <thead className="sticky top-0 border-b border-border bg-card text-muted-foreground">
            <tr>
              <th className="px-2 py-1.5">序号</th>
              <th className="px-2 py-1.5">{branch ? "分行名称" : "所属部门"}</th>
              <th className="px-2 py-1.5 text-right">总数</th>
              <th className="px-2 py-1.5 text-right">剩余</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {rows.map(([name, total, remaining], i) => (
              <tr key={name}>
                <td className="px-2 py-1.5 text-muted-foreground">{i + 1}</td>
                <td className="whitespace-pre-line px-2 py-1.5 font-medium">{name}</td>
                <td className="px-2 py-1.5 text-right font-mono">{total}</td>
                <td className="px-2 py-1.5 text-right font-mono text-muted-foreground">{remaining}</td>
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
  const mainframeRowsFromApi = useMemo(() => api.mainframe.map((row) => [row.organizationName, numberOrZero(row.notOfflineCount) + numberOrZero(row.offlineCount), numberOrZero(row.notOfflineCount)] as ProgressRow), [api.mainframe])
  const branchMainframeRows = useMemo(() => mainframeRowsFromApi.filter(([name]) => name !== "总行"), [mainframeRowsFromApi])
  const headquartersMainframeRows = useMemo(() => mainframeRowsFromApi.filter(([name]) => name === "总行"), [mainframeRowsFromApi])
  const branchSystemTotals = useMemo(() => api.source === "api" ? api.branch.reduce((sum, row) => ({ done: sum.done + numberOrZero(row.singleTrackCount), total: sum.total + numberOrZero(row.includedSystemCount) }), { done: 0, total: 0 }) : { done: 35, total: 50 }, [api.branch, api.source])
  const headquartersSystemTotals = useMemo(() => api.source === "api" ? api.headquarters.reduce((sum, row) => ({ done: sum.done + numberOrZero(row.singleTrackCount), total: sum.total + numberOrZero(row.includedSystemCount) }), { done: 0, total: 0 }) : { done: 38, total: 68 }, [api.headquarters, api.source])
  const mainframeHead = api.mainframe.find((row) => row.organizationName === "总行")
  const mainframeBranchTotals = api.mainframe.filter((row) => row.organizationName !== "总行").reduce((sum, row) => ({ done: sum.done + numberOrZero(row.offlineCount), total: sum.total + numberOrZero(row.offlineCount) + numberOrZero(row.notOfflineCount) }), { done: 0, total: 0 })
  const mainframeHeadTotals = mainframeHead ? { done: numberOrZero(mainframeHead.offlineCount), total: numberOrZero(mainframeHead.offlineCount) + numberOrZero(mainframeHead.notOfflineCount) } : { done: 0, total: 0 }
  const productRowsFromApi = useMemo(() => api.products.map((row) => [row.categoryName, numberOrZero(row.totalCount), numberOrZero(row.replacedCount), numberOrZero(row.unreplacedCount)] as ProductProgressRow), [api.products])

  const useApiData = api.source === "api"
  const systemHeadRows = useApiData ? headquartersRowsFromApi : headRows
  const systemBranchRows = useApiData ? branchRowsFromApi : branchRows
  const machineHeadRows = useApiData ? headquartersMainframeRows : headMachineRows
  const machineBranchRows = useApiData ? branchMainframeRows : branchMachineRows
  const productDisplayRows = useApiData ? productRowsFromApi : productRows
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-[1800px] px-4 pb-5 md:px-6">
        <HeroBanner title="信创管理驾驶舱" subtitle="信创改造 · 国产替代 · 系统适配 · 平稳迁移" />
        <div className="mb-2 flex items-center justify-end gap-2 text-[11px]">
          <span className={`rounded-full px-2 py-0.5 font-semibold ${useApiData ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
            {useApiData ? "真实接口数据" : "Mock 演示数据"}
          </span>
          {api.error && <span className="text-muted-foreground">{api.error}</span>}
        </div>
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
                <div className="flex flex-col gap-2">
                  <Panel title="一般系统信创进度">
                    <div className="grid gap-2 md:grid-cols-2">
                      <div className="rounded-lg border border-border/70 bg-card p-2">
                        <RingStat
                          label="已单轨"
                          ratio={((headquartersSystemTotals.done + branchSystemTotals.done) / Math.max(1, headquartersSystemTotals.total + branchSystemTotals.total)) * 100}
                          value={`${headquartersSystemTotals.done + branchSystemTotals.done}`}
                          sub={`总计 ${headquartersSystemTotals.total + branchSystemTotals.total} 个系统`}
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
                          ratio={((annualOverview.head.done + annualOverview.branch.done) / (annualOverview.head.total + annualOverview.branch.total)) * 100}
                          value={`${annualOverview.head.done + annualOverview.branch.done}`}
                          sub={`总计 ${annualOverview.head.total + annualOverview.branch.total} 个系统`}
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
                <Panel title="其他关键品类产品存量替代进度">
                  <p className="mb-1.5 text-xs font-semibold">各品类进度</p>
                  <ProductBars rows={productDisplayRows} />
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
