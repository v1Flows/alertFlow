import { NextRequest, NextResponse } from "next/server";

import { updateSession } from "@/lib/auth/updateSession";

export async function middleware(request: NextRequest) {
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
    return await updateSession();
  }
}
