"use server";

import { cookies } from "next/headers";

export default async function GetUserSubscription() {
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
      `${process.env.NEXT_PUBLIC_API_URL}/v1/user/subscription`,
      {
        method: "GET",
        headers: headers,
      },
    );
    const data = await res.json();

    return data.subscriptions;
  } catch (error) {
    return { error: "Failed to get user subscriptions" };
  }
}
