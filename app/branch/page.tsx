import type { Metadata } from "next"

import { BranchDashboard } from "@/components/dashboard/branch-dashboard"

export const metadata: Metadata = {
  title: "分行管理驾驶舱",
  description: "分行管理 · 运维监控 · 信创建设 · 系统上云 · 科技人员分布",
}

export default function BranchPage() {
  return <BranchDashboard />
}
