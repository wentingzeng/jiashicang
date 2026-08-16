import { UserCog } from "lucide-react"
import { PanelCard } from "@/components/dashboard/panel-card"
import { personnelStats } from "@/lib/mock-data"

export function PersonnelPanel() {
  return (
    <PanelCard icon={UserCog} title="人员与制度">
      <div className="grid grid-cols-3 gap-2 text-center">
        {personnelStats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1">
            <span className="font-mono text-lg font-bold text-foreground tabular-nums">{stat.value}</span>
            <span className="text-[11px] leading-tight text-muted-foreground">{stat.label}</span>
            <span className="text-[10px] text-muted-foreground/70">{"单位：" + stat.unit}</span>
          </div>
        ))}
      </div>
    </PanelCard>
  )
}
