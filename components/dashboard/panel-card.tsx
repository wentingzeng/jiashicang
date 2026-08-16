import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

type PanelCardProps = {
  icon: LucideIcon
  title: string
  className?: string
  bodyClassName?: string
  accent?: "primary" | "accent"
  children: React.ReactNode
}

export function PanelCard({
  icon: Icon,
  title,
  className,
  bodyClassName,
  accent = "primary",
  children,
}: PanelCardProps) {
  const accentColor = accent === "accent" ? "accent" : "primary"

  return (
    <Card
      className={cn(
        "group gap-0 overflow-hidden border-border/80 bg-card/90 p-0 shadow-[0_0_0_1px_oklch(0.72_0.15_220/6%),0_12px_40px_oklch(0_0_0/18%)] backdrop-blur-sm transition-shadow hover:shadow-[0_0_0_1px_oklch(0.72_0.15_220/18%),0_16px_48px_oklch(0_0_0/22%)]",
        className,
      )}
    >
      <div
        className={cn(
          "relative flex items-center gap-3 border-b border-border/60 px-4 py-3",
          accent === "accent"
            ? "bg-gradient-to-r from-accent/12 via-card to-card"
            : "bg-gradient-to-r from-primary/12 via-card to-card",
        )}
      >
        <div className="flex items-center gap-1 opacity-70" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={cn(
                "h-4 w-1 skew-x-[-18deg] rounded-sm",
                accentColor === "accent" ? "bg-accent/80" : "bg-primary/80",
              )}
            />
          ))}
        </div>
        <span
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-md",
            accentColor === "accent" ? "bg-accent/15 text-accent" : "bg-primary/15 text-primary",
          )}
        >
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <h3 className="min-w-0 flex-1 truncate text-sm font-semibold tracking-wide text-foreground">{title}</h3>
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-30",
            accentColor === "accent" ? "text-accent" : "text-primary",
          )}
          aria-hidden="true"
        />
      </div>
      <div className={cn("p-4", bodyClassName)}>{children}</div>
    </Card>
  )
}
