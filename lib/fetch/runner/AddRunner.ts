"use server";

import { cookies } from "next/headers";

export default async function AddRunner({
  projectId,
  name,
  alertflow_runner,
}: any) {
  "use client";
  const cookieStore = cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return { error: "No token found" };
  }

  const res = await fetch(`${process.env.API_ENDPOINT}/runners/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ name, project_id: projectId, alertflow_runner }),
  });

  if (!res.ok) {
    return { error: "Failed to create runner" };
  }

  const data = await res.json();

  return data;
}
