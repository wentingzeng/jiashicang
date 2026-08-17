"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { navItems } from "@/lib/mock-data"
import { BrainCircuit } from "lucide-react"

export function TopNav() {
  const pathname = usePathname()
  const active = pathname.startsWith("/research")
    ? "rd"
    : pathname.startsWith("/branch")
      ? "branch"
      : pathname.startsWith("/security")
        ? "security"
        : pathname.startsWith("/trusted")
          ? "trusted"
          : pathname.startsWith("/resource")
            ? "resource"
            : navItems[0].key
      

  const routeMap: Record<string, string> = {
    "ai-plus": "/",
    project: "/",
    rd: "/research",
    resource: "/resource",
    branch: "/branch",
    security: "/security",
    trusted: "/trusted",
  }

  return (
    <header className="sticky top-0 z-20 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="border-b border-border/50 bg-gradient-to-b from-secondary/40 to-background px-4 py-2.5 text-center md:px-8">
        <p className="text-sm font-semibold tracking-[0.2em] text-foreground/90 md:text-base">科技条线数据驾驶舱</p>
      </div>
      <nav className="flex h-12 items-center gap-1 overflow-x-auto px-4 md:px-8">
        {navItems.map((item, index) => {
          const isActive = item.key === active
          return (
            <Link
              key={item.key}
              href={routeMap[item.key] ?? "/"}
              className={cn(
                "relative flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive ? "text-accent" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {index === 0 && <BrainCircuit className="size-4" aria-hidden="true" />}
              {item.label}
              {isActive && (
                <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-accent shadow-[0_0_8px_var(--accent)]" aria-hidden="true" />
              )}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
