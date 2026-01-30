import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';



export async function GET(request: NextRequest) {

    const { searchParams } = new URL(request.url);

    const code = searchParams.get('code');



    if (!code) return NextResponse.redirect(new URL('/login?error=no_code', request.url));

    const exchangeRes = await fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/exchange`, {

        method: 'POST',

        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({ code }),

    });



    if (!exchangeRes.ok) return NextResponse.redirect(new URL('/login?error=failed_exchange', request.url));



    const { token } = await exchangeRes.json();

    const cookieStore = await cookies();

    cookieStore.set('access_token', token, {

        httpOnly: true,

        secure: process.env.NODE_ENV === 'production',

        sameSite: 'lax',

        path: '/',

    });

    return NextResponse.redirect(new URL('/dashboard', request.url));

}