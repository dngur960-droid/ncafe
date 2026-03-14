import { useMenus } from '@/app/admin/menus/_components/MenuList/useMenus';
import MenuCard from '../MenuCard/MenuCard';
import styles from './MenuList.module.css';

interface MenuListProps {
    selectedCategory: number | undefined;
    searchQuery: string | undefined;
}

export default function MenuList({ selectedCategory, searchQuery }: MenuListProps) {
    const { menus } = useMenus(selectedCategory, searchQuery);

    const visibleMenus = menus.filter(m => m.isAvailable);

    if (visibleMenus.length === 0) {
        return (
            <div className={styles.empty}>
                <p className={styles.emptyText}>아직 이 카테고리에는 메뉴가 준비되지 않았어요! 🎈</p>
            </div>
        );
    }

    return (
        <div className={styles.grid}>
            {visibleMenus.map((menu) => (
                <MenuCard key={menu.id} menu={menu} />
            ))}
        </div>
    );
}
