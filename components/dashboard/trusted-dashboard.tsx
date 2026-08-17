"use client"

import { useMemo, useState } from "react"
import { ArrowUpRight, CheckCircle2, ChevronDown, CircleAlert, CloudCog, Cpu, Database, Gauge, MonitorCog, Network, ServerCog, ShieldCheck, Sparkles, TrendingUp } from "lucide-react"

type Metric = { label: string; value: string; unit: string; note: string; tone: "blue" | "teal" | "violet" | "amber" }
type ProgressItem = { label: string; value: number; detail: string; tone: "blue" | "teal" | "violet" }

const metrics: Metric[] = [
  { label: "信创总体完成率", value: "76.8", unit: "%", note: "较上月提升 4.2%", tone: "blue" },
  { label: "已完成适配系统", value: "68", unit: "套", note: "本年度新增 12 套", tone: "teal" },
  { label: "信创终端覆盖", value: "2,486", unit: "台", note: "覆盖率 83.4%", tone: "violet" },
  { label: "项目投入规模", value: "3.42", unit: "亿元", note: "年度预算执行 71.5%", tone: "amber" },
]

const systemProgress: ProgressItem[] = [
  { label: "基础软件适配", value: 92, detail: "23 / 25 项", tone: "blue" },
  { label: "数据库适配", value: 84, detail: "21 / 25 项", tone: "teal" },
  { label: "中间件适配", value: 76, detail: "19 / 25 项", tone: "violet" },
  { label: "业务应用改造", value: 68, detail: "68 / 100 套", tone: "blue" },
]

const terminalProgress: ProgressItem[] = [
  { label: "桌面终端", value: 86, detail: "1,984 台", tone: "teal" },
  { label: "服务器", value: 74, detail: "316 台", tone: "blue" },
  { label: "移动终端", value: 62, detail: "186 台", tone: "violet" },
]

const milestones = [
  { title: "核心业务系统适配", owner: "科技信息部", progress: 92, status: "按计划", date: "2026.08" },
  { title: "分支机构终端替换", owner: "运行管理部", progress: 76, status: "推进中", date: "2026.09" },
  { title: "数据中心基础设施升级", owner: "数据中心", progress: 61, status: "推进中", date: "2026.11" },
  { title: "信创人才能力认证", owner: "人力资源部", progress: 48, status: "需关注", date: "2026.12" },
]

const trend = [61, 64, 63, 68, 70, 73, 76, 77, 81, 79, 84, 87]
const issues = [
  { title: "3 个系统存在兼容性风险", detail: "待完成数据库驱动升级", tone: "amber" },
  { title: "2 家供应商交付延期", detail: "预计影响 1 个里程碑", tone: "violet" },
  { title: "终端替换完成率领先计划", detail: "较计划提前 6 天", tone: "teal" },
]

function Panel({ title, eyebrow, icon: Icon, children, className = "" }: { title: string; eyebrow?: string; icon: typeof Cpu; children: React.ReactNode; className?: string }) {
  return (
    <section className={`overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[0_10px_30px_oklch(0.35_0.06_240/8%)] ${className}`}>
      <header className="flex items-center justify-between border-b border-border/70 bg-gradient-to-r from-secondary/70 to-card px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5" /></div>
          <div>
            {eyebrow && <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{eyebrow}</p>}
            <h2 className="text-base font-bold text-foreground">{title}</h2>
          </div>
        </div>
        <span className="rounded-full bg-accent/10 px-3 py-1 text-[10px] font-semibold tracking-[0.16em] text-accent">LIVE</span>
      </header>
      <div className="p-5">{children}</div>
    </section>
  )
}

function MetricCard({ item }: { item: Metric }) {
  const tone = { blue: "text-primary bg-primary/10", teal: "text-accent bg-accent/10", violet: "text-chart-4 bg-chart-4/10", amber: "text-amber-600 bg-amber-500/10" }[item.tone]
  return <article className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm transition-transform hover:-translate-y-0.5">
    <div className="flex items-start justify-between gap-3"><p className="text-sm font-medium text-muted-foreground">{item.label}</p><span className={`rounded-lg p-2 ${tone}`}><TrendingUp className="size-4" /></span></div>
    <div className="mt-5 flex items-baseline gap-2"><strong className="font-mono text-4xl font-black tracking-tight text-foreground">{item.value}</strong><span className="text-sm font-semibold text-muted-foreground">{item.unit}</span></div>
    <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground"><ArrowUpRight className="size-3 text-accent" />{item.note}</p>
  </article>
}

