import { TopNav } from "@/components/dashboard/top-nav"
import { HeroBanner } from "@/components/dashboard/hero-banner"
import { HrPersonnelMix, HrRegionalDistribution, HrUnitDistribution } from "@/components/dashboard/rd-hr-panels"
import { RdOverviewSummaryRow, DurationTrendPanel, MonthlyTaskTrendPanel } from "@/components/dashboard/rd-overview-panels"
import { KeyProjectsTable, KeySpecialsTable } from "@/components/dashboard/rd-tables"
import { hrPersonnelTotal } from "@/lib/mock-data"

function SectionRail({ label, tone }: { label: string; tone: "primary" | "accent" }) {
  const isPrimary = tone === "primary"

  return (
    <div
      className={
        isPrimary
          ? "relative flex w-10 shrink-0 items-center justify-center self-stretch overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-b from-primary/20 via-primary/8 to-transparent shadow-[inset_0_1px_0_oklch(0.72_0.15_220/20%)]"
          : "relative flex w-10 shrink-0 items-center justify-center self-stretch overflow-hidden rounded-xl border border-accent/20 bg-gradient-to-b from-accent/20 via-accent/8 to-transparent shadow-[inset_0_1px_0_oklch(0.75_0.14_195/20%)]"
      }
    >
      <div
        className={
          isPrimary
            ? "pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-primary/25 to-transparent"
            : "pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-accent/25 to-transparent"
        }
        aria-hidden="true"
      />
      <span
        className={
          isPrimary
            ? "relative text-sm font-bold tracking-[0.35em] text-primary [writing-mode:vertical-rl]"
            : "relative text-sm font-bold tracking-[0.35em] text-accent [writing-mode:vertical-rl]"
        }
      >
        {label}
      </span>
    </div>
  )
}

export default function ResearchManagementPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div
        className="pointer-events-none fixed inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 0%, oklch(0.72 0.15 220 / 12%), transparent 42%), radial-gradient(circle at 85% 10%, oklch(0.75 0.14 195 / 10%), transparent 38%)",
        }}
        aria-hidden="true"
      />
      <TopNav />
      <div className="relative mx-auto flex max-w-[1680px] flex-col gap-5 px-4 py-4 md:px-8 lg:px-10">
        <HeroBanner title="研发管理驾驶舱" subtitle="研发统筹 · 人力洞察 · 项目交付 · 效能提升" />

        <section aria-labelledby="hr-title" className="flex gap-4">
          <SectionRail label="人力资源" tone="primary" />
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <h2 id="hr-title" className="text-xl font-bold tracking-tight md:text-2xl">
                人力资源
              </h2>
              <span className="rounded-full border border-primary/25 bg-primary/8 px-3 py-1 text-xs text-muted-foreground">
                研发团队总人数{" "}
                <strong className="font-mono text-base text-primary">{hrPersonnelTotal.toLocaleString()}</strong> 人
              </span>
            </div>
            <div className="grid gap-4 xl:grid-cols-[1fr_1.15fr_0.95fr]">
              <HrPersonnelMix />
              <HrRegionalDistribution />
              <HrUnitDistribution />
            </div>
          </div>
        </section>

        <section aria-labelledby="rd-title" className="flex gap-4">
          <SectionRail label="研发工作概览" tone="accent" />
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <h2 id="rd-title" className="text-xl font-bold tracking-tight md:text-2xl">
              研发工作概览
            </h2>
            <RdOverviewSummaryRow />
            <div className="grid gap-3 lg:grid-cols-2">
              <MonthlyTaskTrendPanel />
              <DurationTrendPanel />
            </div>
            <div className="grid gap-3 xl:grid-cols-[1.65fr_1fr]">
              <KeyProjectsTable />
              <KeySpecialsTable />
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
