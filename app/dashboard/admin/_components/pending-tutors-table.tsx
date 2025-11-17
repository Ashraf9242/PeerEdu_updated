"use client"

import { useState, useTransition } from "react"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { approveTutor } from "../_actions/approve-tutor"
import { rejectTutor } from "../_actions/reject-tutor"

type PendingTutor = {
  id: string
  user: {
    name: string | null
    image: string | null
    createdAt: Date
  }
  university: string | null
  subjects: string[]
  hourlyRate: number | null
}

interface PendingTutorsTableProps {
  tutors: PendingTutor[]
}

export function PendingTutorsTable({ tutors: initialTutors }: PendingTutorsTableProps) {
  const [isPending, startTransition] = useTransition()
  const [tutors, setTutors] = useState(initialTutors)

  const handleApprove = (id: string) => {
    startTransition(async () => {
      const result = await approveTutor(id)
      if (result.success) {
        setTutors((prev) => prev.filter((t) => t.id !== id))
        toast({ title: "Success", description: result.message })
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" })
      }
    })
  }

  const handleReject = (id: string) => {
    startTransition(async () => {
      const result = await rejectTutor(id)
      if (result.success) {
        setTutors((prev) => prev.filter((t) => t.id !== id))
        toast({ title: "Success", description: result.message })
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" })
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Teacher Approvals</CardTitle>
        <CardDescription>Review and approve or reject new teacher applications.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tutor</TableHead>
              <TableHead className="hidden md:table-cell">University</TableHead>
              <TableHead className="hidden lg:table-cell">Subjects</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tutors.length > 0 ? (
              tutors.map((tutor) => (
                <TableRow key={tutor.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={tutor.user.image || "/placeholder-user.jpg"} />
                        <AvatarFallback>{tutor.user.name?.[0] || "T"}</AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{tutor.user.name}</div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{tutor.university || "N/A"}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {tutor.subjects.slice(0, 2).map((s) => (
                        <Badge key={s} variant="secondary">{s}</Badge>
                      ))}
                      {tutor.subjects.length > 2 && <Badge variant="outline">...</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="mr-2"
                      onClick={() => handleApprove(tutor.id)}
                      disabled={isPending}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleReject(tutor.id)}
                      disabled={isPending}
                    >
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No pending approvals.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
