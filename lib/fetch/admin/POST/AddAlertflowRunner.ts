"use server";

import { cookies } from "next/headers";

export default async function AddAlertflowRunner({ name }: any) {
  "use client";
  const cookieStore = cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return { error: "No token found" };
  }

  const res = await fetch(`${process.env.API_ENDPOINT}/admin/runners/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ name: name }),
  });

  if (!res.ok) {
    return { error: "Failed to create runner" };
  }

  const data = await res.json();

  return data;
}
