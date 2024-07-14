"use server";

import { cookies } from "next/headers";

export default async function AddProjectMember(
  id: string,
  email: string,
  role: string,
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
      `${process.env.API_ENDPOINT}/projects/${id}/member`,
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          email: email,
          role: role,
        }),
      },
    );
    const data = await res.json();

    return data;
  } catch (error) {
    return { error: error };
  }
}
