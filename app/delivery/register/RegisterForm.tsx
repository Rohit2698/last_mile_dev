"use client"

import Link from "next/link"
import { useRegisterWizard } from "./useRegisterWizard"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FormInputField, FormPhoneInput } from "@/components/fields"
import { Form } from "@/components/ui/form"

export function RegisterForm() {
  const { form, onSubmit, isLoading } = useRegisterWizard()

  const { handleSubmit, control } = form

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Delivery Partner Registration</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Create your delivery partner account
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInputField
              name="companyName"
              control={control}
              label="Company Name"
              type="text"
              required
            />

            <FormInputField
              name="email"
              control={control}
              label="Email"
              type="email"
              required
            />

            <FormInputField
              name="password"
              control={control}
              label="Password"
              type="password"
              required
            />

            <FormPhoneInput
              name="phone"
              control={control}
              label="Phone"
            />

            <FormInputField
              name="address"
              control={control}
              label="Address"
              type="text"
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Already have an account?{" "}
              <Link
                href="/delivery/login"
                className="text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </form>
        </Form>
      </Card>
    </div>
  )
}
