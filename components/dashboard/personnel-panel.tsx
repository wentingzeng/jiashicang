import { UserCog } from "lucide-react"
import { PanelCard } from "@/components/dashboard/panel-card"
import { personnelStats } from "@/lib/mock-data"

export function PersonnelPanel() {
  return (
    <PanelCard icon={UserCog} title="人员与制度">
      <div className="flex flex-col gap-2">
        {personnelStats.map((stat) => (
          <div key={stat.label} className="flex min-w-0 items-center justify-between rounded-lg border border-border/60 bg-secondary/35 px-3 py-2.5">
            <span className="min-w-0 truncate text-xs text-muted-foreground">{stat.label}</span>
            <div className="flex shrink-0 items-baseline gap-2">
              <span className="font-mono text-lg font-bold text-foreground tabular-nums">{stat.value}</span>
              <span className="text-[10px] text-muted-foreground/70">{"单位：" + stat.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </PanelCard>
  )
}
