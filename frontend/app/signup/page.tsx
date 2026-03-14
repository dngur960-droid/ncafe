import type { Metadata } from 'next';
import SignupForm from './_components/SignupForm/SignupForm';
import styles from '@/app/login/page.module.css';
import Link from 'next/link';

export const metadata: Metadata = {
    title: '회원가입 | NCafe',
    description: 'NCafe 회원가입 페이지',
};

export default function SignupPage() {
    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#5a3d29' }}>반가워요!</h1>
                    <p style={{ color: '#8b5a3c' }}>엔카페의 새 친구가 되어주세요</p>
                </header>
                
                <SignupForm />

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                    <span style={{ color: '#666' }}>이미 회원이신가요? </span>
                    <Link href="/login" style={{ color: '#ee9b00', fontWeight: 700 }}>로그인하기</Link>
                </div>
            </div>
        </div>
    );
}
