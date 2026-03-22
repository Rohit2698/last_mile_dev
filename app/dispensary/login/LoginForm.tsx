"use client"

import Link from "next/link"
import { useLoginWizard } from "./useLoginWizard"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FormInputField } from "@/components/fields"
import { Form } from "@/components/ui/form"

export function LoginForm() {
  const { form, onSubmit, isLoading } = useLoginWizard()

  const { handleSubmit, control } = form

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Dispensary Login</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Sign in to your account
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Don&apos;t have an account?{" "}
              <Link
                href="/dispensary/register"
                className="text-primary hover:underline"
              >
                Create one
              </Link>
            </p>
          </form>
        </Form>
      </Card>
    </div>
  )
}
