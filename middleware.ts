import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value
  const { pathname } = request.nextUrl

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/"

  const isApiRoute = pathname.startsWith("/api")
  const isStatic =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico")

  if (isApiRoute || isStatic) {
    return NextResponse.next()
  }

  if (!token && !isAuthPage) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = "/login"
    return NextResponse.redirect(loginUrl)
  }

  if (token && isAuthPage) {
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = "/dashboard"
    return NextResponse.redirect(dashboardUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
