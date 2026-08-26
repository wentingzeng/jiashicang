"use client"

import { useState } from "react"
import { BarChart3, ChevronUp } from "lucide-react"
import { HeroBanner } from "@/components/dashboard/hero-banner"

const colors = { blue: "#4ba8d8", violet: "#8494d8", teal: "#42bdb7", amber: "#e5b45c" }
const branchRows: Array<[string, number, number]> = [["南京分行", 9, 5], ["苏州分行", 6, 3], ["北京分行", 6, 4], ["上海分行", 5, 3], ["青岛分行", 5, 2], ["福州分行", 9, 6], ["深圳分行", 4, 2], ["西安分行", 6, 4]]
const headRows: Array<[string, number, number]> = [["公司金融部\n数字支撑室", 4, 2], ["绿色金融部\n临客部", 4, 0], ["普惠金融部\n村镇服务", 4, 0], ["机构业务部", 5, 1], ["国际业务部\n贸易行管", 24, 9], ["投资银行部", 2, 1], ["零售金融部\n消费者权益保护办公室", 23, 8]]
const productRows: Array<[string, number, number]> = [["操作系统", 420, 55.26], ["服务器", 180, 64.59], ["金融机具", 310, 38.64], ["数据库", 260, 73.04], ["网络设备", 225, 67.32], ["A4单色打印机", 198, 38.15], ["终端", 360, 61.2], ["存储", 142, 48.7]]
const smallMachineRows: Array<[string, number, number]> = [["南京", 328, 86], ["苏州", 286, 74], ["北京", 240, 62], ["上海", 178, 48], ["其他", 120, 36]]

function Panel({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`overflow-hidden rounded-lg border border-border/80 bg-card shadow-sm ${className}`}>
      <header className="flex items-center gap-2 border-b border-border/70 bg-secondary/50 px-3 py-2">
        <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary">
          <BarChart3 className="size-3.5" />
        </span>
        <h2 className="text-sm font-bold">{title}</h2>
      </header>
      <div className="p-3">{children}</div>
    </section>
  )
}

function StatCard({ label, value, sub, color = colors.blue }: { label: string; value: string; sub: string; color?: string }) {
  return (
    <div className="rounded-lg bg-secondary/40 px-3 py-2.5">
      <p className="text-xs font-semibold text-foreground">{label}</p>
      <p className="mt-1 truncate font-mono text-xl font-black" style={{ color }}>
        {value}
      </p>
      <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{sub}</p>
    </div>
  )
}

