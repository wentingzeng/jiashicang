import { TopNav } from "@/components/dashboard/top-nav"
import { OverviewSection } from "@/components/dashboard/overview-section"
import { TaskStatusPanel } from "@/components/dashboard/task-status-panel"
import { ProgressSummaryPanel } from "@/components/dashboard/progress-summary-panel"
import { AgentProgressPanel } from "@/components/dashboard/agent-progress-panel"
import { MetricPanelCard } from "@/components/dashboard/metric-panel"
import { DatasetPanel } from "@/components/dashboard/dataset-panel"
import { HighlightsPanel } from "@/components/dashboard/highlights-panel"
import { PersonnelPanel } from "@/components/dashboard/personnel-panel"
import { TechFoundationStrip } from "@/components/dashboard/tech-foundation-strip"
import { engineeringPanels } from "@/lib/mock-data"

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 py-6 md:px-8">
        <OverviewSection />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <TaskStatusPanel />
          <ProgressSummaryPanel />
          <AgentProgressPanel />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {engineeringPanels.map((panel) => (
            <MetricPanelCard key={panel.key} panel={panel} />
          ))}
          <DatasetPanel />
          <HighlightsPanel />
          <PersonnelPanel />
        </div>

        <TechFoundationStrip />
      </main>
    </div>
  )
}
