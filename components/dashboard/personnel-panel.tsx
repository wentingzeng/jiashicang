import { UserCog } from "lucide-react"
import { PanelCard } from "@/components/dashboard/panel-card"
import { personnelStats } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export function PersonnelPanel() {
  return (
    <PanelCard icon={UserCog} title="人员与制度">
      <div className="grid grid-cols-2 gap-2">
        {personnelStats.map((stat, index) => (
          <div
            key={stat.label}
            className={cn(
              "flex min-w-0 flex-col justify-between rounded-lg border border-border/60 bg-secondary/35 px-3 py-2.5",
              index === 2 && "col-span-2"
            )}
          >
            <span className="min-h-8 text-xs leading-4 text-muted-foreground">{stat.label}</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-mono text-lg font-bold text-foreground tabular-nums">{stat.value}</span>
              <span className="text-[10px] text-muted-foreground/70">{"单位：" + stat.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </PanelCard>
  )
}
