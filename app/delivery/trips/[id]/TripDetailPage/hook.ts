import { useTripDetailQuery } from "@/app/api/react-query/trips"
import deliveryApiClient from "@/lib/deliveryApiClient"

export const useTripDetailPage = (id: string) => {
  const { data, isLoading, isError } = useTripDetailQuery(id)

  const order = data?.order ?? null
  const driver = data?.driver ?? null
  const timeline = data?.timeline ?? []

  const downloadManifest = async () => {
    if (!order) return

    const response = await deliveryApiClient.get(`/trips/${id}/manifest`, {
      responseType: "blob",
    })

    const url = URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }))
    const a = document.createElement("a")
    a.href = url
    a.download = `manifest-${order.posOrderId || order.id.slice(0, 8)}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }

  return { order, driver, timeline, isLoading, isError, downloadManifest }
}
