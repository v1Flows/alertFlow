"use server";

export default async function CheckUserTaken(email: string, username: string) {
  "use client";
  try {
    const headers = new Headers();

    headers.append("Content-Type", "application/json");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/user/taken`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        email: email,
        username: username,
      }),
    });
    const data = await res.json();

    return data;
  } catch (error) {
    return { error: "Failed to fetch data" };
  }
}
