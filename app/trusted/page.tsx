import { TopNav } from "@/components/dashboard/top-nav"
import { TrustedDashboard } from "@/components/dashboard/trusted-dashboard"

export default function TrustedPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <TopNav />
      <TrustedDashboard />
    </main>
  )
}
