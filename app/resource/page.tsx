import { TopNav } from "@/components/dashboard/top-nav"
import { ResourceDashboard } from "@/components/dashboard/resource-dashboard"

export default function ResourcePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <TopNav />
      <ResourceDashboard />
    </main>
  )
}
