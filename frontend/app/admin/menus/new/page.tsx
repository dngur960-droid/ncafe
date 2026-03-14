'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import MenuForm from '../_components/MenuForm';
import { MenuFormData } from '@/types';
import styles from './page.module.css';

export default function NewMenuPage() {
    const router = useRouter();

    const handleSubmit = async (data: MenuFormData) => {
        try {
            const response = await fetch('/api/admin/menus', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    korName: data.korName,
                    engName: data.engName,
                    price: data.price,
                    description: data.description,
                    categoryId: data.categoryId ? Number(data.categoryId) : null,
                    isAvailable: data.isAvailable,
                    isSoldOut: data.isSoldOut,
                    sortOrder: 1,
                }),
            });

            if (!response.ok) {
                throw new Error('메뉴 등록에 실패했습니다.');
            }

            alert('메뉴가 성공적으로 등록되었습니다.');
            router.push('/admin/menus');
        } catch (err) {
            alert(err instanceof Error ? err.message : '오류가 발생했습니다.');
        }
    };

    return (
        <main className={styles.container}>
            <header className={styles.header}>
                <Link href="/admin/menus" className={styles.backButton} aria-label="목록으로 돌아가기">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className={styles.title}>새 메뉴 등록</h1>
            </header>

            <MenuForm
                onSubmit={handleSubmit}
                submitLabel="메뉴 등록하기"
            />
        </main>
    );
}
