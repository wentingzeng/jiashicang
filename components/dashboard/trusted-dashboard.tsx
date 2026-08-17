"use client"

import { useState } from "react"
import { BarChart3, CheckCircle2, CircleAlert, FileCog, Printer, ServerCog, Settings2, TerminalSquare } from "lucide-react"
import { HeroBanner } from "@/components/dashboard/hero-banner"

const palette = {
  blue: "#2456c7",
  violet: "#6f5bd3",
  teal: "#16a6a1",
  amber: "#d99435",
}

const rolloutRows = [
  ["通用办公软件", 420, 55.26],
  ["设计制图软件", 180, 64.59],
  ["管理支撑软件", 310, 38.64],
  ["开发工具软件", 260, 73.04],
  ["数据分析软件", 225, 67.32],
  ["安全管理软件", 290, 47.2],
]

const branchRows = [
  ["南京分行", 9, 5], ["苏州分行", 6, 3], ["北京分行", 6, 4], ["上海分行", 5, 3], ["青岛分行", 5, 2], ["福州分行", 9, 6], ["深圳分行", 4, 2], ["西安分行", 6, 4],
]

const departmentRows = [
  ["公司金融部\n数字支撑室", 4, 2], ["绿色金融部\n临客部", 4, 0], ["普惠金融部\n村镇服务", 4, 0], ["机构业务部", 5, 1], ["国际业务部\n贸易行管", 24, 9], ["投资银行部", 2, 1], ["零售金融部\n消费者权益保护办公室", 23, 8],
]

function Panel({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return <section className={`overflow-hidden rounded-xl border border-border/80 bg-card shadow-[0_8px_25px_oklch(0.35_0.06_240/8%)] ${className}`}>
    <header className="flex items-center gap-3 border-b border-border/70 bg-gradient-to-r from-secondary/70 to-card px-4 py-3"><span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary"><BarChart3 className="size-4" /></span><h2 className="text-base font-bold text-foreground">{title}</h2></header>
    <div className="p-4">{children}</div>
  </section>
}

function Donut({ value, label, total, color = palette.blue }: { value: number; label: string; total: string; color?: string }) {
  const circumference = 2 * Math.PI * 42
  const offset = circumference * (1 - value / 100)
  return <div className="flex min-h-[132px] items-center gap-3 rounded-xl border border-border/70 bg-secondary/25 p-3">
    <div className="relative size-[92px] shrink-0"><svg viewBox="0 0 100 100" className="size-full -rotate-90"><circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="10" className="text-secondary" /><circle cx="50" cy="50" r="42" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} /></svg><div className="absolute inset-0 flex flex-col items-center justify-center"><strong className="font-mono text-xl font-black text-foreground">{value.toFixed(2)}%</strong><span className="text-[10px] text-muted-foreground">完成率</span></div></div>
    <div><p className="text-sm font-semibold text-foreground">{label}</p><p className="mt-1 font-mono text-xl font-black text-primary">{total}</p><p className="mt-1 text-xs text-muted-foreground">已完成数量</p></div>
  </div>
}

function HorizontalBars() {
  const rows = [["对公核心", 66, 531], ["零售存款", 663, 1031], ["总账核算", 664, 859]]
  return <div className="flex min-w-0 flex-col gap-2">{rows.map(([label, actual, plan]) => <div key={label} className="min-w-0"><div className="mb-2 flex items-center justify-between gap-3 text-sm"><span className="truncate font-semibold text-foreground">{label}</span><span className="shrink-0 text-xs text-muted-foreground">实际 / 计划</span></div><div className="relative flex h-11 min-w-0 flex-col justify-between overflow-hidden rounded-md bg-secondary/45 p-1"><div className="flex h-7 min-w-0 items-center rounded bg-primary px-3 text-xs font-bold text-primary-foreground" style={{ width: `${Math.max(22, (actual / plan) * 100)}%` }}><span className="truncate">实际天数 {actual}</span></div><div className="flex h-7 min-w-0 items-center rounded bg-chart-4 px-3 text-xs font-bold text-primary-foreground" style={{ width: "100%" }}><span className="truncate">计划天数 {plan.toLocaleString()}</span></div></div></div>)}</div>
}

