"use client"

import { statisticsPeriod, lastUpdatedAt } from "@/lib/mock-data"
import { useLiveClock } from "@/lib/use-live-value"

export function HeroBanner({ title = "人工智能+驾驶舱", subtitle = "目标牵引 · 任务推进 · 协同督办 · 成果沉淀" }: { title?: string; subtitle?: string }) {
  const now = useLiveClock()
  const timeLabel = now ? now.toTimeString().slice(0, 8) : "--:--:--"

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-b from-secondary/60 to-card px-5 py-4 md:px-8 md:py-5">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, oklch(0.72 0.15 220 / 25%), transparent 45%), radial-gradient(circle at 80% 0%, oklch(0.75 0.14 195 / 20%), transparent 40%)",
        }}
        aria-hidden="true"
      />

      <div className="relative flex flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-1.5 text-xs text-accent">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-accent" />
          </span>
          {"实时数据同步中 · " + timeLabel}
        </div>
        <h1 className="text-balance font-sans text-3xl font-black tracking-wide text-foreground md:text-4xl">
          {title}
        </h1>
        <p className="text-pretty text-sm text-muted-foreground md:text-base">
          {subtitle}
        </p>
      </div>

      <div className="relative mt-3 flex flex-col items-center justify-end gap-2 text-xs text-muted-foreground md:flex-row">
        <span>{"统计周期：" + statisticsPeriod}</span>
        <span className="hidden h-3 w-px bg-border md:block" aria-hidden="true" />
        <span>{"数据更新时间：" + lastUpdatedAt}</span>
      </div>
    </div>
  )
}
