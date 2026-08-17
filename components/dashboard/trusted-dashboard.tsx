"use client"

import { useState } from "react"
import { BarChart3, CheckCircle2, ChevronDown, CircleAlert, FileCog, Printer, ServerCog, Settings2, TerminalSquare } from "lucide-react"

const palette = {
  blue: "#2456c7",
  violet: "#6f5bd3",
  teal: "#16a6a1",
  amber: "#d99435",
}

const rolloutRows = [
  ["通用办公软件", 55.26, 55.26],
  ["设计制图软件", 14.74, 64.59],
  ["管理支撑软件", 51.26, 38.64],
  ["开发工具软件", 73.04, 26.96],
  ["数据分析软件", 32.68, 67.32],
  ["安全管理软件", 47.2, 33.94],
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
  return <div className="flex items-center gap-4 rounded-xl border border-border/70 bg-secondary/25 p-3">
    <div className="relative size-[116px] shrink-0"><svg viewBox="0 0 100 100" className="size-full -rotate-90"><circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="10" className="text-secondary" /><circle cx="50" cy="50" r="42" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} /></svg><div className="absolute inset-0 flex flex-col items-center justify-center"><strong className="font-mono text-xl font-black text-foreground">{value.toFixed(2)}%</strong><span className="text-[10px] text-muted-foreground">完成率</span></div></div>
    <div><p className="text-sm font-semibold text-foreground">{label}</p><p className="mt-1 font-mono text-xl font-black text-primary">{total}</p><p className="mt-1 text-xs text-muted-foreground">已完成数量</p></div>
  </div>
}

function HorizontalBars() {
  const rows = [["应用系统", 66, 531], ["数据库", 663, 1031], ["中间件", 664, 859]]
  return <div className="flex flex-col gap-5">{rows.map(([label, actual, plan]) => <div key={label}><div className="mb-2 flex items-center justify-between text-sm"><span className="font-semibold text-foreground">{label}</span><span className="text-xs text-muted-foreground">实际 / 计划</span></div><div className="flex flex-col gap-1.5"><div className="flex h-8 items-center rounded-r-md bg-primary px-3 text-sm font-bold text-primary-foreground" style={{ width: `${Math.max(20, (actual / plan) * 100)}%` }}>实际天数 {actual}</div><div className="flex h-8 items-center rounded-r-md bg-chart-4 px-3 text-sm font-bold text-primary-foreground" style={{ width: "100%" }}>计划天数 {plan.toLocaleString()}</div></div></div>)}</div>
}

