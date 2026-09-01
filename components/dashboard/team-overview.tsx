"use client"

import { BriefcaseBusiness, Database, Landmark, Layers3, LineChart, ShieldCheck, Sparkles, UsersRound } from "lucide-react"
import useSWR from "swr"

import Link from "next/link"
import { aiCockpitApi, formatAiValue, toNumber, type AiCockpitRow } from "@/lib/ai-cockpit-api"

import { HeroBanner } from "@/components/dashboard/hero-banner"
import { TopNav } from "@/components/dashboard/top-nav"

const teamIcons = [ShieldCheck, LineChart, Layers3, Landmark, UsersRound, BriefcaseBusiness, Database, Sparkles]

type Team = { name: string; icon: typeof ShieldCheck; metrics: [string, string][]; milestone: string; milestoneComplete: string; task: string; done: string; doing: string; pending: string }

const fallbackTeamNames = ["风险管理智能化专班", "资管财富智能化专班", "集中作业智能化专班", "同业金市智能化专班", "零售金融智能化专班", "企业金融智能化专班", "知识工程专班", "智能平台建设专班"]

function buildTeams(rows: AiCockpitRow[]): Team[] {
  const groups = new Map<string, AiCockpitRow[]>()
  if (!rows.length) return fallbackTeamNames.map((name, index) => ({ name, icon: teamIcons[index], metrics: [], milestone: "-", milestoneComplete: "-", task: "-", done: "-", doing: "-", pending: "-" }))
  for (const row of rows) groups.set(row.subSection, [...(groups.get(row.subSection) ?? []), row])
  const displayOrder = ["风险管理智能化专班", "资管财富智能化专班", "集中作业智能化专班", "同业金市智能化专班", "零售金融智能化专班", "企业金融智能化专班", "知识工程专班", "智能平台建设专班"]
  return Array.from(groups.entries()).sort(([a], [b]) => displayOrder.indexOf(a) - displayOrder.indexOf(b)).map(([name, items], index) => {
    const find = (code: string, name?: string) => items.find((row) => row.metricCode.toLowerCase().includes(code.toLowerCase()) || (name ? row.dataName.includes(name) : false))
    const metricRows = items.filter((row) => row.metricType === "metric" || row.metricType === "rate").slice(0, 2)
    const total = find("task_total", "重点任务总数")
    const milestoneTotal = find("milestone_total", "里程碑目标总数")
    const milestoneComplete = find("milestone_complete", "里程碑目标完成数")
    const done = find("task_complete", "重点任务完成数")
    const doing = find("task_in_progress", "重点任务进行中数量")
    const pending = find("task_not_started", "重点任务未启动数量")
    const displayData = (row?: AiCockpitRow) => row?.data === undefined || row?.data === null ? "-" : String(row.data)
    return { name, icon: teamIcons[index % teamIcons.length], metrics: metricRows.map((row) => [row.dataName, formatAiValue(row.data, row.unit)] as [string, string]), milestone: displayData(milestoneTotal), task: displayData(total), done: displayData(done), doing: displayData(doing), pending: displayData(pending), milestoneComplete: displayData(milestoneComplete) }
  })
}

function TeamCard({ team }: { team: Team }) {
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
          <div className="border-r border-border/70 p-2 text-center"><p className="text-[10px] text-muted-foreground">里程碑目标数</p><strong className="font-mono text-xl text-[#2456c7]">{team.milestone}<small className="ml-1 text-xs">个</small></strong><p className="text-[10px] text-emerald-600">↑ {team.milestoneComplete} 个已完成</p></div>
          <div className="p-2 text-center"><p className="text-[10px] text-muted-foreground">重点任务数</p><strong className="font-mono text-xl text-[#2456c7]">{team.task}<small className="ml-1 text-xs">个</small></strong><p className="text-[10px] text-muted-foreground"><span className="text-emerald-600">{team.done} 已完成</span> / <span className="text-primary">{team.doing} 进行中</span> / <span>{team.pending} 未启动</span></p></div>
        </div>
      </div>
    </article>
  )
}

export function TeamOverview() {
  const { data: rows = [], error, isLoading } = useSWR("ai-cockpit-team", aiCockpitApi.team)
  const teams = buildTeams(rows)
  return <main className="min-h-screen bg-background text-foreground"><TopNav /><div className="mx-auto flex max-w-[1800px] flex-col gap-3 px-4 pb-4 md:px-6"><HeroBanner title="人工智能+驾驶舱" subtitle="智能赋能 · 场景落地 · 提质增效 · 创新引领" /><div className="flex overflow-hidden rounded-lg border border-primary/20 bg-muted/50 text-sm font-semibold"><Link href="/" className="flex-1 px-4 py-2 text-center text-muted-foreground transition-colors hover:bg-primary/10">驾驶舱总览</Link><Link href="/team" className="flex-1 bg-[#2456c7] px-4 py-2 text-center text-white">专班建设概览</Link></div>{(isLoading || error) && <p className={`rounded-xl border p-3 text-center text-sm ${error ? "border-destructive/30 text-destructive" : "border-border text-muted-foreground"}`}>{isLoading ? "正在读取人工智能数据…" : "人工智能数据暂时无法读取，当前显示卡片布局占位。"}</p>}<section className="grid gap-3 md:grid-cols-2 lg:grid-cols-6">{teams.map((team) => <TeamCard key={team.name} team={team} />)}</section></div></main>
}
