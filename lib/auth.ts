import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const response = await fetch("http://localhost:8080/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    throw new Error("Failed to login")
  }

  const data = await response.json()
  const expires = new Date(data.expires_at * 1000)

  cookies().set('session', data.token, { expires, httpOnly: true })
  cookies().set('user', data.user, { httpOnly: true })
}

export async function updateSession(request: NextRequest) {
  const session = cookies().get('session')?.value
  if (!session) return

  // Refresh the token
  const response = await fetch("http://localhost:8080/api/token/refresh", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": session,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to refresh token")
  }

  const data = await response.json()

  const res = NextResponse.next()
  res.cookies.set({
    name: 'session',
    value: data.token,
    expires: new Date(data.expires_at * 1000),
    httpOnly: true
  })
  return res
}