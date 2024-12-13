"use server";

import { cookies } from "next/headers";

interface Result {
  result: string;
}

interface ErrorResponse {
  success: false;
  error: string;
  message: string;
}

interface SuccessResponse {
  success: true;
  data: Result;
}

export default async function UpdateSettings(
  maintenance: boolean,
  signup: boolean,
  create_projects: boolean,
  create_flows: boolean,
  create_runners: boolean,
  create_api_keys: boolean,
  add_project_members: boolean,
  add_flow_actions: boolean,
  start_executions: boolean,
  inject_payloads: boolean,
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
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/settings`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token.value,
        },
        body: JSON.stringify({
          maintenance: maintenance,
          signup: signup,
          create_projects: create_projects,
          create_flows: create_flows,
          create_runners: create_runners,
          create_api_keys: create_api_keys,
          add_project_members: add_project_members,
          add_flow_actions: add_flow_actions,
          start_executions: start_executions,
          inject_payloads: inject_payloads,
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
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      message: "Failed to update settings",
    };
  }
}
