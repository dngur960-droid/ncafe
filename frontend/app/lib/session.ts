import { getIronSession, SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';

// 세션에 저장할 사용자 정보 타입
export interface SessionUser {
    username: string;
    role: string;
}

export interface SessionData {
    token: string;      // Spring Boot에서 발급받은 JWT
    user: SessionUser;  // 사용자 정보
}

export const sessionOptions: SessionOptions = {
    password: process.env.SESSION_SECRET || 'default-secret-change-in-production-32-chars-min',
    cookieName: 'app_session',
    cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
        maxAge: 60 * 60 * 24, // 24시간
    },
};

export async function getSession() {
    const cookieStore = await cookies();
    return getIronSession<SessionData>(cookieStore, sessionOptions);
}
