"use server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function updateSession() {
  const session = cookies().get("session")?.value;

  if (!session) return;

  // Refresh the token
  const response = await fetch("http://localhost:8080/api/token/refresh", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: session,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }

  const data = await response.json();

  const res = NextResponse.next();

  res.cookies.set({
    name: "session",
    value: data.token,
    expires: new Date(data.expires_at * 1000),
    httpOnly: true,
  });

  return res;
}
