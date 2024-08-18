"use server";

import { cookies } from "next/headers";

export default async function UpdateFlowAction(flowID: string, action: any) {
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
      `${process.env.API_ENDPOINT}/flows/${flowID}/actions/${action.id}`,
      {
        method: "PUT",
        headers: headers,
        body: JSON.stringify({
          ...action,
        }),
      },
    );
    const data = await res.json();

    return data;
  } catch (error) {
    return { error: "Failed to update action" };
  }
}
