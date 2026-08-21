import type { Metadata } from "next"

import { TeamOverview } from "@/components/dashboard/team-overview"

export const metadata: Metadata = {
  title: "专班建设概览",
  description: "人工智能+专班建设概览 · 目标牵引 · 任务跟踪 · 成效展示",
}

export default function TeamPage() {
  return <TeamOverview />
}
