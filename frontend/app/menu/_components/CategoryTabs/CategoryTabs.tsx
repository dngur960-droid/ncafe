import { CategoryResponseDto, useCategories } from '@/app/admin/menus/_components/CategoryTabs/useCategories';
import styles from './CategoryTabs.module.css';

interface CategoryTabsProps {
    selectedCategory: number | undefined;
    setSelectedCategory: (id: number | undefined) => void;
}

export default function CategoryTabs({ selectedCategory, setSelectedCategory }: CategoryTabsProps) {
    const { categories } = useCategories();

    return (
        <div className={styles.tabs}>
            <button
                className={`${styles.tab} ${selectedCategory === undefined ? styles.tabActive : ''}`}
                onClick={() => setSelectedCategory(undefined)}
            >
                <span className={styles.tabIcon}>🌈</span>
                전체보기
            </button>

            {categories.map((category: CategoryResponseDto) => (
                <button
                    key={category.id}
                    className={`${styles.tab} ${selectedCategory === category.id ? styles.tabActive : ''}`}
                    onClick={() => setSelectedCategory(category.id)}
                >
                    <span className={styles.tabIcon}>{category.icon || '🍪'}</span>
                    {category.name}
                </button>
            ))}
        </div>
    );
}
