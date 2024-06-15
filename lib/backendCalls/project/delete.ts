'use server'

import { cookies } from 'next/headers'

export default async function DeleteProject(projectId: any) {
  'use client'
  const session = cookies().get('session')?.value

  if (!session) {
    return { error: "No session found" }
  }

  const res = await fetch(`http://localhost:8080/api/projects/${projectId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": session,
    },
  })

  if (!res.ok) {
    return { error: "Failed to delete project" }
  }


  const data = await res.json()
  return data.runners
}