export type AiCockpitRow = {
  id: number
  pageType: string
  section: string
  subSection: string
  metricCode: string
  dataName: string
  data: number | string
  unit: string | null
  metricType: string | null
  dataLabel: string | null
  dataMeaning: string | null
  dataTime: string
}

const API_BASE = process.env.NEXT_PUBLIC_SECURITY_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080"

async function request(path: string): Promise<AiCockpitRow[]> {
  const response = await fetch(`${API_BASE}${path}`, { cache: "no-store" })
  if (!response.ok) throw new Error(`人工智能数据接口请求失败：${response.status}`)
  return response.json()
}

export const aiCockpitApi = {
  overview: () => request(`/api/ai-cockpit/data?pageType=${encodeURIComponent("驾驶舱总览")}`),
  team: () => request(`/api/ai-cockpit/data?pageType=${encodeURIComponent("专班建设概览")}`),
}

export function formatAiValue(value: number | string, unit?: string | null) {
  const text = String(value)
  return unit ? `${text} ${unit}` : text
}

export function latestRowsBySubSection(rows: AiCockpitRow[]) {
  return rows.reduce<Record<string, AiCockpitRow[]>>((groups, row) => {
    const key = `${row.section}::${row.subSection}`
    ;(groups[key] ??= []).push(row)
    return groups
  }, {})
}

export function rowsByMetricPrefix(rows: AiCockpitRow[], prefix: string) {
  return rows.filter((row) => row.metricCode.startsWith(prefix))
}

export function toNumber(value: number | string) {
  const parsed = Number(String(value).replace(/[%，,]/g, ""))
  return Number.isFinite(parsed) ? parsed : 0
}
