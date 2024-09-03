"use server";

import { cookies } from "next/headers";

export default async function CreateSubscription(planStripeID: string) {
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
      `${process.env.NEXT_PUBLIC_API_URL}/payment/subscription`,
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          stripe_id: planStripeID,
        }),
      },
    );
    const data = await res.json();

    return data;
  } catch (error) {
    return { error: "Failed to set subscription" };
  }
}
