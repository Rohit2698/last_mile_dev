import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { useDeliveryAuth } from "@/context/DeliveryAuthContext"
import { useDeliveryRegisterMutation } from "@/app/api/react-query/deliveryAuth"
import { registerSchema, RegisterFormData } from "./util"
import { useEffect } from "react"
import axios from "axios"

export function useRegisterWizard() {
  const router = useRouter()
  const { setDeliveryUser, isAuthenticated: isDeliveryAuthenticated } = useDeliveryAuth()
  const registerMutation = useDeliveryRegisterMutation()

  useEffect(() => {
    if (isDeliveryAuthenticated) {
      router.push("/delivery/dashboard")
    }
  }, [isDeliveryAuthenticated, router])

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      companyName: "",
      email: "",
      password: "",
      phone: "",
      address: "",
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await registerMutation.mutateAsync(data)

      if (response.success) {
        toast.success(response.message || "Registration successful!")
        setDeliveryUser(response.data)
        router.push("/delivery/dashboard")
      }
    } catch (error: unknown) {
      let errorMessage = "Registration failed. Please try again."
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message
      }
      toast.error(errorMessage)
    }
  }

  return {
    form,
    onSubmit,
    isLoading: registerMutation.isPending,
  }
}
