"use server";

import { cookies } from "next/headers";

export async function setSession(token: string, user: any, expires_at: number) {
  const expires = new Date(expires_at * 1000);

  cookies().set({
    name: "session",
    value: token,
    expires,
    httpOnly: true,
  });

  cookies().set({
    name: "user",
    value: JSON.stringify(user),
    expires,
    httpOnly: true,
  });
}
