"use client"

import { useState } from "react"
import { BarChart3, CheckCircle2, CircleAlert, FileCog, Printer, ServerCog, Settings2, TerminalSquare } from "lucide-react"
import { HeroBanner } from "@/components/dashboard/hero-banner"

const palette = {
  blue: "#4ba8d8",
  violet: "#8494d8",
  teal: "#42bdb7",
  amber: "#e5b45c",
}

const rolloutRows = [
  ["操作系统", 420, 55.26],
  ["服务器", 180, 64.59],
  ["金融机具", 310, 38.64],
  ["数据库", 260, 73.04],
  ["网络设备", 225, 67.32],
]

const branchRows = [
  ["南京分行", 9, 5], ["苏州分行", 6, 3], ["北京分行", 6, 4], ["上海分行", 5, 3], ["青岛分行", 5, 2], ["福州分行", 9, 6], ["深圳分行", 4, 2], ["西安分行", 6, 4],
]

const departmentRows = [
  ["公司金融部\n数字支撑室", 4, 2], ["绿色金融部\n临客部", 4, 0], ["普惠金融部\n村镇服务", 4, 0], ["机构业务部", 5, 1], ["国际业务部\n贸易行管", 24, 9], ["投资银行部", 2, 1], ["零售金融部\n消费者权益保护办公室", 23, 8],
]

function Panel({ title, children, className = "" }: { title: React.ReactNode; children: React.ReactNode; className?: string }) {
  return <section className={`overflow-hidden rounded-lg border border-border/80 bg-card shadow-[0_6px_18px_oklch(0.35_0.06_240/8%)] ${className}`}>
    <header className="flex items-center gap-2 border-b border-border/70 bg-gradient-to-r from-secondary/70 to-card px-3 py-2"><div className="flex min-w-0 items-center gap-2"><span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary"><BarChart3 className="size-3.5" /></span><h2 className="min-w-0 truncate text-sm font-bold text-foreground">{title}</h2></div></header>
  <div className="flex flex-1 flex-col p-3">{children}</div>
  </section>
  }

function Donut({ value, label, total, color = palette.blue }: { value: number; label: string; total: string; color?: string }) {
  const circumference = 2 * Math.PI * 42
  const offset = circumference * (1 - value / 100)
  return <div className="flex min-h-[84px] items-center gap-2 rounded-lg border border-border/70 bg-secondary/25 p-2">
    <div className="relative size-[62px] shrink-0"><svg viewBox="0 0 100 100" className="size-full -rotate-90"><circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="12" className="text-secondary" /><circle cx="50" cy="50" r="42" fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} /></svg><div className="absolute inset-0 flex flex-col items-center justify-center"><strong className="font-mono text-[13px] font-black text-foreground">{value.toFixed(1)}%</strong></div></div>
    <div className="min-w-0"><p className="truncate text-xs font-semibold text-foreground">{label}</p><p className="mt-0.5 truncate font-mono text-base font-black text-primary">{total}</p></div>
  </div>
}