function MiniBars({ rows }: { rows: Array<[string, number, number]> }) {
  return <div className="flex h-40 items-end gap-2 border-b border-l border-border px-3 pb-0 pt-4">{rows.map(([label, value, percent]) => <div key={label} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1"><span className="font-mono text-[10px] font-bold text-primary">{percent}%</span><div className="w-full rounded-t-md bg-primary" style={{ height: `${Math.max(16, value * 1.8)}px` }} /><span className="max-w-full truncate text-[10px] text-muted-foreground">{label}</span></div>)}</div>
}

function DetailTable({ title, rows, branch = false }: { title: string; rows: Array<[string, number, number]>; branch?: boolean }) {
  return <Panel title={title}><p className="mb-3 text-xs text-muted-foreground">{branch ? "各分行系统改造进展情况" : "各部门系统改造进展情况"}</p><table className="w-full text-left text-xs"><thead className="border-b border-border text-muted-foreground"><tr><th className="pb-2">序号</th><th className="pb-2">{branch ? "分行名称" : "所属部门"}</th><th className="pb-2 text-right">总数</th><th className="pb-2 text-right">剩余数量</th></tr></thead><tbody className="divide-y divide-border/60">{rows.map(([name, total, remaining], i) => <tr key={name}><td className="py-2 text-muted-foreground">{i + 1}</td><td className="whitespace-pre-line py-2 font-medium text-foreground">{name}</td><td className="py-2 text-right font-mono text-foreground">{total}</td><td className="py-2 text-right font-mono text-muted-foreground">{remaining}</td></tr>)}</tbody></table><div className="mt-3 flex justify-center gap-2 text-xs text-muted-foreground"><span>1-10/{rows.length + 34}</span><span className="rounded bg-primary px-2 py-1 text-primary-foreground">1</span><span className="px-2 py-1">2</span><span className="px-2 py-1">3</span><span className="px-2 py-1">4</span></div></Panel>
}

export function TrustedDashboard() {
  const [year, setYear] = useState("2026")
  return <div className="min-h-screen bg-background px-4 py-5 text-foreground md:px-6 lg:px-8"><div className="mx-auto max-w-[1760px] space-y-5">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Trusted Computing</p><h1 className="mt-1 text-3xl font-black tracking-tight text-foreground">信创管理驾驶舱</h1><p className="mt-2 text-sm text-muted-foreground">{year} 年度信创改造进度总览</p></div><label className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground">统计年度<select value={year} onChange={(e) => setYear(e.target.value)} className="bg-transparent font-semibold text-foreground outline-none"><option>2026</option><option>2025</option></select><ChevronDown className="size-4" /></label></div>
    <div className="grid gap-5 xl:grid-cols-[0.92fr_2.2fr_0.92fr]">
      <div className="flex flex-col gap-5"><Panel title="软件类产品许可部署进度"><p className="mb-3 text-sm font-semibold text-foreground">总体进度</p><MiniBars rows={rolloutRows} /></Panel><Panel title="国产改造和替代进度"><p className="mb-4 text-sm font-semibold text-foreground">总体进度</p><div className="grid grid-cols-2 gap-3">{[["翻译工作", 100, 30], ["国密改造", 80, 25]].map(([label, total, done]) => <div key={label} className="rounded-xl bg-secondary/60 p-4"><p className="text-sm font-bold text-foreground">{label}</p><p className="mt-2 font-mono text-3xl font-black text-primary">{total}</p><p className="text-xs text-muted-foreground">总数</p><div className="mt-3 text-xs text-muted-foreground">已改造数 <strong className="font-mono text-accent">{done}</strong></div></div>)}</div></Panel></div>
      <section className="rounded-xl border-4 border-primary/80 bg-card p-4 shadow-[0_10px_35px_oklch(0.35_0.06_240/10%)]"><div className="border-b border-border pb-3 text-center"><h2 className="text-xl font-black text-primary">核心指标</h2><p className="mt-1 text-xs text-muted-foreground">信创改造关键进展</p></div><div className="grid gap-4 p-2 lg:grid-cols-2"><div><h3 className="mb-3 text-sm font-bold text-foreground">一般系统信创进度</h3><Donut value={65.81} label="已替代" total="412" /><h3 className="mb-3 mt-4 text-sm font-bold text-foreground">2026年任务进度</h3><Donut value={24.68} label="已完成" total="58" color={palette.violet} /></div><div><h3 className="mb-3 text-sm font-bold text-foreground">核心系统信创进度</h3><HorizontalBars /></div><div><h3 className="mb-3 text-sm font-bold text-foreground">薄弱桌面操作系统推广进度</h3><Donut value={19.56} label="已推广" total="16.68K" color={palette.violet} /><h3 className="mb-3 mt-4 text-sm font-bold text-foreground">2026年任务进度</h3><Donut value={30.93} label="年度已推广" total="16.68K" color={palette.violet} /></div><div><h3 className="mb-3 text-sm font-bold text-foreground">A4单色打印机存量替代进度</h3><Donut value={38.15} label="推广数" total="4,572" color={palette.violet} /><h3 className="mb-3 mt-4 text-sm font-bold text-foreground">小型机下线进展</h3><MiniBars rows={[["南京", 328, 328], ["苏州", 286, 286], ["北京", 240, 240], ["上海", 178, 178], ["其他", 120, 120]]} /></div></div></section>
      <div className="flex flex-col gap-5"><DetailTable title="总行系统改造进展明细" rows={departmentRows} /><DetailTable title="分行系统改造进展明细" rows={branchRows} branch /></div>
    </div>
  </div></div>
}
