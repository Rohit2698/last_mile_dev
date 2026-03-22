import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { useAuth } from "@/context/AuthContext"
import { useRegisterMutation } from "@/app/api/react-query/auth"
import { registerSchema, RegisterFormData } from "./util"
import { useEffect } from "react"
import axios from "axios"

export function useRegisterWizard() {
  const router = useRouter()
  const { setUser, isAuthenticated } = useAuth()
  const registerMutation = useRegisterMutation()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dispensary/dashboard")
    }
  }, [isAuthenticated, router])

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      licenseNumber: "",
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await registerMutation.mutateAsync(data)

      if (response.success) {
        toast.success(response.message || "Registration successful!")
        setUser(response.data)
        router.push("/dispensary/dashboard")
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
