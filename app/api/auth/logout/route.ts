import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
    try {
        await fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/logout`, {
            method: "POST",
            credentials: 'include',
        });
        const cookieStore = await cookies();
        cookieStore.set("access_token", "", {
            maxAge: 0,
            path: "/",
        });
        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json({ error: "Logout failed" }, { status: 500 });
    }
}