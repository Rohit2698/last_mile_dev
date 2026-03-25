import { DashboardLayout } from "@/components/dashboard-layout"
import { TripsPage } from "./TripsPage"

export default function TripsPageRoute() {
  return (
    <DashboardLayout role="delivery">
      <TripsPage />
    </DashboardLayout>
  )
}
