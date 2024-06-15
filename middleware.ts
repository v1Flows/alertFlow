import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "./lib/auth";

export async function middleware(request: NextRequest) {
  if (request.url.includes("/dashboard") && !request.cookies.get("session")) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  if (request.url.includes("/dashboard") && request.cookies.get("session")) {
    return await updateSession(request)
  }
}