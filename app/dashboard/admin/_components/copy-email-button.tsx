"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

interface CopyEmailButtonProps {
  email: string
  variant?: "ghost" | "outline" | "secondary"
  size?: "icon" | "sm"
  successMessage: string
  errorMessage: string
  ariaLabel: string
}

export function CopyEmailButton({
  email,
  variant = "ghost",
  size = "icon",
  successMessage,
  errorMessage,
  ariaLabel,
}: CopyEmailButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      toast.success(successMessage)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error(error)
      toast.error(errorMessage)
    }
  }

  return (
    <Button type="button" variant={variant} size={size} onClick={handleCopy} aria-label={ariaLabel}>
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </Button>
  )
}
