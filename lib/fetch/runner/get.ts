"use server";

import { cookies } from "next/headers";

export default async function GetRunners() {
  "use client";
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  try {
    const headers = new Headers();

    headers.append("Content-Type", "application/json");
    if (token) {
      headers.append("Authorization", token);
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/runners/`, {
      method: "GET",
      headers: headers,
    });
    const data = await res.json();

    return data.runners;
  } catch (error) {
    return { error: "Failed to get runners" };
  }
}
