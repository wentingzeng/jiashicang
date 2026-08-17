"use client"

import { useState } from "react"
import { BarChart3, ChevronLeft, ChevronRight, PieChart, TrendingUp } from "lucide-react"
import { HeroBanner } from "@/components/dashboard/hero-banner"

const budgetTrend = [4000, 7000, 11570, 18400, 27480, 35380, 43090, 39570, 46800, 51560, 58000, 76000]
const budgetLabels = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
const executionTrend = [23.8, 38.8, 52.1, 18.9, 33.5, 24.0, 49.6, 23.5, 31.8, 42.8, 58.2, 76.0]
const categoryData = [
  ["服务", 72420, "#356be4"],
  ["硬件", 4742, "#8b8bea"],
  ["网络", 9870, "#f3ae32"],
  ["软件", 9620, "#e5796d"],
  ["其他", 12820, "#a5a7ef"],
] as const
const topDepartments = [
  ["科技创新中心", 61742.29],
  ["信息科技部", 19238.67],
  ["数据管理部", 14816.55],
  ["金融市场部", 9818.37],
  ["运营管理部", 5309.95],
  ["风险管理部", 4714.72],
  ["财务会计部", 3096.35],
  ["人力资源部", 1598.05],
  ["办公室", 1450.25],
] as const
const detailRows = Array.from({ length: 12 }, (_, index) => [
  `资源项目 ${index + 1}`,
  ["服务", "硬件", "网络", "软件"][index % 4],
  ["科技创新中心", "信息科技部", "数据管理部", "运营管理部"][index % 4],
  1200 + index * 386,
  ["已完成", "执行中", "待执行"][index % 3],
]) as Array<[string, string, string, number, string]>

