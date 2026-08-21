import Link from "next/link"
import { TopNav } from "@/components/dashboard/top-nav"
import { HeroBanner } from "@/components/dashboard/hero-banner"
import { KpiCards } from "@/components/dashboard/kpi-cards"
import { TaskStatusPanel } from "@/components/dashboard/task-status-panel"
import { ProgressSummaryPanel } from "@/components/dashboard/progress-summary-panel"
import { AgentProgressPanel } from "@/components/dashboard/agent-progress-panel"
import { MetricPanelCard } from "@/components/dashboard/metric-panel"
import { DatasetPanel } from "@/components/dashboard/dataset-panel"
import { HighlightsPanel } from "@/components/dashboard/highlights-panel"
import { PersonnelPanel } from "@/components/dashboard/personnel-panel"
import { TechFoundationStrip } from "@/components/dashboard/tech-foundation-strip"
import { engineeringPanels } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

function SectionRail({ label, tone }: { label: string; tone: "primary" | "accent" | "chart-4" }) {
  const isPrimary = tone === "primary"
  const isAccent = tone === "accent"

  const railColors = {
    primary: "border-primary/20 bg-gradient-to-b from-primary/20 via-primary/8 to-transparent shadow-[inset_0_1px_0_oklch(0.72_0.15_220/20%)]",
    accent: "border-accent/20 bg-gradient-to-b from-accent/20 via-accent/8 to-transparent shadow-[inset_0_1px_0_oklch(0.75_0.14_195/20%)]",
    "chart-4": "border-chart-4/20 bg-gradient-to-b from-chart-4/20 via-chart-4/8 to-transparent shadow-[inset_0_1px_0_oklch(0.65_0.12_280/20%)]",
  }

  const spanColors = {
    primary: "text-primary",
    accent: "text-accent",
    "chart-4": "text-chart-4",
  }

  return (
    <div className={cn("relative flex w-12 shrink-0 items-center justify-center self-stretch overflow-hidden rounded-xl border", railColors[tone])}>
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b to-transparent",
          isPrimary ? "from-primary/25" : isAccent ? "from-accent/25" : "from-chart-4/25"
        )}
        aria-hidden="true"
      />
      <span className={cn("relative text-base font-bold tracking-[0.35em] [writing-mode:vertical-rl]", spanColors[tone])}>
        {label}
      </span>
    </div>
  )
}

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <div
        className="pointer-events-none fixed inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 10% 0%, oklch(0.72 0.15 220 / 12%), transparent 40%), radial-gradient(circle at 90% 10%, oklch(0.75 0.14 195 / 10%), transparent 35%), radial-gradient(circle at 50% 100%, oklch(0.65 0.12 280 / 8%), transparent 30%)",
        }}
        aria-hidden="true"
      />
      <TopNav />
      
      <div className="relative mx-auto flex max-w-[1720px] flex-col gap-6 px-4 py-6 md:px-8 lg:px-10">
        <HeroBanner title="人工智能+驾驶舱" subtitle="智能赋能 · 场景落地 · 提质增效 · 创新引领" />

        <div className="flex overflow-hidden rounded-lg border border-primary/20 bg-muted/50 text-sm font-semibold">
          <Link href="/" className="flex-1 bg-primary px-4 py-2 text-center text-primary-foreground">驾驶舱总览</Link>
          <Link href="/team" className="flex-1 px-4 py-2 text-center text-muted-foreground transition-colors hover:bg-primary/10">专班建设概览</Link>
        </div>

        {/* Overview Section */}
        <section aria-labelledby="overview-title" className="flex animate-in fade-in slide-in-from-bottom-4 duration-700 gap-6">
          <SectionRail label="核心概览" tone="primary" />
          <div className="flex min-w-0 flex-1 flex-col gap-5">
            <KpiCards />
            <div className="grid items-start grid-cols-1 gap-6 lg:grid-cols-3">
              <TaskStatusPanel />
              <ProgressSummaryPanel />
              <AgentProgressPanel />
            </div>
          </div>
        </section>

        {/* Engineering Section */}
        <section aria-labelledby="eng-title" className="flex animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 gap-6">
          <SectionRail label="工程建设" tone="accent" />
          <div className="flex min-w-0 flex-1 flex-col gap-5">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
              {engineeringPanels.map((panel) => (
                <MetricPanelCard key={panel.key} panel={panel} />
              ))}
              <DatasetPanel />
              <HighlightsPanel />
              <PersonnelPanel />
            </div>
          </div>
        </section>

        {/* Foundation Section */}
        <section aria-labelledby="foundation-title" className="flex animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 gap-6">
          <SectionRail label="技术底座" tone="chart-4" />
          <div className="flex min-w-0 flex-1 flex-col gap-5">
            <TechFoundationStrip />
          </div>
        </section>
      </div>
    </main>
  )
}
