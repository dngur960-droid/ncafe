'use client';

import { useCart } from '../_context/CartContext';
import styles from './cart.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, CheckCircle, CreditCard, Wallet } from 'lucide-react';
import { orderAPI } from '../lib/api';
import { loadTossPayments } from '@tosspayments/payment-sdk';

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, totalAmount, totalItems, clearCart } = useCart();
    const [orderSuccess, setOrderSuccess] = useState<any>(null);
    const [isOrdering, setIsOrdering] = useState(false);
    const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq';
    
    // 주문 폼 상태
    const [formData, setFormData] = useState({
        guestName: '',
        guestPhone: '',
        paymentMethod: 'CARD', // 기본값: 카드
        memo: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleOrder = async () => {
        if (!formData.guestName || !formData.guestPhone) {
            alert('이름과 전화번호를 입력해주세요! 🐾');
            return;
        }

        setIsOrdering(true);
        try {
            const orderRequest = {
                ...formData,
                items: items.map(item => ({
                    menuId: item.id,
                    quantity: item.quantity,
                    options: '' 
                }))
            };

            const result = await orderAPI.placeOrder(orderRequest);
            
            // 토스페이/카드 결제일 경우 토스 결제창 띄우기
            if (formData.paymentMethod === 'CARD') {
                const tossPayments = await loadTossPayments(clientKey);
                // "ORDER-" 접두사를 붙여서 문자열로 만듦
                const tossOrderIdStr = `ORDER-${result.id}`; 
                
                await tossPayments.requestPayment('카드', {
                    amount: totalAmount,
                    orderId: tossOrderIdStr,
                    orderName: `${items[0].korName} 외 ${totalItems - 1}건`,
                    customerName: formData.guestName,
                    successUrl: window.location.origin + '/checkout/success',
                    failUrl: window.location.origin + '/checkout/fail',
                });
                // Note: The above call redirects the browser. It won't reach the code below unless user cancels.
            } else {
                // 현장 결제의 경우 바로 성공 화면으로 표시
                setOrderSuccess(result);
                clearCart();
                window.scrollTo(0, 0);
            }
        } catch (error) {
            console.error('Order failed:', error);
            alert('주문에 실패했어요.. 잠시 후 다시 시도해주세요! 😭');
            setIsOrdering(false);
        }
    };

    // 주문 완료 시 화면
    if (orderSuccess) {
        return (
            <div className={styles.successContainer}>
                <div className={styles.successContent}>
                    <CheckCircle size={100} className={styles.successIcon} />
                    <h1 className={styles.successTitle}>주문이 완료되었습니다!</h1>
                    <p className={styles.successSub}>
                        나이스 쿼카가 맛있는 간식을 준비하고 있어요! 🐾<br/>
                        주문 번호: <strong>#{orderSuccess.id}</strong>
                    </p>
                    <div className={styles.orderSummary}>
                        <h3>주문 내역</h3>
                        <p>받는 분: {orderSuccess.guestName}</p>
                        <p>결제 금액: {orderSuccess.totalAmount?.toLocaleString() || totalAmount.toLocaleString()}원</p>
                    </div>
                    <Link href="/" className={styles.backButton}>
                        홈으로 돌아가기
                    </Link>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className={styles.emptyContainer}>
                <div className={styles.emptyContent}>
                    <ShoppingBag size={80} className={styles.emptyIcon} />
                    <h1 className={styles.emptyTitle}>장바구니가 비어있어요!</h1>
                    <p className={styles.emptySub}>맛있는 메뉴들을 골라 담아보세요. 🐾</p>
                    <Link href="/menu" className={styles.backButton}>
                        <ArrowLeft size={20} /> 메뉴 보러 가기
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.cartPage}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>내 장바구니 🐾</h1>
                    <button className={styles.clearButton} onClick={clearCart}>전체 삭제</button>
                </header>

                <div className={styles.layout}>
                    <div className={styles.itemList}>
                        {items.map((item) => (
                            <div key={item.id} className={styles.cartItem}>
                                <div className={styles.itemImage}>
                                    <Image 
                                        src={`/images/${item.imageSrc}`} 
                                        alt={item.korName} 
                                        fill 
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                                <div className={styles.itemInfo}>
                                    <h3 className={styles.itemName}>{item.korName}</h3>
                                    <p className={styles.itemEngName}>{item.engName}</p>
                                    <p className={styles.itemPrice}>{item.price.toLocaleString()}원</p>
                                </div>
                                <div className={styles.quantityControls}>
                                    <button 
                                        className={styles.qtyBtn} 
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className={styles.qtyValue}>{item.quantity}</span>
                                    <button 
                                        className={styles.qtyBtn} 
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                                <div className={styles.itemTotal}>
                                    {(item.price * item.quantity).toLocaleString()}원
                                </div>
                                <button 
                                    className={styles.removeBtn} 
                                    onClick={() => removeFromCart(item.id)}
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}

                        {/* 주문자 정보 입력 폼 */}
                        <div className={styles.checkoutForm}>
                            <h2 className={styles.formTitle}>주문자 정보 🐾</h2>
                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label>주문자 성함</label>
                                    <input 
                                        type="text" 
                                        name="guestName" 
                                        value={formData.guestName} 
                                        onChange={handleInputChange} 
                                        placeholder="이름을 적어주세요!"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>연락처</label>
                                    <input 
                                        type="text" 
                                        name="guestPhone" 
                                        value={formData.guestPhone} 
                                        onChange={handleInputChange} 
                                        placeholder="010-0000-0000"
                                    />
                                </div>
                                <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                                    <label>결제 수단</label>
                                    <div className={styles.paymentMethods}>
                                        <div 
                                            className={`${styles.paymentOption} ${formData.paymentMethod === 'CARD' ? styles.active : ''}`}
                                            onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'CARD' }))}
                                        >
                                            <CreditCard size={20} /> 카드 결제
                                        </div>
                                        <div 
                                            className={`${styles.paymentOption} ${formData.paymentMethod === 'CASH' ? styles.active : ''}`}
                                            onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'CASH' }))}
                                        >
                                            <Wallet size={20} /> 현장 결제
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                                    <label>요청 사항 (선택)</label>
                                    <textarea 
                                        name="memo" 
                                        value={formData.memo} 
                                        onChange={handleInputChange} 
                                        placeholder="쿼카 바리스타에게 하고 싶은 말을 적어보세요! ㅋㅋㅋ"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <aside className={styles.summary}>
                        <div className={styles.summaryCard}>
                            <h2 className={styles.summaryTitle}>주문 요약</h2>
                            <div className={styles.summaryRow}>
                                <span>총 수량</span>
                                <span>{totalItems}개</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>총 금액</span>
                                <span className={styles.totalPrice}>{totalAmount.toLocaleString()}원</span>
                            </div>
                            <button 
                                className={styles.orderButton} 
                                onClick={handleOrder}
                                disabled={isOrdering}
                            >
                                {isOrdering ? '주문 처리 중...' : '주문하기'}
                            </button>
                            <Link href="/menu" className={styles.continueLink}>
                                메뉴 더 고르기
                            </Link>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
