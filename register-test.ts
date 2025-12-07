import "dotenv/config"
import { POST } from "./app/api/auth/register/route"

async function main() {
  const form = new FormData()
  form.append("role", "student")
  form.append("firstName", "Test")
  form.append("middleName", "")
  form.append("familyName", "User")
  form.append("phone", "+96812345678")
  form.append("email", `testuser${Date.now()}@example.com`)
  form.append("university", "squ")
  form.append("yearOfStudy", "study1")
  form.append("password", "TestPass1!")
  form.append("confirmPassword", "TestPass1!")
  form.append("agreeToTerms", "true")

  const request = new Request("http://localhost/api/auth/register", {
    method: "POST",
    body: form,
  })

  const response = await POST(request)
  console.log("status", response.status)
  const json = await response.json()
  console.log(json)
}

main().catch((err) => {
  console.error("register-test error", err)
})
