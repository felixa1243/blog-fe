'use client'
import { useParams } from "next/navigation";

export default function Page() {
    const slug = useParams().slug
    return (
        <div className="mt-16">
            <h1 className="text-4xl">Post</h1>
            <p>{slug}</p>
        </div>
    );
}