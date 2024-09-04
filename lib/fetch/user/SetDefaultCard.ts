"use server";

import { cookies } from "next/headers";

export default async function SetDefaultCard(cardID: string) {
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
      `${process.env.NEXT_PUBLIC_API_URL}/user/payment/card/default`,
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          default_card: cardID,
        }),
      },
    );
    const data = await res.json();

    return data;
  } catch (error) {
    return { error: "Failed to set new default card" };
  }
}
