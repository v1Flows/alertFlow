"use server";

import { cookies } from "next/headers";

export async function setSession(token: string, user: any, expires_at: string) {
  const expires = new Date(expires_at);

  cookies().set({
    name: "session",
    value: token,
    expires,
    httpOnly: true,
  });

  cookies().set({
    name: "user",
    value: JSON.stringify(user),
    httpOnly: true,
  });
}
