"use server";

import { cookies } from "next/headers";

export default async function UpdateFlowActions(flowID: string, actions: any) {
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
      `${process.env.NEXT_PUBLIC_API_URL}/v1/flows/${flowID}/actions`,
      {
        method: "PUT",
        headers: headers,
        body: JSON.stringify({
          actions: actions,
        }),
      },
    );
    const data = await res.json();

    return data;
  } catch (error) {
    return { error: "Failed to update actions" };
  }
}
