"use server";

import { cookies } from "next/headers";

export default async function AddProjectRunner({ projectId, name }: any) {
  "use client";
  const cookieStore = cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return { error: "No token found" };
  }

  const res = await fetch(`http://localhost:8080/api/runners/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ name: name, project_id: projectId }),
  });

  if (!res.ok) {
    return { error: "Failed to create runner" };
  }

  const data = await res.json();

  return data;
}
