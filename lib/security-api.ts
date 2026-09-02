export type BranchScore = {
  id: number
  branchLevel: string
  branchName: string
  province: string
  city: string
  annualTotalScore: number
  rankByBranchLevel: number | null
  rankByAllBranches: number | null
  assessmentYear: number
  institutionType: string
  [key: string]: unknown
}

export type SecurityNetworkCapabilityDetail = {
  id: number
  category: string
  branchName: string
  province: string
  city: string
  securityResourceScore: number
  cybersecurityAssessmentScore: number
  cybersecurityInspectionScore: number
  employeeSecurityScore: number
  personalInformationScore: number
  securityInnovationScore: number
  securityIncidentScore: number
  totalScore: number
}

export type SecurityIndicator = {
  id: number
  indicatorCategory: string
  indicatorName: string
  indicatorDefinition: string
  indicatorValue: number
  valueUnit: string
  assessmentYear: number
}

export type InspectionProblem = {
  id: number
  problemCategory: string
  problemRatio: number
  problemCount: number
  assessmentYear: number
}

export type BranchRanking = {
  id: number
  branchName: string
  rankingType: "excellent" | "poor"
  rankingPosition: number
  assessmentYear: number
}

export type TrainingStat = {
  id: number
  unitName: string
  safetyTrainingCount: number
  violationScoreCount: number
  safetyTrainingCoverage: number
  assessmentYear: number
}

const API_BASE = process.env.NEXT_PUBLIC_SECURITY_API_BASE_URL ?? "http://localhost:8080"

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, { cache: "no-store" })
  if (!response.ok) throw new Error(`安全数据接口请求失败：${response.status}`)
  return response.json() as Promise<T>
}

export const securityApi = {
  networkCapabilityDetails: () => request<SecurityNetworkCapabilityDetail[]>("/api/security/network-capability/details"),
  branches: (year: string) => request<BranchScore[]>(`/api/security/branches?year=${encodeURIComponent(year)}`),
  indicators: (year: string) => request<SecurityIndicator[]>(`/api/security/indicators?year=${encodeURIComponent(year)}`),
  problems: (year: string) => request<InspectionProblem[]>(`/api/security/inspection-problems?year=${encodeURIComponent(year)}`),
  rankings: (year: string) => request<BranchRanking[]>(`/api/security/rankings?year=${encodeURIComponent(year)}`),
  training: (year: string) => request<TrainingStat[]>(`/api/security/training?year=${encodeURIComponent(year)}`),
}

export function normalizeRatio(value: number) {
  return value <= 1 ? value * 100 : value
}

export function toCapabilityData(rows: BranchScore[]) {
  return rows.map((row) => ({
    ...row,
    name: row.branchName,
    value: Number(row.annualTotalScore ?? 0),
    rankByAllBranches: row.rankByAllBranches,
    rankByBranchLevel: row.rankByBranchLevel,
    branchLevel: row.branchLevel,
  }))
}

const INDICATOR_ORDER = [
  "全行特别重大、重大网络安全事件数",
  "全行特别重大、重大数据安全事件数",
  "网络安全检查分支机构覆盖面",
  "安全工单自动化派发率",
  "安全告警AI研判准确率",
  "商用密码应用安全性评估通过率",
]

export function toIndicatorLabels(rows: SecurityIndicator[]) {
  const orderedRows = [...rows].sort((a, b) => {
    const ai = INDICATOR_ORDER.findIndex((name) => a.indicatorName.includes(name))
    const bi = INDICATOR_ORDER.findIndex((name) => b.indicatorName.includes(name))
    return (ai < 0 ? INDICATOR_ORDER.length : ai) - (bi < 0 ? INDICATOR_ORDER.length : bi)
  })
  return orderedRows.map((row) => {
    const unit = row.valueUnit?.toLowerCase()
    const value = unit === "percent" ? `${normalizeRatio(row.indicatorValue)}%` : unit === "count" ? String(row.indicatorValue) : `${row.indicatorValue}${row.valueUnit ?? ""}`
    return `${row.indicatorName}：${value}`
  })
}

export function toProblemData(rows: InspectionProblem[]) {
  return rows.map((row) => ({ name: row.problemCategory, value: row.problemCount }))
}

export function toTrainingData(rows: TrainingStat[]) {
  return [...rows].sort((a, b) => b.safetyTrainingCount - a.safetyTrainingCount).map((row) => ({ name: row.unitName, value: row.safetyTrainingCount }))
}

export function toViolationData(rows: TrainingStat[]) {
  return [...rows].sort((a, b) => b.violationScoreCount - a.violationScoreCount).map((row) => ({ name: row.unitName, value: row.violationScoreCount }))
}

export function toRepairRate(rows: SecurityIndicator[]) {
  const row = rows.find((item) => item.indicatorName.includes("覆盖面") || item.indicatorName.includes("覆盖率"))
  return row ? normalizeRatio(row.indicatorValue) : 0
}

export function toTotalProblems(rows: InspectionProblem[]) {
  return rows.reduce((sum, row) => sum + row.problemCount, 0)
}

export function toRankingBranches(rows: BranchRanking[], type: BranchRanking["rankingType"]) {
  return rows.filter((row) => row.rankingType === type).sort((a, b) => a.rankingPosition - b.rankingPosition).map((row) => row.branchName)
}

export function toFujianCityData(rows: BranchScore[]) {
  return rows
    .filter((row) => row.province?.includes("福建") || row.branchName?.includes("福建") || row.city?.includes("福建"))
    .map((row) => ({
      name: row.city?.endsWith("市") ? row.city : `${row.city}市`,
      value: Number(row.annualTotalScore ?? 0),
      rankByAllBranches: row.rankByAllBranches,
      rankByBranchLevel: row.rankByBranchLevel,
      branchLevel: row.branchLevel,
    }))
}
