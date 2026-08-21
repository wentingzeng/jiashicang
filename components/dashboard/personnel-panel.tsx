import { UserCog } from "lucide-react"
import { PanelCard } from "@/components/dashboard/panel-card"
import { personnelStats } from "@/lib/mock-data"

export function PersonnelPanel() {
  return (
    <PanelCard icon={UserCog} title="人员与制度">
      <div className="grid grid-cols-2 gap-2">
        {personnelStats.map((stat, index) => (
          <div
            key={stat.label}
            className={`flex min-w-0 flex-col px-3 py-2 ${index === 2 ? "col-span-2" : ""}`}
          >
            <span className="font-mono text-lg font-bold leading-6 text-foreground tabular-nums">{stat.value}</span>
            <span className="mt-1 min-h-8 text-[11px] leading-tight text-muted-foreground">{stat.label}</span>
            <span className="mt-1 text-[10px] text-muted-foreground/70">{"单位：" + stat.unit}</span>
          </div>
        ))}
      </div>
    </PanelCard>
  )
}
