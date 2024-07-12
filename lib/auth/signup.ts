"use server";

export default async function SignUpAPI(
  email: string,
  username: string,
  password: string,
) {
  "use client";
  try {
    const headers = new Headers();

    headers.append("Content-Type", "application/json");
    const res = await fetch(`${process.env.API_ENDPOINT}/auth/register`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        email: email,
        username: username,
        password: password,
      }),
    });
    const data = await res.json();

    return data;
  } catch (error) {
    return { error: "Failed to fetch data" };
  }
}
