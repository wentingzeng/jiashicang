import { AlertTriangle, ArrowUpRight, CircleAlert } from "lucide-react"
import { PanelCard } from "@/components/dashboard/panel-card"
import { highlights } from "@/lib/mock-data"

export function HighlightsPanel() {
  return (
    <PanelCard icon={AlertTriangle} title="重点关注" bodyClassName="flex h-full flex-col p-3">
      <ul className="flex flex-col gap-1">
        {highlights.map((item) => (
          <li key={item.index} className="flex min-w-0 items-center gap-2 rounded-lg border border-border/70 bg-secondary/35 px-2 py-1">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <CircleAlert className="size-3" aria-hidden="true" />
            </span>
            <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
              <div className="flex min-w-0 flex-col gap-0">
                <span className="truncate text-xs font-medium leading-4 text-foreground">{item.title}</span>
                <span className="text-[11px] leading-4 text-muted-foreground">{item.description}</span>
              </div>
              <ArrowUpRight className="size-4 shrink-0 text-muted-foreground/60" aria-hidden="true" />
            </div>
          </li>
        ))}
      </ul>
    </PanelCard>
  )
}
