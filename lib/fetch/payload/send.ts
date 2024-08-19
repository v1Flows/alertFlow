"use server";

export default async function SimulatePayload(target: any, payload: any) {
  try {
    const headers = new Headers();

    headers.append("Content-Type", "application/json");
    await fetch(target, {
      method: "POST",
      headers: headers,
      body: payload,
    });

    return;
  } catch (error) {
    return { error: "Failed to send payload" };
  }
}
