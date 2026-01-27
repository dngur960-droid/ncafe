'use client';

import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import Button from '@/components/common/Button';
import styles from './MenusPageHeader.module.css';

interface MenusPageHeaderProps {
    totalCount: number;
    soldOutCount: number;
    searchQuery: string;
    onSearchChange: (value: string) => void;
}

export default function MenusPageHeader({
    totalCount,
    soldOutCount,
    searchQuery,
    onSearchChange,
}: MenusPageHeaderProps) {
    return (
        <header className={styles.pageHeader}>
            <div className={styles.titleSection}>
                <h1 className={styles.title}>메뉴 관리</h1>
                <p className={styles.subtitle}>
                    총 {totalCount}개의 메뉴 · {soldOutCount}개 품절
                </p>
            </div>

            <div className={styles.actions}>
                {/* 검색 */}
                <div className={styles.searchWrapper}>
                    <Search className={styles.searchIcon} />
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="메뉴 이름으로 검색..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                {/* 새 메뉴 추가 버튼 */}
                <Link href="/admin/menus/new">
                    <Button className={styles.addButton}>
                        <Plus size={18} />
                        새 메뉴 추가
                    </Button>
                </Link>
            </div>
        </header>
    );
}
