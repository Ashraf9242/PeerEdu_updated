"use client"

import { CheckCircle2, AlertTriangle, Activity } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export type HealthMetric = {
  label: string
  value: string
  status: "healthy" | "attention" | "warning"
  helper?: string
}

interface SystemHealthCardProps {
  metrics: HealthMetric[]
  queueDepth: number
  queueDepthLabel: string
  title: string
  description: string
  queueLabel: string
  queueHelper: string
  statusLabels: {
    healthy: string
    attention: string
    warning: string
  }
}

const STATUS_META = {
  healthy: { icon: CheckCircle2, color: "text-emerald-500" },
  attention: { icon: Activity, color: "text-amber-500" },
  warning: { icon: AlertTriangle, color: "text-red-500" },
}

export function SystemHealthCard({
  metrics,
  queueDepth,
  queueDepthLabel,
  title,
  description,
  queueLabel,
  queueHelper,
  statusLabels,
}: SystemHealthCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/30 px-4 py-3">
          <div>
            <p className="text-sm font-semibold">{queueLabel}</p>
            <p className="text-xs text-muted-foreground">{queueHelper}</p>
          </div>
          <Badge variant={queueDepth > 25 ? "destructive" : queueDepth > 10 ? "outline" : "secondary"}>
            {queueDepthLabel}
          </Badge>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {metrics.map((metric) => {
            const meta = STATUS_META[metric.status]
            const Icon = meta.icon
            return (
              <div key={metric.label} className="rounded-2xl border border-border/60 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{metric.label}</p>
                  <span className={`flex items-center gap-1 text-xs font-semibold ${meta.color}`}>
                    <Icon className="h-4 w-4" />
                    {statusLabels[metric.status]}
                  </span>
                </div>
                <p className="text-2xl font-bold text-foreground mt-2">{metric.value}</p>
                {metric.helper && <p className="text-xs text-muted-foreground">{metric.helper}</p>}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
