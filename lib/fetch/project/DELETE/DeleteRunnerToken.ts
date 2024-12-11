"use server";

import { cookies } from "next/headers";

export default async function DeleteRunnerToken(tokenId: any) {
  "use client";
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return { error: "No token found" };
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/token/runner/${tokenId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
  );

  if (!res.ok) {
    return { error: "Failed to delete token" };
  }

  const data = await res.json();

  return data;
}
