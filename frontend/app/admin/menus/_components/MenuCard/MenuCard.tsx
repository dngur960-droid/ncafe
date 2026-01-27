'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Edit2, Trash2, GripVertical } from 'lucide-react';
import { Menu } from '@/types';
import styles from './MenuCard.module.css';

interface MenuCardProps {
    menu: Menu;
    onToggleSoldOut: (id: string, isSoldOut: boolean) => void;
    onDelete: (id: string) => void;
}

export default function MenuCard({ menu, onToggleSoldOut, onDelete }: MenuCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: menu.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    // 대표 이미지 찾기
    const primaryImage = menu.images.find(img => img.isPrimary) || menu.images[0];

    // 가격 포맷팅
    const formatPrice = (price: number) => {
        return price.toLocaleString('ko-KR') + '원';
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`${styles.card} ${menu.isSoldOut ? styles.cardSoldOut : ''}`}
        >
            {/* 이미지 영역 */}
            {/* 이미지 영역 */}
            <div className={styles.imageWrapper}>
                <Link href={`/admin/menus/${menu.id}`} className={styles.imageLink}>
                    {primaryImage ? (
                        <Image
                            src={primaryImage.url}
                            alt={menu.korName}
                            fill
                            className={styles.image}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className={styles.imagePlaceholder}>☕</div>
                    )}
                </Link>

                {/* 품절 뱃지 */}
                {menu.isSoldOut && (
                    <span className={styles.soldOutBadge}>품절</span>
                )}

                {/* 드래그 핸들 */}
                <button
                    className={styles.dragHandle}
                    {...attributes}
                    {...listeners}
                    aria-label="순서 변경"
                >
                    <GripVertical size={18} />
                </button>

                {/* 카테고리 뱃지 */}
                <span className={styles.categoryBadge}>
                    <span>{menu.category.icon}</span>
                    {menu.category.korName}
                </span>
            </div>

            {/* 컨텐츠 영역 */}
            <div className={styles.content}>
                <div className={styles.header}>
                    <div>
                        <Link href={`/admin/menus/${menu.id}`} className={styles.nameLink}>
                            <h3 className={styles.name}>{menu.korName}</h3>
                        </Link>
                        <p className={styles.engName}>{menu.engName}</p>
                    </div>
                    <span className={styles.price}>{formatPrice(menu.price)}</span>
                </div>

                <p className={styles.description}>{menu.description}</p>

                {/* 푸터 - 토글 & 액션 버튼 */}
                <div className={styles.footer}>
                    <div className={styles.toggle}>
                        <span className={styles.toggleLabel}>품절</span>
                        <button
                            className={`${styles.toggleSwitch} ${menu.isSoldOut ? styles.toggleSwitchActive : ''}`}
                            onClick={() => onToggleSoldOut(menu.id, !menu.isSoldOut)}
                            aria-label={menu.isSoldOut ? '판매중으로 변경' : '품절로 변경'}
                        />
                    </div>

                    <div className={styles.actions}>
                        <Link
                            href={`/admin/menus/${menu.id}/edit`}
                            className={styles.actionButton}
                            aria-label="수정"
                        >
                            <Edit2 size={16} />
                        </Link>
                        <button
                            className={`${styles.actionButton} ${styles.actionButtonDanger}`}
                            onClick={() => onDelete(menu.id)}
                            aria-label="삭제"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
