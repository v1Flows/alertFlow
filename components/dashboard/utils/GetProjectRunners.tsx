'use server'

import { cookies } from 'next/headers'

export default async function GetProjectRunners(projectId: any) {
  'use client'
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    return { error: "No token found" }
  }

  const res = await fetch(`http://localhost:8080/api/projects/${projectId}/runners`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token,
    },
  })

  if (!res.ok) {
    return { error: "Failed to fetch data" }
  }


  const data = await res.json()
  return data.runners
}