import Link from "next/link"
import { KeyRound, ShieldAlert } from "lucide-react"

import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ResetPasswordForm } from "./_components/reset-password-form"

interface ResetPasswordPageProps {
  params: {
    token: string
  }
}

// We can't use the language hook here directly, so we'll pass down props
// or use a client component for translated text if needed.
// For simplicity, we'll use hardcoded English for the error state server-side.
// The form itself is a client component and will use the language hook.

const ResetPasswordPage = async ({ params }: ResetPasswordPageProps) => {
  const { token } = params

  const verificationToken = await db.verificationToken.findFirst({
    where: { token },
  })

  const hasExpired =
    !verificationToken || new Date(verificationToken.expires) < new Date()

  let isValid = !hasExpired

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            {isValid ? (
              <KeyRound className="h-8 w-8" />
            ) : (
              <ShieldAlert className="h-8 w-8" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {isValid ? "Reset Your Password" : "Invalid Link"}
          </CardTitle>
          <CardDescription>
            {isValid
              ? "Create a new, strong password for your account."
              : "This password reset link is invalid or has expired. Please request a new one."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isValid ? (
            <ResetPasswordForm token={token} />
          ) : (
            <div className="text-center">
              <Button asChild>
                <Link href="/forgot-password">Request New Link</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ResetPasswordPage
