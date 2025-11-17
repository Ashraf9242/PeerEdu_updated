import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components"
import * as React from "react"

interface ForgotPasswordEmailProps {
  name?: string | null
  resetLink?: string
}

const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"

export const ForgotPasswordEmail = ({
  name,
  resetLink,
}: ForgotPasswordEmailProps) => (
  <Html>
    <Head />
    <Preview>PeerEdu - Reset your password</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${baseUrl}/images/peeredu-logo.png`}
          width="120"
          height="auto"
          alt="PeerEdu"
          style={logo}
        />
        <Heading style={heading}>Reset Your Password</Heading>
        <Section style={mainSection}>
          <Text style={text}>Hi {name || "Student"},</Text>
          <Text style={text}>
            We received a request to reset the password for your PeerEdu account.
            Click the button below to set a new password.
          </Text>
          <Button pX={20} pY={12} style={button} href={resetLink}>
            Reset Password
          </Button>
          <Text style={text}>
            This link is valid for one hour. If you didn&apos;t request a password
            reset, you can safely ignore this email.
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            PeerEdu - Connecting Students for Academic Excellence
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default ForgotPasswordEmail

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  border: "1px solid #f0f0f0",
  borderRadius: "4px",
}

const logo = {
  margin: "0 auto",
}

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
}

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
}

const footer = {
  color: "#a8dadc",
  fontSize: "12px",
  textAlign: "center" as const,
}
