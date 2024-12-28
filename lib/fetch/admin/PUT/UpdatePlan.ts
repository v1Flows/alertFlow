"use server";

import { cookies } from "next/headers";

type Result = {
  result: string;
};

type ErrorResponse = {
  success: false;
  error: string;
  message: string;
};

type SuccessResponse = {
  success: true;
  data: Result;
};

export default async function UpdatePlan(
  id: string,
  name: string,
  description: string,
  price: number,
  projects: number,
  project_members: number,
  flows: number,
  self_hosted_runners: number,
  alertflow_runners: number,
  executions_per_month: number,
  stripe_id: string,
): Promise<SuccessResponse | ErrorResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session");

    if (!token) {
      return {
        success: false,
        error: "Authentication token not found",
        message: "User is not authenticated",
      };
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/plans/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token.value,
        },
        body: JSON.stringify({
          name,
          description,
          price,
          projects,
          project_members,
          flows,
          self_hosted_runners,
          alertflow_runners,
          executions_per_month,
          stripe_id,
        }),
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
      message: "Failed to update plan",
    };
  }
}
