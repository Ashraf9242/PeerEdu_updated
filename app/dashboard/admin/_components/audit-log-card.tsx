"use client"

import { Activity } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export type AuditEvent = {
  id: string
  action: string
  summary: string
  severity?: "info" | "warning" | "critical"
}

interface AuditLogCardProps {
  events: AuditEvent[]
  title: string
  description: string
  emptyMessage: string
  severityLabels?: {
    info: string
    warning: string
    critical: string
  }
}

export function AuditLogCard({
  events,
  title,
  description,
  emptyMessage,
  severityLabels = { info: "info", warning: "warning", critical: "critical" },
}: AuditLogCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className="flex items-start gap-3 rounded-2xl border border-border/60 p-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <Activity className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{event.action}</p>
                    {event.severity && (
                      <Badge variant={event.severity === "critical" ? "destructive" : "secondary"} className="text-xs">
                        {severityLabels[event.severity]}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{event.summary}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
