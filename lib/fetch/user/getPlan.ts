"use server";

import { cookies } from "next/headers";

export default async function GetUserPlan() {
  "use client";
  const cookieStore = cookies();
  const token = cookieStore.get("session")?.value;
  const user = JSON.parse(cookies().get("user")?.value || "{}");

  try {
    const headers = new Headers();

    headers.append("Content-Type", "application/json");
    if (token) {
      headers.append("Authorization", token);
    }
    const res = await fetch(
      `${process.env.API_ENDPOINT}/user/${user.id}/plan`,
      {
        method: "GET",
        headers: headers,
      },
    );
    const data = await res.json();

    return data.plan;
  } catch (error) {
    return { error: "Failed to fetch data" };
  }
}
