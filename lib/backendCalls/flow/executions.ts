'use server'

import { cookies } from 'next/headers'

export default async function GetFlowExecutions(flowId: any) {
  'use client'
  const cookieStore = cookies()
  const token = cookieStore.get('session')?.value

  if (!token) {
    return { error: "No token found" }
  }

  const res = await fetch(`http://localhost:8080/api/flows/${flowId}/executions`, {
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
  const sorted_data = data.executions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return sorted_data
}