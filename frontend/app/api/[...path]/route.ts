import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/lib/session';

export const dynamic = 'force-dynamic';

export async function proxyRequest(req: NextRequest) {
    const session = await getSession();

    const search = req.nextUrl.search;
    
    const isRagRequest = req.nextUrl.pathname.startsWith('/api/rag');
    const targetBase = isRagRequest 
        ? (process.env.RAG_API_BASE_URL || 'http://172.27.76.25:8000') 
        : (process.env.API_BASE_URL || 'http://backend:8029');

    // ★ 수정: 메뉴 이미지 요청인 경우 /api/images를 /images로만 바꾸어서 백엔드로 전달
    // 백엔드의 WebConfig는 /images/** 경로에 대해 file:upload/ 디렉토리를 서빙합니다.
    let targetPath = req.nextUrl.pathname;
    if (!isRagRequest && targetPath.startsWith('/api/images')) {
        targetPath = targetPath.replace(/^\/api\/images/, '/images');
    }
    
    // ★ 수정: 프록시(local-proxy.conf)의 rewrite /api/$1 규칙 때문에
    // /api/api/... 처럼 중복되는 경로가 생기는 현상 방지
    if (targetPath.startsWith('/api/api/')) {
        targetPath = targetPath.replace(/^\/api\/api\//, '/api/');
    }

    const targetUrl = `${targetBase}${targetPath}${search}`;

    console.log(`[Proxy] ${req.method} ${req.nextUrl.pathname} -> ${targetUrl} (RAG: ${isRagRequest})`);

    const headers: Record<string, string> = {};

    // ★ 수정: 프록시 시 문제를 일으킬 수 있는 헤더 제외 (Connection, Keep-Alive 등)
    const skipHeaders = ['host', 'cookie', 'connection', 'keep-alive', 'transfer-encoding'];
    req.headers.forEach((value, key) => {
        if (!skipHeaders.includes(key.toLowerCase())) {
            headers[key] = value;
        }
    });

    // ★ 핵심: 세션에 JWT가 있으면 Authorization 헤더 주입
    if (session.token) {
        headers['Authorization'] = `Bearer ${session.token}`;
    }

    let body: BodyInit | null = null;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        if (req.headers.get('content-type')?.includes('multipart/form-data')) {
            body = await req.blob();
        } else {
            body = await req.text();
            console.log(`[Proxy] Read body text: ${body}`);
        }
    }

    const proxyRes = await fetch(targetUrl, {
        method: req.method,
        headers,
        body,
        cache: 'no-store',
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
