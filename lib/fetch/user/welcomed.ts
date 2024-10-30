"use server";

import { cookies } from "next/headers";

export default async function Welcomed() {
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
      `${process.env.NEXT_PUBLIC_API_URL}/v1/user/welcomed`,
      {
        method: "PUT",
        headers: headers,
        body: JSON.stringify({}),
      },
    );
    const data = await res.json();

    return data;
  } catch (error) {
    return { error: "Failed to update user welcome status" };
  }
}
