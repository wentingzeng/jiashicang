import { FolderKanban, ListChecks } from "lucide-react"
import { PanelCard } from "@/components/dashboard/panel-card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { keyProjects, keySpecials } from "@/lib/mock-data"

function ProgressCell({ value, colorClass }: { value: number; colorClass?: string }) {
  return (
    <div className="flex min-w-[8rem] items-center gap-3">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted/50">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000 ease-out",
            colorClass ? colorClass : (value >= 100 ? "bg-chart-2" : "bg-primary"),
          )}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      <span className="w-10 shrink-0 text-right font-mono text-[11px] font-normal tabular-nums text-foreground">
        {value}%
      </span>
    </div>
  )
}

function DashboardTable({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-xl border border-border/40 bg-background/20", className)}>
      <div className="overflow-x-auto">
        <Table className="min-w-full text-xs">{children}</Table>
      </div>
    </div>
  )
}

export function KeyProjectsTable() {
  return (
    <PanelCard icon={FolderKanban} title="重点项目监控" className="min-w-0" bodyClassName="p-0">
      <DashboardTable>
        <TableHeader className="bg-muted/30">
          <TableRow className="border-border/60 hover:bg-transparent">
            <TableHead className="h-9 whitespace-nowrap text-xs font-bold uppercase tracking-wider text-muted-foreground px-4">项目名称</TableHead>
            <TableHead className="h-9 text-xs font-bold uppercase tracking-wider text-muted-foreground px-4">类型</TableHead>
            <TableHead className="h-9 text-xs font-bold uppercase tracking-wider text-muted-foreground px-4">环境</TableHead>
            <TableHead className="h-9 min-w-[10rem] text-xs font-bold uppercase tracking-wider text-muted-foreground px-4">完成进度</TableHead>
            <TableHead className="h-9 text-xs font-bold uppercase tracking-wider text-muted-foreground px-4">主办部门</TableHead>
            <TableHead className="h-9 text-xs font-normal uppercase tracking-wider text-muted-foreground px-4 text-center">开始时间</TableHead>
            <TableHead className="h-9 text-xs font-normal uppercase tracking-wider text-muted-foreground px-4 text-center">研发时长</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {keyProjects.map((row, i) => (
            <TableRow
              key={row.name}
              className={cn(
                "group border-border/40 transition-colors hover:bg-primary/5",
                i % 2 === 1 && "bg-background/40",
              )}
            >
              <TableCell className="max-w-[280px] px-2 py-1.5 font-normal text-foreground group-hover:text-primary transition-colors">
                {row.name}
              </TableCell>
              <TableCell className="px-2 py-1.5">
                <Badge variant="outline" className="rounded-md border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-normal text-primary">
                  {row.type}
                </Badge>
              </TableCell>
              <TableCell className="px-2 py-1.5">
                <span className="rounded-md bg-muted/50 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                  {row.env}
                </span>
              </TableCell>
              <TableCell className="px-2 py-1.5">
                <ProgressCell value={row.progress} />
              </TableCell>
              <TableCell className="px-2 py-1.5 text-xs text-muted-foreground">{row.dept}</TableCell>
              <TableCell className="px-2 py-1.5 text-center font-mono text-xs text-muted-foreground">
                {row.start}
              </TableCell>
              <TableCell className="px-2 py-1.5 text-center">
                <span className="font-mono text-xs font-normal text-foreground bg-primary/10 px-2.5 py-1 rounded text-primary">
                  {row.duration}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </DashboardTable>
    </PanelCard>
  )
}

export function KeySpecialsTable() {
  return (
    <PanelCard icon={ListChecks} title="重点专项监控" className="min-w-0" accent="accent" bodyClassName="p-0">
      <DashboardTable>
        <TableHeader className="bg-muted/30">
          <TableRow className="border-border/60 hover:bg-transparent">
            <TableHead className="h-9 text-xs font-bold uppercase tracking-wider text-muted-foreground px-4">专项名称</TableHead>
            <TableHead className="h-9 text-xs font-bold uppercase tracking-wider text-muted-foreground px-4">状态</TableHead>
            <TableHead className="h-9 min-w-[10rem] text-xs font-bold uppercase tracking-wider text-muted-foreground px-4">完成进度</TableHead>
            <TableHead className="h-9 text-xs font-normal uppercase tracking-wider text-muted-foreground px-4 text-center">交付时长</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {keySpecials.map((row, i) => (
            <TableRow
              key={row.name}
              className={cn(
                "group border-border/40 transition-colors hover:bg-accent/5",
                i % 2 === 1 && "bg-background/40",
              )}
            >
              <TableCell className="max-w-[240px] px-2 py-1.5 font-normal text-foreground group-hover:text-accent transition-colors">
                {row.name}
              </TableCell>
              <TableCell className="px-2 py-1.5">
                <Badge 
                  variant={row.status === "已完成" ? "secondary" : "outline"} 
                  className={cn(
                    "rounded-md px-2.5 py-1 text-xs font-normal",
                    row.status === "已完成" ? "bg-accent/20 text-accent border-accent/20" : "bg-muted/50 text-muted-foreground border-border"
                  )}
                >
                  {row.status}
                </Badge>
              </TableCell>
              <TableCell className="px-2 py-1.5">
                <ProgressCell value={row.progress} colorClass={row.status === "已完成" ? "bg-accent" : "bg-accent/60"} />
              </TableCell>
              <TableCell className="px-2 py-1.5 text-center">
                <span className="font-mono text-xs font-normal text-foreground bg-accent/10 px-2.5 py-1 rounded text-accent">
                  {row.duration}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </DashboardTable>
    </PanelCard>
  )
}
