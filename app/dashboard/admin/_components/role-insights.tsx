import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type InsightRow = {
  label: string
  value: string
  helper?: string
}

interface RoleInsightsProps {
  topSubjects: InsightRow[]
  topTutors: InsightRow[]
  topStudents: InsightRow[]
}

export function RoleInsights({ topSubjects, topTutors, topStudents }: RoleInsightsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <InsightCard title="Top Subjects" rows={topSubjects} />
      <InsightCard title="Top Tutors" rows={topTutors} badgeLabel="sessions" />
      <InsightCard title="Top Students" rows={topStudents} badgeLabel="bookings" />
    </div>
  )
}

interface InsightCardProps {
  title: string
  rows: InsightRow[]
  badgeLabel?: string
}

function InsightCard({ title, rows, badgeLabel }: InsightCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">Not enough recent data.</p>
        ) : (
          rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between rounded-xl border border-border/60 px-3 py-2">
              <div>
                <p className="text-sm font-medium text-foreground">{row.label}</p>
                {row.helper && <p className="text-xs text-muted-foreground">{row.helper}</p>}
              </div>
              <Badge variant="secondary" className="text-xs font-semibold">
                {row.value} {badgeLabel}
              </Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
