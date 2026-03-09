import { NextRequest, NextResponse } from 'next/server';

// 로그인 필요한 경로
const PROTECTED_PATHS = ['/admin'];

// 인증 체크 건너뛸 경로
const PUBLIC_PATHS = ['/login', '/oauth', '/api', '/_next'];

// session.ts의 cookieName
const SESSION_COOKIE_NAME = 'app_session';

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // 정적 파일은 건너뜀
    if (pathname.includes('.')) {
        return NextResponse.next();
    }

    // 공개 경로는 건너뜀
    if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
        return NextResponse.next();
    }

    // 보호 경로인지 확인
    const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));
    if (!isProtected) {
        return NextResponse.next();
    }

    // 세션 쿠키 존재 여부 확인
    const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME);
    if (!sessionCookie) {
        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
