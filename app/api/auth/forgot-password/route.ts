import crypto from "crypto"
import { NextResponse } from "next/server"
import { Resend } from "resend"
import * as z from "zod"

import { db } from "@/lib/db"
import ForgotPasswordEmail from "@/components/emails/forgot-password-email"

const resend = new Resend(process.env.RESEND_API_KEY)
const baseUrl = process.env.NEXTAUTH_URL

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email } = forgotPasswordSchema.parse(body)

    const user = await db.user.findUnique({
      where: { email },
    })

    // To prevent email enumeration attacks, we always return a success response,
    // regardless of whether the user exists.
    if (user) {
      const passwordResetToken = crypto.randomBytes(32).toString("hex")
      const tokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

      // Delete any old tokens for this user
      await db.verificationToken.deleteMany({
        where: { identifier: email },
      })

      // Create the new password reset token
      await db.verificationToken.create({
        data: {
          identifier: email,
          token: passwordResetToken,
          expires: tokenExpiry,
        },
      })

      const resetLink = `${baseUrl}/reset-password/${passwordResetToken}`

      try {
        await resend.emails.send({
          from: process.env.EMAIL_FROM || "PeerEdu <noreply@peeredu.io>",
          to: [email],
          subject: "Reset Your PeerEdu Password",
          react: ForgotPasswordEmail({
            name: user.name,
            resetLink: resetLink,
          }),
        })
      } catch (emailError) {
        console.error("Failed to send password reset email:", emailError)
        // We still return a success response to the user
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "If an account with that email exists, a password reset link has been sent.",
      },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }

    console.error("Forgot password error:", error)
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 }
    )
  }
}