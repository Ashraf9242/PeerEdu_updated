import { format, formatDistanceToNow, subDays } from "date-fns"
import type { BookingStatus, User } from "@prisma/client"
import Link from "next/link"

import { requireRole } from "@/auth-utils"
import { db } from "@/lib/db"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AdminHero } from "./_components/admin-hero"
import { CopyEmailButton } from "./_components/copy-email-button"
import { AdminCharts } from "./_components/admin-charts"
import { RoleInsights } from "./_components/role-insights"
import { SystemHealthCard } from "./_components/system-health-card"
import { AutomationSettingsCard } from "./_components/automation-settings-card"
import { AnnouncementComposer } from "./_components/announcement-composer"
import { AuditLogCard } from "./_components/audit-log-card"
import type { AuditEvent } from "./_components/audit-log-card"
import { updateTutorApprovalAction, updateUserStatusAction } from "./_actions/manage-users"

type AdminPageProps = {
  searchParams: Record<string, string | string[] | undefined>
}

const UNIVERSITY_FILTERS = ["Sultan Qaboos University", "UTAS Ibri", "PeerEdu", "Muscat University"]

export default async function AdminDashboardPage({ searchParams }: AdminPageProps) {
  await requireRole("ADMIN")

  const last30Days = subDays(new Date(), 30)

  const [
    totalUsers,
    studentCount,
    teacherCount,
    adminCount,
    pendingTeacherAccounts,
    pendingStudentAccounts,
    pendingSubjectApprovals,
    recentUsers,
    recentBookings,
    totalBookings,
    pendingBookings,
    confirmedBookings,
    completedBookings,
    revenueResult,
    bookingsLast30Detailed,
    usersLast30Detailed,
  ] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { role: "STUDENT" } }),
    db.user.count({ where: { role: "TEACHER" } }),
    db.user.count({ where: { role: "ADMIN" } }),
    db.user.findMany({
      where: { role: "TEACHER", status: "PENDING" },
      include: { tutorProfile: true },
      orderBy: { createdAt: "desc" },
      take: 25,
    }),
    db.user.findMany({
      where: { role: "STUDENT", status: "PENDING" },
      orderBy: { createdAt: "desc" },
      take: 25,
    }),
    db.tutorProfile.findMany({
      where: { isApproved: false },
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 25,
    }),
    db.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 12,
    }),
    db.booking.findMany({
      include: { student: true, tutor: true },
      orderBy: { createdAt: "desc" },
      take: 12,
    }),
    db.booking.count(),
    db.booking.count({ where: { status: "PENDING" } }),
    db.booking.count({ where: { status: "CONFIRMED" } }),
    db.booking.count({ where: { status: "COMPLETED" } }),
    db.booking.aggregate({
      _sum: { price: true },
      where: { status: { in: ["CONFIRMED", "COMPLETED"] } },
    }),
    db.booking.findMany({
      where: { createdAt: { gte: last30Days } },
      include: { tutor: true, student: true },
      orderBy: { createdAt: "asc" },
    }),
    db.user.findMany({
      where: { createdAt: { gte: last30Days } },
      orderBy: { createdAt: "asc" },
    }),
  ])

  const totalRevenue = revenueResult._sum.price?.toNumber() ?? 0
  const pendingTeacherCount = pendingTeacherAccounts.length
  const pendingStudentCount = pendingStudentAccounts.length
  const pendingSubjectCount = pendingSubjectApprovals.length

  const teacherSearch = getParam(searchParams, "teacherSearch")
  const teacherUniversity = getParam(searchParams, "teacherUniversity")
  const studentSearch = getParam(searchParams, "studentSearch")
  const studentUniversity = getParam(searchParams, "studentUniversity")
  const bookingStatusFilter = getParam(searchParams, "bookingStatus")

  const filteredTeachers = pendingTeacherAccounts.filter((teacher) => {
    const matchesQuery =
      !teacherSearch ||
      teacher.email.toLowerCase().includes(teacherSearch.toLowerCase()) ||
      (teacher.name ?? "").toLowerCase().includes(teacherSearch.toLowerCase())
    const matchesUniversity = !teacherUniversity || teacher.university === teacherUniversity
    return matchesQuery && matchesUniversity
  })

  const filteredStudents = pendingStudentAccounts.filter((student) => {
    const matchesQuery =
      !studentSearch ||
      student.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
      (student.name ?? "").toLowerCase().includes(studentSearch.toLowerCase())
    const matchesUniversity = !studentUniversity || student.university === studentUniversity
    return matchesQuery && matchesUniversity
  })

  const filteredBookings = bookingStatusFilter
    ? recentBookings.filter((booking) => booking.status === bookingStatusFilter)
    : recentBookings

  const userGrowthData = aggregateByDay(usersLast30Detailed.map((user) => user.createdAt))
  const bookingStatusData = aggregateByStatus(bookingsLast30Detailed)
  const revenueTrendData = aggregateRevenueByDay(bookingsLast30Detailed)

  const topSubjects = buildSubjectLeaderboard(bookingsLast30Detailed).slice(0, 5)
  const topTutors = buildTutorLeaderboard(bookingsLast30Detailed).slice(0, 5)
  const topStudents = buildStudentLeaderboard(bookingsLast30Detailed).slice(0, 5)

  const queueDepth = pendingTeacherCount + pendingStudentCount + pendingSubjectCount + pendingBookings

  const systemHealthMetrics = buildSystemHealthMetrics({
    totalBookings,
    completedBookings,
    pendingBookings,
    pendingTeacherCount,
    pendingStudentCount,
  })

  const auditEvents = buildAuditEvents({
    recentUsers,
    recentBookings,
    pendingTeacherAccounts,
  })

  const adminStats = [
    {
      labelKey: "admin.stats.totalUsers",
      value: totalUsers.toLocaleString(),
      helperText: `${adminCount} admins`,
    },
    {
      labelKey: "admin.stats.students",
      value: studentCount.toLocaleString(),
      helperText: `${pendingStudentCount} pending approvals`,
    },
    {
      labelKey: "admin.stats.teachers",
      value: teacherCount.toLocaleString(),
      helperText: `${pendingTeacherCount} pending · ${pendingSubjectCount} subject checks`,
    },
    {
      labelKey: "admin.stats.totalBookings",
      value: totalBookings.toLocaleString(),
      helperText: `${pendingBookings} pending · ${confirmedBookings} confirmed · ${completedBookings} completed`,
    },
    {
      labelKey: "admin.stats.totalRevenue",
      value: formatCurrency(totalRevenue),
      helperText: "Confirmed and completed sessions",
    },
  ]

  const quickActions = [
    { labelKey: "admin.quickActions.manageUsers", href: "#pending-students", badgeContent: pendingStudentCount },
    { labelKey: "admin.quickActions.manageTutors", href: "#pending-teachers", badgeContent: pendingTeacherCount },
    { labelKey: "admin.quickActions.allBookings", href: "#recent-bookings", badgeContent: totalBookings },
    { labelKey: "admin.quickActions.reports", href: "#reports", badgeContent: pendingSubjectCount },
    { labelKey: "admin.quickActions.settings", href: "#automation" },
  ]

  return (
    <div className="space-y-10">
      <AdminHero stats={adminStats} quickActions={quickActions} />

      <RoleInsights topSubjects={topSubjects} topTutors={topTutors} topStudents={topStudents} />

      <section className="grid gap-6 lg:grid-cols-2">
        <Card id="pending-teachers" className="border-primary/20 shadow-sm">
          <CardHeader>
            <CardTitle>Pending Teacher Approvals</CardTitle>
            <CardDescription>Review tutor applications submitted from the teacher portal.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <TeacherFilters />
            {filteredTeachers.length === 0 ? (
              <EmptyState message="No tutor applications awaiting review." />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tutor</TableHead>
                    <TableHead>University</TableHead>
                    <TableHead>Subjects</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell>
                        <div className="flex flex-col space-y-1">
                          <span className="font-medium text-foreground">{teacher.name ?? teacher.email}</span>
                          <span className="text-xs text-muted-foreground">{teacher.email}</span>
                          <div className="flex gap-2">
                            <CopyEmailButton email={teacher.email} />
                            <Button asChild variant="ghost" size="icon">
                              <Link href={`mailto:${teacher.email}?subject=PeerEdu%20Admin%20Update`}>
                                <span className="sr-only">Message</span>✉️
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{teacher.university ?? "—"}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {teacher.tutorProfile?.subjects?.length ? (
                            teacher.tutorProfile.subjects.slice(0, 3).map((subject) => (
                              <Badge key={subject} variant="outline" className="text-xs">
                                {subject}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">No subjects submitted</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {teacher.tutorProfile?.hourlyRate
                          ? formatCurrency(teacher.tutorProfile.hourlyRate.toNumber())
                          : "—"}
                      </TableCell>
                      <TableCell>{relativeTime(teacher.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-2 md:flex-row md:justify-end">
                          <form action={updateUserStatusAction}>
                            <input type="hidden" name="userId" value={teacher.id} />
                            <input type="hidden" name="status" value="ACTIVE" />
                            <Button size="sm">Approve</Button>
                          </form>
                          <form action={updateUserStatusAction}>
                            <input type="hidden" name="userId" value={teacher.id} />
                            <input type="hidden" name="status" value="SUSPENDED" />
                            <Button type="submit" size="sm" variant="outline">
                              Suspend
                            </Button>
                          </form>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card id="pending-students" className="border-primary/20 shadow-sm">
          <CardHeader>
            <CardTitle>Pending Student Accounts</CardTitle>
            <CardDescription>Activate student sign-ups coming from the public website.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <StudentFilters />
            {filteredStudents.length === 0 ? (
              <EmptyState message="No student accounts are waiting for approval." />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>University</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex flex-col space-y-1">
                          <span className="font-medium text-foreground">{student.name ?? student.email}</span>
                          <span className="text-xs text-muted-foreground">{student.email}</span>
                          <div className="flex gap-2">
                            <CopyEmailButton email={student.email} />
                            <Button asChild variant="ghost" size="icon">
                              <Link href={`mailto:${student.email}?subject=PeerEdu%20Enrollment`}>
                                <span className="sr-only">Message</span>✉️
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{student.university ?? "—"}</TableCell>
                      <TableCell>{relativeTime(student.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-2 md:flex-row md:justify-end">
                          <form action={updateUserStatusAction}>
                            <input type="hidden" name="userId" value={student.id} />
                            <input type="hidden" name="status" value="ACTIVE" />
                            <Button size="sm">Approve</Button>
                          </form>
                          <form action={updateUserStatusAction}>
                            <input type="hidden" name="userId" value={student.id} />
                            <input type="hidden" name="status" value="SUSPENDED" />
                            <Button type="submit" size="sm" variant="outline">
                              Reject
                            </Button>
                          </form>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </section>

      <Card id="subject-approvals" className="border-primary/20 shadow-sm">
        <CardHeader>
          <CardTitle>Subject Registrations</CardTitle>
          <CardDescription>Teachers waiting for their submitted subjects to be validated.</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingSubjectCount === 0 ? (
            <EmptyState message="No subject requests are pending right now." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Subjects</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingSubjectApprovals.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{profile.user?.name ?? profile.user?.email}</span>
                        <span className="text-xs text-muted-foreground">{profile.user?.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {profile.subjects.length ? (
                          profile.subjects.map((subject) => (
                            <Badge key={subject} variant="outline" className="text-xs">
                              {subject}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">No subjects listed</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-sm text-foreground">{profile.experience ?? "—"}</p>
                      <p className="text-xs text-muted-foreground">{profile.education ?? ""}</p>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <form action={updateTutorApprovalAction} className="flex flex-col gap-2">
                        <input type="hidden" name="userId" value={profile.userId} />
                        <input type="hidden" name="decision" value="reject" />
                        <Input
                          name="note"
                          placeholder="Optional note"
                          defaultValue={profile.rejectionReason ?? ""}
                          className="h-9"
                        />
                        <Button variant="outline" size="sm" type="submit">
                          Return for edits
                        </Button>
                      </form>
                    </TableCell>
                    <TableCell>
                      <form action={updateTutorApprovalAction} className="flex justify-end">
                        <input type="hidden" name="userId" value={profile.userId} />
                        <input type="hidden" name="decision" value="approve" />
                        <Button size="sm">Approve</Button>
                      </form>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <section id="reports" className="space-y-6">
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/api/admin/export?type=users" prefetch={false}>
              Export users CSV
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/api/admin/export?type=bookings" prefetch={false}>
              Export bookings CSV
            </Link>
          </Button>
        </div>
        <AdminCharts
          userGrowthData={userGrowthData}
          bookingStatusData={bookingStatusData}
          revenueTrendData={revenueTrendData}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <SystemHealthCard metrics={systemHealthMetrics} queueDepth={queueDepth} />
        <AuditLogCard events={auditEvents} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2" id="recent-bookings">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Latest student–tutor interactions across the platform.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <BookingFilters />
            {filteredBookings.length === 0 ? (
              <EmptyState message="No bookings match the selected filters." />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Tutor</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.student?.name ?? booking.student?.email}</TableCell>
                      <TableCell>{booking.tutor?.name ?? booking.tutor?.email}</TableCell>
                      <TableCell>{booking.subject}</TableCell>
                      <TableCell>
                        <Badge variant={bookingStatusVariant(booking.status)} className="text-xs">
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{new Date(booking.startAt).toLocaleDateString()}</span>
                          <span className="text-xs text-muted-foreground">{relativeTime(booking.startAt)}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card id="recent-users">
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>Latest sign-ups across students, teachers, and admins.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentUsers.length === 0 ? (
              <EmptyState message="Nothing to review here yet." />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name ?? "—"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {user.role.toLowerCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                          <span className="text-xs text-muted-foreground">{relativeTime(user.createdAt)}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </section>

      <section id="automation" className="grid gap-6 lg:grid-cols-2">
        <AutomationSettingsCard />
        <AnnouncementComposer />
      </section>
    </div>
  )
}

function TeacherFilters() {
  return (
    <form className="grid gap-3 md:grid-cols-2" method="get">
      <div className="space-y-2">
        <Label htmlFor="teacherSearch">Search</Label>
        <Input id="teacherSearch" name="teacherSearch" placeholder="Name or email" defaultValue="" />
      </div>
      <div className="space-y-2">
        <Label>University</Label>
        <Select name="teacherUniversity">
          <SelectTrigger>
            <SelectValue placeholder="All universities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            {UNIVERSITY_FILTERS.map((uni) => (
              <SelectItem key={uni} value={uni}>
                {uni}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </form>
  )
}

function StudentFilters() {
  return (
    <form className="grid gap-3 md:grid-cols-2" method="get">
      <div className="space-y-2">
        <Label htmlFor="studentSearch">Search</Label>
        <Input id="studentSearch" name="studentSearch" placeholder="Name or email" defaultValue="" />
      </div>
      <div className="space-y-2">
        <Label>University</Label>
        <Select name="studentUniversity">
          <SelectTrigger>
            <SelectValue placeholder="All universities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            {UNIVERSITY_FILTERS.map((uni) => (
              <SelectItem key={uni} value={uni}>
                {uni}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </form>
  )
}

function BookingFilters() {
  return (
    <form className="space-y-2" method="get">
      <Label>Status</Label>
      <Select name="bookingStatus">
        <SelectTrigger>
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All</SelectItem>
          <SelectItem value="PENDING">Pending</SelectItem>
          <SelectItem value="CONFIRMED">Confirmed</SelectItem>
          <SelectItem value="COMPLETED">Completed</SelectItem>
          <SelectItem value="CANCELLED">Cancelled</SelectItem>
        </SelectContent>
      </Select>
    </form>
  )
}

function getParam(params: Record<string, string | string[] | undefined>, key: string) {
  const value = params[key]
  if (Array.isArray(value)) return value[0]
  return value
}

function formatCurrency(value: number) {
  if (!Number.isFinite(value)) {
    return "—"
  }
  return new Intl.NumberFormat("en-OM", {
    style: "currency",
    currency: "OMR",
  }).format(value)
}

function relativeTime(date: Date) {
  return formatDistanceToNow(date, { addSuffix: true })
}

function bookingStatusVariant(status: BookingStatus): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "COMPLETED":
      return "default"
    case "CONFIRMED":
      return "secondary"
    case "CANCELLED":
      return "destructive"
    default:
      return "outline"
  }
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-muted-foreground/30 bg-muted/30 p-6 text-center text-sm text-muted-foreground">
      {message}
    </div>
  )
}

function aggregateByDay(dates: Date[]) {
  const counts = new Map<string, number>()
  dates.forEach((date) => {
    const key = format(date, "yyyy-MM-dd")
    counts.set(key, (counts.get(key) ?? 0) + 1)
  })
  return Array.from(counts.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, value]) => ({ date: format(new Date(key), "MMM d"), value }))
}

function aggregateByStatus(bookings: { status: BookingStatus }[]) {
  const data = new Map<BookingStatus, number>()
  bookings.forEach((booking) => {
    data.set(booking.status, (data.get(booking.status) ?? 0) + 1)
  })
  return Array.from(data.entries()).map(([status, value]) => ({ status, value }))
}

function aggregateRevenueByDay(bookings: { createdAt: Date; price: any; status: BookingStatus }[]) {
  const totals = new Map<string, number>()
  bookings.forEach((booking) => {
    if (!["CONFIRMED", "COMPLETED"].includes(booking.status)) return
    const key = format(booking.createdAt, "yyyy-MM-dd")
    const current = totals.get(key) ?? 0
    totals.set(key, current + Number(booking.price))
  })
  return Array.from(totals.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, revenue]) => ({ date: format(new Date(key), "MMM d"), revenue }))
}

function buildSubjectLeaderboard(bookings: { subject: string }[]) {
  const counts = new Map<string, number>()
  bookings.forEach((booking) => {
    counts.set(booking.subject, (counts.get(booking.subject) ?? 0) + 1)
  })
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([subject, value]) => ({ label: subject, value: value.toString() }))
}

function buildTutorLeaderboard(
  bookings: {
    tutor?: User | null
    tutorId: string | null
  }[],
) {
  const counts = new Map<string, { name: string; count: number }>()
  bookings.forEach((booking) => {
    if (!booking.tutorId) return
    const key = booking.tutorId
    const name = booking.tutor?.name ?? booking.tutor?.email ?? "Tutor"
    const current = counts.get(key) ?? { name, count: 0 }
    counts.set(key, { name, count: current.count + 1 })
  })
  return Array.from(counts.values())
    .sort((a, b) => b.count - a.count)
    .map((item) => ({ label: item.name, value: item.count.toString(), helper: "Last 30 days" }))
}

function buildStudentLeaderboard(
  bookings: {
    student?: User | null
    studentId: string | null
  }[],
) {
  const counts = new Map<string, { name: string; count: number }>()
  bookings.forEach((booking) => {
    if (!booking.studentId) return
    const key = booking.studentId
    const name = booking.student?.name ?? booking.student?.email ?? "Student"
    const current = counts.get(key) ?? { name, count: 0 }
    counts.set(key, { name, count: current.count + 1 })
  })
  return Array.from(counts.values())
    .sort((a, b) => b.count - a.count)
    .map((item) => ({ label: item.name, value: item.count.toString(), helper: "Last 30 days" }))
}

function buildSystemHealthMetrics({
  totalBookings,
  completedBookings,
  pendingBookings,
  pendingTeacherCount,
  pendingStudentCount,
}: {
  totalBookings: number
  completedBookings: number
  pendingBookings: number
  pendingTeacherCount: number
  pendingStudentCount: number
}) {
  const completionRate = totalBookings === 0 ? 0 : Math.round((completedBookings / totalBookings) * 100)
  return [
    {
      label: "Completion rate",
      value: `${completionRate}%`,
      status: completionRate > 80 ? "healthy" : completionRate > 60 ? "attention" : "warning",
      helper: "Completed bookings / total",
    },
    {
      label: "Pending bookings",
      value: pendingBookings.toString(),
      status: pendingBookings < 10 ? "healthy" : pendingBookings < 25 ? "attention" : "warning",
      helper: "Awaiting tutor confirmation",
    },
    {
      label: "Teacher queue",
      value: pendingTeacherCount.toString(),
      status: pendingTeacherCount < 10 ? "healthy" : pendingTeacherCount < 20 ? "attention" : "warning",
      helper: "Profiles awaiting review",
    },
    {
      label: "Student queue",
      value: pendingStudentCount.toString(),
      status: pendingStudentCount < 10 ? "healthy" : pendingStudentCount < 20 ? "attention" : "warning",
      helper: "Registrations awaiting approval",
    },
  ] as const
}

function buildAuditEvents({
  recentUsers,
  recentBookings,
  pendingTeacherAccounts,
}: {
  recentUsers: User[]
  recentBookings: { id: string; tutor?: User | null; student?: User | null; status: BookingStatus; subject: string; createdAt: Date }[]
  pendingTeacherAccounts: User[]
}): AuditEvent[] {
  const events: AuditEvent[] = [
    ...recentUsers.slice(0, 5).map((user) => ({
      id: `user-${user.id}`,
      actor: "system",
      action: `New ${user.role.toLowerCase()} registered`,
      target: user.email,
      createdAt: user.createdAt,
      severity: "info" as const,
    })),
    ...recentBookings.slice(0, 5).map((booking) => ({
      id: `booking-${booking.id}`,
      actor: booking.tutor?.name ?? "Tutor",
      action: `${booking.status} booking`,
      target: booking.student?.name ?? booking.student?.email ?? "",
      createdAt: booking.createdAt,
      severity: booking.status === "CANCELLED" ? "warning" : "info",
    })),
    ...pendingTeacherAccounts.slice(0, 5).map((teacher) => ({
      id: `pending-${teacher.id}`,
      actor: teacher.name ?? teacher.email,
      action: "Submitted tutor profile",
      target: teacher.university ?? "",
      createdAt: teacher.createdAt,
      severity: "info" as const,
    })),
  ]
  return events.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 10)
}
