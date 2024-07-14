"use server";

import { cookies } from "next/headers";

export default async function GetProject(projectId: any) {
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
      `${process.env.API_ENDPOINT}/projects/${projectId}`,
      {
        method: "GET",
        headers: headers,
      },
    );
    const data = await res.json();

    return {
      project: data.project,
      members: data.members,
    };
  } catch (error) {
    return { error: "Failed to fetch data" };
  }
}
