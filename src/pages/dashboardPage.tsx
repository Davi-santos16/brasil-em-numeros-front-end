import { DashboardContent } from "@/components/dashboardContent"

export function DashboardPage() {
  return (
    <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-4 flex flex-col gap-6">
      <DashboardContent />
    </div>
  )
}
