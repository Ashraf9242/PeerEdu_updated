
import { Resend } from "resend"
import { render } from "@react-email/render"
import * as React from "react"

const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null

interface SendEmailOptions {
  to: string
  subject: string
  react: React.ReactElement
}

export const sendEmail = async ({ to, subject, react }: SendEmailOptions) => {
  if (!resend) {
    console.warn("RESEND_API_KEY is not configured; skipping email send.")
    return { success: false, error: new Error("Missing RESEND_API_KEY") }
  }

  const html = await render(react)

  try {
    const { data, error } = await resend.emails.send({
      from: "PeerEdu <onboarding@resend.dev>", // Replace with your domain
      to,
      subject,
      html,
    })

    if (error) {
      console.error("Error sending email:", error)
      return { success: false, error }
    }

    console.log("Email sent successfully:", data)
    return { success: true, data }
  } catch (error) {
    console.error("Failed to send email:", error)
    return { success: false, error }
  }
}
