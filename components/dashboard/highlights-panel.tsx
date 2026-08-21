import { AlertTriangle, ArrowUpRight, CircleAlert } from "lucide-react"
import { PanelCard } from "@/components/dashboard/panel-card"
import { highlights } from "@/lib/mock-data"

export function HighlightsPanel() {
  return (
    <PanelCard icon={AlertTriangle} title="重点关注" bodyClassName="flex h-full flex-col justify-center p-4">
      <ul className="grid h-full grid-cols-2 items-stretch gap-3">
        {highlights.map((item) => (
          <li key={item.index} className="flex min-w-0 flex-col justify-between rounded-lg border border-border/70 bg-secondary/35 p-3">
            <div className="flex items-start justify-between gap-2">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                <CircleAlert className="size-4" aria-hidden="true" />
              </span>
              <ArrowUpRight className="size-4 text-muted-foreground/60" aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-foreground">{item.title}</span>
              <span className="text-[11px] leading-5 text-muted-foreground">{item.description}</span>
            </div>
          </li>
        ))}
      </ul>
    </PanelCard>
  )
}
