"use server";

import { cookies } from "next/headers";

type Flow = {
  flow: object;
};

type ErrorResponse = {
  success: false;
  error: string;
  message: string;
};

type SuccessResponse = {
  success: true;
  data: Flow;
};

export async function GetFlow(
  flowID: any,
): Promise<SuccessResponse | ErrorResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/flows/${flowID}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token.value,
        },
      },
    );

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
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      message: "Failed to fetch flow",
    };
  }
}

export default GetFlow;
