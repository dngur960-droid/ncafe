'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/app/lib/api';
import styles from '@/app/login/_components/LoginForm/LoginForm.module.css';

interface FormValues {
    username: string;
    password: string;
    confirmPassword: string;
}

interface FormErrors {
    username?: string;
    password?: string;
    confirmPassword?: string;
}

export default function SignupForm() {
    const router = useRouter();

    const [values, setValues] = useState<FormValues>({ username: '', password: '', confirmPassword: '' });
    const [errors, setErrors] = useState<FormErrors>({});
    const [serverError, setServerError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const validate = (): boolean => {
        const newErrors: FormErrors = {};
        if (!values.username.trim()) newErrors.username = '아이디를 입력해주세요.';
        if (!values.password) newErrors.password = '비밀번호를 입력해주세요.';
        if (values.password !== values.confirmPassword) newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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
            await authAPI.register(values.username, values.password);
            alert('회원가입에 성공했습니다! 로그인해주세요.');
            router.push('/login');
        } catch (err: any) {
            setServerError(err.message || '서버와 통신 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
            {serverError && (
                <div className={styles.errorBox} role="alert">
                    <span>⚠</span>
                    <span>{serverError}</span>
                </div>
            )}

            <div className={styles.fieldGroup}>
                <label htmlFor="username" className={styles.label}>아이디</label>
                <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="아이디를 입력하세요"
                    value={values.username}
                    onChange={handleChange}
                    className={`${styles.input} ${errors.username ? styles.inputError : ''}`}
                    disabled={isLoading}
                />
                {errors.username && <span className={styles.fieldError}>{errors.username}</span>}
            </div>

            <div className={styles.fieldGroup}>
                <label htmlFor="password" className={styles.label}>비밀번호</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    value={values.password}
                    onChange={handleChange}
                    className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                    disabled={isLoading}
                />
                {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
            </div>

            <div className={styles.fieldGroup}>
                <label htmlFor="confirmPassword" className={styles.label}>비밀번호 확인</label>
                <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="비밀번호를 다시 입력하세요"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
                    disabled={isLoading}
                />
                {errors.confirmPassword && <span className={styles.fieldError}>{errors.confirmPassword}</span>}
            </div>

            <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                {isLoading ? '가입 중...' : '회원가입'}
            </button>
        </form>
    );
}