function ProgressRow({ item }: { item: ProgressItem }) {
  const bar = { blue: "bg-primary", teal: "bg-accent", violet: "bg-chart-4" }[item.tone]
  return <div className="space-y-2"><div className="flex items-center justify-between gap-3 text-sm"><span className="font-medium text-foreground">{item.label}</span><span className="font-mono text-xs text-muted-foreground">{item.detail}</span></div><div className="h-3 overflow-hidden rounded-full bg-secondary"><div className={`h-full rounded-full ${bar} transition-all`} style={{ width: `${item.value}%` }} /></div><div className="text-right font-mono text-xs font-bold text-primary">{item.value}%</div></div>
}

function TrendChart() {
  const points = trend.map((value, index) => `${index * 9.09} ${100 - (value - 55) * 2.4}`).join(" ")
  return <div className="rounded-xl border border-border/70 bg-secondary/30 p-4"><div className="mb-3 flex items-center justify-between"><div><p className="text-sm font-semibold text-foreground">综合完成趋势</p><p className="text-xs text-muted-foreground">近 12 个月累计进展</p></div><span className="font-mono text-lg font-bold text-accent">+26%</span></div><svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-36 w-full overflow-visible"><defs><linearGradient id="trustedArea" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="currentColor" stopOpacity="0.2" /><stop offset="1" stopColor="currentColor" stopOpacity="0" /></linearGradient></defs><polygon points={`0 100 ${points} 100 100 100`} fill="url(#trustedArea)" className="text-primary" /><polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.8" vectorEffect="non-scaling-stroke" className="text-primary" /></svg><div className="mt-2 flex justify-between text-[10px] text-muted-foreground"><span>09月</span><span>12月</span><span>03月</span><span>06月</span><span>08月</span></div></div>
}

export function TrustedDashboard() {
  const [year, setYear] = useState("2026")
  const summary = useMemo(() => `${year} 年度信创工作总览`, [year])
  return <main className="min-h-screen bg-background px-4 py-5 text-foreground md:px-6 lg:px-8">
    <div className="mx-auto max-w-[1680px] space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Trusted Computing Dashboard</p><h1 className="mt-1 text-3xl font-black tracking-tight text-foreground">信创管理驾驶舱</h1><p className="mt-2 text-sm text-muted-foreground">{summary} · 数据更新于 2026 年 8 月 16 日</p></div><div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-sm"><span className="text-sm text-muted-foreground">统计年度</span><select value={year} onChange={(event) => setYear(event.target.value)} className="bg-transparent text-sm font-semibold text-foreground outline-none"><option>2026</option><option>2025</option><option>2024</option></select><ChevronDown className="size-4 text-muted-foreground" /></div></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map((item) => <MetricCard key={item.label} item={item} />)}</div>
      <div className="grid items-stretch gap-5 xl:grid-cols-[1.05fr_1fr_1.15fr]">
        <Panel title="系统适配进展" eyebrow="APPLICATION" icon={ServerCog} className="h-full"><div className="flex flex-col gap-5">{systemProgress.map((item) => <ProgressRow key={item.label} item={item} />)}<div className="rounded-xl bg-primary/5 p-4"><div className="flex items-center gap-3"><CheckCircle2 className="size-5 text-accent" /><div><p className="text-sm font-bold text-foreground">适配质量保持稳定</p><p className="mt-1 text-xs text-muted-foreground">已完成系统验收通过率 96.2%</p></div></div></div></div></Panel>
        <Panel title="终端覆盖情况" eyebrow="ENDPOINT" icon={MonitorCog} className="h-full"><div className="flex flex-col gap-5">{terminalProgress.map((item) => <ProgressRow key={item.label} item={item} />)}<div className="grid grid-cols-2 gap-3"><div className="rounded-xl bg-secondary/70 p-4"><p className="text-xs text-muted-foreground">本月替换</p><p className="mt-2 font-mono text-2xl font-black text-foreground">286<span className="ml-1 text-xs font-medium text-muted-foreground">台</span></p></div><div className="rounded-xl bg-secondary/70 p-4"><p className="text-xs text-muted-foreground">待替换</p><p className="mt-2 font-mono text-2xl font-black text-foreground">498<span className="ml-1 text-xs font-medium text-muted-foreground">台</span></p></div></div></div></Panel>
        <Panel title="总体趋势" eyebrow="PERFORMANCE" icon={Gauge} className="h-full"><TrendChart /><div className="mt-4 grid grid-cols-3 gap-3 text-center"><div><p className="font-mono text-xl font-black text-foreground">87%</p><p className="mt-1 text-xs text-muted-foreground">当前完成率</p></div><div><p className="font-mono text-xl font-black text-accent">+4.2%</p><p className="mt-1 text-xs text-muted-foreground">环比提升</p></div><div><p className="font-mono text-xl font-black text-foreground">12</p><p className="mt-1 text-xs text-muted-foreground">新增系统</p></div></div></Panel>
      </div>
      <div className="grid items-stretch gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel title="重点项目进展" eyebrow="PROJECTS" icon={Network}><div className="overflow-x-auto"><table className="w-full min-w-[600px] text-left text-sm"><thead className="text-xs text-muted-foreground"><tr><th className="pb-3 font-medium">项目名称</th><th className="pb-3 font-medium">牵头部门</th><th className="pb-3 font-medium">进度</th><th className="pb-3 text-right font-medium">计划节点</th></tr></thead><tbody className="divide-y divide-border/70">{milestones.map((item) => <tr key={item.title}><td className="py-4 font-semibold text-foreground">{item.title}<span className={`ml-2 rounded-full px-2 py-1 text-[10px] ${item.status === "需关注" ? "bg-amber-500/10 text-amber-700" : "bg-accent/10 text-accent"}`}>{item.status}</span></td><td className="py-4 text-muted-foreground">{item.owner}</td><td className="py-4"><div className="flex items-center gap-3"><div className="h-2 w-28 rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: `${item.progress}%` }} /></div><span className="font-mono text-xs font-bold text-foreground">{item.progress}%</span></div></td><td className="py-4 text-right font-mono text-xs text-muted-foreground">{item.date}</td></tr>)}</tbody></table></div></Panel>
        <Panel title="风险与提醒" eyebrow="INSIGHTS" icon={CircleAlert}><div className="flex flex-col gap-3">{issues.map((issue) => <div key={issue.title} className="flex items-start gap-3 rounded-xl border border-border/70 bg-secondary/30 p-4"><div className={`mt-0.5 rounded-lg p-2 ${issue.tone === "amber" ? "bg-amber-500/10 text-amber-600" : issue.tone === "violet" ? "bg-chart-4/10 text-chart-4" : "bg-accent/10 text-accent"}`}>{issue.tone === "teal" ? <ShieldCheck className="size-4" /> : <CircleAlert className="size-4" />}</div><div><p className="text-sm font-semibold text-foreground">{issue.title}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{issue.detail}</p></div></div>)}</div></Panel>
      </div>
      <div className="grid gap-4 md:grid-cols-3"><div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm"><Cpu className="size-5 text-primary" /><div><p className="text-xs text-muted-foreground">国产 CPU 适配率</p><p className="font-mono text-xl font-black text-foreground">78.4%</p></div></div><div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm"><Database className="size-5 text-accent" /><div><p className="text-xs text-muted-foreground">国产数据库适配</p><p className="font-mono text-xl font-black text-foreground">84.0%</p></div></div><div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm"><CloudCog className="size-5 text-chart-4" /><div><p className="text-xs text-muted-foreground">云平台资源池</p><p className="font-mono text-xl font-black text-foreground">92.6%</p></div></div></div>
    </div>
  </main>
}
