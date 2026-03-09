export async function fetchAPI(endpoint: string, options?: RequestInit) {
    try {
        const res = await fetch(`/api${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...options?.headers,
            },
            // credentials: 'same-origin' 이 기본값이므로 쿠키 자동 전송
        });

        if (!res.ok) {
            // 401이면 로그인 페이지로 리다이렉트
            if (res.status === 401 && typeof window !== 'undefined') {
                const currentPath = window.location.pathname;
                if (!currentPath.startsWith('/login')) {
                    window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
                }
                return;
            }
            const error: any = new Error(`API Error: ${res.status}`);
            error.status = res.status;
            try {
                const body = await res.json();
                error.message = body.message || error.message;
            } catch { /* no json body */ }
            throw error;
        }

        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return res.json();
        }
        return null;
    } catch (error: any) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            const networkError: any = new Error('Network Error: 서버에 연결할 수 없습니다.');
            networkError.status = 0;
            throw networkError;
        }
        throw error;
    }
}

// 인증 API 모음
export const authAPI = {
    login: (username: string, password: string) =>
        fetchAPI('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        }),

    logout: () =>
        fetchAPI('/auth/logout', { method: 'POST' }),

    getSession: () => fetchAPI('/auth/session'),
};
