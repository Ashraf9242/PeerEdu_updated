"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts"

interface BookingsPieChartProps {
  data: {
    pending: number
    confirmed: number
    completed: number
    cancelled: number
  }
}

const COLORS = {
  pending: "#f59e0b", // amber-500
  confirmed: "#10b981", // emerald-500
  completed: "#3b82f6", // blue-500
  cancelled: "#ef4444", // red-500
}

export function BookingsPieChart({ data }: BookingsPieChartProps) {
  const chartData = [
    { name: "Pending", value: data.pending },
    { name: "Confirmed", value: data.confirmed },
    { name: "Completed", value: data.completed },
    { name: "Cancelled", value: data.cancelled },
  ].filter(item => item.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bookings by Status</CardTitle>
        <CardDescription>
          A pie chart showing the distribution of booking statuses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                borderColor: "hsl(var(--border))",
              }}
            />
            <Legend />
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
