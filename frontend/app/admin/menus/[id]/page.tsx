'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getMenuById } from '@/mocks/menuData';
import { Menu } from '@/types';
import { useMenu } from './useMenu';
import MenuDetailHeader from './_components/MenuDetailHeader';
import MenuDetailInfo from './_components/MenuDetailInfo';
import MenuImages from './_components/MenuImages';
import MenuOptions from './_components/MenuOptions';
import styles from './page.module.css';

<<<<<<< HEAD
interface MenuDetailPageProps {
    params: Promise<{ id: string }>;
}

export default function MenuDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { menu, loading, error } = useMenu(id);

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>에러 발생: {error.message}</div>;
    if (!menu) return <div>메뉴를 찾을 수 없습니다.</div>;
=======
export default function MenuDetailPage({ params }: { params: Promise<{ id: number }> }) {
    const { id } = use(params);
>>>>>>> acd0828dfdf61b419e0c5a38f70f4ab06fe7708e

    return (
        <main>
            <MenuDetailHeader
<<<<<<< HEAD
                id={menu.id.toString()}
=======
                title="메뉴 상세"
>>>>>>> acd0828dfdf61b419e0c5a38f70f4ab06fe7708e
            />
            <div className={styles.pageLayout}>
                <div className={styles.column}>
<<<<<<< HEAD
                    <MenuImages />
                    <MenuDetailInfo />
=======
                    <MenuImages menuId={id} />
                    <MenuDetailInfo id={id} />
>>>>>>> acd0828dfdf61b419e0c5a38f70f4ab06fe7708e
                </div>
                <div className={styles.column}>
                    <MenuOptions />
                </div>
            </div>
        </main>
    );
}
