"use server";

import { cookies } from "next/headers";

export default async function DeleteProjectRunner(runnerID: any) {
  "use client";
  const cookieStore = cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return { error: "No token found" };
  }

  const res = await fetch(`http://localhost:8080/api/runners/${runnerID}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });

  if (!res.ok) {
    return { error: "Failed to delete runner" };
  }

  const data = await res.json();

  return data;
}
