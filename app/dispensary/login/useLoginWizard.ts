import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { useAuth } from "@/context/AuthContext"
import { useLoginMutation } from "@/app/api/react-query/auth"
import { loginSchema, LoginFormData } from "./util"
import { useEffect } from "react"
import axios from "axios"

export function useLoginWizard() {
  const router = useRouter()
  const { setUser, isAuthenticated } = useAuth()
  const loginMutation = useLoginMutation()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dispensary/dashboard")
    }
  }, [isAuthenticated, router])

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
        setUser(response.data)
        router.push("/dispensary/dashboard")
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
