"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Eye, EyeOff, KeyRound } from "lucide-react"
import zxcvbn from "zxcvbn"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"

interface ResetPasswordFormProps {
  token: string
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const { t } = useLanguage()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const formSchema = z
    .object({
      password: z
        .string()
        .min(8, t("resetPassword.error.length"))
        .refine((p) => /[A-Z]/.test(p), t("resetPassword.error.case"))
        .refine((p) => /[0-9]/.test(p), t("resetPassword.error.number"))
        .refine((p) => /[^A-Za-z0-9]/.test(p), t("resetPassword.error.special")),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("resetPassword.error.mismatch"),
      path: ["confirmPassword"],
    })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: "", confirmPassword: "" },
  })

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pass = e.target.value
    form.setValue("password", pass)
    const strength = zxcvbn(pass).score
    setPasswordStrength(strength)
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: values.password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Something went wrong")
      }

      toast({
        title: t("resetPassword.success.title"),
        description: t("resetPassword.success.message"),
      })

      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return "bg-red-500"
      case 2:
        return "bg-yellow-500"
      case 3:
      case 4:
        return "bg-green-500"
      default:
        return "bg-gray-300"
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("resetPassword.password")}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    {...field}
                    onChange={handlePasswordChange}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <Progress
                value={(passwordStrength / 4) * 100}
                className={`h-2 mt-2 ${getStrengthColor()}`}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("resetPassword.confirmPassword")}</FormLabel>
              <FormControl>
                <Input type={showPassword ? "text" : "password"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? t("resetPassword.loading") : t("resetPassword.submit")}
        </Button>
      </form>
    </Form>
  )
}
