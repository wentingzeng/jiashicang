"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  LabelList,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CalendarDays,
  CircleAlert,
  ClipboardList,
  Gauge,
  Layers3,
  Timer,
} from "lucide-react";
import { HeroBanner } from "@/components/dashboard/hero-banner";

const tooltipStyle = {
  backgroundColor: "#ffffff",
  color: "#0f172a",
  border: "1px solid #cbd5e1",
  borderRadius: 10,
  fontSize: 11,
  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.16)",
};
const palette = ["#3157d5", "#14a89a", "#f0a33a", "#d85d70", "#7468d9"];
const statusData = [
  { name: "已启动", value: 67.7 },
  { name: "已申请未批复", value: 23.7 },
  { name: "已批复超期未启动", value: 2.7 },
  { name: "已批复未启动", value: 5.9 },
];
const progressData = [
  { name: "业务需求", value: 52 },
  { name: "总体设计", value: 51 },
  { name: "商务", value: 65 },
  { name: "编码测试", value: 83 },
  { name: "上线准备", value: 11 },
];
const overdueData = [
  { name: "轻度延期项目", count: 23, value: 23 },
  { name: "中度延期项目", count: 3, value: 3 },
  { name: "重度延期项目", count: 3, value: 3 },
];
const taskData = [
  { name: "待执行的任务数", value: 331 },
  { name: "进行中的任务数", value: 64 },
  { name: "延期的任务数", value: 22 },
  { name: "已完成的任务数", value: 119 },
];
const keyProgressData = [
  { name: "待启动项目", count: 98 },
  { name: "已投产项目", count: 133 },
  { name: "在建项目", count: 188 },
  { name: "延期项目", count: 5 },
];
const taskTotal = taskData.reduce((total, item) => total + item.value, 0);
const keyProgressTotal = keyProgressData.reduce((total, item) => total + item.count, 0);
const overdueTotal = overdueData.reduce((total, item) => total + item.count, 0);
const deliveryData = [
  { name: "2026投产项目", count: 145, days: 176 },
  { name: "投产顺序项目", count: 40, days: 23 },
  { name: "投产敏捷项目", count: 105, days: 107 },
];
const gauges = [
  { label: "顺序项目科技实施阶段时长占比", value: 51, min: 0, max: 100 },
  { label: "敏捷项目首版本平均交付周期", value: 107, min: 100, max: 110 },
  { label: "敏捷项目版本平均交付周期", value: 23, min: 20, max: 25 },
];
const kpis = [
  { label: "年度需求计划", value: "329", unit: "个", icon: CalendarDays },
  { label: "总行在建项目数", value: "321", unit: "个", icon: Layers3 },
  { label: "总行投产项目数", value: "145", unit: "个", icon: ClipboardList },
  {
    label: "延期项目数",
    value: "29",
    unit: "个",
    icon: CircleAlert,
    danger: true,
  },
  { label: "本月计划投产项目数", value: "30", unit: "个", icon: Gauge },
  { label: "投产项目平均交付周期", value: "176", unit: "天", icon: Timer },
];

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="group overflow-hidden rounded-xl border border-border/80 bg-card/90 shadow-[0_0_0_1px_oklch(0.72_0.15_220/6%),0_12px_40px_oklch(0_0_0/18%)] backdrop-blur-sm transition-shadow hover:shadow-[0_0_0_1px_oklch(0.72_0.15_220/18%),0_16px_48px_oklch(0_0_0/22%)]">
      <header className="relative flex items-center gap-3 border-b border-border/60 bg-gradient-to-r from-primary/12 via-card to-card px-4 py-3">
        <div className="flex items-center gap-1 opacity-70" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-4 w-1 skew-x-[-18deg] rounded-sm bg-primary/80"
            />
          ))}
        </div>
        <h2 className="min-w-0 flex-1 truncate text-sm font-semibold tracking-wide text-foreground">
          {title}
        </h2>
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-30"
          aria-hidden="true"
        />
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}
function ChartBox({
  children,
  height = 185,
}: {
  children: React.ReactElement;
  height?: number;
}) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}
function ProgressBars({
  data,
}: {
  data: readonly { name: string; value: number }[];
}) {
  return (
    <div className="grid gap-3 px-3 py-3">
      <div className="flex flex-col gap-3">
        {data.map((item) => (
          <div
            key={item.name}
            className="grid grid-cols-[88px_minmax(0,1fr)_38px] items-center gap-3"
          >
            <span className="truncate text-xs text-muted-foreground">
              {item.name}
            </span>
            <div className="h-4 overflow-hidden rounded-full bg-primary/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#3157d5] to-[#14a89a] transition-[width] duration-500"
                style={{ width: `${Math.min(item.value, 100)}%` }}
              />
            </div>
            <strong className="text-right font-mono text-xs text-primary">
              {item.value}
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
}
function GaugeCard({
  label,
  value,
  min,
  max,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
}) {
  const percent = Math.max(
    0,
    Math.min(100, ((value - min) / (max - min)) * 100),
  );
  return (
    <div className="flex min-w-0 flex-col items-center gap-1">
      <div className="relative h-28 w-full max-w-[190px]">
        <svg
          viewBox="0 0 200 130"
          preserveAspectRatio="xMidYMid meet"
          className="size-full overflow-visible"
        >
          <defs>
            <linearGradient
              id={`gaugeGradient-${label}`}
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              <stop stopColor="#3157d5" />
              <stop offset="1" stopColor="#14a89a" />
            </linearGradient>
          </defs>
          <path
            d="M24 100 A76 76 0 0 1 176 100"
            fill="none"
            stroke="#dbe2eb"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <path
            d="M24 100 A76 76 0 0 1 176 100"
            fill="none"
            stroke={`url(#gaugeGradient-${label})`}
            strokeWidth="16"
            strokeLinecap="round"
            pathLength="100"
            strokeDasharray={`${percent} 100`}
          />
          <line
            x1="24"
            y1="100"
            x2="17"
            y2="100"
            stroke="#64748b"
            strokeWidth="3"
          />
          <line
            x1="176"
            y1="100"
            x2="183"
            y2="100"
            stroke="#64748b"
            strokeWidth="3"
          />
        </svg>
        <strong className="absolute inset-x-0 bottom-6 z-10 bg-transparent text-center font-mono text-xl font-black leading-none text-[#005486]">
          {value}
        </strong>
        <span className="absolute bottom-1 left-1 text-[10px] font-semibold text-slate-500">
          最小 {min}
        </span>
        <span className="absolute bottom-1 right-1 text-[10px] font-semibold text-slate-500">
          最大 {max}
        </span>
      </div>
      <span className="text-center text-xs leading-4 text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

export function ProjectDashboard() {
  return (
    <main className="min-h-screen bg-background px-4 pb-4 text-foreground md:px-6">
      <div className="mx-auto max-w-[1800px]">
        <HeroBanner
          title="项目管理驾驶舱"
          subtitle="目标牵引 · 任务推进 · 协同督办 · 成果沉淀"
        />
        <div className="grid grid-cols-2 gap-3 py-2 md:grid-cols-3 xl:grid-cols-6">
          {kpis.map(({ label, value, unit, icon: Icon, danger }) => (
            <div
              key={label}
              className={`flex items-center gap-3 rounded-2xl border bg-card/90 px-4 py-3 shadow-sm ${danger ? "border-red-200" : "border-primary/15"}`}
            >
              <span
                className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${danger ? "bg-red-100 text-red-600" : "bg-primary/10 text-primary"}`}
              >
                <Icon className="size-5" />
              </span>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">
                  {label}
                </p>
                <p
                  className={`font-mono text-2xl font-black ${danger ? "text-red-600" : "text-primary"}`}
                >
                  {value}
                  <small className="ml-1 text-xs font-normal text-foreground">
                    {unit}
                  </small>
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="grid gap-2 lg:grid-cols-3">
          <Panel title="年度需求计划状态分布">
            <div className="relative">
              <ChartBox height={210}>
              <PieChart margin={{ top: 4, right: 30, bottom: 0, left: 30 }}>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={48}
                  outerRadius={72}
                  paddingAngle={3}
                  label={({ cx, cy, midAngle, outerRadius, percent }) => {
                    const RADIAN = Math.PI / 180
                    const sin = Math.sin(-midAngle * RADIAN)
                    const cos = Math.cos(-midAngle * RADIAN)
                    const sx = cx + (outerRadius + 2) * cos
                    const sy = cy + (outerRadius + 2) * sin
                    const mx = cx + (outerRadius + 10) * cos
                    const my = cy + (outerRadius + 10) * sin
                    const ex = mx + (cos >= 0 ? 1 : -1) * 8
                    const ey = my
                    const textAnchor = cos >= 0 ? "start" : "end"
                    return (
                      <g>
                        <polyline
                          points={`${sx},${sy} ${mx},${my} ${ex},${ey}`}
                          fill="none"
                          stroke="var(--muted-foreground)"
                          strokeOpacity={0.5}
                          strokeWidth={1}
                        />
                        <text
                          x={ex + (cos >= 0 ? 3 : -3)}
                          y={ey}
                          textAnchor={textAnchor}
                          dominantBaseline="central"
                          fontSize={9}
                          fontWeight={500}
                          fill="var(--foreground)"
                        >
                          {`${(Number(percent) * 100).toFixed(1)}%`}
                        </text>
                      </g>
                    )
                  }}
                  labelLine={false}
                >
                  {statusData.map((item, index) => (
                    <Cell key={item.name} fill={palette[index]} />
                  ))}
                </Pie>
                <Tooltip
                  cursor={false}
                  contentStyle={tooltipStyle}
                  formatter={(value) => [
                    `${Number(value).toFixed(2)}%`,
                    "项目占比",
                  ]}
                />
                <Legend
                  verticalAlign="bottom"
                  height={30}
                  wrapperStyle={{ fontSize: 10, paddingTop: 6 }}
                />
              </PieChart>
              </ChartBox>
              <div className="pointer-events-none absolute left-1/2 top-[92px] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                <span className="text-[9px] leading-tight text-muted-foreground">{statusData[0].name}</span>
                <span className="font-mono text-lg font-bold leading-tight text-primary tabular-nums">
                  {statusData[0].value.toFixed(1)}%
                </span>
              </div>
            </div>
          </Panel>
          <Panel title="在建项目进展情况">
            <ProgressBars data={progressData} />
          </Panel>
          <Panel title="项目进度绩效表">
            <ChartBox>
              <BarChart
                data={[
                  { name: "[0,0.5]", value: 35 },
                  { name: "[0.5,1]", value: 144 },
                  { name: "[1,1.5]", value: 46 },
                  { name: ">1.5", value: 4 },
                ]}
                margin={{ top: 18, right: 10, bottom: 12, left: 0 }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(value) => [`${Number(value)}个`, "项目个数"]} cursor={false} contentStyle={tooltipStyle} />
                <Bar dataKey="value" fill="#3157d5" radius={[6, 6, 0, 0]}>
                  {[35, 144, 46, 4].map((_, index) => <Cell key={index} fill={palette[index]} />)}
                  <LabelList dataKey="value" position="top" formatter={(value: number) => `${value}个`} fill="var(--foreground)" fontSize={10} />
                </Bar>
              </BarChart>
            </ChartBox>
          </Panel>
          <Panel title="分布式核心任务进展">
            <div className="grid grid-cols-2 gap-2 p-3">
              {taskData.map((item, index) => (
                <div key={item.name} className="flex min-h-28 flex-col rounded-lg border border-border/60 bg-card p-3 shadow-sm">
                  <div className="flex items-start justify-between gap-2"><span className="text-xs leading-5 text-muted-foreground">{item.name}</span><span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: palette[index] }} /></div>
                  <p className="mt-2 font-mono text-2xl font-bold text-foreground">{item.value}<span className="ml-1 text-sm font-medium">项</span></p>
                  <div className="mt-auto pt-4"><div className="mb-2 flex justify-between text-[10px] text-muted-foreground"><span>任务占比</span><span>{((item.value / taskTotal) * 100).toFixed(2)}%</span></div><div className="h-2 rounded-full bg-muted"><div className="h-full rounded-full" style={{ width: `${(item.value / taskTotal) * 100}%`, backgroundColor: palette[index] }} /></div></div>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="全行重点项目进展情况">
            <div className="grid grid-cols-2 gap-2 p-3">
              {keyProgressData.map((item, index) => (
<div key={item.name} className="flex min-h-28 flex-col rounded-lg border border-border/60 bg-card p-3 shadow-sm">
  <div className="flex items-center justify-between gap-2"><span className="text-xs font-medium text-muted-foreground">{item.name}</span><span className="size-2 rounded-full" style={{ backgroundColor: palette[index] }} /></div>
  <p className="mt-2 font-mono text-2xl font-bold tracking-tight" style={{ color: palette[index] }}>{item.count}<span className="ml-1 text-sm font-medium">项</span></p>
  <div className="mt-auto pt-4"><div className="mb-2 flex justify-between text-[10px] text-muted-foreground"><span>项目占比</span><span>{((item.count / keyProgressTotal) * 100).toFixed(2)}%</span></div><div className="h-2 rounded-full bg-muted"><div className="h-full rounded-full" style={{ width: `${(item.count / keyProgressTotal) * 100}%`, backgroundColor: palette[index] }} /></div></div>
</div>
              ))}
            </div>
          </Panel>
          <Panel title="延期项目情况">
            <div className="grid grid-cols-2 gap-2 p-3">
              {overdueData.map((item, index) => (
                <div key={item.name} className="flex min-h-28 flex-col rounded-lg border border-border/60 bg-card p-3 shadow-sm">
                  <div className="flex items-center justify-between gap-2"><p className="text-xs font-medium text-muted-foreground">{item.name.replace("项目", "")}</p><span className="size-2 rounded-full" style={{ backgroundColor: palette[index + 1] }} /></div>
                  <p className="mt-2 font-mono text-2xl font-bold tracking-tight" style={{ color: palette[index + 1] }}>{item.count}<span className="ml-1 text-sm font-medium">项</span></p>
                  <div className="mt-auto pt-4"><div className="mb-2 flex justify-between text-[10px] text-muted-foreground"><span>延期占比</span><span>{((item.count / overdueTotal) * 100).toFixed(2)}%</span></div><div className="h-2 rounded-full bg-muted"><div className="h-full rounded-full" style={{ width: `${(item.count / overdueTotal) * 100}%`, backgroundColor: palette[index + 1] }} /></div></div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
        <div className="mt-3">
          <Panel title="2026投产项目交付周期">
            <div className="grid items-center gap-3 lg:grid-cols-4">
              <div className="lg:col-span-1">
                <ChartBox height={190}>
                  <ComposedChart
                    data={deliveryData}
                    margin={{ top: 12, right: 12, bottom: 20, left: 0 }}
                  >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                    <YAxis yAxisId="count" tick={{ fontSize: 9 }} />
<YAxis
                    yAxisId="days"
                    orientation="right"
                    domain={[0, 200]}
                    ticks={[0, 50, 100, 150, 200]}
                    tick={{ fontSize: 9 }}
                  />
                    <Tooltip
                      cursor={false}
                      contentStyle={tooltipStyle}
                      labelFormatter={(label) => String(label)}
                      formatter={(value, name) => {
                        const label = name === "项目平均交付周期（天）" ? "项目平均交付周期（天）" : "项目个数"
                        return [name === "项目平均交付周期（天）" ? `${Number(value)}天` : `${Number(value)}个`, label]
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={22}
                      wrapperStyle={{ fontSize: 9 }}
                    />
                    <Bar
                      yAxisId="count"
                      dataKey="count"
                      name="项目个数"
                      fill="#6366f1"
                      radius={[6, 6, 0, 0]}
                    ><LabelList dataKey="count" position="insideBottom" offset={8} formatter={(value: number) => `${value}个`} fill="#ffffff" fontSize={10} fontWeight={700} /></Bar>
                    <Line
                      yAxisId="days"
                      type="monotone"
                      dataKey="days"
                      name="项目平均交付周期（天）"
                      stroke="#0d9488"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#0d9488" }}
                    ><LabelList dataKey="days" position="top" offset={12} formatter={(value: number) => `${value}天`} fill="#0f766e" fontSize={10} fontWeight={700} /></Line>
                  </ComposedChart>
                </ChartBox>
              </div>
              <div className="grid gap-2 sm:grid-cols-3 lg:col-span-3">
                {gauges.map((gauge) => (
                  <GaugeCard key={gauge.label} {...gauge} />
                ))}
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </main>
  );
}
