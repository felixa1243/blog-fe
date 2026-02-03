import { cookies } from "next/headers";
import { cache } from "react";
import { LoginButton } from "./LoginButton";
import Userdropdown from "./Userdropdown";
import Link from "next/link";

const getAuthenticatedUser = cache(async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) return null;

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BLOG_API_URL}/me`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            next: { tags: ['user-data'] }
        });

        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        console.error("Auth check failed:", error);
        return null;
    }
});

export default async function Navbar() {
    const userData = await getAuthenticatedUser();
    console.log(userData)
    const isAuthenticated = !!userData;
    return (
        <nav className="bg-gray-950 fixed w-full z-20 top-0 start-0 border-b border-default">
            <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span className="self-center text-xl text-white font-semibold whitespace-nowrap">Iqbal Network </span>
                </Link>
                <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                    {isAuthenticated ? (
                        <Userdropdown name={userData.fullname} email={userData.email} role={userData.role} />
                    ) : (
                        <LoginButton />
                    )}

                    <button data-collapse-toggle="navbar-user" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-body rounded-base md:hidden hover:bg-neutral-secondary-soft">
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
}