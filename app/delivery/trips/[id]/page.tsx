import { DashboardLayout } from "@/components/dashboard-layout"
import TripDetailPage from "./TripDetailPage"

interface Props {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: Props) {
  const { id } = await params
  return (
    <DashboardLayout role="delivery">
      <TripDetailPage id={id} />
    </DashboardLayout>
  )
}
