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
            className={`flex min-w-0 flex-col justify-between px-3 py-2 ${index === 2 ? "col-span-2" : ""}`}
          >
            <span className="min-h-8 text-[11px] leading-tight text-muted-foreground">{stat.label}</span>
            <div className="mt-2 flex flex-col gap-1">
              <span className="font-mono text-lg font-bold text-foreground tabular-nums">{stat.value}</span>
              <span className="text-[10px] text-muted-foreground/70">{"单位：" + stat.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </PanelCard>
  )
}
