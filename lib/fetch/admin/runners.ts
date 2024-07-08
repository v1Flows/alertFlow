"use server";

import { cookies } from "next/headers";

export default async function AdminGetRunners() {
  // TOOD: return two objects: one with alertflow_runners and one with self_hosted_runners
  "use client";
  const cookieStore = cookies();
  const token = cookieStore.get("session")?.value;

  try {
    const headers = new Headers();

    headers.append("Content-Type", "application/json");
    if (token) {
      headers.append("Authorization", token);
    }
    const res = await fetch(`${process.env.API_ENDPOINT}/admin/runners`, {
      method: "GET",
      headers: headers,
    });
    const data = await res.json();

    return {
      alertflow_runners: data.alertflow_runners,
      self_hosted_runners: data.self_hosted_runners,
    };
  } catch (error) {
    return { error: "Failed to fetch data" };
  }
}