function MiniBars({ rows }: { rows: Array<[string, number, number]> }) {
  const maxValue = Math.max(...rows.map(([, value]) => value), 1)
  return <div className="flex h-48 items-end gap-2 border-b border-l border-border px-3 pb-0 pt-4"><div className="mr-1 flex h-full flex-col justify-between text-[10px] text-muted-foreground"><span>{maxValue}</span><span>{Math.round(maxValue * 0.66)}</span><span>{Math.round(maxValue * 0.33)}</span><span>0</span></div>{rows.map(([label, value, percent]) => { return <div key={label} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1"><span className="font-mono text-[10px] font-bold text-primary">{percent}%</span><div className="flex w-full flex-col justify-end" style={{ height: `${Math.max(18, (value / maxValue) * 128)}px` }}><div className="w-full rounded-t-md bg-primary" style={{ height: `${percent}%` }} /><div className="w-full bg-secondary" style={{ height: `${100 - percent}%` }} /></div><span className="max-w-full truncate text-[10px] text-muted-foreground">{label}</span></div>})}</div>
}

function SmallMachineBars() {
  const rows = [["南京", 328, 86], ["苏州", 286, 74], ["北京", 240, 62], ["上海", 178, 48], ["其他", 120, 36]]
  const maxValue = 360
  return <div className="relative h-44 border-b border-l border-border pl-7 pt-4"><div className="absolute inset-y-4 left-0 flex flex-col justify-between text-[10px] text-muted-foreground"><span>360</span><span>240</span><span>120</span><span>0</span></div><div className="flex h-full items-end gap-3">{rows.map(([label, remaining, offline]) => <div key={label} className="flex min-w-0 flex-1 flex-col items-center"><div className="flex w-full flex-col justify-end" style={{ height: `${((remaining + offline) / maxValue) * 112}px` }}><div className="w-full rounded-t bg-primary" style={{ height: `${(remaining / (remaining + offline)) * 100}%` }} /><div className="w-full bg-accent" style={{ height: `${(offline / (remaining + offline)) * 100}%` }} /></div><span className="mt-1 max-w-full truncate text-[10px] text-muted-foreground">{label}</span></div>)}</div><div className="absolute bottom-0 right-0 flex gap-3 text-[10px] text-muted-foreground"><span><i className="mr-1 inline-block size-2 rounded-sm bg-primary" />尚未下线数</span><span><i className="mr-1 inline-block size-2 rounded-sm bg-accent" />已下线数</span></div></div>
}

function DetailTable({ title, rows, branch = false, className = "" }: { title: string; rows: Array<[string, number, number]>; branch?: boolean; className?: string }) {
  const [page, setPage] = useState(0)
  const pageSize = 5
  const pages = Math.max(1, Math.ceil(rows.length / pageSize))
  const visibleRows = rows.slice(page * pageSize, page * pageSize + pageSize)
  return <Panel className={className} title={title}><p className="mb-3 text-xs text-muted-foreground">{branch ? "各分行系统改造进展情况" : "各部门系统改造进展情况"}</p><div className="max-h-[18rem] overflow-y-auto rounded-lg border border-border/60"><table className="w-full min-w-[360px] text-left text-xs"><thead className="sticky top-0 z-10 border-b border-border bg-card text-muted-foreground"><tr><th className="px-3 py-2">序号</th><th className="px-3 py-2">{branch ? "分行名称" : "所属部门"}</th><th className="px-3 py-2 text-right">总数</th><th className="px-3 py-2 text-right">剩余数量</th></tr></thead><tbody className="divide-y divide-border/60">{visibleRows.map(([name, total, remaining], i) => <tr key={name}><td className="px-3 py-2 text-muted-foreground">{page * pageSize + i + 1}</td><td className="whitespace-pre-line px-3 py-2 font-medium text-foreground">{name}</td><td className="px-3 py-2 text-right font-mono text-foreground">{total}</td><td className="px-3 py-2 text-right font-mono text-muted-foreground">{remaining}</td></tr>)}</tbody></table></div><div className="mt-3 flex items-center justify-between gap-2 text-xs text-muted-foreground"><span>{page * pageSize + 1}-{Math.min((page + 1) * pageSize, rows.length)} / {rows.length + 34}</span><div className="flex gap-1"><button type="button" aria-label="上一页" onClick={() => setPage((current) => Math.max(0, current - 1))} disabled={page === 0} className="rounded px-2 py-1 disabled:opacity-40">‹</button>{Array.from({ length: pages }, (_, index) => <button type="button" key={index} onClick={() => setPage(index)} className={`rounded px-2 py-1 ${page === index ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>{index + 1}</button>)}<button type="button" aria-label="下一页" onClick={() => setPage((current) => Math.min(pages - 1, current + 1))} disabled={page === pages - 1} className="rounded px-2 py-1 disabled:opacity-40">›</button></div></div></Panel>
}

export function TrustedDashboard() {
  return <div className="min-h-screen bg-background text-foreground"><div className="relative mx-auto max-w-[1800px] px-4 pb-8 md:px-6">
    <HeroBanner title="信创管理驾驶舱" subtitle="信创改造 · 国产替代 · 系统适配 · 平稳迁移" />
    <div className="grid min-w-0 items-stretch gap-5 lg:grid-cols-12">
      <div className="order-1 col-span-12 flex min-w-0 flex-col gap-5 lg:col-span-7"><Panel title="一般系统信创进度"><div className="grid gap-4 md:grid-cols-2"><div><h3 className="mb-3 text-sm font-bold text-foreground">总体进度</h3><Donut value={65.81} label="已替代" total="412" /></div><div><h3 className="mb-3 text-sm font-bold text-foreground">2026年任务进度</h3><Donut value={24.68} label="已完成" total="58" color={palette.violet} /></div></div></Panel><Panel title="麒麟界面推广进度"><div className="grid gap-4 md:grid-cols-2"><div><h3 className="mb-3 text-sm font-bold text-foreground">总体进度</h3><Donut value={19.56} label="已推广" total="16.68K" color={palette.violet} /></div><div><h3 className="mb-3 text-sm font-bold text-foreground">2026年任务进度</h3><Donut value={30.93} label="年度已推广" total="16.68K" color={palette.violet} /></div></div></Panel><Panel title="软件类产品许可部署进度"><p className="mb-3 text-sm font-semibold text-foreground">总体进度</p><MiniBars rows={rolloutRows} /></Panel><Panel title="国产改造和替代进度"><p className="mb-4 text-sm font-semibold text-foreground">总体进度</p><div className="grid grid-cols-2 gap-3">{[["密评工作", 100, 30], ["国密改造", 80, 25]].map(([label, total, done]) => <div key={label} className="rounded-xl bg-secondary/60 p-4"><p className="text-sm font-bold text-foreground">{label}</p><p className="mt-2 font-mono text-3xl font-black text-primary">{total}</p><p className="text-xs text-muted-foreground">总数</p><div className="mt-3 text-xs text-muted-foreground">已改造数 <strong className="font-mono text-accent">{done}</strong></div></div>)}</div></Panel></div>
      <section className="order-2 col-span-12 min-w-0 rounded-xl border-4 border-primary/80 bg-card p-4 shadow-[0_10px_35px_oklch(0.35_0.06_240/10%)] lg:col-span-5"><div className="border-b border-border pb-3 text-center"><h2 className="text-xl font-black text-primary">核心指标</h2><p className="mt-1 text-xs text-muted-foreground">信创改造关键进展</p></div><div className="p-1"><h3 className="mb-3 text-sm font-bold text-foreground">核心系统信创进度</h3><HorizontalBars /></div></section>
      <div className="order-3 col-span-12 grid min-w-0 gap-5 lg:grid-cols-2"><Panel title="A4单色打印机存量替代进度"><Donut value={38.15} label="推广数" total="4,572" color={palette.violet} /></Panel><Panel title="小型机下线进展"><SmallMachineBars /></Panel></div>
      <div className="order-4 col-span-12 grid min-w-0 gap-5 lg:grid-cols-2"><DetailTable className="flex flex-col" title="总行系统改造进展明细" rows={departmentRows} /><DetailTable className="flex flex-col" title="分行系统改造进展明细" rows={branchRows} branch /></div>
    </div>
  </div></div>
}
