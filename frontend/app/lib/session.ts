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
        // 배포 환경이 HTTPS가 아닐 경우 쿠키가 저장되지 않는 문제를 방지하기 위해 false로 설정하거나
        // 환경변수에 따라 유연하게 대처하도록 수정합니다.
        secure: false, 
        sameSite: 'lax' as const,
        path: '/',
        maxAge: 60 * 60 * 24, // 24시간
    },
};

export async function getSession() {
    const cookieStore = await cookies();
    return getIronSession<SessionData>(cookieStore, sessionOptions);
}
