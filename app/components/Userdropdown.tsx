'use client'
import Link from "next/link";
import { useState } from "react";
import SignOutButton from "./SignOutButton";
import { Badge } from "@/components/ui/badge";

type userDataType = {
    name: string,
    email: string,
    role: string
}

export default function Userdropdown(userData: userDataType) {
    const [dropDownActivated, setDropDownActivated] = useState(false);
    const allowedPostingRole = ['Administrator', 'Blog:Editor'];
    return (
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse relative">
            <button
                type="button"
                className="flex text-sm bg-gray-950 rounded-full md:me-0 focus:ring-4 focus:ring-neutral-tertiary"
                id="user-menu-button"
                aria-expanded={dropDownActivated}
                onClick={() => setDropDownActivated(!dropDownActivated)}
            >
                <span className="sr-only">Open user menu</span>
                <img className="w-8 h-8 rounded-full" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiG59GD2DTZhFU928dYvnWiZJzTd-M5NUkzw&s" alt="user photo" />
            </button>

            {dropDownActivated && (
                /* Changed: top-full mt-2 right-0 | Removed: bottom-7 hidden */
                <div className="z-50  bg-black absolute top-full mt-2 right-0 bg-gray-950-medium border border-default-medium rounded-xl shadow-lg w-44 text-white" id="user-dropdown">
                    <div className="px-4 py-3 text-sm border-b border-default text-white flex gap-3 items-center">
                        <span className="block text-heading font-medium">{userData.name}</span>
                        <Badge variant="secondary" >{userData.role}</Badge>
                    </div>
                    <ul className="p-2 text-sm text-body font-medium" aria-labelledby="user-menu-button">
                        <li>
                            <Link href="/dashboard" className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">Dashboard</Link>
                        </li>
                        <li>
                            {allowedPostingRole.includes(userData.role) && (
                                <Link href="/create-post" className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">Create Post</Link>
                            )}
                        </li>
                        <li>
                            <a href="#" className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">Earnings</a>
                        </li>
                        <li>
                            <SignOutButton />
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}