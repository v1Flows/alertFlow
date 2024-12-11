"use server";

import { cookies } from "next/headers";

export default async function GetProjectApiKeys(projectId: any) {
  "use client";
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return { error: "No token found" };
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/projects/${projectId}/tokens`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
  );

  if (!res.ok) {
    return { error: "Failed to fetch data" };
  }

  const data = await res.json();

  return data.tokens;
}
