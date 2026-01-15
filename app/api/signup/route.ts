import { NextResponse } from "next/server";

const LARAVEL_API_BASE = "http://localhost:8000";

export async function POST(request: Request) {
    const { name, email, password, confirmPassword } = await request.json();

    if (password !== confirmPassword) {
        return NextResponse.json({ message: "Passwords do not match" }, { status: 400 });
    }

    const res = await fetch(`${LARAVEL_API_BASE}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, password_confirmation: confirmPassword }),
    });

    const data = await res.json();

    if (!res.ok || !data.token) {
        return NextResponse.json({ message: data.message || "Signup failed" }, { status: 400 });
    }

    const response = NextResponse.json({ message: "Signup successful" });
    response.cookies.set("auth_token", data.token, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    });

    return response;
}
