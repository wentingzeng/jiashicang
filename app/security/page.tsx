import { TopNav } from "@/components/dashboard/top-nav"
import { SecurityDashboard } from "@/components/dashboard/security-dashboard"

export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <TopNav />
      <SecurityDashboard />
    </main>
  )
}