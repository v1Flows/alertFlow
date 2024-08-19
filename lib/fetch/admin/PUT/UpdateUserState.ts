"use server";

import { cookies } from "next/headers";

export default async function UpdateUserStatus(
  userId: string,
  targetStatus: boolean,
  reason: string,
) {
  "use client";
  const cookieStore = cookies();
  const token = cookieStore.get("session")?.value;

  try {
    const headers = new Headers();

    headers.append("Content-Type", "application/json");
    if (token) {
      headers.append("Authorization", token);
    }
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}/state`,
      {
        method: "PUT",
        headers: headers,
        body: JSON.stringify({
          disabled: targetStatus,
          disabled_reason: reason,
        }),
      },
    );
    const data = await res.json();

    return data;
  } catch (error) {
    return { error: "Failed to update user status" };
  }
}
