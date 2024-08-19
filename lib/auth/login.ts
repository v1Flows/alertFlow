"use server";

export default async function LoginAPI(email: string, password: string) {
  "use client";
  try {
    const headers = new Headers();

    headers.append("Content-Type", "application/json");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await res.json();

    return data;
  } catch (error) {
    return { error: "Failed to login" };
  }
}
