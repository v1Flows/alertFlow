"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function deleteSession() {
  cookies().delete("session");
  cookies().delete("user");

  redirect("/");

  return;
}
