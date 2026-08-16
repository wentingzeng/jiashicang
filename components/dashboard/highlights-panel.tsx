import { AlertTriangle } from "lucide-react"
import { PanelCard } from "@/components/dashboard/panel-card"
import { highlights } from "@/lib/mock-data"

export function HighlightsPanel() {
  return (
    <PanelCard icon={AlertTriangle} title="重点关注">
      <ul className="flex flex-col gap-3">
        {highlights.map((item) => (
          <li key={item.index} className="flex gap-2.5">
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-destructive/20 text-[11px] font-bold text-destructive">
              {item.index}
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold text-foreground">{item.title}</span>
              <span className="text-[11px] leading-snug text-muted-foreground">{item.description}</span>
            </div>
          </li>
        ))}
      </ul>
    </PanelCard>
  )
}
