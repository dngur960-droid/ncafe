import type { Metadata } from 'next';
import LoginHeader from './_components/LoginHeader/LoginHeader';
import LoginForm from './_components/LoginForm/LoginForm';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: '로그인 | NCafe 관리자',
    description: 'NCafe 관리자 페이지 로그인',
};

export default function LoginPage() {
    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <LoginHeader />
                <LoginForm />
            </div>
        </div>
    );
}
