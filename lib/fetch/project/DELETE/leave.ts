"use server";

import { cookies } from "next/headers";

export default async function LeaveProject(id: any) {
  "use client";
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  try {
    const headers = new Headers();

    headers.append("Content-Type", "application/json");
    if (token) {
      headers.append("Authorization", token);
    }
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/projects/${id}/leave`,
      {
        method: "DELETE",
        headers: headers,
      },
    );
    const data = await res.json();

    return data;
  } catch (error) {
    return { error: "Failed to remove your user from project" };
  }
}
