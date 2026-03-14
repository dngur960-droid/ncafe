'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './GlobalNav.module.css';

export default function GlobalNav() {
    const [user, setUser] = useState<{ username: string; role: string } | null>(null);
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await fetch('/api/auth/session');
                if (res.ok) {
                    const data = await res.json();
                    if (data.user) {
                        setUser(data.user);
                    }
                }
            } catch (err) {
                console.error('Session check failed', err);
            }
        };
        checkSession();
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            setUser(null);
            router.refresh();
        } catch (err) {
            console.error('Logout failed', err);
        }
    };

    return (
        <nav className={styles.nav}>
            <Link href="/menu" className={styles.navItem}>맛있는 메뉴</Link>
            <Link href="/#facilities" className={styles.navItem}>놀이시설</Link>
            <Link href="/#guide" className={styles.navItem}>이용안내</Link>
            
            {user ? (
                <>
                    <span className={styles.userGreeting}>
                         안녕하세요, {user.username}님!
                    </span>
                    <button onClick={handleLogout} className={styles.navItem}>로그아웃</button>
                    {user.role === 'ROLE_ADMIN' && (
                        <Link href="/admin" className={`${styles.navItem} ${styles.navItemActive}`}>관리자</Link>
                    )}
                </>
            ) : (
                <>
                    <Link href="/login" className={styles.navItem}>로그인</Link>
                    <Link href="/signup" className={styles.navItem}>회원가입</Link>
                </>
            )}
        </nav>
    );
}
