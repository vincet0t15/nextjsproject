import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define your routes
const protectedRoutes = ["/dashboard"];
const guestRoutes = ["/login", "/signup"];

export function middleware(req: NextRequest) {
    const token = req.cookies.get("auth_token")?.value;
    const { pathname } = req.nextUrl;

    // Protect routes
    if (protectedRoutes.some((r) => pathname.startsWith(r)) && !token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // Redirect logged-in users away from guest routes
    if (guestRoutes.some((r) => pathname.startsWith(r)) && token) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
}
