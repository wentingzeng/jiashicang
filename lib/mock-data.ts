// 静态模拟数据层。
// 未来接入真实后端时，只需将下方各个导出的常量替换为
// 对应的 API 请求结果（保持相同的字段结构），页面组件无需改动。

export type NavItem = {
  key: string
  label: string
}

export const navItems: NavItem[] = [
  { key: "ai-plus", label: "人工智能+" },
  { key: "project", label: "项目管理" },
  { key: "resource", label: "资源管理" },
  { key: "branch", label: "分行管理" },
  { key: "security", label: "网络安全" },
  { key: "trusted", label: "信创" },
]

export type KpiCard = {
  key: string
  label: string
  value: number
  unit?: string
  icon: "users" | "check" | "target" | "clock" | "award" | "layers"
  decimals?: number
  /** 归属的顶部 Tab：驾驶舱总览 / 专班建设概览 */
  group: "overview" | "team"
}

export const kpiCards: KpiCard[] = [
  { key: "team-count", label: "专班数量", value: 8, unit: "个", icon: "users", group: "overview" },
  { key: "task-total", label: "年度任务总数", value: 170, unit: "项", icon: "check", group: "overview" },
  { key: "task-rate", label: "任务完成率", value: 5.8, unit: "%", icon: "target", decimals: 1, group: "overview" },
  { key: "overdue", label: "延期任务数", value: 4, unit: "项", icon: "clock", group: "team" },
  { key: "benchmark", label: "示范标杆项目数", value: 13, unit: "项", icon: "award", group: "team" },
  { key: "reuse", label: "AI 场景共性能力复用", value: 0, unit: "个", icon: "layers", group: "team" },
]

export type TaskStatusSlice = {
  key: string
  label: string
  value: number
  color: string
}

export const taskStatusDistribution: TaskStatusSlice[] = [
  { key: "completed", label: "已完成", value: 126, color: "var(--chart-1)" },
  { key: "in-progress", label: "建设中", value: 30, color: "var(--chart-2)" },
  { key: "not-started", label: "待开始", value: 10, color: "var(--chart-3)" },
  { key: "overdue", label: "延期", value: 4, color: "var(--chart-5)" },
]

export type OverallProgress = {
  overallRate: number
  milestoneRate: number
  milestoneDone: number
  milestoneTotal: number
}

export const overallProgress: OverallProgress = {
  overallRate: 3.9,
  milestoneRate: 2,
  milestoneDone: 1,
  milestoneTotal: 51,
}

export type AgentProgress = {
  key: string
  label: string
  value: number
}

export const agentProgress: AgentProgress[] = [
  { key: "internal", label: "对内超级智能体进度", value: 0 },
  { key: "external", label: "对客超级智能体进度", value: 2 },
]

export type MetricPanelItem = {
  label: string
  value: number
  unit: string
  decimals?: number
}

export type MetricPanel = {
  key: string
  title: string
  items: MetricPanelItem[]
}

export const engineeringPanels: MetricPanel[] = [
  {
    key: "model",
    title: "模型工程",
    items: [
      { label: "大模型推理加速比", value: 10, unit: "%" },
      { label: "大模型性能优化比", value: 0, unit: "%" },
    ],
  },
  {
    key: "knowledge",
    title: "知识工程",
    items: [
      { label: "知识文档总数", value: 0, unit: "个" },
      { label: "应用场景数", value: 0, unit: "个" },
      { label: "调用次数", value: 0, unit: "万次" },
    ],
  },
]

export const datasetProgress = {
  title: "高质量数据集工程",
  label: "高质量数据集建设完成度",
  value: 3,
}

export type HighlightItem = {
  index: number
  title: string
  description: string
}

export const highlights: HighlightItem[] = [
  {
    index: 1,
    title: "资源保障承压",
    description: "人力、采购及算力资源需统筹保障",
  },
  {
    index: 2,
    title: "平台依赖较强",
    description: "接口、架构及智算云进度需协同推进",
  },
]

export type PersonnelStat = {
  label: string
  value: number
  unit: string
}

export const personnelStats: PersonnelStat[] = [
  { label: "已发布制度", value: 8, unit: "项" },
  { label: "在建制度", value: 18, unit: "项" },
  { label: "科技条线AI认证人数", value: 0, unit: "人" },
]

export type TechStat = {
  label: string
  value: number
  unit: string
  decimals?: number
}

