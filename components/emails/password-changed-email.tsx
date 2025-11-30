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

interface PasswordChangedEmailProps {
  name?: string | null
  contactLink?: string
}

const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"

export const PasswordChangedEmail = ({
  name,
  contactLink = `${baseUrl}/contact`,
}: PasswordChangedEmailProps) => (
  <Html>
    <Head />
    <Preview>PeerEdu - Your password has been changed</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${baseUrl}/images/peeredu-logo.png`}
          width="120"
          height="auto"
          alt="PeerEdu"
          style={logo}
        />
        <Heading style={heading}>Password Changed Successfully</Heading>
        <Section style={mainSection}>
          <Text style={text}>Hi {name || "Student"},</Text>
          <Text style={text}>
            This email confirms that the password for your PeerEdu account has
            been successfully changed.
          </Text>
          <Text style={text}>
            If you were not the one who made this change, please contact our
            support team immediately to secure your account.
          </Text>
          <Button style={button} href={contactLink}>
            Contact Support
          </Button>
          <Hr style={hr} />
          <Text style={footer}>
            PeerEdu - Connecting Students for Academic Excellence
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default PasswordChangedEmail

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
  padding: "12px 20px",
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
