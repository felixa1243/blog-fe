"use client"; // Required for interactivity

import { useRouter } from "next/navigation";

export default function SignOutButton() {
    const router = useRouter();

    async function signOut() {
        try {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
            });

            if (response.ok) {
                router.refresh();
                router.push("/login");
            } else {
                console.error("Logout failed");
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