export type TechFoundationGroup = {
  key: string
  title: string
  icon: "server" | "zap" | "boxes" | "database"
  stats: TechStat[]
}

export const techFoundationGroups: TechFoundationGroup[] = [
  {
    key: "compute",
    title: "智算基础设施",
    icon: "server",
    stats: [
      { label: "总算力卡数", value: 1295, unit: "张" },
      { label: "总算力规模", value: 338, unit: "PFlops" },
      { label: "生产算力分配率", value: 69, unit: "%" },
    ],
  },
  {
    key: "serving",
    title: "模型服务能力",
    icon: "zap",
    stats: [
      { label: "模型月度调用次数", value: 1.62, unit: "亿次", decimals: 2 },
      { label: "模型月度token用量", value: 1890, unit: "亿" },
      { label: "智能体达标应用数", value: 0, unit: "个" },
    ],
  },
  {
    key: "models",
    title: "模型矩阵",
    icon: "boxes",
    stats: [
      { label: "基础大模型", value: 21, unit: "个" },
      { label: "商用大模型", value: 1, unit: "个" },
      { label: "行域大模型", value: 4, unit: "个" },
      { label: "小模型", value: 56, unit: "个" },
    ],
  },
  {
    key: "assets",
    title: "数据与资产",
    icon: "database",
    stats: [
      { label: "非结构化数据目完备率", value: 0, unit: "%" },
      { label: "精品资产认定数量", value: 15, unit: "个" },
    ],
  },
]

export const hrPersonnelTotal = 5718

export const hrPersonnelMix = [
  { name: "自有人员（A类）", value: 44.54, color: "var(--chart-1)" },
  { name: "现场技术服务人员（B类）", value: 50.44, color: "var(--chart-3)" },
  { name: "合作公司人员（C类）", value: 5.02, color: "var(--chart-5)" },
]

export const regionalPersonnel = [
  { name: "上海", value: 2542 },
  { name: "福州", value: 1838 },
  { name: "成都", value: 1246 },
  { name: "深圳", value: 1186 },
  { name: "广州", value: 986 },
  { name: "杭州", value: 842 },
  { name: "武汉", value: 654 },
  { name: "西安", value: 548 },
  { name: "北京", value: 486 },
  { name: "厦门", value: 412 },
]

export const unitPersonnel = [
  { name: "零售与渠道研发部", value: 896 },
  { name: "测试服务部", value: 1228 },
  { name: "对公与投行研发部", value: 768 },
  { name: "软件开发中心", value: 642 },
  { name: "数据管理中心", value: 586 },
  { name: "风险管理研发部", value: 524 },
  { name: "运营与流程研发部", value: 468 },
  { name: "金融市场研发部", value: 412 },
  { name: "基础技术部", value: 386 },
  { name: "架构管理部", value: 348 },
  { name: "数字化创新部", value: 296 },
  { name: "信息安全部", value: 264 },
]

export const businessLineDistribution = [
  { name: "零售金融", value: 21.43, color: "var(--chart-1)" },
  { name: "对公金融", value: 15.65, color: "var(--chart-2)" },
  { name: "同业金融", value: 13.28, color: "var(--chart-3)" },
  { name: "风险管理", value: 12.04, color: "var(--chart-4)" },
  { name: "运营管理", value: 11.52, color: "var(--chart-5)" },
  { name: "金融市场", value: 9.86, color: "oklch(0.68 0.16 250)" },
  { name: "渠道建设", value: 8.42, color: "oklch(0.70 0.14 180)" },
  { name: "其他条线", value: 7.8, color: "var(--muted-foreground)" },
]

export const rdOverviewStats = [
  { label: "在建项目及专项任务数", value: 331, unit: "项", tone: "primary" as const },
  { label: "当年已投产项目及专项任务数", value: 142, unit: "项", tone: "accent" as const },
  { label: "在建项目数", value: 282, unit: "项", tone: "primary" as const },
  { label: "在建专项任务数", value: 49, unit: "项", tone: "accent" as const },
  { label: "投产项目数", value: 142, unit: "项", tone: "primary" as const },
  { label: "投产专项任务数", value: 68, unit: "项", tone: "accent" as const },
]

