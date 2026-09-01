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
  const payload = await response.json()
  const rows = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.data?.rows)
        ? payload.data.rows
        : Array.isArray(payload?.rows)
          ? payload.rows
          : []
  return rows.map((row) => ({
    ...row,
    section: row.section ?? row.sectionName ?? row.section_name ?? "",
    subSection: row.subSection ?? row.sub_section ?? row.subsection ?? "",
    metricCode: row.metricCode ?? row.metric_code ?? String(row.id ?? ""),
    dataName: row.dataName ?? row.data_name ?? row.name ?? "",
    data: row.data ?? row.value ?? "",
    unit: row.unit ?? null,
  }))
}

export const aiCockpitApi = {
  overview: () => request(`/api/ai-cockpit/data?pageType=${encodeURIComponent("驾驶舱总览")}`),
  team: () => request(`/api/ai-cockpit/data?pageType=${encodeURIComponent("专班建设概览")}`),
}

export function formatAiValue(value: number | string, unit?: string | null) {
  const text = String(value)
  return unit ? `${text}${unit}` : text
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

/** 按 section + subSection（对应页面上的分区标题 / 卡片标题）筛选数据行。 */
export function rowsBySection(rows: AiCockpitRow[], section: string, subSection?: string) {
  return rows.filter((row) => row.section === section && (subSection === undefined || row.subSection === subSection))
}

/** 在一组数据行中按 dataName 关键字查找第一条匹配记录。 */
export function findByName(rows: AiCockpitRow[], keyword: string) {
  return rows.find((row) => row.dataName.includes(keyword))
}

export function toNumber(value: number | string) {
  const parsed = Number(String(value).replace(/[%，,]/g, ""))
  return Number.isFinite(parsed) ? parsed : 0
}
