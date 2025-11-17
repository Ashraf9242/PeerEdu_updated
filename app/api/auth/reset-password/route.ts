import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import * as z from "zod"
import bcrypt from "bcryptjs"
import { Resend } from "resend"
import { PasswordChangedEmail } from "@/components/emails/password-changed-email"

const resend = new Resend(process.env.RESEND_API_KEY)

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .refine(
      (password) => /[A-Z]/.test(password),
      "Password must contain an uppercase letter"
    )
    .refine(
      (password) => /[0-9]/.test(password),
      "Password must contain a number"
    )
    .refine(
      (password) => /[^A-Za-z0-9]/.test(password),
      "Password must contain a special character"
    ),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { token, newPassword } = resetPasswordSchema.parse(body)

    const verificationToken = await db.verificationToken.findUnique({
      where: { token },
    })

    if (!verificationToken) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired link" },
        { status: 400 }
      )
    }

    const hasExpired = new Date(verificationToken.expires) < new Date()

    if (hasExpired) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired link" },
        { status: 400 }
      )
    }

    const user = await db.user.findUnique({
      where: { email: verificationToken.identifier },
    })

    if (!user) {
      // This case should be rare if a token exists, but it's a safeguard.
      return NextResponse.json(
        { success: false, error: "User not found." },
        { status: 404 }
      )
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update user's password
    await db.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    })

    // Invalidate all sessions for this user to force re-login
    await db.session.deleteMany({
      where: { userId: user.id },
    })

    // Delete all verification tokens for this user's email
    await db.verificationToken.deleteMany({
      where: { identifier: user.email },
    })

    // Send confirmation email
    try {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || "PeerEdu <noreply@peeredu.io>",
        to: [user.email],
        subject: "Your PeerEdu Password Has Been Changed",
        react: PasswordChangedEmail({ name: user.name }),
      })
    } catch (emailError) {
      console.error("Failed to send password change confirmation email:", emailError)
      // Do not block the success response if the email fails
    }

    return NextResponse.json(
      { success: true, message: "Password has been reset successfully." },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }

    console.error("Reset password error:", error)
    return NextResponse.json(
      { success: false, error: "An internal server error occurred." },
      { status: 500 }
    )
  }
}

