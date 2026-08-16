import { FolderKanban, ListChecks } from "lucide-react"
import { PanelCard } from "@/components/dashboard/panel-card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { keyProjects, keySpecials } from "@/lib/mock-data"

function ProgressCell({ value }: { value: number }) {
  return (
    <div className="flex min-w-[7rem] items-center gap-2">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted/80">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700",
            value >= 100 ? "bg-gradient-to-r from-accent to-chart-3" : "bg-gradient-to-r from-primary to-accent",
          )}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      <span className="w-9 shrink-0 text-right font-mono text-xs tabular-nums text-foreground">{value}%</span>
    </div>
  )
}

function DashboardTable({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("-mx-1 overflow-x-auto rounded-lg border border-border/50", className)}>
      <Table>{children}</Table>
    </div>
  )
}

export function KeyProjectsTable() {
  return (
    <PanelCard icon={FolderKanban} title="重点项目" className="min-w-0" bodyClassName="p-3 sm:p-4">
      <DashboardTable>
        <TableHeader>
          <TableRow className="border-border/60 hover:bg-transparent">
            <TableHead className="whitespace-nowrap text-xs">项目名称</TableHead>
            <TableHead className="text-xs">类型</TableHead>
            <TableHead className="text-xs">所处环境</TableHead>
            <TableHead className="min-w-[8rem] text-xs">工作进度</TableHead>
            <TableHead className="text-xs">主办部门</TableHead>
            <TableHead className="text-xs">项目开始时间</TableHead>
            <TableHead className="text-xs">计划投产时间</TableHead>
            <TableHead className="text-xs">实际投产时间</TableHead>
            <TableHead className="text-xs">项目研发时长</TableHead>
            <TableHead className="text-xs">首版本交付时长</TableHead>
            <TableHead className="text-xs">项目全时长</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {keyProjects.map((row, i) => (
            <TableRow
              key={row.name}
              className={cn(
                "border-border/40 transition-colors hover:bg-primary/5",
                i % 2 === 1 && "bg-background/30",
              )}
            >
              <TableCell className="max-w-[220px] font-medium text-foreground">{row.name}</TableCell>
              <TableCell>
                <Badge variant="outline" className="text-[11px]">
                  {row.type}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{row.env}</TableCell>
              <TableCell>
                <ProgressCell value={row.progress} />
              </TableCell>
              <TableCell className="text-xs">{row.dept}</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">{row.start}</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">{row.plan}</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">{row.actual}</TableCell>
              <TableCell className="text-xs">{row.duration}</TableCell>
              <TableCell className="text-xs">{row.first}</TableCell>
              <TableCell className="text-xs">{row.total}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </DashboardTable>
    </PanelCard>
  )
}

export function KeySpecialsTable() {
  return (
    <PanelCard icon={ListChecks} title="重点专项" className="min-w-0" accent="accent" bodyClassName="p-3 sm:p-4">
      <DashboardTable>
        <TableHeader>
          <TableRow className="border-border/60 hover:bg-transparent">
            <TableHead className="text-xs">专项名称</TableHead>
            <TableHead className="text-xs">状态</TableHead>
            <TableHead className="min-w-[8rem] text-xs">工作进度</TableHead>
            <TableHead className="text-xs">主办部门</TableHead>
            <TableHead className="text-xs">开始时间</TableHead>
            <TableHead className="text-xs">计划投产</TableHead>
            <TableHead className="text-xs">实际投产</TableHead>
            <TableHead className="text-xs">交付时长</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {keySpecials.map((row, i) => (
            <TableRow
              key={row.name}
              className={cn(
                "border-border/40 transition-colors hover:bg-accent/5",
                i % 2 === 1 && "bg-background/30",
              )}
            >
              <TableCell className="max-w-[180px] font-medium text-foreground">{row.name}</TableCell>
              <TableCell>
                <Badge variant={row.status === "已完成" ? "secondary" : "outline"} className="text-[11px]">
                  {row.status}
                </Badge>
              </TableCell>
              <TableCell>
                <ProgressCell value={row.progress} />
              </TableCell>
              <TableCell className="text-xs">{row.dept}</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">{row.start}</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">{row.plan}</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">{row.actual}</TableCell>
              <TableCell className="text-xs">{row.duration}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </DashboardTable>
    </PanelCard>
  )
}
