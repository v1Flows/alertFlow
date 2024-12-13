"use server";

import { cookies } from "next/headers";

interface Runners {
  runners: [];
}

interface ErrorResponse {
  success: false;
  error: string;
  message: string;
}

interface SuccessResponse {
  success: true;
  data: Runners;
}

export async function GetRunners(): Promise<SuccessResponse | ErrorResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/runners/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token.value,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();

      return {
        success: false,
        error: `API error: ${res.status} ${res.statusText}`,
        message: errorData.message || "An error occurred",
      };
    }

    const data = await res.json();

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      message: "Failed to fetch runners",
    };
  }
}

export default GetRunners;
