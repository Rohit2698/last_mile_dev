import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import apiClient from "@/lib/apiClient"
import deliveryApiClient from "@/lib/deliveryApiClient"

export interface ConnectionLink {
  id: string
  deliveryPartnerId: string
  dispensaryId: string
  status: "PENDING" | "ACTIVE" | "INACTIVE"
  createdAt: string
  updatedAt: string
  deliveryPartner?: {
    id: string
    companyName: string
    email: string
    phone?: string
    logoUrl?: string
    isVerified?: boolean
  }
  dispensary?: {
    id: string
    name: string
    email: string
    phone?: string
    address?: string
    isVerified?: boolean
  }
}

// ─── Dispensary hooks ────────────────────────────────────────────────────────

export const useDispensaryConnectionCode = () => {
  return useQuery({
    queryKey: ["dispensary", "connection-code"],
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; data: { connectionCode: string } }>(
        "/dispensary/connection-code",
      )
      return res.data.data
    },
  })
}

export const useRegenerateDispensaryCode = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const res = await apiClient.post("/dispensary/connection-code/regenerate")
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dispensary", "connection-code"] })
    },
  })
}

export const useDispensaryConnections = () => {
  return useQuery({
    queryKey: ["dispensary", "connections"],
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; data: ConnectionLink[] }>(
        "/dispensary/connections",
      )
      return res.data.data
    },
  })
}

export const useDispensaryConnectionRequests = () => {
  return useQuery({
    queryKey: ["dispensary", "connection-requests"],
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; data: ConnectionLink[] }>(
        "/dispensary/connection-requests",
      )
      return res.data.data
    },
  })
}

export const useConnectToPartner = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (code: string) => {
      const res = await apiClient.post("/dispensary/connect", { code })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dispensary", "connections"] })
      queryClient.invalidateQueries({ queryKey: ["dispensary", "connection-requests"] })
    },
  })
}

export const useApproveDispensaryRequest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (linkId: string) => {
      const res = await apiClient.post(`/dispensary/connections/${linkId}/approve`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dispensary", "connections"] })
      queryClient.invalidateQueries({ queryKey: ["dispensary", "connection-requests"] })
    },
  })
}

export const useRejectDispensaryRequest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (linkId: string) => {
      const res = await apiClient.post(`/dispensary/connections/${linkId}/reject`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dispensary", "connection-requests"] })
    },
  })
}

export const useDisconnectFromPartner = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (linkId: string) => {
      const res = await apiClient.delete(`/dispensary/connections/${linkId}`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dispensary", "connections"] })
    },
  })
}

// ─── Delivery partner hooks ───────────────────────────────────────────────────

export const useDeliveryConnectionCode = () => {
  return useQuery({
    queryKey: ["delivery", "connection-code"],
    queryFn: async () => {
      const res = await deliveryApiClient.get<{
        success: boolean
        data: { connectionCode: string }
      }>("/delivery-partner/connection-code")
      return res.data.data
    },
  })
}

export const useRegenerateDeliveryCode = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const res = await deliveryApiClient.post("/delivery-partner/connection-code/regenerate")
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery", "connection-code"] })
    },
  })
}

export const useDeliveryConnections = () => {
  return useQuery({
    queryKey: ["delivery", "connections"],
    queryFn: async () => {
      const res = await deliveryApiClient.get<{ success: boolean; data: ConnectionLink[] }>(
        "/delivery-partner/connections",
      )
      return res.data.data
    },
  })
}

export const useDeliveryConnectionRequests = () => {
  return useQuery({
    queryKey: ["delivery", "connection-requests"],
    queryFn: async () => {
      const res = await deliveryApiClient.get<{ success: boolean; data: ConnectionLink[] }>(
        "/delivery-partner/connection-requests",
      )
      return res.data.data
    },
  })
}

export const useConnectToDispensary = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (code: string) => {
      const res = await deliveryApiClient.post("/delivery-partner/connect", { code })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery", "connections"] })
      queryClient.invalidateQueries({ queryKey: ["delivery", "connection-requests"] })
    },
  })
}

export const useApproveDeliveryRequest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (linkId: string) => {
      const res = await deliveryApiClient.post(`/delivery-partner/connections/${linkId}/approve`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery", "connections"] })
      queryClient.invalidateQueries({ queryKey: ["delivery", "connection-requests"] })
    },
  })
}

export const useRejectDeliveryRequest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (linkId: string) => {
      const res = await deliveryApiClient.post(`/delivery-partner/connections/${linkId}/reject`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery", "connection-requests"] })
    },
  })
}

export const useDisconnectFromDispensary = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (linkId: string) => {
      const res = await deliveryApiClient.delete(`/delivery-partner/connections/${linkId}`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery", "connections"] })
    },
  })
}