function CoreBars() {
  const rows: Array<[string, number, number]> = [["对公核心", 66, 531], ["零售存款", 663, 1031], ["总账核算", 664, 859]]
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[11px] text-muted-foreground">进度数值均为：实际天数 / 计划天数</p>
      {rows.map(([label, actual, plan]) => (
        <div key={label}>
          <div className="mb-1 flex justify-between text-xs font-semibold">
            <span>{label}</span>
            <span className="font-mono text-muted-foreground">{actual} / {plan} 天</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-primary" style={{ width: `${(actual / plan) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function ProductBars() {
  const DONE = "#7dd3fc"
  const UNDONE = "#e8f4fd"
  const max = Math.max(...productRows.map(([, n]) => n))
  const niceMax = Math.ceil(max / 100) * 100
  const chartHeight = 176
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(niceMax * f))
  return (
    <div className="pt-1">
      <div className="mb-2 flex items-center justify-end gap-3 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <i className="inline-block size-2.5 rounded-full" style={{ background: DONE }} />
          已替代
        </span>
        <span className="flex items-center gap-1.5">
          <i className="inline-block size-2.5 rounded-full" style={{ background: UNDONE }} />
          未替代
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
              {productRows.map(([name, amount, ratio]) => (
                <div key={name} className="group relative flex flex-col items-center justify-end">
                  <div className="pointer-events-none absolute bottom-full z-10 mb-2 hidden w-28 -translate-x-1/2 rounded border border-border bg-card p-1 text-[10px] shadow-lg group-hover:block">
                    {name}
                    <br />
                    总量 {amount}，已替代 {Math.round((amount * ratio) / 100)}
                  </div>
                  <div className="flex w-6 flex-col justify-end overflow-hidden rounded-t-md" style={{ height: `${Math.max(8, (amount / niceMax) * chartHeight)}px` }}>
                    <div style={{ height: `${ratio}%`, background: DONE }} />
                    <div style={{ height: `${100 - ratio}%`, background: UNDONE }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-around px-3 pt-1">
            {productRows.map(([name]) => (
              <span key={name} className="max-w-[46px] truncate text-center text-[10px] font-medium text-muted-foreground">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function SmallMachineChart() {
  const UNDONE = "#63b3ed"
  const DONE = "#38b2ac"
  const max = Math.max(...smallMachineRows.map(([, total]) => total))
  const niceMax = Math.ceil(max / 180) * 180
  const chartHeight = 176
  const ticks = [0, niceMax / 2, niceMax]
  return (
    <div className="pt-1">
      <div className="mb-2 flex items-center justify-end gap-3 text-[10px] text-muted-foreground">
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
              {smallMachineRows.map(([name, total, done]) => {
                const barHeight = Math.max(8, (total / niceMax) * chartHeight)
                const doneHeight = (done / total) * barHeight
                return (
                  <div key={name} className="flex flex-col items-center">
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
            {smallMachineRows.map(([name]) => (
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
  const [systemView, setSystemView] = useState<null | "head" | "branch">(null)
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-[1800px] px-4 pb-8 md:px-6">
        <HeroBanner title="信创管理驾驶舱" subtitle="信创改造 · 国产替代 · 系统适配 · 平稳迁移" />
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="flex min-w-0 flex-col gap-4">
            <div className="rounded-xl border-2 border-primary/70 bg-card p-3">
              <div className="mb-3 border-b border-border pb-2">
                <h1 className="text-base font-black text-primary">系统改造</h1>
              </div>
              <div className="mb-3 grid gap-2 md:grid-cols-2">
                <button type="button" onClick={() => setSystemView("head")} className="rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-left text-xs font-semibold text-primary hover:bg-primary/10">
                  点击查看总行系统改造明细
                </button>
                <button type="button" onClick={() => setSystemView("branch")} className="rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-left text-xs font-semibold text-primary hover:bg-primary/10">
                  点击查看分行系统改造明细
                </button>
              </div>
              {systemView ? (
                <DetailTable title={systemView === "head" ? "总行系统改造进展明细" : "分行系统改造进展明细"} rows={systemView === "head" ? headRows : branchRows} branch={systemView === "branch"} onBack={() => setSystemView(null)} />
              ) : (
                <div className="flex flex-col gap-3">
                  <Panel title="一般系统信创进度">
                    <div className="grid gap-2 md:grid-cols-2">
                      <StatCard label="已单轨" value="412" sub="未单轨 214" />
                      <StatCard label="年度已完成" value="58" sub="未完成 177" color={colors.violet} />
                    </div>
                  </Panel>
                  <Panel title="核心系统信创进度">
                    <CoreBars />
                  </Panel>
                </div>
              )}
            </div>
            <div className="rounded-xl border-2 border-primary/70 bg-card p-3">
              <div className="mb-3 border-b border-border pb-2">
                <h2 className="text-base font-black text-primary">国密改造和密评进度</h2>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <StatCard label="密评工作" value="100" sub="总数 · 已改造 30" color={colors.amber} />
                <StatCard label="国密改造" value="80" sub="总数 · 已改造 25" color={colors.teal} />
              </div>
            </div>
          </div>
          <div className="flex min-w-0 flex-col gap-4">
            <div className="rounded-xl border-2 border-primary/70 bg-card p-3">
              <div className="mb-3 border-b border-border pb-2">
                <h2 className="text-base font-black text-primary">产品替代</h2>
              </div>
              <div className="flex flex-col gap-3">
                <Panel title="麒麟界面推广进度">
                  <div className="grid gap-2 md:grid-cols-2">
                    <StatCard label="已推广" value="16.68K" sub="未推广 68.58K" color={colors.violet} />
                    <StatCard label="年度已推广" value="16.68K" sub="年度未推广 37.24K" color={colors.violet} />
                  </div>
                </Panel>
                <Panel title="小型机下线进展">
                  <SmallMachineChart />
                </Panel>
                <Panel title="其他关键品类产品存量替代进度">
                  <p className="mb-2 text-xs font-semibold">各品类进度</p>
                  <ProductBars />
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
