'use client';

import { Menu } from '@/types';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import MenuCard from '../MenuCard';
import styles from './MenuList.module.css';

interface MenuListProps {
    menus: Menu[];
    onToggleSoldOut: (id: string, isSoldOut: boolean) => void;
    onDelete: (id: string) => void;
}

export default function MenuList({ menus, onToggleSoldOut, onDelete }: MenuListProps) {
    if (menus.length === 0) {
        return (
            <div className={styles.empty}>
                <div className={styles.emptyIcon}>📋</div>
                <h3 className={styles.emptyTitle}>등록된 메뉴가 없습니다</h3>
                <p className={styles.emptyDescription}>
                    새 메뉴를 등록하여 고객에게 보여주세요.
                </p>
            </div>
        );
    }

    return (
        <SortableContext
            items={menus.map(m => m.id)}
            strategy={rectSortingStrategy}
        >
            <div className={styles.grid}>
                {menus.map((menu) => (
                    <MenuCard
                        key={menu.id}
                        menu={menu}
                        onToggleSoldOut={onToggleSoldOut}
                        onDelete={onDelete}
                    />
                ))}
            </div>
        </SortableContext>
    );
}
