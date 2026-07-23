import { DashboardContent } from "@/components/DashboardContent"

export function DashboardPage() {
  return (
    <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-4 flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Dashboard Brasil em Números</h1>
      <DashboardContent />
    </div>
  )
}
