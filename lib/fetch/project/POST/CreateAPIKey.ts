"use server";

import { cookies } from "next/headers";

export default async function CreateProjectApiKey({
  projectId,
  description,
}: any) {
  "use client";
  const cookieStore = cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return { error: "No token found" };
  }

  const res = await fetch(
    `http://localhost:8080/api/token/service/${projectId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ description }),
    },
  );

  if (!res.ok) {
    return { error: "Failed to fetch data" };
  }

  const data = await res.json();

  return data;
}
