import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth" // افتراض وجود هذا الملف

/**
 * تعريف نوع المستخدم بناءً على ما يرجع من الجلسة
 * يجب تعديل هذا النوع ليطابق بيانات المستخدم الفعلية في مشروعك
 */
type AppUser = {
  id: string
  role: "STUDENT" | "TEACHER" | "ADMIN"
  // أضف أي خصائص أخرى للمستخدم هنا
  name?: string | null
  email?: string | null
  image?: string | null
  idDocumentUrl?: string | null
}

/**
 * دالة لجلب المستخدم الحالي من الجلسة بدون أي عمليات إعادة توجيه.
 * @returns {Promise<AppUser | null>} بيانات المستخدم أو null إذا لم يكن مسجلاً.
 */
export async function getCurrentUser(): Promise<AppUser | null> {
  try {
    const session = await getServerSession(authOptions)

    // next-auth v5 returns user directly on the session object by default
    const user = session as AppUser | undefined

    if (!user) {
      return null
    }

    return user
  } catch (error) {
    console.error("Error fetching current user:", error)
    return null
  }
}

/**
 * دالة تفرض وجود جلسة مسجلة، وتستخدم في مكونات الخادم المحمية.
 * إذا لم يكن المستخدم مسجلاً، تعيد توجيهه إلى صفحة تسجيل الدخول.
 * @returns {Promise<AppUser>} بيانات المستخدم الكاملة.
 */
export async function requireAuth(): Promise<AppUser> {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return user
}

/**
 * دالة تفرض وجود دور (role) معين للمستخدم.
 * @param {("STUDENT" | "TEACHER" | "ADMIN")} role - الدور المطلوب.
 * @returns {Promise<AppUser>} بيانات المستخدم إذا كان يملك الدور المطلوب.
 */
export async function requireRole(role: "STUDENT" | "TEACHER" | "ADMIN"): Promise<AppUser> {
  const user = await requireAuth()

  if (user.role !== role) {
    // إعادة توجيه المستخدم إلى صفحته الرئيسية بناءً على دوره الفعلي
    const userDashboard = `/dashboard/${user.role.toLowerCase()}`
    redirect(userDashboard)
  }

  return user
}