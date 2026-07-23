import "./index.css"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardPage } from "@/pages/DashboardPage"

function App() {
  return (
    <AppSidebar>
      <DashboardPage />
    </AppSidebar>
  )
}

export default App
