"use server";

import { cookies } from "next/headers";

export default async function CreateProject(
  name: string,
  description: string,
  alertflowRunners: boolean,
  icon: string,
  color: string,
) {
  "use client";
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  try {
    const headers = new Headers();

    headers.append("Content-Type", "application/json");
    if (token) {
      headers.append("Authorization", token);
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/projects/`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        name: name,
        description: description,
        alertflow_runners: alertflowRunners,
        icon: icon,
        color: color,
      }),
    });
    const data = await res.json();

    return data;
  } catch (error) {
    return { error: "Failed to create project" };
  }
}
