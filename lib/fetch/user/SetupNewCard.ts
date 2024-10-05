"use server";

import { cookies } from "next/headers";

export default async function SetupNewCard() {
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
      `${process.env.NEXT_PUBLIC_API_URL}/user/payment/card`,
      {
        method: "POST",
        headers: headers,
        body: "",
      },
    );
    const data = await res.json();

    return data;
  } catch (error) {
    return { error: "Failed to setup new payment card" };
  }
}
