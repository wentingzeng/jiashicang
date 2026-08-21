import { UserCog } from "lucide-react"
import { PanelCard } from "@/components/dashboard/panel-card"
import { personnelStats } from "@/lib/mock-data"

export function PersonnelPanel() {
  return (
    <PanelCard icon={UserCog} title="人员与制度">
      <div className="grid grid-cols-3 items-stretch gap-2 text-center">
        {personnelStats.map((stat) => (
          <div key={stat.label} className="flex min-w-0 flex-col items-center rounded-lg border border-border/60 bg-secondary/35 px-2 py-2.5">
            <span className="flex h-9 w-full items-center justify-center overflow-hidden whitespace-nowrap text-[10px] leading-4 text-muted-foreground">{stat.label}</span>
            <span className="mt-1 font-mono text-lg font-bold text-foreground tabular-nums">{stat.value}</span>
            <span className="mt-0.5 text-[10px] text-muted-foreground/70">{"单位：" + stat.unit}</span>
          </div>
        ))}
      </div>
    </PanelCard>
  )
}
