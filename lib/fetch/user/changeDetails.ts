"use server";

import { cookies } from "next/headers";

export default async function ChangeUserDetails(
  id: string,
  username: string,
  email: string,
) {
  "use client";
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  try {
    const headers = new Headers();

    headers.append("Content-Type", "application/json");
    if (token) {
      headers.append("Authorization", token);
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/user/`, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify({
        username: username,
        email: email,
      }),
    });
    const data = await res.json();

    return data;
  } catch (error) {
    return { error: "Failed to update user" };
  }
}
