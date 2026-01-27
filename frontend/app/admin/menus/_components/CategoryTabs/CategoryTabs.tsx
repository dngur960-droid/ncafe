'use client';

import { MenuCategory, Menu } from '@/types';
import styles from './CategoryTabs.module.css';

interface CategoryTabsProps {
    categories: MenuCategory[];
    menus: Menu[];
    selectedCategory: string | null;
    onSelectCategory: (categoryId: string | null) => void;
}

export default function CategoryTabs({
    categories,
    menus,
    selectedCategory,
    onSelectCategory,
}: CategoryTabsProps) {
    // 카테고리별 메뉴 개수 계산
    const getMenuCount = (categoryId: string | null) => {
        if (!categoryId) return menus.length;
        return menus.filter(menu => menu.category.id === categoryId).length;
    };

    return (
        <div className={styles.tabs}>
            {/* 전체 탭 */}
            <button
                className={`${styles.tab} ${selectedCategory === null ? styles.tabActive : ''}`}
                onClick={() => onSelectCategory(null)}
            >
                <span className={styles.tabIcon}>📋</span>
                전체
                <span className={styles.tabCount}>{getMenuCount(null)}</span>
            </button>

            {/* 카테고리별 탭 */}
            {categories.map((category) => (
                <button
                    key={category.id}
                    className={`${styles.tab} ${selectedCategory === category.id ? styles.tabActive : ''}`}
                    onClick={() => onSelectCategory(category.id)}
                >
                    <span className={styles.tabIcon}>{category.icon}</span>
                    {category.korName}
                    <span className={styles.tabCount}>{getMenuCount(category.id)}</span>
                </button>
            ))}
        </div>
    );
}
