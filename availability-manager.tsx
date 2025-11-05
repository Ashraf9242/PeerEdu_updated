"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AvailabilityManagerProps {
  tutorId: string
}

export function AvailabilityManager({ tutorId }: AvailabilityManagerProps) {
  // TODO: Fetch existing availabilities
  // TODO: Implement UI for adding/deleting time slots

  return (
    <Card>
      <CardHeader>
        <CardTitle>إدارة الأوقات المتاحة</CardTitle>
      </CardHeader>
      <CardContent>{/* جدول الأسبوع أو قائمة الأوقات هنا */}</CardContent>
    </Card>
  )
}