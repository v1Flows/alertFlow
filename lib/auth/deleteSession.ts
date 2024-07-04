"use server";
import { cookies } from "next/headers";

export function deleteSession() {
  cookies().delete("session");
  cookies().delete("user");

  return;
}