function Panel({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return <section className={`overflow-hidden rounded-xl border border-border/80 bg-card shadow-[0_8px_24px_oklch(0.35_0.06_240/8%)] ${className}`}>
    <header className="flex items-center gap-2 border-b border-border/70 bg-gradient-to-r from-secondary/70 to-card px-3 py-2.5"><span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary"><BarChart3 className="size-4" /></span><h2 className="text-sm font-bold text-foreground">{title}</h2></header>
    <div className="p-3">{children}</div>
  </section>
}

function LineChart({ values, labels, color = "#356be4", suffix = "" }: { values: number[]; labels: string[]; color?: string; suffix?: string }) {
  const [selected, setSelected] = useState(values.length - 1)
  const max = Math.max(...values)
  const points = values.map((value, index) => `${(index / (values.length - 1)) * 100},${100 - (value / max) * 82 - 8}`).join(" ")
  return <div><div className="relative h-44 rounded-lg border border-border/70 bg-secondary/20 p-3"><div className="absolute inset-3 flex flex-col justify-between text-[9px] text-muted-foreground"><span>{max.toLocaleString()}{suffix}</span><span>{Math.round(max / 2).toLocaleString()}{suffix}</span><span>0{suffix}</span></div><svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-8 h-[calc(100%-3rem)] w-[calc(100%-4rem)] overflow-visible"><polyline points={points} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" /><polyline points={`0,100 ${points} 100,100`} fill={color} opacity="0.12" /></svg><div className="absolute inset-x-8 bottom-3 flex justify-between text-[9px] text-muted-foreground">{labels.map((label) => <button type="button" key={label} onClick={() => setSelected(labels.indexOf(label))} className="hover:text-primary">{label}</button>)}</div><div className="absolute inset-x-8 bottom-7 flex justify-between">{values.map((value, index) => <button type="button" key={`${index}-${value}`} aria-label={`${labels[index]} ${value}${suffix}`} onClick={() => setSelected(index)} className={`size-2 rounded-full border-2 border-card ${selected === index ? "scale-150 bg-accent" : "bg-primary"}`} />)}</div></div><p className="mt-1 text-center text-xs text-muted-foreground">{labels[selected]}：<strong className="font-mono text-foreground">{values[selected].toLocaleString()}{suffix}</strong></p></div>
}

function HorizontalRank() {
  const max = topDepartments[0][1]
  return <div className="flex flex-col gap-2">{topDepartments.map(([name, value], index) => <button type="button" key={name} title={`${name}：${value.toLocaleString()}万元`} className="group grid grid-cols-[7rem_1fr_4.5rem] items-center gap-2 text-left text-xs"><span className="truncate text-muted-foreground">{index + 1}. {name}</span><span className="h-5 overflow-hidden rounded bg-secondary"><span className="block h-full rounded bg-primary transition group-hover:bg-accent" style={{ width: `${(value / max) * 100}%` }} /></span><strong className="text-right font-mono text-foreground">{value.toLocaleString()}</strong></button>)}</div>
}

function ResourcePie() {
  const [selected, setSelected] = useState(0)
  const total = categoryData.reduce((sum, [, value]) => sum + value, 0)
  let cursor = 0
  const segments = categoryData.map(([name, value, color]) => { const start = cursor; cursor += (value / total) * 360; return { name, value, color, start, end: cursor } })
  const selectedItem = categoryData[selected]
  return <div className="flex items-center gap-5"><svg viewBox="0 0 120 120" className="size-40 -rotate-90">{segments.map((segment, index) => <circle key={segment.name} cx="60" cy="60" r="42" fill="none" stroke={segment.color} strokeWidth={index === selected ? 24 : 20} strokeDasharray={`${((segment.end - segment.start) / 360) * 264} 264`} strokeDashoffset={`${-(segment.start / 360) * 264}`} onClick={() => setSelected(index)} className="cursor-pointer transition-all hover:opacity-80" />)}</svg><div className="flex flex-col gap-1.5 text-xs">{categoryData.map(([name, value, color], index) => <button type="button" key={name} onClick={() => setSelected(index)} className={`flex items-center gap-2 text-left ${selected === index ? "font-bold text-foreground" : "text-muted-foreground"}`}><i className="size-2 rounded-sm" style={{ backgroundColor: color }} />{name} {((value / total) * 100).toFixed(2)}%</button>)}<p className="mt-2 border-t border-border pt-2 text-muted-foreground">{selectedItem[0]}：<strong className="font-mono text-foreground">{selectedItem[1].toLocaleString()} 万元</strong></p></div></div>
}

function ResourceTable({ title, rows }: { title: string; rows: typeof detailRows }) {
  const [page, setPage] = useState(0)
  const pageSize = 5
  const visible = rows.slice(page * pageSize, page * pageSize + pageSize)
  return <Panel title={title}><div className="overflow-x-auto rounded-md border border-border/70"><table className="w-full min-w-[560px] text-left text-xs"><thead className="bg-secondary/50 text-muted-foreground"><tr><th className="px-2 py-2">项目名称</th><th className="px-2 py-2">资源类型</th><th className="px-2 py-2">责任部门</th><th className="px-2 py-2 text-right">预算（万元）</th><th className="px-2 py-2">状态</th></tr></thead><tbody className="divide-y divide-border/60">{visible.map((row) => <tr key={row[0]}><td className="px-2 py-2 font-medium text-foreground">{row[0]}</td><td className="px-2 py-2 text-muted-foreground">{row[1]}</td><td className="px-2 py-2 text-muted-foreground">{row[2]}</td><td className="px-2 py-2 text-right font-mono text-foreground">{row[3].toLocaleString()}</td><td className="px-2 py-2 text-primary">{row[4]}</td></tr>)}</tbody></table></div><div className="mt-2 flex items-center justify-between text-xs text-muted-foreground"><span>{page * pageSize + 1}-{Math.min((page + 1) * pageSize, rows.length)} / {rows.length}</span><div className="flex gap-1"><button type="button" aria-label="上一页" onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} className="rounded px-1.5 py-1 disabled:opacity-40"><ChevronLeft className="size-3" /></button><span className="rounded bg-primary px-2 py-1 text-primary-foreground">{page + 1}</span><button type="button" aria-label="下一页" onClick={() => setPage(Math.min(Math.ceil(rows.length / pageSize) - 1, page + 1))} disabled={(page + 1) * pageSize >= rows.length} className="rounded px-1.5 py-1 disabled:opacity-40"><ChevronRight className="size-3" /></button></div></div></Panel>
}

export function ResourceDashboard() {
  return <div className="min-h-screen bg-background px-4 pb-8 text-foreground md:px-6"><div className="mx-auto max-w-[1800px]"><HeroBanner title="资源管理驾驶舱" subtitle="预算管理 · 资源配置 · 执行监控 · 效率分析" /><div className="mt-4 grid gap-3 lg:grid-cols-12"><Panel className="lg:col-span-8" title="2026年预算执行总体情况"><LineChart values={budgetTrend} labels={budgetLabels} suffix="万元" /></Panel><Panel className="lg:col-span-4" title="资源类型分布"><ResourcePie /></Panel><Panel className="lg:col-span-5" title="预算执行率趋势"><LineChart values={executionTrend} labels={budgetLabels} color="#f0a42d" suffix="%" /></Panel><Panel className="lg:col-span-7" title="总行部门预算情况（TOP10）"><HorizontalRank /></Panel><div className="lg:col-span-12 grid gap-3 lg:grid-cols-2"><ResourceTable title="资源分类及执行情况" rows={detailRows} /><ResourceTable title="资源分类及部门预算情况" rows={detailRows} /></div></div></div></div>
}
