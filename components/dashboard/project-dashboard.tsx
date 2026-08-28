"use client";

import { useEffect, useMemo, useState } from "react";
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
  { indicatorId: "ID01", label: "年度需求计划", value: "329", unit: "个", icon: CalendarDays },
  { indicatorId: "ID06", label: "总行在建项目数", value: "321", unit: "个", icon: Layers3 },
  { indicatorId: "ID12", label: "总行投产项目数", value: "145", unit: "个", icon: ClipboardList },
  { indicatorId: "ID13", label: "延期项目数", value: "29", unit: "个", icon: CircleAlert, danger: true },
  { indicatorId: "ID14", label: "本月计划投产项目数", value: "30", unit: "个", icon: Gauge },
  { indicatorId: "ID44", label: "投产项目平均交付周期", value: "176", unit: "天", icon: Timer },
];

type ProjectIndicatorApiRow = {
  indicatorId?: string;
  dimension?: string;
  metricName: string;
  currentValue?: number | string | null;
  currentUnit?: string | null;
  targetValue?: number | string | null;
};

const PROJECT_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

function toMetricNumber(value: number | string | null | undefined, fallback: number) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="group h-full overflow-hidden rounded-xl border border-border/80 bg-card/90 shadow-[0_0_0_1px_oklch(0.72_0.15_220/6%),0_12px_40px_oklch(0_0_0/18%)] backdrop-blur-sm transition-shadow hover:shadow-[0_0_0_1px_oklch(0.72_0.15_220/18%),0_16px_48px_oklch(0_0_0/22%)]">
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
  progress,
  min,
  max,
}: {
  label: string;
  value: number;
  progress: number;
  min: number;
  max: number;
}) {
  const currentPercent = Math.max(
    0,
    Math.min(100, ((value - min) / (max - min)) * 100),
  );
  const targetPercent = Math.max(
    0,
    Math.min(100, ((progress - min) / (max - min)) * 100),
  );
  // The pointer starts pointing up (0°) and sweeps left-to-right across the semicircle.
  const pointerAngle = (currentPercent / 100) * 180 - 90;
  const targetAngle = Math.PI - (targetPercent / 100) * Math.PI;
  const targetInnerRadius = 66;
  const targetOuterRadius = 87;
  const targetMarker = {
    x1: 100 + Math.cos(targetAngle) * targetInnerRadius,
    y1: 100 - Math.sin(targetAngle) * targetInnerRadius,
    x2: 100 + Math.cos(targetAngle) * targetOuterRadius,
    y2: 100 - Math.sin(targetAngle) * targetOuterRadius,
  };
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
            strokeDasharray={`${currentPercent} 100`}
          />
          <line
            x1={targetMarker.x1}
            y1={targetMarker.y1}
            x2={targetMarker.x2}
            y2={targetMarker.y2}
            stroke="#f0a33a"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <text
            x={100 + Math.cos(targetAngle) * (targetOuterRadius + 16)}
            y={100 - Math.sin(targetAngle) * (targetOuterRadius + 16)}
            textAnchor={
              Math.cos(targetAngle) < -0.22
                ? "end"
                : Math.cos(targetAngle) > 0.22
                  ? "start"
                  : "middle"
            }
            dominantBaseline="middle"
            fill="#1e3a5f"
            fontSize="13"
            fontWeight="700"
          >
            {progress}
          </text>
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
          <g transform={`rotate(${pointerAngle} 100 100)`}>
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="43"
              stroke="#94a3b8"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="100" cy="100" r="4" fill="#94a3b8" />
          </g>
        </svg>
        <div className="pointer-events-none absolute inset-x-0 bottom-5 z-10 flex items-center justify-center">
          <strong className="bg-transparent text-center font-mono text-xl font-black leading-none text-[#005486]">
            {value}
          </strong>
        </div>
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

function StatusPie({ data }: { data: readonly { name: string; value: number }[] }) {
  const safeData = data.length > 0 ? data : [{ name: "暂无数据", value: 0 }];
  const [selected, setSelected] = useState(0);
  const safeSelected = Math.min(selected, safeData.length - 1);
  const [selectedName, selectedValue] = [
  safeData[safeSelected].name,
  safeData[safeSelected].value,
  ];
  return (
    <div className="flex items-center gap-3">
      <div className="relative shrink-0" style={{ width: 148 }}>
        <ChartBox height={148}>
          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <Pie
              data={safeData}
              dataKey="value"
              nameKey="name"
              innerRadius={46}
              outerRadius={68}
              paddingAngle={3}
              stroke="none"
              onClick={(_, index) => setSelected(index)}
            >
              {data.map((item, index) => (
                <Cell
                  key={item.name}
                  fill={palette[index]}
                  opacity={selected === index ? 1 : 0.55}
                  className="cursor-pointer outline-none"
                />
              ))}
            </Pie>
            <Tooltip
              cursor={false}
              contentStyle={tooltipStyle}
              formatter={(value, name) => [
                `${Number(value).toFixed(2)}%`,
                String(name),
              ]}
            />
          </PieChart>
        </ChartBox>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-2xl font-black text-foreground tabular-nums">
            {selectedValue.toFixed(1)}%
          </span>
          <span className="max-w-20 text-center text-[10px] leading-tight text-muted-foreground">
            {selectedName}
          </span>
        </div>
      </div>
      <ul className="flex min-w-0 flex-1 flex-col gap-1">
        {safeData.map((item, index) => {
          const isSelected = selected === index;
          return (
            <li key={item.name}>
              <button
                type="button"
                onClick={() => setSelected(index)}
                className={`flex w-full items-center gap-2 rounded-md px-2 py-1 text-left transition ${isSelected ? "bg-secondary/60" : "hover:bg-secondary/35"}`}
              >
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: palette[index] }}
                  aria-hidden="true"
                />
                <span
                  className={`min-w-0 flex-1 truncate text-xs ${isSelected ? "font-semibold text-foreground" : "text-muted-foreground"}`}
                >
                  {item.name}
                </span>
                <span
                  className={`font-mono text-xs tabular-nums ${isSelected ? "font-semibold text-foreground" : "text-foreground"}`}
                >
                  {item.value.toFixed(1)}%
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ProjectDashboard() {
  const [apiRows, setApiRows] = useState<ProjectIndicatorApiRow[]>([]);
  const [apiState, setApiState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${PROJECT_API_BASE_URL}/api/project/indicators?year=2026`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Project indicators API ${response.status}`);
        return response.json() as Promise<{ code?: number; data?: ProjectIndicatorApiRow[] } | ProjectIndicatorApiRow[]>;
      })
      .then((payload) => {
        const rows = Array.isArray(payload) ? payload : payload.data;
        setApiRows(Array.isArray(rows) ? rows : []);
        setApiState("ready");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setApiState("error");
      });
    return () => controller.abort();
  }, []);

  const apiById = useMemo(() => {
    const result = new Map<string, ProjectIndicatorApiRow>();
    apiRows.forEach((row) => {
      if (row.indicatorId) result.set(row.indicatorId, row);
    });
    return result;
  }, [apiRows]);

  const valueFor = (indicatorId: string, fallback: number) =>
    toMetricNumber(apiById.get(indicatorId)?.currentValue, fallback);

  const targetFor = (indicatorId: string, fallback: number) =>
    toMetricNumber(apiById.get(indicatorId)?.targetValue, fallback);

  const displayKpis = useMemo(
    () => kpis.map((item) => {
      const row = apiById.get(item.indicatorId);
      if (!row) return item;
      return {
        ...item,
        value: String(toMetricNumber(row.currentValue, Number(item.value))),
        unit: row.currentUnit ?? item.unit,
      };
    }),
    [apiById],
  );

  const statusCounts = [
    valueFor("ID03", 221),
    valueFor("ID02", 78),
    valueFor("ID04", 9),
    valueFor("ID05", 21),
  ];
  const statusTotal = statusCounts.reduce((sum, value) => sum + value, 0);
  const liveStatusData = [
    { name: "已启动", value: statusTotal > 0 ? (statusCounts[0] / statusTotal) * 100 : 0 },
    { name: "已申请未批复", value: statusTotal > 0 ? (statusCounts[1] / statusTotal) * 100 : 0 },
    { name: "已批复超期未启动", value: statusTotal > 0 ? (statusCounts[2] / statusTotal) * 100 : 0 },
    { name: "已批复未启动", value: statusTotal > 0 ? (statusCounts[3] / statusTotal) * 100 : 0 },
  ];
  const liveProgressData = ["业务需求", "总体设计", "商务", "编码测试", "上线准备"].map((name, index) => ({
    name,
    value: valueFor(`ID0${7 + index}`, progressData[index].value),
  }));
  const liveOverdueData = ["轻度延期项目", "中度延期项目", "重度延期项目"].map((name, index) => ({
    name,
    count: valueFor(`ID${16 + index}`, overdueData[index].count),
    value: valueFor(`ID${16 + index}`, overdueData[index].value),
  }));
  const liveTaskData = ["待执行的任务数", "进行中的任务数", "延期的任务数", "已完成的任务数"].map((name, index) => ({
    name,
    value: valueFor(`ID${23 + index}`, taskData[index].value),
  }));
  const liveKeyProgressData = ["待启动项目", "已投产项目", "在建项目", "延期项目"].map((name, index) => ({
    name,
    count: valueFor(`ID${[27, 29, 28, 30][index]}`, keyProgressData[index].count),
  }));
  const liveDeliveryData = [
    { name: "2026投产项目", count: valueFor("ID45", 145), days: valueFor("ID46", 176) },
    { name: "投产顺序项目", count: valueFor("ID47", 40), days: valueFor("ID48", 315) },
    { name: "投产敏捷项目", count: valueFor("ID49", 105), days: valueFor("ID50", 126) },
  ];
  const liveGauges = [
    {
      label: "顺序项目科技实施阶段时长占比",
      value: valueFor("ID35", 51),
      progress: targetFor("ID35", 60),
      min: 0,
      max: 100,
    },
    {
      label: "敏捷项目首版本平均交付周期",
      value: valueFor("ID41", 107),
      progress: targetFor("ID41", 105),
      min: 100,
      max: 107,
    },
    {
      label: "敏捷项目版本平均交付周期",
      value: valueFor("ID43", 23),
      progress: targetFor("ID43", 22.5),
      min: 20,
      max: 23,
    },
  ];
  const livePerformanceData = ["ID19", "ID20", "ID21", "ID22"].map((id, index) => ({
    name: ["[0,0.5)", "[0.5,1)", "[1,1.5)", "≥1.5"][index],
    value: valueFor(id, [35, 144, 46, 4][index]),
  }));
  const liveTaskTotal = liveTaskData.reduce((total, item) => total + item.value, 0);
  const liveKeyProgressTotal = liveKeyProgressData.reduce((total, item) => total + item.count, 0);
  const liveOverdueTotal = liveOverdueData.reduce((total, item) => total + item.count, 0);

  return (
    <main className="min-h-screen bg-background px-4 pb-4 text-foreground md:px-6">
      <div className="mx-auto max-w-[1800px]">
        <HeroBanner
          title="项目管理驾驶舱"
          subtitle="目标牵引 · 任务推进 · 协同督办 · 成果沉淀"
        />
        {apiState === "error" && (
          <p className="px-1 py-1 text-xs text-muted-foreground">
            项目指标接口暂不可用，当前显示页面默认数据。
          </p>
        )}
        <div className="grid grid-cols-2 gap-3 py-2 md:grid-cols-3 xl:grid-cols-6">
          {displayKpis.map(({ label, value, unit, icon: Icon, danger }) => (
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
            <StatusPie data={liveStatusData} />
          </Panel>
          <Panel title="在建项目进展情况">
            <ProgressBars data={liveProgressData} />
          </Panel>
          <Panel title="项目进度绩效表">
            <ChartBox>
              <BarChart
                data={livePerformanceData}
                margin={{ top: 18, right: 10, bottom: 12, left: 0 }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(value) => [`${Number(value)}个`, "项目个数"]} cursor={false} contentStyle={tooltipStyle} />
                <Bar dataKey="value" fill="#3157d5" radius={[6, 6, 0, 0]}>
                  {livePerformanceData.map((_, index) => <Cell key={index} fill={palette[index]} />)}
                  <LabelList dataKey="value" position="top" formatter={(value) => `${Number(value)}个`} fill="var(--foreground)" fontSize={10} />
                </Bar>
              </BarChart>
            </ChartBox>
          </Panel>
          <Panel title="分布式核心任务进展">
            <div className="grid grid-cols-2 gap-2 p-3">
              {liveTaskData.map((item, index) => (
                <div key={item.name} className="flex h-32 min-h-32 flex-col rounded-lg border border-border/60 bg-card p-3 shadow-sm">
                  <div className="flex items-start justify-between gap-2"><span className="text-xs leading-5 text-muted-foreground">{item.name}</span><span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: palette[index] }} /></div>
                  <p className="mt-2 font-mono text-2xl font-bold text-foreground">{item.value}<span className="ml-1 text-sm font-medium">项</span></p>
                  <div className="mt-auto pt-4"><div className="mb-2 flex justify-between text-[10px] text-muted-foreground"><span>任务占比</span><span>{((item.value / liveTaskTotal) * 100).toFixed(2)}%</span></div><div className="h-2 rounded-full bg-muted"><div className="h-full rounded-full" style={{ width: `${(item.value / liveTaskTotal) * 100}%`, backgroundColor: palette[index] }} /></div></div>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="全行重点项目进展情况">
            <div className="grid grid-cols-2 gap-2 p-3">
              {liveKeyProgressData.map((item, index) => (
<div key={item.name} className="flex h-32 min-h-32 flex-col rounded-lg border border-border/60 bg-card p-3 shadow-sm">
  <div className="flex items-center justify-between gap-2"><span className="text-xs font-medium text-muted-foreground">{item.name}</span><span className="size-2 rounded-full" style={{ backgroundColor: palette[index] }} /></div>
  <p className="mt-2 font-mono text-2xl font-bold tracking-tight" style={{ color: palette[index] }}>{item.count}<span className="ml-1 text-sm font-medium">项</span></p>
  <div className="mt-auto pt-4"><div className="mb-2 flex justify-between text-[10px] text-muted-foreground"><span>项目占比</span><span>{((item.count / liveKeyProgressTotal) * 100).toFixed(2)}%</span></div><div className="h-2 rounded-full bg-muted"><div className="h-full rounded-full" style={{ width: `${(item.count / liveKeyProgressTotal) * 100}%`, backgroundColor: palette[index] }} /></div></div>
</div>
              ))}
            </div>
          </Panel>
          <Panel title="延期项目情况">
            <div className="grid grid-cols-2 gap-2 p-3">
              {liveOverdueData.map((item, index) => (
                <div key={item.name} className="flex h-32 min-h-32 flex-col rounded-lg border border-border/60 bg-card p-3 shadow-sm">
                  <div className="flex items-center justify-between gap-2"><p className="text-xs font-medium text-muted-foreground">{item.name.replace("项目", "")}</p><span className="size-2 rounded-full" style={{ backgroundColor: palette[index + 1] }} /></div>
                  <p className="mt-2 font-mono text-2xl font-bold tracking-tight" style={{ color: palette[index + 1] }}>{item.count}<span className="ml-1 text-sm font-medium">项</span></p>
                  <div className="mt-auto pt-4"><div className="mb-2 flex justify-between text-[10px] text-muted-foreground"><span>延期占比</span><span>{((item.count / liveOverdueTotal) * 100).toFixed(2)}%</span></div><div className="h-2 rounded-full bg-muted"><div className="h-full rounded-full" style={{ width: `${(item.count / liveOverdueTotal) * 100}%`, backgroundColor: palette[index + 1] }} /></div></div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
        <div className="mt-3">
          <Panel title="2026投产项目交付周期">
            <div className="grid items-center gap-3 lg:grid-cols-4">
              <div className="lg:col-span-1">
                <ChartBox height={205}>
                  <ComposedChart
                    data={liveDeliveryData}
                    margin={{ top: 28, right: 12, bottom: 20, left: 0 }}
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
                        const label = name === "项目平均交付周期��天）" ? "项目平均交付周期（天）" : "项目个数"
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
                    ><LabelList dataKey="count" position="insideBottom" offset={8} formatter={(value) => `${Number(value)}个`} fill="#ffffff" fontSize={10} fontWeight={700} /></Bar>
                    <Line
                      yAxisId="days"
                      type="monotone"
                      dataKey="days"
                      name="项目平均交付周期（天）"
  stroke="#3157d5"
  strokeWidth={3}
  dot={{ r: 4, fill: "#3157d5", stroke: "#ffffff", strokeWidth: 1.5 }}
  ><LabelList dataKey="days" position="top" offset={12} formatter={(value) => `${Number(value)}天`} fill="#1e3a8a" fontSize={10} fontWeight={700} /></Line>
                  </ComposedChart>
                </ChartBox>
              </div>
              <div className="grid gap-2 sm:grid-cols-3 lg:col-span-3">
                {liveGauges.map((gauge) => (
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
