"use server";

import { cookies } from "next/headers";

export default async function CreateDoc(
  title: string,
  content: string,
  category: string,
  hidden: boolean,
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
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/docs/`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        title: title,
        content: content,
        category: category,
        hidden: hidden,
      }),
    });
    const data = await res.json();

    return data;
  } catch (error) {
    return { error: "Failed to fetch data" };
  }
}
