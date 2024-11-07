import { NextRequest, NextResponse } from "next/server";

import "./updateSessionInterval";

import PageGetSettings from "./lib/fetch/page/settings";

export async function middleware(request: NextRequest) {
  const user = JSON.parse(request.cookies.get("user")?.value || "{}");

  // ignore all those _next and favicon requests
  if (
    !request.url.includes("_next") &&
    !request.url.includes("/favicon.ico") &&
    !request.url.includes("/admin") &&
    !request.url.includes("/maintenance") &&
    !request.url.includes(".png") &&
    !request.url.includes(".jpg") &&
    !request.url.includes(".jpeg") &&
    !request.url.includes(".svg") &&
    !request.url.includes(".gif") &&
    !request.url.includes(".json")
  ) {
    const settings = await PageGetSettings();

    // check for maintenance mode
    if (settings.maintenance && user.role !== "admin") {
      return NextResponse.redirect(new URL("/maintenance", request.url));
    }

    if (request.url.includes("/auth/signup") && !settings.signup) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (request.url.includes("/auth/login") && request.cookies.get("session")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (request.url.includes("/auth/signup") && request.cookies.get("session")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (
    (request.url.includes("/dashboard") || request.url.includes("/admin")) &&
    !request.cookies.get("session")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}
