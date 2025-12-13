"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

type AnnouncementDraft = {
  headline: string
  body: string
  ctaLabel: string
  ctaUrl: string
}

const STORAGE_KEY = "peeredu-announcement-draft"

export function AnnouncementComposer() {
  const [draft, setDraft] = useState<AnnouncementDraft>(() => {
    if (typeof window === "undefined") {
      return { headline: "", body: "", ctaLabel: "", ctaUrl: "" }
    }
    const cached = window.localStorage.getItem(STORAGE_KEY)
    return cached ? (JSON.parse(cached) as AnnouncementDraft) : { headline: "", body: "", ctaLabel: "", ctaUrl: "" }
  })

  const updateDraft = (field: keyof AnnouncementDraft, value: string) => {
    setDraft((prev) => {
      const next = { ...prev, [field]: value }
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      }
      return next
    })
  }

  const handleCopy = async () => {
    const snippet = JSON.stringify(draft, null, 2)
    try {
      await navigator.clipboard.writeText(snippet)
      toast.success("Announcement JSON copied")
    } catch {
      toast.error("Unable to copy announcement")
    }
  }

  const handleReset = () => {
    const empty: AnnouncementDraft = { headline: "", body: "", ctaLabel: "", ctaUrl: "" }
    setDraft(empty)
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(empty))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Homepage Announcement</CardTitle>
        <CardDescription>Draft hero copy or banner content before publishing it live.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Headline</label>
            <Input value={draft.headline} onChange={(event) => updateDraft("headline", event.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">CTA label</label>
            <Input value={draft.ctaLabel} onChange={(event) => updateDraft("ctaLabel", event.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Body</label>
          <Textarea rows={4} value={draft.body} onChange={(event) => updateDraft("body", event.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">CTA URL</label>
          <Input value={draft.ctaUrl} onChange={(event) => updateDraft("ctaUrl", event.target.value)} placeholder="https://..." />
        </div>
        <div className="flex flex-wrap gap-3">
          <Button type="button" onClick={handleCopy}>
            Copy JSON
          </Button>
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
