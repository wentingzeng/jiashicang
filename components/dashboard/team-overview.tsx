"use client"

import Link from "next/link"
import { BriefcaseBusiness, Database, Landmark, Layers3, LineChart, ShieldCheck, Sparkles, UsersRound } from "lucide-react"

import { HeroBanner } from "@/components/dashboard/hero-banner"
import { TopNav } from "@/components/dashboard/top-nav"

const teams = [
  { name: "风险管理智能化专班", icon: ShieldCheck, metrics: [["数智化授信审查使用率", "92%"], ["存续期监测客户数量", "486 个"]], milestone: 8, task: 15, done: 3, doing: 9, pending: 3 },
  { name: "资管财富智能化专班", icon: LineChart, metrics: [["钱大理财产品购买转化率", "38%"], ["私行营销模型转化率提升", "26%"]], milestone: 6, task: 12, done: 2, doing: 8, pending: 2 },
  { name: "集中作业智能化专班", icon: Layers3, metrics: [["平台日均调用次数", "1.8 万次"], ["推广场景数", "32 个"]], milestone: 7, task: 13, done: 4, doing: 7, pending: 2 },
  { name: "同业金市智能化专班", icon: Landmark, metrics: [["小类兴成交总量", "42 亿元"], ["划款指令智能审核金额", "18 亿元"]], milestone: 4, task: 5, done: 1, doing: 3, pending: 1 },
  { name: "零售金融智能化专班", icon: UsersRound, metrics: [["智能管客带动资产规模", "109.9 亿元"], ["智能管客触客人次", "1373 万人次"]], milestone: 6, task: 16, done: 1, doing: 15, pending: 0 },
  { name: "企业金融智能化专班", icon: BriefcaseBusiness, metrics: [["AI 助前报备客户覆盖量", "3000 个"], ["产业金融AI营销沙盘触达率", "72%"]], milestone: 3, task: 14, done: 3, doing: 11, pending: 0 },
  { name: "知识工程专班", icon: Database, metrics: [["知识检索/问答调用次数", "0 万次"], ["知识应用场景数", "0 个"]], milestone: 10, task: 13, done: 0, doing: 11, pending: 2 },
  { name: "智能平台建设专班", icon: Sparkles, metrics: [["兴福龙AI月活", "4020 人"], ["AI共性能力场景复用数", "0 个"]], milestone: 20, task: 76, done: 4, doing: 70, pending: 2 },
]

function TeamCard({ team }: { team: (typeof teams)[number] }) {
  const Icon = team.icon
  const compact = team.name === "知识工程专班" || team.name === "智能平台建设专班"
  return (
    <article className={`overflow-hidden rounded-2xl border border-border/70 bg-card/90 shadow-[0_8px_24px_rgba(37,86,199,0.06)] backdrop-blur-sm ${compact ? "lg:col-span-3" : "lg:col-span-2"}`}>
      <header className="flex items-center gap-2 bg-gradient-to-r from-primary/10 via-chart-4/10 to-accent/10 px-3 py-2 text-foreground">
        <span className="size-3 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,.18),0_0_10px_rgba(16,185,129,.55)]" aria-hidden="true" />
        <h2 className="text-sm font-bold tracking-wide">{team.name}</h2>
      </header>
      <div className={`grid gap-3 p-3 ${compact ? "lg:grid-cols-[1.15fr_1fr] lg:items-center" : ""}`}>
        <div className="grid grid-cols-[auto_1fr] gap-3">
          <div className="flex size-14 items-center justify-center rounded-xl bg-secondary text-primary"><Icon className="size-7" aria-hidden="true" /></div>
          <div className="min-w-0">
            <p className="mb-1 text-xs font-bold text-foreground">北极星指标</p>
            <div className="grid gap-1 text-xs text-muted-foreground">{team.metrics.map(([label, value]) => <div className="flex items-center justify-between gap-2" key={label}><span className="truncate">{label}</span><strong className="shrink-0 font-mono text-[#2456c7]">{value}</strong></div>)}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-border/70 bg-muted/35">
          <div className="border-r border-border/70 p-2 text-center"><p className="text-[10px] text-muted-foreground">里程碑目标数</p><strong className="font-mono text-xl text-[#2456c7]">{team.milestone}<small className="ml-1 text-xs">个</small></strong><p className="text-[10px] text-emerald-600">↑ {team.done} 个已完成</p></div>
          <div className="p-2 text-center"><p className="text-[10px] text-muted-foreground">重点任务数</p><strong className="font-mono text-xl text-[#2456c7]">{team.task}<small className="ml-1 text-xs">个</small></strong><p className="text-[10px] text-muted-foreground"><span className="text-emerald-600">{team.done} 已完成</span> / <span className="text-primary">{team.doing} 进行中</span> / <span>{team.pending} 未启动</span></p></div>
        </div>
      </div>
    </article>
  )
}

export function TeamOverview() {
  return <main className="min-h-screen bg-background text-foreground"><TopNav /><div className="mx-auto flex max-w-[1800px] flex-col gap-3 px-4 pb-4 md:px-6"><HeroBanner title="人工智能+驾驶舱" subtitle="整体统筹 · 过程管控 · 重点跟踪 · 成效展示" /><div className="flex overflow-hidden rounded-lg border border-primary/20 bg-muted/50 text-sm font-semibold"><Link href="/" className="flex-1 px-4 py-2 text-center text-muted-foreground transition-colors hover:bg-primary/10">驾驶舱总览</Link><Link href="/team" className="flex-1 bg-[#2456c7] px-4 py-2 text-center text-white">专班建设概览</Link></div><section className="grid gap-3 md:grid-cols-2 lg:grid-cols-6">{teams.map((team) => <TeamCard key={team.name} team={team} />)}</section></div></main>
}
