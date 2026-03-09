import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/lib/session';

const API_BASE = process.env.API_BASE_URL || 'http://localhost:8029';

async function proxyRequest(req: NextRequest) {
    const session = await getSession();

    // 클라이언트가 /api/admin/menus 로 요청하면 백엔드에는 /admin/menus 로 전달해야 함 
    // (Spring Boot 애플리케이션에 /api context path가 없으므로)
    const requestPath = req.nextUrl.pathname.replace(/^\/api/, '');
    const search = req.nextUrl.search;
    const targetUrl = `${API_BASE}${requestPath}${search}`;

    const headers: Record<string, string> = {};

    const contentType = req.headers.get('content-type');
    if (contentType) {
        headers['Content-Type'] = contentType;
    }

    const accept = req.headers.get('accept');
    if (accept) {
        headers['Accept'] = accept;
    }

    // ★ 핵심: 세션에 JWT가 있으면 Authorization 헤더 주입
    if (session.token) {
        headers['Authorization'] = `Bearer ${session.token}`;
    }

    let body: BodyInit | null = null;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        if (contentType?.includes('multipart/form-data')) {
            body = await req.blob();
        } else {
            body = await req.text();
        }
    }

    const proxyRes = await fetch(targetUrl, {
        method: req.method,
        headers,
        body,
    });

    // 401 응답 시 세션 삭제 (JWT 만료)
    if (proxyRes.status === 401 && session.token) {
        session.destroy();
    }

    const responseHeaders = new Headers();
    const resContentType = proxyRes.headers.get('content-type');
    if (resContentType) {
        responseHeaders.set('Content-Type', resContentType);
    }

    return new NextResponse(proxyRes.body, {
        status: proxyRes.status,
        statusText: proxyRes.statusText,
        headers: responseHeaders,
    });
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
export const PATCH = proxyRequest;
