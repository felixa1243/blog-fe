import { cookies } from 'next/headers';

async function getPrivatePosts() {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    const res = await fetch(`${process.env.NEXT_PUBLIC_BLOG_API_URL}/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) return [];
    return res.json();
}

export default async function DashboardPage() {
    return (
        <div className='py-12 px-10 mt-16'>
            <h1 className='text-4xl'>Dashboard</h1>
        </div>
    );
}