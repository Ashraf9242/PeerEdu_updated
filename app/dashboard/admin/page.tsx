import { format, formatDistanceToNow, subDays } from "date-fns"
import type { Locale } from "date-fns"
import { ar, enUS } from "date-fns/locale"
import type { BookingStatus, User } from "@prisma/client"
import Link from "next/link"
import { cookies } from "next/headers"
import { Mail } from "lucide-react"

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
import {
  AdminCharts,
  type BookingStatusDatum,
  type RevenueTrendDatum,
  type UserGrowthDatum,
} from "./_components/admin-charts"
import { RoleInsights, type InsightRow } from "./_components/role-insights"
import { SystemHealthCard, type HealthMetric } from "./_components/system-health-card"
import { AutomationSettingsCard } from "./_components/automation-settings-card"
import { AnnouncementComposer } from "./_components/announcement-composer"
import { AuditLogCard, type AuditEvent } from "./_components/audit-log-card"
import { ThemePreviewCard } from "./_components/theme-preview-card"
import { updateTutorApprovalAction, updateUserStatusAction } from "./_actions/manage-users"
import { getAdminCopy, type AdminCopy } from "@/lib/admin-copy"
import { LANGUAGE_COOKIE, resolveLanguage, type SupportedLanguage } from "@/lib/i18n"

export type AdminPageProps = {
  searchParams: Record<string, string | string[] | undefined>
}

const UNIVERSITY_FILTERS = ["Sultan Qaboos University", "UTAS Ibri", "PeerEdu", "Muscat University"]
const SELECT_ALL_VALUE = "__all"

