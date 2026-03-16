import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/lib/session';

const API_BASE = process.env.API_BASE_URL || 'http://localhost:8029';

export async function POST(req: NextRequest) {
    const rawText = await req.text();
    console.log(`[Auth Login Proxy] Received raw text from client: ${rawText}`);
    
    let body;
    try {
        body = JSON.parse(rawText);
    } catch (e) {
        body = {};
    }

    // 1. Spring Boot 로그인 API 호출 (서버 -> 서버)
    const loginRes = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!loginRes.ok) {
        const error = await loginRes.json().catch(() => ({ message: '로그인에 실패했습니다.' }));
        return NextResponse.json(error, { status: loginRes.status });
    }

    const tokenData = await loginRes.json();
    const token = tokenData.accessToken || tokenData.token;

    if (!token) {
        return NextResponse.json({ message: '토큰을 받지 못했습니다.' }, { status: 500 });
    }

    // 2. 사용자 정보 조회
    const meRes = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    let user = null;
    if (meRes.ok) {
        const resp = await meRes.json();
        user = {
            username: resp.username,
            role: resp.role,
        };
    }

    // 3. 세션에 저장 (httpOnly 쿠키로 암호화되어 저장됨)
    const session = await getSession();
    session.token = token;
    if (user) {
        session.user = {
            username: user.username,
            role: user.role,
        };
    }
    await session.save();

    return NextResponse.json({ user: session.user });
}
