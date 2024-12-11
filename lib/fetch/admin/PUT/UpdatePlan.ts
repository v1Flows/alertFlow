"use server";

import { cookies } from "next/headers";

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
) {
  "use client";
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  try {
    const headers = new Headers();

    headers.append("Content-Type", "application/json");
    if (token) {
      headers.append("Authorization", token);
    }
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/plans/${id}`,
      {
        method: "PUT",
        headers: headers,
        body: JSON.stringify({
          name: name,
          description: description,
          price: price,
          projects: projects,
          project_members: project_members,
          flows: flows,
          self_hosted_runners: self_hosted_runners,
          alertflow_runners: alertflow_runners,
          executions_per_month: executions_per_month,
          stripe_id: stripe_id,
        }),
      },
    );
    const data = await res.json();

    return data;
  } catch (error) {
    return { error: "Failed to update plan" };
  }
}
