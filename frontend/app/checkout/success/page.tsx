'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { orderAPI } from '../../lib/api';
import styles from '../../cart/cart.module.css';
import { CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

function CheckoutSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<'loading' | 'success' | 'checking'>('loading');
    const [orderInfo, setOrderInfo] = useState<any>(null);

    useEffect(() => {
        const confirmPayment = async () => {
            const paymentKey = searchParams.get('paymentKey');
            const orderIdStr = searchParams.get('orderId'); // format: ORDER-{id}
            const amount = searchParams.get('amount');

            if (!paymentKey || !orderIdStr || !amount) {
                setStatus('loading');
                return;
            }

            try {
                setStatus('checking');
                // 백엔드에 최종 결제 승인 요청
                const response = await orderAPI.confirmPayment({
                    paymentKey,
                    orderId: orderIdStr,
                    amount: parseInt(amount, 10)
                });
                setOrderInfo(response);
                setStatus('success');
            } catch (err) {
                console.error('Payment confirmation failed:', err);
                router.push(`/checkout/fail?message=${encodeURIComponent('결제 승인 과정에서 오류가 발생했습니다.')}`);
            }
        };

        confirmPayment();
    }, [searchParams, router]);

    if (status === 'loading' || status === 'checking') {
        return (
            <div className={styles.successContainer}>
                <div className={styles.successContent}>
                    <h1 className={styles.successTitle}>결제 승인 중... 🐾</h1>
                    <p className={styles.successSub}>잠시만 기다려주세요!</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.successContainer}>
            <div className={styles.successContent}>
                <CheckCircle size={100} className={styles.successIcon} />
                <h1 className={styles.successTitle}>주문이 완료되었습니다!</h1>
                <p className={styles.successSub}>
                    나이스 쿼카가 맛있는 간식을 준비하고 있어요! 🐾<br/>
                    주문 번호: <strong>#{orderInfo?.id}</strong>
                </p>
                <div className={styles.orderSummary}>
                    <h3>주문 내역</h3>
                    <p>받는 분: {orderInfo?.guestName}</p>
                    <p>결제 금액: {orderInfo?.totalPrice?.toLocaleString()}원</p>
                </div>
                <Link href="/" className={styles.backButton}>
                    홈으로 돌아가기
                </Link>
            </div>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={<div className={styles.successContainer}><p>로딩 중...</p></div>}>
            <CheckoutSuccessContent />
        </Suspense>
    );
}
