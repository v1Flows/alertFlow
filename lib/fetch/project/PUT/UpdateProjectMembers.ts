"use server";

import { cookies } from "next/headers";

export default async function UpdateProjectMembers({ id, members }: any) {
  "use client";
  const cookieStore = cookies();
  const token = cookieStore.get("session")?.value;

  const headers = new Headers();

  headers.append("Content-Type", "application/json");
  if (token) {
    headers.append("Authorization", token);
  }

  const res = await fetch(
    `${process.env.API_ENDPOINT}/projects/${id}/members`,
    {
      method: "PUT",
      headers: headers,
      body: JSON.stringify({
        members: members,
      }),
    },
  );
  const data = await res.json();

  return data;
}
