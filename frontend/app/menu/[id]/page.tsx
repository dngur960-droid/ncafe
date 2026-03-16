'use client';

import { useState, useEffect } from 'react';
import styles from './menu-detail.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Sparkles } from 'lucide-react';
import { use } from 'react';

interface MenuDetail {
    id: number;
    korName: string;
    engName: string;
    description: string;
    price: number;
    categoryName: string;
    images?: { srcUrl: string }[];
    isAvailable: boolean;
    isSoldOut: boolean;
}

export default function MenuDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [menu, setMenu] = useState<MenuDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await fetch(`/api/menus/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setMenu(data);
                }
            } catch (error) {
                console.error('Failed to fetch menu:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMenu();
    }, [id]);

    if (loading) return (
        <div className="paper-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#8b5a3c' }}>메뉴를 불러오는 중이에요... 🍪</p>
        </div>
    );

    if (!menu) return (
        <div className="paper-bg" style={{ minHeight: '100vh' }}>
            <div style={{ textAlign: 'center', padding: '10rem 2rem' }}>
                <h2 style={{ fontSize: '2rem', color: '#5a3d29', marginBottom: '1rem' }}>앗! 메뉴를 찾을 수 없어요.</h2>
                <Link href="/menu" style={{ color: '#8b5a3c', textDecoration: 'underline' }}>메뉴판으로 돌아가기</Link>
            </div>
        </div>
    );

    return (
        <div className="paper-bg" style={{ minHeight: '100vh' }}>
            <main className={styles.detailContainer}>
                <Link href="/menu" className={styles.backButton}>
                    <ChevronLeft size={20} />
                    <span>메뉴판으로 돌아가기</span>
                </Link>

                <div className={styles.contentWrapper}>
                    {menu.isSoldOut && (
                        <div className={styles.soldOutTag}>다음에 만나요! (품절)</div>
                    )}

                    <div className={styles.imageSection}>
                        {menu.images?.[0]?.srcUrl ? (
                            <Image
                                src={`/images/${menu.images[0].srcUrl}`}
                                alt={menu.korName}
                                fill
                                className={styles.image}
                                priority
                            />
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4c4b7' }}>
                                <Sparkles size={80} strokeWidth={1} />
                            </div>
                        )}
                    </div>

                    <div className={styles.infoSection}>
                        <span className={styles.category}>{menu.categoryName}</span>
                        <h1 className={styles.name}>{menu.korName}</h1>
                        <p className={styles.engName}>{menu.engName}</p>
                        
                        <div className={styles.description}>
                            {menu.description || "맛있고 영양 가득한 엔카페의 추천 간식입니다! 우리 아이들이 좋아할 거예요. 😊"}
                        </div>

                        <div className={styles.priceWrapper}>
                            <span className={styles.priceLabel}>가격:</span>
                            <span className={styles.price}>{menu.price.toLocaleString()}원</span>
                        </div>
                    </div>
                </div>
            </main>

            <footer style={{ textAlign: 'center', padding: '4rem 0', color: '#8b5a3c', opacity: 0.6 }}>
                <p>© 2026 NCAFE KIDS CAFE - 세상에서 가장 따뜻한 놀이터</p>
            </footer>
        </div>
    );
}