export default async function AdminDashboardPage({ searchParams }: AdminPageProps) {
  await requireRole("ADMIN")

  const cookieStore = await cookies()
  const language = resolveLanguage(cookieStore.get(LANGUAGE_COOKIE)?.value)
  const copy = getAdminCopy(language)
  const locale = language === "ar" ? ar : enUS
  const localeTag = language === "ar" ? "ar-OM" : "en-OM"
  const numberFormatter = new Intl.NumberFormat(localeTag)
  const currencyFormatter = new Intl.NumberFormat(localeTag, { style: "currency", currency: "OMR" })
  const dateFormatter = new Intl.DateTimeFormat(localeTag)

  const formatNumber = (value: number) => numberFormatter.format(value)
  const formatCurrencyValue = (value: number) => formatCurrency(value, currencyFormatter, copy.helpers.notAvailable)
  const formatDate = (date: Date) => dateFormatter.format(date)
  const relativeTimeFn = (date: Date) => relativeTime(date, locale)
  const joinWithSeparator = (...parts: string[]) => parts.filter(Boolean).join(` ${copy.helpers.separator} `)

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
  const teacherUniversityRaw = getParam(searchParams, "teacherUniversity")
  const teacherUniversity = normalizeSelectParam(teacherUniversityRaw)
  const studentSearch = getParam(searchParams, "studentSearch")
  const studentUniversityRaw = getParam(searchParams, "studentUniversity")
  const studentUniversity = normalizeSelectParam(studentUniversityRaw)
  const bookingStatusFilterRaw = getParam(searchParams, "bookingStatus")
  const bookingStatusFilter = normalizeSelectParam(bookingStatusFilterRaw) as BookingStatus | undefined*** End Patch

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

  const userGrowthData = aggregateByDay(usersLast30Detailed.map((user) => user.createdAt), locale)
  const bookingStatusData = aggregateByStatus(bookingsLast30Detailed)
  const revenueTrendData = aggregateRevenueByDay(bookingsLast30Detailed, locale)

  const topSubjects = buildSubjectLeaderboard(
    bookingsLast30Detailed,
    formatNumber,
    copy.roleInsights.badgeSuffix,
  ).slice(0, 5)
  const topTutors = buildTutorLeaderboard(
    bookingsLast30Detailed,
    formatNumber,
    copy.roleInsights.timeframe,
    copy.roleInsights.badgeSuffix,
  ).slice(0, 5)
  const topStudents = buildStudentLeaderboard(
    bookingsLast30Detailed,
    formatNumber,
    copy.roleInsights.timeframe,
    copy.roleInsights.badgeSuffix,
  ).slice(0, 5)

  const queueDepth = pendingTeacherCount + pendingStudentCount + pendingSubjectCount + pendingBookings

  const systemHealthMetrics = buildSystemHealthMetrics(
    {
      totalBookings,
      completedBookings,
      pendingBookings,
      pendingTeacherCount,
      pendingStudentCount,
    },
    copy.systemHealth,
    formatNumber,
  )

  const auditEvents = buildAuditEvents(
    {
      recentUsers,
      recentBookings,
      pendingTeacherAccounts,
    },
    copy,
    language,
    copy.auditLog.summary,
    relativeTimeFn,
  )

  const adminStats = [
    {
      label: copy.stats.totalUsers,
      value: formatNumber(totalUsers),
      helperText: `${formatNumber(adminCount)} ${copy.helpers.adminsLabel}`,
    },
    {
      label: copy.stats.students,
      value: formatNumber(studentCount),
      helperText: `${formatNumber(pendingStudentCount)} ${copy.helpers.pendingApprovals}`,
    },
    {
      label: copy.stats.teachers,
      value: formatNumber(teacherCount),
      helperText: joinWithSeparator(
        `${formatNumber(pendingTeacherCount)} ${copy.helpers.pendingTutorProfiles}`,
        `${formatNumber(pendingSubjectCount)} ${copy.helpers.pendingSubjectChecks}`,
      ),
    },
    {
      label: copy.stats.totalBookings,
      value: formatNumber(totalBookings),
      helperText: joinWithSeparator(
        `${formatNumber(pendingBookings)} ${copy.helpers.bookings.pending}`,
        `${formatNumber(confirmedBookings)} ${copy.helpers.bookings.confirmed}`,
        `${formatNumber(completedBookings)} ${copy.helpers.bookings.completed}`,
      ),
    },
    {
      label: copy.stats.totalRevenue,
      value: formatCurrencyValue(totalRevenue),
      helperText: copy.helpers.revenueNote,
    },
  ]

  const quickActions = [
    { label: copy.quickActions.manageUsers, href: "#pending-students", badgeContent: pendingStudentCount },
    { label: copy.quickActions.manageTutors, href: "#pending-teachers", badgeContent: pendingTeacherCount },
    { label: copy.quickActions.allBookings, href: "#recent-bookings", badgeContent: totalBookings },
    { label: copy.quickActions.reports, href: "#reports", badgeContent: pendingSubjectCount },
    { label: copy.quickActions.settings, href: "#automation" },
  ]
  return (
    <div className="space-y-10">
      <AdminHero
        badgeLabel={copy.hero.badge}
        title={copy.hero.title}
        subtitle={copy.hero.subtitle}
        quickActionsTitle={copy.hero.quickActionsTitle}
        logoutLabel={copy.hero.logoutLabel}
        stats={adminStats}
        quickActions={quickActions}
      />

      <RoleInsights
        subjectsTitle={copy.roleInsights.subjectsTitle}
        tutorsTitle={copy.roleInsights.tutorsTitle}
        studentsTitle={copy.roleInsights.studentsTitle}
        emptyMessage={copy.roleInsights.emptyMessage}
        topSubjects={topSubjects}
        topTutors={topTutors}
        topStudents={topStudents}
      />

      <section className="grid gap-6 lg:grid-cols-2">
        <Card id="pending-teachers" className="border-primary/20 shadow-sm">
          <CardHeader>
            <CardTitle>{copy.sections.pendingTeachers.title}</CardTitle>
            <CardDescription>{copy.sections.pendingTeachers.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <TeacherFilters
              copy={copy}
              defaultSearch={teacherSearch ?? ""}
              defaultUniversity={teacherUniversityRaw}
            />
            {filteredTeachers.length === 0 ? (
              <EmptyState message={copy.sections.pendingTeachers.empty} />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{copy.tables.teachers.tutor}</TableHead>
                    <TableHead>{copy.tables.teachers.university}</TableHead>
                    <TableHead>{copy.tables.teachers.subjects}</TableHead>
                    <TableHead>{copy.tables.teachers.rate}</TableHead>
                    <TableHead>{copy.tables.teachers.registered}</TableHead>
                    <TableHead className="text-right">{copy.tables.teachers.actions}</TableHead>
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
                            <CopyEmailButton
                              email={teacher.email}
                              successMessage={copy.copyEmail.success}
                              errorMessage={copy.copyEmail.error}
                              ariaLabel={copy.copyEmail.ariaLabel}
                            />
                            <Button asChild variant="ghost" size="icon">
                              <Link
                                href={`mailto:${teacher.email}?subject=${encodeURIComponent(copy.mail.teacherSubject)}`}
                                prefetch={false}
                                aria-label={copy.helpers.emailUser}
                              >
                                <Mail className="h-4 w-4" aria-hidden="true" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{teacher.university ?? copy.helpers.notAvailable}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {teacher.tutorProfile?.subjects?.length ? (
                            teacher.tutorProfile.subjects.slice(0, 3).map((subject) => (
                              <Badge key={subject} variant="outline" className="text-xs">
                                {subject}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">{copy.helpers.noSubjects}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {teacher.tutorProfile?.hourlyRate
                          ? formatCurrencyValue(teacher.tutorProfile.hourlyRate.toNumber())
                          : copy.helpers.notAvailable}
                      </TableCell>
                      <TableCell>{relativeTimeFn(teacher.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-2 md:flex-row md:justify-end">
                          <form action={updateUserStatusAction}>
                            <input type="hidden" name="userId" value={teacher.id} />
                            <input type="hidden" name="status" value="ACTIVE" />
                            <Button size="sm">{copy.buttons.approve}</Button>
                          </form>
                          <form action={updateUserStatusAction}>
                            <input type="hidden" name="userId" value={teacher.id} />
                            <input type="hidden" name="status" value="SUSPENDED" />
                            <Button type="submit" size="sm" variant="outline">
                              {copy.buttons.suspend}
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
            <CardTitle>{copy.sections.pendingStudents.title}</CardTitle>
            <CardDescription>{copy.sections.pendingStudents.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <StudentFilters
              copy={copy}
              defaultSearch={studentSearch ?? ""}
              defaultUniversity={studentUniversityRaw}
            />
            {filteredStudents.length === 0 ? (
              <EmptyState message={copy.sections.pendingStudents.empty} />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{copy.tables.students.student}</TableHead>
                    <TableHead>{copy.tables.students.university}</TableHead>
                    <TableHead>{copy.tables.students.joined}</TableHead>
                    <TableHead className="text-right">{copy.tables.students.actions}</TableHead>
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
                            <CopyEmailButton
                              email={student.email}
                              successMessage={copy.copyEmail.success}
                              errorMessage={copy.copyEmail.error}
                              ariaLabel={copy.copyEmail.ariaLabel}
                            />
                            <Button asChild variant="ghost" size="icon">
                              <Link
                                href={`mailto:${student.email}?subject=${encodeURIComponent(copy.mail.studentSubject)}`}
                                prefetch={false}
                                aria-label={copy.helpers.emailUser}
                              >
                                <Mail className="h-4 w-4" aria-hidden="true" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{student.university ?? copy.helpers.notAvailable}</TableCell>
                      <TableCell>{relativeTimeFn(student.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-2 md:flex-row md:justify-end">
                          <form action={updateUserStatusAction}>
                            <input type="hidden" name="userId" value={student.id} />
                            <input type="hidden" name="status" value="ACTIVE" />
                            <Button size="sm">{copy.buttons.approve}</Button>
                          </form>
                          <form action={updateUserStatusAction}>
                            <input type="hidden" name="userId" value={student.id} />
                            <input type="hidden" name="status" value="SUSPENDED" />
                            <Button type="submit" size="sm" variant="outline">
                              {copy.buttons.reject}
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
          <CardTitle>{copy.sections.subjectApprovals.title}</CardTitle>
          <CardDescription>{copy.sections.subjectApprovals.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingSubjectCount === 0 ? (
            <EmptyState message={copy.sections.subjectApprovals.empty} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{copy.tables.subjectApprovals.teacher}</TableHead>
                  <TableHead>{copy.tables.subjectApprovals.subjects}</TableHead>
                  <TableHead>{copy.tables.subjectApprovals.experience}</TableHead>
                  <TableHead>{copy.tables.subjectApprovals.note}</TableHead>
                  <TableHead className="text-right">{copy.tables.subjectApprovals.actions}</TableHead>
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
                          <span className="text-xs text-muted-foreground">{copy.helpers.noSubjects}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-sm text-foreground">{profile.experience ?? copy.helpers.noExperience}</p>
                      <p className="text-xs text-muted-foreground">{profile.education ?? ""}</p>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <form action={updateTutorApprovalAction} className="flex flex-col gap-2">
                        <input type="hidden" name="userId" value={profile.userId} />
                        <input type="hidden" name="decision" value="reject" />
                        <Input
                          name="note"
                          placeholder={copy.helpers.optionalNotePlaceholder}
                          defaultValue={profile.rejectionReason ?? ""}
                          className="h-9"
                        />
                        <Button variant="outline" size="sm" type="submit">
                          {copy.buttons.returnForEdits}
                        </Button>
                      </form>
                    </TableCell>
                    <TableCell>
                      <form action={updateTutorApprovalAction} className="flex justify-end">
                        <input type="hidden" name="userId" value={profile.userId} />
                        <input type="hidden" name="decision" value="approve" />
                        <Button size="sm">{copy.buttons.approve}</Button>
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
              {copy.buttons.exportUsers}
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/api/admin/export?type=bookings" prefetch={false}>
              {copy.buttons.exportBookings}
            </Link>
          </Button>
        </div>
        <AdminCharts
          userGrowthData={userGrowthData}
          bookingStatusData={bookingStatusData}
          revenueTrendData={revenueTrendData}
          copy={{
            userGrowthTitle: copy.charts.userGrowthTitle,
            userGrowthDescription: copy.charts.userGrowthDescription,
            bookingsTitle: copy.charts.bookingsTitle,
            bookingsDescription: copy.charts.bookingsDescription,
            revenueTitle: copy.charts.revenueTitle,
            revenueDescription: copy.charts.revenueDescription,
          }}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <SystemHealthCard
          metrics={systemHealthMetrics}
          queueDepth={queueDepth}
          queueDepthLabel={formatNumber(queueDepth)}
          title={copy.systemHealth.title}
          description={copy.systemHealth.description}
          queueLabel={copy.systemHealth.queueLabel}
          queueHelper={copy.systemHealth.queueHelper}
          statusLabels={copy.systemHealth.statusLabels}
        />
        <AuditLogCard
          events={auditEvents}
          title={copy.auditLog.title}
          description={copy.auditLog.description}
          emptyMessage={copy.auditLog.empty}
          severityLabels={copy.auditLog.severity}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2" id="recent-bookings">
        <Card>
          <CardHeader>
            <CardTitle>{copy.sections.bookings.title}</CardTitle>
            <CardDescription>{copy.sections.bookings.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <BookingFilters copy={copy} defaultStatus={bookingStatusFilterRaw} />
            {filteredBookings.length === 0 ? (
              <EmptyState message={copy.sections.bookings.empty} />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{copy.tables.bookings.student}</TableHead>
                    <TableHead>{copy.tables.bookings.tutor}</TableHead>
                    <TableHead>{copy.tables.bookings.subject}</TableHead>
                    <TableHead>{copy.tables.bookings.status}</TableHead>
                    <TableHead>{copy.tables.bookings.date}</TableHead>
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
                          {copy.bookingStatus[booking.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{formatDate(new Date(booking.startAt))}</span>
                          <span className="text-xs text-muted-foreground">{relativeTimeFn(booking.startAt)}</span>
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
            <CardTitle>{copy.sections.recentUsers.title}</CardTitle>
            <CardDescription>{copy.sections.recentUsers.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {recentUsers.length === 0 ? (
              <EmptyState message={copy.sections.recentUsers.empty} />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{copy.tables.users.name}</TableHead>
                    <TableHead>{copy.tables.users.email}</TableHead>
                    <TableHead>{copy.tables.users.role}</TableHead>
                    <TableHead>{copy.tables.users.joined}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name ?? copy.helpers.notAvailable}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {copy.roles[user.role]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{formatDate(user.createdAt)}</span>
                          <span className="text-xs text-muted-foreground">{relativeTimeFn(user.createdAt)}</span>
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

      <section id="automation" className="grid gap-6 xl:grid-cols-3">
        <AutomationSettingsCard
          title={copy.automation.title}
          description={copy.automation.description}
          toggles={copy.automation.toggles}
          buttonLabel={copy.automation.buttonLabel}
          toastMessage={copy.automation.toastMessage}
        />
        <AnnouncementComposer
          title={copy.announcements.title}
          description={copy.announcements.description}
          fields={{
            headline: { label: copy.announcements.fields.headline },
            body: { label: copy.announcements.fields.body },
            ctaLabel: { label: copy.announcements.fields.ctaLabel },
            ctaUrl: {
              label: copy.announcements.fields.ctaUrl.label,
              placeholder: copy.announcements.fields.ctaUrl.placeholder,
            },
          }}
          buttons={copy.announcements.buttons}
          toastCopy={copy.announcements.toastCopy}
          toastError={copy.announcements.toastError}
        />
        <ThemePreviewCard
          title={copy.themePreview.title}
          description={copy.themePreview.description}
          lightLabel={copy.themePreview.lightLabel}
          darkLabel={copy.themePreview.darkLabel}
          lightPreview={copy.themePreview.lightPreview}
          darkPreview={copy.themePreview.darkPreview}
        />
      </section>
    </div>
  )
}

function TeacherFilters({
  copy,
  defaultSearch,
  defaultUniversity,
}: {
  copy: AdminCopy
  defaultSearch: string
  defaultUniversity?: string | null
}) {
  return (
    <form className="grid gap-3 md:grid-cols-2" method="get">
      <div className="space-y-2">
        <Label htmlFor="teacherSearch">{copy.filters.teachers.searchLabel}</Label>
        <Input
          id="teacherSearch"
          name="teacherSearch"
          placeholder={copy.filters.teachers.searchPlaceholder}
          defaultValue={defaultSearch}
        />
      </div>
      <div className="space-y-2">
        <Label>{copy.filters.teachers.universityLabel}</Label>
        <Select name="teacherUniversity" defaultValue={defaultUniversity || undefined}>
          <SelectTrigger>
            <SelectValue placeholder={copy.filters.teachers.universityPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={SELECT_ALL_VALUE}>{copy.filters.teachers.allOption}</SelectItem>
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

function StudentFilters({
  copy,
  defaultSearch,
  defaultUniversity,
}: {
  copy: AdminCopy
  defaultSearch: string
  defaultUniversity?: string | null
}) {
  return (
    <form className="grid gap-3 md:grid-cols-2" method="get">
      <div className="space-y-2">
        <Label htmlFor="studentSearch">{copy.filters.students.searchLabel}</Label>
        <Input
          id="studentSearch"
          name="studentSearch"
          placeholder={copy.filters.students.searchPlaceholder}
          defaultValue={defaultSearch}
        />
      </div>
      <div className="space-y-2">
        <Label>{copy.filters.students.universityLabel}</Label>
        <Select name="studentUniversity" defaultValue={defaultUniversity || undefined}>
          <SelectTrigger>
            <SelectValue placeholder={copy.filters.students.universityPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={SELECT_ALL_VALUE}>{copy.filters.students.allOption}</SelectItem>
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

function BookingFilters({
  copy,
  defaultStatus,
}: {
  copy: AdminCopy
  defaultStatus?: string | null
}) {
  return (
    <form className="space-y-2" method="get">
      <Label>{copy.filters.bookings.statusLabel}</Label>
      <Select name="bookingStatus" defaultValue={defaultStatus || undefined}>
        <SelectTrigger>
          <SelectValue placeholder={copy.filters.bookings.allOption} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={SELECT_ALL_VALUE}>{copy.filters.bookings.allOption}</SelectItem>
          {Object.entries(copy.filters.bookings.statuses).map(([key, label]) => (
            <SelectItem key={key} value={key}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </form>
  )
}

function normalizeSelectParam(value?: string | null) {
  if (!value || value === SELECT_ALL_VALUE) {
    return undefined
  }
  return value
}

function getParam(params: Record<string, string | string[] | undefined>, key: string) {
  const value = params[key]
  if (Array.isArray(value)) return value[0]
  return value
}

function formatCurrency(value: number, formatter: Intl.NumberFormat, fallback: string) {
  if (!Number.isFinite(value)) {
    return fallback
  }
  return formatter.format(value)
}

function relativeTime(date: Date | string, locale: Locale) {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale })
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
function aggregateByDay(dates: Date[], locale: Locale): UserGrowthDatum[] {
  const counts = new Map<string, number>()
  dates.forEach((date) => {
    const key = format(date, "yyyy-MM-dd")
    counts.set(key, (counts.get(key) ?? 0) + 1)
  })
  return Array.from(counts.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, value]) => ({ date: format(new Date(key), "MMM d", { locale }), value }))
}

function aggregateByStatus(bookings: { status: BookingStatus }[]): BookingStatusDatum[] {
  const data = new Map<BookingStatus, number>()
  bookings.forEach((booking) => {
    data.set(booking.status, (data.get(booking.status) ?? 0) + 1)
  })
  return Array.from(data.entries()).map(([status, value]) => ({ status, value }))
}

function aggregateRevenueByDay(
  bookings: { createdAt: Date; price: any; status: BookingStatus }[],
  locale: Locale,
): RevenueTrendDatum[] {
  const totals = new Map<string, number>()
  bookings.forEach((booking) => {
    if (!["CONFIRMED", "COMPLETED"].includes(booking.status)) return
    const key = format(booking.createdAt, "yyyy-MM-dd")
    const current = totals.get(key) ?? 0
    totals.set(key, current + Number(booking.price))
  })
  return Array.from(totals.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, revenue]) => ({ date: format(new Date(key), "MMM d", { locale }), revenue }))
}

function buildSubjectLeaderboard(
  bookings: { subject: string }[],
  formatNumber: (value: number) => string,
  badgeSuffix: string,
): InsightRow[] {
  const counts = new Map<string, number>()
  bookings.forEach((booking) => {
    counts.set(booking.subject, (counts.get(booking.subject) ?? 0) + 1)
  })
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([subject, value]) => ({ label: subject, value: formatNumber(value), badgeSuffix }))
}

function buildTutorLeaderboard(
  bookings: { tutor?: User | null; tutorId: string | null }[],
  formatNumber: (value: number) => string,
  helper: string,
  badgeSuffix: string,
): InsightRow[] {
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
    .map((item) => ({ label: item.name, value: formatNumber(item.count), helper, badgeSuffix }))
}

function buildStudentLeaderboard(
  bookings: { student?: User | null; studentId: string | null }[],
  formatNumber: (value: number) => string,
  helper: string,
  badgeSuffix: string,
): InsightRow[] {
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
    .map((item) => ({ label: item.name, value: formatNumber(item.count), helper, badgeSuffix }))
}

function buildSystemHealthMetrics(
  {
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
  },
  systemHealthCopy: AdminCopy["systemHealth"],
  formatNumber: (value: number) => string,
): HealthMetric[] {
  const completionRate = totalBookings === 0 ? 0 : Math.round((completedBookings / totalBookings) * 100)
  return [
    {
      label: systemHealthCopy.metrics.completionRate.label,
      value: `${completionRate}%`,
      status: completionRate > 80 ? "healthy" : completionRate > 60 ? "attention" : "warning",
      helper: systemHealthCopy.metrics.completionRate.helper,
    },
    {
      label: systemHealthCopy.metrics.pendingBookings.label,
      value: formatNumber(pendingBookings),
      status: pendingBookings < 10 ? "healthy" : pendingBookings < 25 ? "attention" : "warning",
      helper: systemHealthCopy.metrics.pendingBookings.helper,
    },
    {
      label: systemHealthCopy.metrics.teacherQueue.label,
      value: formatNumber(pendingTeacherCount),
      status: pendingTeacherCount < 10 ? "healthy" : pendingTeacherCount < 20 ? "attention" : "warning",
      helper: systemHealthCopy.metrics.teacherQueue.helper,
    },
    {
      label: systemHealthCopy.metrics.studentQueue.label,
      value: formatNumber(pendingStudentCount),
      status: pendingStudentCount < 10 ? "healthy" : pendingStudentCount < 20 ? "attention" : "warning",
      helper: systemHealthCopy.metrics.studentQueue.helper,
    },
  ]
}

function buildAuditEvents(
  {
    recentUsers,
    recentBookings,
    pendingTeacherAccounts,
  }: {
    recentUsers: User[]
    recentBookings: {
      id: string
      tutor?: User | null
      student?: User | null
      status: BookingStatus
      subject: string
      createdAt: Date
    }[]
    pendingTeacherAccounts: User[]
  },
  copy: AdminCopy,
  language: SupportedLanguage,
  summary: (args: { actor: string; target?: string; relativeTime: string }) => string,
  relativeTimeFn: (date: Date) => string,
): AuditEvent[] {
  const eventsWithDates = [
    ...recentUsers.slice(0, 5).map((user) => ({
      createdAt: user.createdAt,
      event: {
        id: `user-${user.id}`,
        action:
          language === "ar"
            ? `????? ${copy.roles[user.role]}`
            : `New ${copy.roles[user.role]} registered`,
        summary: summary({
          actor: user.email,
          target: copy.roles[user.role],
          relativeTime: relativeTimeFn(user.createdAt),
        }),
        severity: "info" as const,
      },
    })),
    ...recentBookings.slice(0, 5).map((booking) => ({
      createdAt: booking.createdAt,
      event: {
        id: `booking-${booking.id}`,
        action:
          language === "ar"
            ? `${copy.bookingStatus[booking.status]} ?????`
            : `${copy.bookingStatus[booking.status]} booking`,
        summary: summary({
          actor: booking.tutor?.name ?? booking.tutor?.email ?? "Tutor",
          target: booking.student?.name ?? booking.student?.email ?? undefined,
          relativeTime: relativeTimeFn(booking.createdAt),
        }),
        severity: booking.status === "CANCELLED" ? ("warning" as const) : ("info" as const),
      },
    })),
    ...pendingTeacherAccounts.slice(0, 5).map((teacher) => ({
      createdAt: teacher.createdAt,
      event: {
        id: `pending-${teacher.id}`,
        action: language === "ar" ? "????? ??? ??????" : "Submitted tutor profile",
        summary: summary({
          actor: teacher.name ?? teacher.email,
          target: teacher.university ?? undefined,
          relativeTime: relativeTimeFn(teacher.createdAt),
        }),
        severity: "info" as const,
      },
    })),
  ]

  return eventsWithDates
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 10)
    .map(({ event }) => event)
}
