"use server";

import { cookies } from "next/headers";

export default async function AddRunner({
  projectId,
  name,
  alertflow_runner,
}: any) {
  "use client";
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return { error: "No token found" };
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/runners/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ name, project_id: projectId, alertflow_runner }),
  });

  const data = await res.json();

  if (!res.ok) {
    return { error: data };
  }

  return data;
}
