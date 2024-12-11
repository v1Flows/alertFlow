"use server";

import { cookies } from "next/headers";

export default async function ProjectTransferOwnershipAPI(
  new_owner_id: string,
  project_id: string,
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
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/projects/${project_id}/transfer_ownership`,
      {
        method: "PUT",
        headers: headers,
        body: JSON.stringify({
          user_id: new_owner_id,
        }),
      },
    );
    const data = await res.json();

    return data;
  } catch (error) {
    return { error: "Failed to transfer ownership" };
  }
}
