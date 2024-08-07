import { NextRequest, NextResponse } from "next/server";

import { updateSession } from "@/lib/auth/updateSession";

import PageGetSettings from "./lib/fetch/page/settings";
import { error } from "console";

export async function middleware(request: NextRequest) {
  const user = JSON.parse(request.cookies.get("user")?.value || "{}");

  // ignore all those _next and favicon requests
  if (
    !request.url.includes("_next") &&
    !request.url.includes("/favicon.ico") &&
    !request.url.includes("/admin") &&
    !request.url.includes("/maintenance")
  ) {
    const settings = await PageGetSettings();

    // check for maintenance mode
    if (settings.maintenance && user.role !== "Admin") {
      return NextResponse.redirect(new URL("/maintenance", request.url));
    }
  }

  if (
    (request.url.includes("/dashboard") || request.url.includes("/admin")) &&
    !request.cookies.get("session")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    (request.url.includes("/dashboard") || request.url.includes("/admin")) &&
    !request.url.includes("_next") &&
    request.cookies.get("session")
  ) {
    const updatedSession = await updateSession();

    if (!updatedSession) {
      return NextResponse.redirect(new URL("/error", request.url));
    }
  }
}
