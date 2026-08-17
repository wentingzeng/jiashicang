import { TopNav } from "@/components/dashboard/top-nav"
import { HeroBanner } from "@/components/dashboard/hero-banner"
import { HrPersonnelMix, HrRegionalDistribution, HrUnitDistribution } from "@/components/dashboard/rd-hr-panels"
import { RdOverviewSummaryRow, DurationTrendPanel, MonthlyTaskTrendPanel } from "@/components/dashboard/rd-overview-panels"
import { KeyProjectsTable, KeySpecialsTable } from "@/components/dashboard/rd-tables"
import { hrPersonnelTotal } from "@/lib/mock-data"
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

export default function ResearchManagementPage() {
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
      <div className="relative mx-auto flex max-w-[1720px] flex-col gap-3 px-3 py-3 md:px-6 lg:px-8">
        <HeroBanner title="研发管理驾驶舱" subtitle="研发统筹 · 人力洞察 · 项目交付 · 效能提升" />

        {/* HR Section */}
        <section aria-labelledby="hr-title" className="flex animate-in fade-in slide-in-from-bottom-4 duration-700 gap-3">
          <SectionRail label="人力资源" tone="primary" />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="flex items-center gap-3">
                <h2 id="hr-title" className="text-2xl font-bold tracking-tight md:text-3xl">
                  人力资源
                </h2>
                <div className="h-5 w-px bg-border/60" />
                <p className="text-base text-muted-foreground">Team Resource Insight</p>
              </div>
              <div className="rounded-full border border-primary/25 bg-primary/8 px-4 py-2 text-sm text-muted-foreground shadow-sm">
                研发团队总人数{" "}
                <strong className="font-mono text-lg font-bold text-primary">{hrPersonnelTotal.toLocaleString()}</strong> 人
              </div>
            </div>
            <div className="grid gap-4 xl:grid-cols-[1fr_1.15fr_0.95fr]">
              <HrPersonnelMix />
              <HrRegionalDistribution />
              <HrUnitDistribution />
            </div>
          </div>
        </section>

        {/* RD Overview Section */}
        <section aria-labelledby="rd-title" className="flex animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 gap-6">
          <SectionRail label="研发工作概览" tone="accent" />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex items-center gap-3">
              <h2 id="rd-title" className="text-2xl font-bold tracking-tight md:text-3xl">
                研发工作概览
              </h2>
              <div className="h-5 w-px bg-border/60" />
              <p className="text-base text-muted-foreground">R&D Work Overview</p>
            </div>
            <RdOverviewSummaryRow />
            <div className="grid gap-4 lg:grid-cols-2">
              <MonthlyTaskTrendPanel />
              <DurationTrendPanel />
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
              <KeyProjectsTable />
              <KeySpecialsTable />
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