export const monthlyTaskTrend = [
  { month: "2025-03", building: 240, delivered: 54 }, { month: "2025-05", building: 280, delivered: 78 },
  { month: "2025-06", building: 258, delivered: 108 }, { month: "2025-08", building: 272, delivered: 151 },
  { month: "2025-09", building: 273, delivered: 180 }, { month: "2025-10", building: 323, delivered: 187 },
  { month: "2025-11", building: 339, delivered: 238 }, { month: "2025-12", building: 329, delivered: 283 },
  { month: "2026-01", building: 365, delivered: 224 }, { month: "2026-02", building: 466, delivered: 40 },
  { month: "2026-03", building: 230, delivered: 68 }, { month: "2026-04", building: 229, delivered: 122 },
  { month: "2026-05", building: 252, delivered: 166 }, { month: "2026-06", building: 259, delivered: 190 },
  { month: "2026-07", building: 309, delivered: 230 }, { month: "2026-08", building: 331, delivered: 230 },
]

export const rdDurationTrend = [
  { month: "1月", project: 86, agile: 42 }, { month: "2月", project: 82, agile: 39 }, { month: "3月", project: 78, agile: 36 },
  { month: "4月", project: 75, agile: 34 }, { month: "5月", project: 71, agile: 31 }, { month: "6月", project: 68, agile: 29 },
  { month: "7月", project: 66, agile: 27 }, { month: "8月", project: 63, agile: 26 }, { month: "9月", project: 60, agile: 24 },
  { month: "10月", project: 58, agile: 23 }, { month: "11月", project: 56, agile: 22 }, { month: "12月", project: 54, agile: 21 },
]

export const keyProjects = [
  { name: "兴业生活高端建设三期工程", type: "敏捷", env: "测试", progress: 78, dept: "零售与渠道研发部", start: "2025-11-08", plan: "2026-09-30", actual: "—", duration: "186天", first: "36天", total: "—" },
  { name: "Murex系统版本升级", type: "瀑布", env: "预生产", progress: 92, dept: "金融市场研发部", start: "2025-09-16", plan: "2026-07-15", actual: "—", duration: "228天", first: "48天", total: "—" },
  { name: "新一代核心业务系统建设", type: "瀑布", env: "开发", progress: 64, dept: "软件开发中心", start: "2026-01-12", plan: "2026-11-30", actual: "—", duration: "198天", first: "42天", total: "—" },
  { name: "智能风控平台升级", type: "敏捷", env: "测试", progress: 86, dept: "风险管理研发部", start: "2026-02-08", plan: "2026-08-20", actual: "—", duration: "156天", first: "35天", total: "—" },
  { name: "统一客户画像平台", type: "敏捷", env: "生产", progress: 100, dept: "数据管理中心", start: "2025-08-16", plan: "2026-04-30", actual: "2026-04-24", duration: "251天", first: "38天", total: "251天" },
  { name: "移动端体验重塑工程", type: "敏捷", env: "预生产", progress: 58, dept: "零售与渠道研发部", start: "2026-03-18", plan: "2026-12-15", actual: "—", duration: "116天", first: "28天", total: "—" },
]

export const keySpecials = [
  { name: "数据要素价值提升专项", status: "进行中", progress: 68, dept: "数据管理中心", start: "2026-01-20", plan: "2026-09-30", actual: "—", duration: "—" },
  { name: "信创应用适配专项", status: "已完成", progress: 100, dept: "基础技术部", start: "2025-10-12", plan: "2026-03-30", actual: "2026-03-26", duration: "165天" },
  { name: "敏捷研发效能提升专项", status: "进行中", progress: 55, dept: "架构管理部", start: "2026-04-06", plan: "2026-10-31", actual: "—", duration: "—" },
  { name: "研发安全合规治理专项", status: "进行中", progress: 42, dept: "信息安全部", start: "2026-02-20", plan: "2026-11-30", actual: "—", duration: "—" },
]

export const deliveryQualityStats = [
  { label: "交付达标率", value: 94.2, unit: "%", trend: "up" },
  { label: "线上问题解决率", value: 98.5, unit: "%", trend: "up" },
  { label: "代码千行Bug率", value: 0.24, unit: "‰", trend: "down" },
  { label: "自动化测试覆盖率", value: 72.8, unit: "%", trend: "up" },
]

export const qualityTrend = [
  { month: "1月", bug: 0.32, coverage: 65 },
  { month: "2月", bug: 0.30, coverage: 66 },
  { month: "3月", bug: 0.28, coverage: 68 },
  { month: "4月", bug: 0.29, coverage: 69 },
  { month: "5月", bug: 0.26, coverage: 71 },
  { month: "6月", bug: 0.24, coverage: 73 },
]

export const statisticsPeriod = "2026年度"
export const lastUpdatedAt = "20260622"
