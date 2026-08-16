import { Bot } from "lucide-react"
import { PanelCard } from "@/components/dashboard/panel-card"
import { Progress } from "@/components/ui/progress"
import { agentProgress } from "@/lib/mock-data"

export function AgentProgressPanel() {
  return (
    <PanelCard icon={Bot} title="超级智能体建设情况">
      <div className="flex flex-col gap-4">
        {agentProgress.map((item) => (
          <div key={item.key} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-mono font-semibold text-foreground tabular-nums">{item.value}%</span>
            </div>
            <Progress value={item.value} />
          </div>
        ))}
      </div>
    </PanelCard>
  )
}
