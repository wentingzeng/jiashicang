"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { PieChart as PieChartIcon } from "lucide-react"
import { PanelCard } from "@/components/dashboard/panel-card"
import { taskStatusDistribution } from "@/lib/mock-data"

export function TaskStatusPanel() {
  const total = taskStatusDistribution.reduce((sum, slice) => sum + slice.value, 0)

  return (
    <PanelCard icon={PieChartIcon} title="专班工作概览">
      <p className="mb-2 text-xs text-muted-foreground">任务状态分布</p>
      <div className="flex items-center gap-2">
        <div className="h-40 w-1/2 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={taskStatusDistribution}
                dataKey="value"
                nameKey="label"
                innerRadius="55%"
                outerRadius="90%"
                paddingAngle={2}
                strokeWidth={0}
              >
                {taskStatusDistribution.map((slice) => (
                  <Cell key={slice.key} fill={slice.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  fontSize: 12,
                  color: "var(--popover-foreground)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="flex flex-1 flex-col gap-2">
          {taskStatusDistribution.map((slice) => {
            const pct = total > 0 ? ((slice.value / total) * 100).toFixed(1) : "0.0"
            return (
              <li key={slice.key} className="flex items-center justify-between gap-2 text-xs">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="size-2 rounded-full" style={{ backgroundColor: slice.color }} aria-hidden="true" />
                  {slice.label}
                </span>
                <span className="font-mono tabular-nums text-foreground">
                  {slice.value} ({pct}%)
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </PanelCard>
  )
}
