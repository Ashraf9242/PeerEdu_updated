import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { BookingStatus } from "@prisma/client"
import { format } from "date-fns"

type RecentBooking = {
  id: string
  student: { name: string | null }
  tutor: { name: string | null }
  status: BookingStatus
  createdAt: Date
  price: number
}

interface RecentBookingsProps {
  bookings: RecentBooking[]
}

const statusColors: Record<BookingStatus, string> = {
  PENDING: "bg-yellow-400/20 text-yellow-600",
  CONFIRMED: "bg-blue-400/20 text-blue-600",
  CANCELLED: "bg-red-400/20 text-red-600",
  COMPLETED: "bg-green-400/20 text-green-600",
  REJECTED: "bg-gray-400/20 text-gray-600",
}

export function RecentBookings({ bookings }: RecentBookingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Bookings</CardTitle>
        <CardDescription>The last 10 bookings made on the platform.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Tutor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.student.name}</TableCell>
                <TableCell>{booking.tutor.name}</TableCell>
                <TableCell>
                  <Badge className={statusColors[booking.status]}>
                    {booking.status}
                  </Badge>
                </TableCell>
                <TableCell>{format(new Date(booking.createdAt), "PPP")}</TableCell>
                <TableCell className="text-right">${booking.price.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
