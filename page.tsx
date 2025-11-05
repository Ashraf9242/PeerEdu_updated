import { requireRole } from "@/auth-utils"
import { BecomeTutorForm } from "@/components/forms/become-tutor-form"
import { EditTutorProfileForm } from "@/components/forms/edit-tutor-profile-form"
import { AvailabilityManager } from "@/components/teacher/availability-manager"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { db } from "@/lib/db"
import { BookingStatus } from "@prisma/client"
import { DollarSign, Star, Users } from "lucide-react"

export default async function TeacherProfilePage() {
  // 1. حماية المسار والتأكد من أن المستخدم هو معلم
  const user = await requireRole("TEACHER")

  // 2. جلب البيانات
  const tutorProfile = await db.tutorProfile.findUnique({
    where: { userId: user.id },
  })

  // 3. إذا لم يكن لديه ملف تعريفي، عرض نموذج التقديم
  if (!tutorProfile) {
    return (
      <div className="container mx-auto max-w-4xl py-12">
        <Card>
          <CardHeader>
            <CardTitle>كن معلماً في PeerEdu</CardTitle>
          </CardHeader>
          <CardContent>
            <BecomeTutorForm />
          </CardContent>
        </Card>
      </div>
    )
  }

  // 4. أ) إذا كان الطلب قيد المراجعة
  if (!tutorProfile.isApproved) {
    return (
      <div className="container mx-auto max-w-2xl py-12">
        <Alert>
          <AlertTitle>طلبك قيد المراجعة</AlertTitle>
          <AlertDescription>
            شكراً لتقديمك. سيقوم فريقنا بمراجعة ملفك وسيتم إعلامك عند الموافقة عليه.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // جلب الإحصائيات إذا تمت الموافقة على الملف
  const stats = await getTeacherStats(user.id)

  // 4. ب) عرض لوحة التحكم الكاملة للمعلم
  return (
    <div className="container mx-auto py-12">
      <h1 className="mb-6 text-3xl font-bold">لوحة تحكم المعلم</h1>
      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">الملف التعريفي</TabsTrigger>
          <TabsTrigger value="availability">الأوقات المتاحة</TabsTrigger>
          <TabsTrigger value="stats">الإحصائيات</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>تعديل الملف التعريفي</CardTitle>
            </CardHeader>
            <CardContent>
              <EditTutorProfileForm tutorProfile={tutorProfile} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability">
          <AvailabilityManager tutorId={user.id} />
        </TabsContent>

        <TabsContent value="stats">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* إحصائيات مختلفة */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

async function getTeacherStats(tutorId: string) {
  const totalSessions = await db.booking.count({
    where: { tutorId, status: BookingStatus.COMPLETED },
  })
  // ... (يمكن إضافة المزيد من الإحصائيات هنا)
  return { totalSessions }
}