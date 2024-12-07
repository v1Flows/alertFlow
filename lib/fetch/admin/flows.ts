"use server";

import { cookies } from "next/headers";

export default async function AdminGetFlows() {
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
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/flows`,
      {
        method: "GET",
        headers: headers,
      },
    );
    const data = await res.json();

    return data.flows;
  } catch (error) {
    return { error: "Failed to fetch data" };
  }
}
