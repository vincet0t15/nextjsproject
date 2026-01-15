import { NextResponse } from "next/server";

const LARAVEL_API_BASE = "http://localhost:8000";

export async function POST(request: Request) {
    const { email, password } = await request.json();

    const res = await fetch(`${LARAVEL_API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok || !data.token) {
        return NextResponse.json({ message: data.message || "Login failed" }, { status: 401 });
    }

    const response = NextResponse.json({ message: "Login successful" });
    response.cookies.set("auth_token", data.token, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    });

    return response;
}
