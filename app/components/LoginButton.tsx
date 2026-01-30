'use client'

export function LoginButton() {
    const handleLogin = () => {
        const ssoUrl = `${process.env.NEXT_PUBLIC_AUTH_URL}/login` || '';
        const callbackUrl = process.env.NEXT_PUBLIC_CALLBACK_SSO_URL || '';
        window.location.href = `${ssoUrl}?redirect_url=${encodeURIComponent(callbackUrl)}`;
    };
    return (
        <button
            onClick={handleLogin}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
            Sign in
        </button>
    )
}