import { redirect } from "next/navigation"

export default function Home() {
  // Redirect to signin by default
  // Users will be logged in via OTP at /auth/signin
  redirect("/auth/signin")
}
