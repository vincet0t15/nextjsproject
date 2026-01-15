import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const LARAVEL_API_BASE = "http://localhost:8000";

export async function POST() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (token) {
        await fetch(`${LARAVEL_API_BASE}/api/logout`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });
    }

    const response = NextResponse.json({ message: "Logged out successfully" });
    response.cookies.set("auth_token", "", {
        httpOnly: true,
        path: "/",
        maxAge: 0,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    });

    return response;
}

