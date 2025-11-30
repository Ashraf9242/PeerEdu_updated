import {
  Button,
  Heading,
  Section,
  Text,
} from "@react-email/components"
import * as React from "react"
import { BaseEmailTemplate } from "@/lib/email-templates"

interface ForgotPasswordEmailProps {
  name?: string | null
  resetLink?: string
}

export const ForgotPasswordEmail = ({
  name,
  resetLink,
}: ForgotPasswordEmailProps) => (
  <BaseEmailTemplate preview="PeerEdu - Reset your password">
    <Heading style={heading}>Reset Your Password</Heading>
    <Section style={mainSection}>
      <Text style={text}>Hi {name || "Student"},</Text>
      <Text style={text}>
        We received a request to reset the password for your PeerEdu account.
        Click the button below to set a new password.
      </Text>
      <Button style={button} href={resetLink || "#"}>
        Reset Password
      </Button>
      <Text style={text}>
        This link is valid for one hour. If you didn&apos;t request a password
        reset, you can safely ignore this email.
      </Text>
    </Section>
  </BaseEmailTemplate>
)

export default ForgotPasswordEmail

const heading = {
  fontSize: "28px",
  fontWeight: "bold",
  marginTop: "48px",
  textAlign: "center" as const,
  color: "#1d3557",
}

const mainSection = {
  padding: "0 48px",
}

const text = {
  color: "#457b9d",
  fontSize: "16px",
  lineHeight: "24px",
}

const button = {
  backgroundColor: "#e63946",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "12px 20px",
}
