import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.API_BASE_URL || 'http://localhost:8029';

export async function POST(req: NextRequest) {
    const body = await req.json();

    const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const errorMsg = await res.text();
        return NextResponse.json({ message: errorMsg || '회원가입에 실패했습니다.' }, { status: res.status });
    }

    return NextResponse.json({ message: '회원가입에 성공했습니다.' });
}
