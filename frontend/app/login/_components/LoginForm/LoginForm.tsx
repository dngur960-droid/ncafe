'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { authAPI } from '@/app/lib/api';
import styles from './LoginForm.module.css';

interface FormValues {
    username: string;
    password: string;
}

interface FormErrors {
    username?: string;
    password?: string;
}

export default function LoginForm() {
    const router = useRouter();

    const [values, setValues] = useState<FormValues>({ username: '', password: '' });
    const [errors, setErrors] = useState<FormErrors>({});
    const [serverError, setServerError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    // 세션 체크 상태
    const [sessionUser, setSessionUser] = useState<any>(null);
    const [isCheckingSession, setIsCheckingSession] = useState(true);

    // 컴포넌트 마운트 시 세션 확인
    useEffect(() => {
        authAPI.getSession()
            .then(res => {
                if (res?.user) setSessionUser(res.user);
            })
            .finally(() => setIsCheckingSession(false));
    }, []);

    const validate = (): boolean => {
        const newErrors: FormErrors = {};
        if (!values.username.trim()) newErrors.username = '아이디를 입력해주세요.';
        if (!values.password) newErrors.password = '비밀번호를 입력해주세요.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await authAPI.logout();
            setSessionUser(null);
            router.refresh();
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
        setServerError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);
        setServerError(null);

        try {
            const sessionData = await authAPI.login(values.username, values.password);
            const user = sessionData.user;

            // 리다이렉트 처리
            const searchParams = new URLSearchParams(window.location.search);
            const redirectParams = searchParams.get('redirect');
            
            if (redirectParams) {
                // 절대 경로가 아님을 보장하여 보안 유지
                const safePath = redirectParams.startsWith('/') ? redirectParams : '/';
                toast.success('로그인에 성공했습니다!');
                router.push(safePath);
            } else if (user?.role === 'ADMIN') {
                toast.success('관리자로 로그인했습니다!');
                router.push('/admin');
            } else {
                toast.success('로그인에 성공했습니다!');
                router.push('/');
            }

        } catch (err: any) {
            const errorMsg = err.message || '서버와 통신 중 오류가 발생했습니다.';
            toast.error(errorMsg);
            setServerError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    if (isCheckingSession) {
        return <div className={styles.loadingBox}><span className={styles.spinner} /> 쿼카가 확인 중...</div>;
    }

    // 이미 로그인된 경우
    if (sessionUser) {
        return (
            <div className={styles.alreadyLoggedBox}>
                <div className={styles.quokkaGreeting}>👋</div>
                <p>반가워요! 이미 <strong>{sessionUser.username}</strong>님으로 로그인되어 있어요.</p>
                <div className={styles.actionGroup}>
                    <button className={styles.submitBtn} onClick={() => router.push('/admin')}>대시보드로 이동</button>
                    <button className={styles.logoutBtn} onClick={handleLogout}>다른 아이디로 로그인</button>
                </div>
            </div>
        );
    }

    return (
        <form id="loginForm" className={styles.form} onSubmit={handleSubmit} noValidate>

            {/* 서버 에러 박스 */}
            {serverError && (
                <div id="loginErrorBox" className={styles.errorBox} role="alert">
                    <span>⚠</span>
                    <span>{serverError}</span>
                </div>
            )}

            {/* 아이디 */}
            <div className={styles.fieldGroup}>
                <label htmlFor="username" className={styles.label}>아이디</label>
                <div className={styles.inputWrap}>
                    <span className={styles.inputIcon}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </span>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        placeholder="관리자 아이디"
                        value={values.username}
                        onChange={handleChange}
                        className={`${styles.input} ${errors.username ? styles.inputError : ''}`}
                        disabled={isLoading}
                    />
                </div>
                {errors.username && <span className={styles.fieldError}>{errors.username}</span>}
            </div>

            {/* 비밀번호 */}
            <div className={styles.fieldGroup}>
                <label htmlFor="password" className={styles.label}>비밀번호</label>
                <div className={styles.inputWrap}>
                    <span className={styles.inputIcon}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                    </span>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        placeholder="비밀번호"
                        value={values.password}
                        onChange={handleChange}
                        className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                        disabled={isLoading}
                    />
                </div>
                {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
            </div>

            {/* 로그인 버튼 */}
            <button
                id="loginSubmitBtn"
                type="submit"
                className={styles.submitBtn}
                disabled={isLoading}
            >
                {isLoading && <span className={styles.spinner} />}
                {isLoading ? '로그인 중...' : '로그인'}
            </button>
        </form>
    );
}
