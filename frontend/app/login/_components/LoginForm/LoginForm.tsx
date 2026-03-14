'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

    const validate = (): boolean => {
        const newErrors: FormErrors = {};
        if (!values.username.trim()) newErrors.username = '아이디를 입력해주세요.';
        if (!values.password) newErrors.password = '비밀번호를 입력해주세요.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: value }));
        // 타이핑 시 해당 필드 에러 초기화
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
                router.push(redirectParams);
            } else if (user?.role === 'ADMIN') {
                router.push('/admin');
            } else {
                router.push('/');
            }

        } catch (err: any) {
            setServerError(err.message || '서버와 통신 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

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
