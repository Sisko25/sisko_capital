"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// Simple credentials store - in a real app, this would be in a database
const VALID_CREDENTIALS = {
  email: "sisko@duck.com",
  password: "sisko09",
}

// Simple authentication function
export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // Simple string comparison instead of bcrypt
  if (email === VALID_CREDENTIALS.email && password === VALID_CREDENTIALS.password) {
    // Set a simple session cookie
    cookies().set({
      name: "session",
      value: "authenticated",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    return { success: true }
  }

  return { success: false, error: "Invalid email or password" }
}

// Simple logout function
export async function logout() {
  cookies().set({
    name: "session",
    value: "",
    expires: new Date(0),
    path: "/",
  })

  redirect("/login")
}

// Simple session verification
export async function getSession() {
  const session = cookies().get("session")
  return session?.value === "authenticated"
}
