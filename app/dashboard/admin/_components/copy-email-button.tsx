"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

interface CopyEmailButtonProps {
  email: string
  variant?: "ghost" | "outline" | "secondary"
  size?: "icon" | "sm"
}

export function CopyEmailButton({ email, variant = "ghost", size = "icon" }: CopyEmailButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      toast.success("Email copied to clipboard")
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error(error)
      toast.error("Unable to copy email")
    }
  }

  return (
    <Button type="button" variant={variant} size={size} onClick={handleCopy} aria-label="Copy email address">
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </Button>
  )
}
