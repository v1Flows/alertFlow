"use server";

import { cookies } from "next/headers";

export default async function UpdateFlow(
  id: string,
  name: string,
  description: string,
  projectID: string,
  runnerID: string,
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
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/flows/${id}`,
      {
        method: "PUT",
        headers: headers,
        body: JSON.stringify({
          name: name,
          description: description,
          project_id: projectID,
          runner_id: runnerID,
        }),
      },
    );
    const data = await res.json();

    return data;
  } catch (error) {
    return { error: "Failed to update flow" };
  }
}
