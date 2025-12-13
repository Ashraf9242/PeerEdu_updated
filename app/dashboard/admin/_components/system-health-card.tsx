import { CheckCircle2, AlertTriangle, Activity } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type HealthMetric = {
  label: string
  value: string
  status: "healthy" | "attention" | "warning"
  helper?: string
}

interface SystemHealthCardProps {
  metrics: HealthMetric[]
  queueDepth: number
}

const STATUS_META = {
  healthy: { label: "Healthy", icon: CheckCircle2, color: "text-emerald-500" },
  attention: { label: "Attention", icon: Activity, color: "text-amber-500" },
  warning: { label: "Warning", icon: AlertTriangle, color: "text-red-500" },
}

export function SystemHealthCard({ metrics, queueDepth }: SystemHealthCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Health</CardTitle>
        <CardDescription>Live snapshot of operational signals and queues.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/30 px-4 py-3">
          <div>
            <p className="text-sm font-semibold">Queue depth</p>
            <p className="text-xs text-muted-foreground">Pending approvals + requests</p>
          </div>
          <Badge variant={queueDepth > 25 ? "destructive" : queueDepth > 10 ? "outline" : "secondary"}>
            {queueDepth} items
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
                    {meta.label}
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
