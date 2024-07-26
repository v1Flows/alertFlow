"use server";

import { cookies } from "next/headers";

export default async function CreateProject(
  name: string,
  description: string,
  alertflowRunners: boolean,
) {
  "use client";
  const cookieStore = cookies();
  const token = cookieStore.get("session")?.value;

  try {
    const headers = new Headers();

    headers.append("Content-Type", "application/json");
    if (token) {
      headers.append("Authorization", token);
    }
    const res = await fetch(`${process.env.API_ENDPOINT}/projects/`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        name: name,
        description: description,
        alertflow_runners: alertflowRunners,
      }),
    });
    const data = await res.json();

    return data;
  } catch (error) {
    return { error: "Failed to create project" };
  }
}
