"use client";

import { useRouter } from "next/navigation";

export default function SignOutButton() {
    const router = useRouter();

    async function signOut() {
        try {
            // Point to your local Next.js API route
            const response = await fetch("/api/auth/logout", {
                method: "POST",
            });

            if (response.ok) {
                router.refresh();
                router.replace("/");
            } else {
                console.error("Logout failed at backend");
            }
        } catch (error) {
            console.error("An error occurred during logout:", error);
        }
    }

    return (
        <button
            onClick={signOut}
            className="px-6 py-3 bg-red-700 text-white rounded-lg hover:bg-red-900 transition w-full"
        >
            Sign out
        </button>
    );
}