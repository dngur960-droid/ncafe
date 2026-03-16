'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from '../../cart/cart.module.css';
import { XCircle } from 'lucide-react';
import Link from 'next/link';

function CheckoutFailContent() {
    const searchParams = useSearchParams();
    const message = searchParams.get('message') || '결제에 실패했습니다.';

    return (
        <div className={styles.successContainer}>
            <div className={styles.successContent}>
                <XCircle size={100} color="#ff4b4b" style={{ margin: '0 auto 1.5rem auto' }} />
                <h1 className={styles.successTitle} style={{ color: '#ff4b4b' }}>주문 실패</h1>
                <p className={styles.successSub}>{message}</p>
                <Link href="/cart" className={styles.backButton}>
                    장바구니로 돌아가기
                </Link>
            </div>
        </div>
    );
}

export default function CheckoutFailPage() {
    return (
        <Suspense fallback={<div className={styles.successContainer}><p>로딩 중...</p></div>}>
            <CheckoutFailContent />
        </Suspense>
    );
}
