"use client"

import { useTheme } from "next-themes"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ThemePreviewCardProps {
  title: string
  description: string
  lightLabel: string
  darkLabel: string
  lightPreview: string
  darkPreview: string
}

export function ThemePreviewCard({
  title,
  description,
  lightLabel,
  darkLabel,
  lightPreview,
  darkPreview,
}: ThemePreviewCardProps) {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <Button type="button" variant={resolvedTheme === "light" ? "default" : "outline"} onClick={() => setTheme("light")}>
            {lightLabel}
          </Button>
          <Button type="button" variant={resolvedTheme === "dark" ? "default" : "outline"} onClick={() => setTheme("dark")}>
            {darkLabel}
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border p-4 bg-white text-foreground shadow-sm">
            <p className="text-sm text-muted-foreground">{lightPreview}</p>
          </div>
          <div className="rounded-2xl border border-border p-4 bg-slate-900 text-slate-100 shadow-sm">
            <p className="text-sm text-slate-200">{darkPreview}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
