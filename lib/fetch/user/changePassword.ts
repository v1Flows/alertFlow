"use server";

import { cookies } from "next/headers";

export default async function ChangeUserPassword(
  id: string,
  currentPassword: string,
  newPassword: string,
  confirmPassword: string,
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
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}/password`, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }),
    });
    const data = await res.json();

    return data;
  } catch (error) {
    return { error: "Failed to update user password" };
  }
}