function HorizontalBars() {
  const rows = [["对公核心", 66, 531], ["零售存款", 663, 1031], ["总账核算", 664, 859]]
  return <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 py-1"><div className="mb-1 flex items-center justify-end gap-4 text-[10px] text-muted-foreground"><span><i className="mr-1 inline-block size-2 rounded-sm bg-[#4ba8d8]" />实际天数</span><span><i className="mr-1 inline-block size-2 rounded-sm bg-[#42bdb7]" />计划天数</span></div>{rows.map(([label, actual, plan]) => <div key={label} className="min-w-0"><div className="mb-2 flex items-center justify-between gap-3 text-sm"><span className="truncate font-semibold text-foreground">{label}</span></div><div className="relative flex h-16 min-w-0 flex-col justify-between overflow-hidden rounded-lg bg-secondary/45 p-1"><div className="flex h-6 min-w-0 items-center rounded bg-[#4ba8d8] px-3 text-xs font-bold text-white" style={{ width: `${Math.max(30, (actual / plan) * 100)}%` }}><span className="truncate">{actual}</span></div><div className="flex h-6 min-w-0 items-center rounded bg-[#42bdb7] px-3 text-xs font-bold text-white" style={{ width: "100%" }}><span className="truncate">{plan.toLocaleString()}</span></div></div></div>)}</div>
}

function MiniBars({ rows }: { rows: Array<[string, number, number]> }) {
  const maxValue = Math.max(...rows.map(([, value]) => value), 1)
  return <div><div className="relative mb-7 ml-7 flex h-32 items-end gap-1.5 border-b border-l border-border px-2 pb-0 pt-3"><div className="pointer-events-none absolute inset-y-0 -left-7 flex flex-col justify-between text-[9px] text-muted-foreground"><span>{maxValue}</span><span>{Math.round(maxValue * 0.5)}</span><span>0</span></div>{rows.map(([name, amount, ratio]) => <div key={name} className="group relative z-10 flex min-w-0 flex-1 flex-col items-center justify-end gap-0.5 rounded-t px-0.5"><div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden w-36 -translate-x-1/2 rounded-lg border border-border/60 bg-card px-2 py-1.5 text-[10px] shadow-lg group-hover:block"><div className="font-semibold text-foreground">{name}</div><div className="text-muted-foreground">已替代数量 <strong className="font-mono text-primary">{Math.round(amount * ratio / 100)}</strong>，未替代数量 <strong className="font-mono text-foreground">{amount - Math.round(amount * ratio / 100)}</strong></div></div><div className="flex w-full flex-col justify-end" style={{ height: `${Math.max(12, (amount / maxValue) * 82)}px` }}><div className="relative w-full rounded-t bg-[#4ba8d8] transition-colors group-hover:bg-primary" style={{ height: `${ratio}%` }}><span className="absolute inset-x-0 top-0 -translate-y-full text-center font-mono text-[8px] text-primary">{Number(ratio).toFixed(2)}%</span></div><div className="relative w-full bg-secondary" style={{ height: `${100 - ratio}%` }}><span className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-mono text-[8px] text-foreground">{Number(100 - ratio).toFixed(2)}%</span></div></div><span className="absolute -bottom-7 left-1/2 max-w-full -translate-x-1/2 truncate text-[9px] text-muted-foreground">{name}</span></div>)}</div></div>
}

function SmallMachineBars() {
  const rows = [["南京", 328, 86], ["苏州", 286, 74], ["北京", 240, 62], ["上海", 178, 48], ["其他", 120, 36]]
  const maxValue = 360
  return <div><div className="relative mb-7 ml-7 h-32 border-b border-l border-border pl-0 pt-3"><div className="pointer-events-none absolute inset-y-0 -left-7 flex flex-col justify-between text-[9px] text-muted-foreground"><span>{maxValue}</span><span>180</span><span>0</span></div><div className="flex h-full items-end gap-2">{rows.map(([name, rest, done]) => <div key={name} className="group relative z-10 flex min-w-0 flex-1 flex-col items-center rounded-t px-0.5"><div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden w-36 -translate-x-1/2 rounded-lg border border-border/60 bg-card px-2 py-1.5 text-[10px] shadow-lg group-hover:block"><div className="font-semibold text-foreground">{name}</div><div className="text-muted-foreground">尚未下线 <strong className="font-mono text-foreground">{rest}</strong>，已下线 <strong className="font-mono text-accent">{done}</strong></div></div><div className="flex w-full flex-col justify-end" style={{ height: `${((rest + done) / maxValue) * 82}px` }}><div className="relative w-full rounded-t bg-[#4ba8d8] transition-colors group-hover:bg-primary" style={{ height: `${(rest / (rest + done)) * 100}%` }}><span className="absolute inset-x-0 top-0 -translate-y-full text-center font-mono text-[9px] text-foreground">{rest}</span></div><div className="relative w-full bg-accent transition-colors group-hover:bg-primary/70" style={{ height: `${(done / (rest + done)) * 100}%` }}><span className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-mono text-[9px] text-white">{done}</span></div></div><span className="absolute -bottom-7 left-1/2 max-w-full -translate-x-1/2 truncate text-[9px] text-muted-foreground">{name}</span></div>)}</div><div className="absolute -top-1 right-0 flex gap-2 text-[9px] text-muted-foreground"><span><i className="mr-1 inline-block size-1.5 rounded-sm bg-primary" />未下线</span><span><i className="mr-1 inline-block size-1.5 rounded-sm bg-accent" />已下线</span></div></div></div>
}

function DetailTable({ title, rows, branch = false, className = "" }: { title: string; rows: Array<[string, number, number]>; branch?: boolean; className?: string }) {
  const [page, setPage] = useState(0)
  const pageSize = 5
  const pages = Math.max(1, Math.ceil(rows.length / pageSize))
  const visibleRows = rows.slice(page * pageSize, page * pageSize + pageSize)
  return <Panel className={className} title={title}><div className="max-h-40 overflow-y-auto rounded-md border border-border/60"><table className="w-full min-w-[320px] text-left text-xs"><thead className="sticky top-0 z-10 border-b border-border bg-card text-muted-foreground"><tr><th className="px-2 py-1.5">序号</th><th className="px-2 py-1.5">{branch ? "分行名称" : "所属部门"}</th><th className="px-2 py-1.5 text-right">总数</th><th className="px-2 py-1.5 text-right">剩余</th></tr></thead><tbody className="divide-y divide-border/60">{visibleRows.map(([name, total, remaining], i) => <tr key={name}><td className="px-2 py-1.5 text-muted-foreground">{page * pageSize + i + 1}</td><td className="whitespace-pre-line px-2 py-1.5 font-medium text-foreground">{name}</td><td className="px-2 py-1.5 text-right font-mono text-foreground">{total}</td><td className="px-2 py-1.5 text-right font-mono text-muted-foreground">{remaining}</td></tr>)}</tbody></table></div><div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-muted-foreground"><span>{page * pageSize + 1}-{Math.min((page + 1) * pageSize, rows.length)} / {rows.length + 34}</span><div className="flex gap-1"><button type="button" aria-label="上一页" onClick={() => setPage((current) => Math.max(0, current - 1))} disabled={page === 0} className="rounded px-1.5 py-0.5 disabled:opacity-40">‹</button>{Array.from({ length: pages }, (_, index) => <button type="button" key={index} onClick={() => setPage(index)} className={`rounded px-1.5 py-0.5 ${page === index ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>{index + 1}</button>)}<button type="button" aria-label="下一页" onClick={() => setPage((current) => Math.min(pages - 1, current + 1))} disabled={page === pages - 1} className="rounded px-1.5 py-0.5 disabled:opacity-40">›</button></div></div></Panel>
}

export function TrustedDashboard() {
  return <div className="min-h-screen bg-background text-foreground"><div className="relative mx-auto max-w-[1800px] px-4 pb-8 md:px-6">
    <HeroBanner title="信创管理驾驶舱" subtitle="信创改造 · 国产替代 · 系统适配 · 平稳迁移" />
    <div className="grid min-w-0 items-stretch gap-3 lg:grid-cols-12">
      <section className="order-1 col-span-12 min-w-0 rounded-xl border-2 border-primary/70 bg-card p-3 shadow-[0_8px_24px_oklch(0.35_0.06_240/8%)]"><div className="mb-2 flex items-center justify-between border-b border-border pb-2"><h2 className="text-base font-black text-primary">核心指标</h2><p className="text-[11px] text-muted-foreground">信创改造关键进展</p></div><div className="grid items-stretch gap-3 lg:grid-cols-3"><div className="grid gap-3"><Panel title="一般系统信创进度"><div className="grid gap-2 md:grid-cols-2"><div><h3 className="mb-1 text-[11px] font-bold text-foreground">总体进度</h3><Donut value={65.81} label="已单轨" total="412" /></div><div><h3 className="mb-1 text-[11px] font-bold text-foreground">2026年任务进度</h3><Donut value={24.68} label="已完成" total="58" color={palette.violet} /></div></div></Panel><Panel title="麒麟界面推广进度"><div className="grid gap-2 md:grid-cols-2"><div><h3 className="mb-1 text-[11px] font-bold text-foreground">总体进度</h3><Donut value={19.56} label="已推广" total="16.68K" color={palette.violet} /></div><div><h3 className="mb-1 text-[11px] font-bold text-foreground">2026年任务进度</h3><Donut value={30.93} label="年度已推广" total="16.68K" color={palette.violet} /></div></div></Panel></div><Panel className="flex flex-col" title="核心系统信创进度"><HorizontalBars /></Panel><div className="grid gap-3"><Panel title="A4单色打印机存量替代进度"><Donut value={38.15} label="推广数" total="4,572" color={palette.violet} /></Panel><Panel title="小型机下线进展"><SmallMachineBars /></Panel></div></div></section>
      <div className="order-2 col-span-12 grid min-w-0 gap-3 lg:grid-cols-2"><Panel title={<div className="flex min-w-0 items-center justify-between gap-3"><span className="truncate">其他关键品类产品存量替代进度</span><span className="flex shrink-0 gap-2 text-[9px] font-normal text-muted-foreground"><span><i className="mr-1 inline-block size-1.5 rounded-sm bg-[#4ba8d8]" />已替代</span><span><i className="mr-1 inline-block size-1.5 rounded-sm bg-secondary" />未替代</span></span></div>}><p className="mb-2 text-xs font-semibold text-foreground">各品类进度</p><MiniBars rows={rolloutRows} /></Panel><Panel title="国密改造和密评进度"><p className="mb-2 text-xs font-semibold text-foreground">总体进度</p><div className="grid grid-cols-2 gap-2"><div className="rounded-lg bg-secondary/60 p-2.5"><p className="text-xs font-bold text-foreground">密评工作</p><p className="mt-1 font-mono text-xl font-black text-primary">100</p><p className="text-[10px] text-muted-foreground">总数 · 已改造 <strong className="font-mono text-accent">30</strong></p></div><div className="rounded-lg bg-secondary/60 p-2.5"><p className="text-xs font-bold text-foreground">国密改造</p><p className="mt-1 font-mono text-xl font-black text-primary">80</p><p className="text-[10px] text-muted-foreground">总数 · 已改造 <strong className="font-mono text-accent">25</strong></p></div></div></Panel></div>
      <div className="order-4 col-span-12 grid min-w-0 gap-3 lg:grid-cols-2"><DetailTable className="flex flex-col" title="总行系统改造进展明细" rows={departmentRows} /><DetailTable className="flex flex-col" title="分行系统改造进展明细" rows={branchRows} branch /></div>
    </div>
  </div></div>
}
