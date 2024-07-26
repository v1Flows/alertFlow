"use server";

import { cookies } from "next/headers";

export default async function DeleteUser(id: any) {
  "use client";
  const cookieStore = cookies();
  const token = cookieStore.get("session")?.value;

  try {
    const headers = new Headers();

    headers.append("Content-Type", "application/json");
    if (token) {
      headers.append("Authorization", token);
    }
    const res = await fetch(`${process.env.API_ENDPOINT}/user/${id}`, {
      method: "DELETE",
      headers: headers,
    });
    const data = await res.json();

    return data;
  } catch (error) {
    return { error: "Failed to delete user" };
  }
}
