"use server";

import { cookies } from "next/headers";

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
) {
  "use client";
  const cookieStore = cookies();
  const token = cookieStore.get("session")?.value;

  try {
    const headers = new Headers();

    headers.append("Content-Type", "application/json");
    if (token) {
      headers.append("Authorization", token);
    }
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/settings`,
      {
        method: "PUT",
        headers: headers,
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
    const data = await res.json();

    return data;
  } catch (error) {
    return { error: "Failed to fetch data" };
  }
}
