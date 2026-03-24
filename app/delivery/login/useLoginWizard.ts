import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { useDeliveryAuth } from "@/context/DeliveryAuthContext"
import { useDeliveryLoginMutation } from "@/app/api/react-query/deliveryAuth"
import { loginSchema, LoginFormData } from "./util"
import { useEffect } from "react"
import axios from "axios"

export function useLoginWizard() {
  const router = useRouter()
  const { setDeliveryUser, isAuthenticated: isDeliveryAuthenticated } = useDeliveryAuth()
  const loginMutation = useDeliveryLoginMutation()

  useEffect(() => {
    if (isDeliveryAuthenticated) {
      router.push("/delivery/dashboard")
    }
  }, [isDeliveryAuthenticated, router])

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await loginMutation.mutateAsync(data)

      if (response.success) {
        toast.success(response.message || "Login successful!")
        setDeliveryUser(response.data)
        router.push("/delivery/dashboard")
      }
    } catch (error: unknown) {
      let errorMessage = "Login failed. Please try again."
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message
      }
      toast.error(errorMessage)
    }
  }

  return {
    form,
    onSubmit,
    isLoading: loginMutation.isPending,
  }
}
