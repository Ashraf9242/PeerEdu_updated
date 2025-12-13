"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

type AutomationState = {
  autoApproveTrusted: boolean
  escalateDormant: boolean
  notifyQueueOverflow: boolean
}

const STORAGE_KEY = "peeredu-admin-automation"

export function AutomationSettingsCard() {
  const [state, setState] = useState<AutomationState>({
    autoApproveTrusted: false,
    escalateDormant: true,
    notifyQueueOverflow: true,
  })

  useEffect(() => {
    if (typeof window === "undefined") return
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setState(JSON.parse(stored) as AutomationState)
      } catch {
        /* ignore */
      }
    }
  }, [])

  const handleChange = (key: keyof AutomationState, value: boolean) => {
    setState((prev) => {
      const next = { ...prev, [key]: value }
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      }
      return next
    })
  }

  const handleTest = () => {
    toast.success("Automation hooks pinged. Check your workflow logs.")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Automation Rules</CardTitle>
        <CardDescription>Toggle workflows that auto-handle routine admin tasks.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <AutomationToggle
          label="Auto-approve trusted universities"
          description="Instantly activate teacher profiles from vetted institutions."
          checked={state.autoApproveTrusted}
          onCheckedChange={(checked) => handleChange("autoApproveTrusted", checked)}
        />
        <AutomationToggle
          label="Escalate dormant tutor applications"
          description="Ping admins when a profile sits idle for 72 hours."
          checked={state.escalateDormant}
          onCheckedChange={(checked) => handleChange("escalateDormant", checked)}
        />
        <AutomationToggle
          label="Queue overflow alerts"
          description="Send Slack notifications when pending items exceed thresholds."
          checked={state.notifyQueueOverflow}
          onCheckedChange={(checked) => handleChange("notifyQueueOverflow", checked)}
        />
        <Button type="button" variant="outline" onClick={handleTest}>
          Trigger automation test
        </Button>
      </CardContent>
    </Card>
  )
}

interface AutomationToggleProps {
  label: string
  description: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

function AutomationToggle({ label, description, checked, onCheckedChange }: AutomationToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-border/60 p-4">
      <div>
        <Label className="text-sm font-semibold">{label}</Label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}
