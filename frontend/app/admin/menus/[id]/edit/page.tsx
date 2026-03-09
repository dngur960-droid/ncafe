'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import MenuForm from '../../_components/MenuForm';
import { MenuFormData } from '@/types';
import styles from './page.module.css';

interface EditMenuPageProps {
    params: Promise<{ id: string }>;
}

export default function EditMenuPage({ params }: EditMenuPageProps) {
    const { id } = use(params);
    const router = useRouter();
    const [initialData, setInitialData] = useState<Partial<MenuFormData> | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await fetch(`/api/admin/menus/${id}`);
                if (!response.ok) throw new Error('메뉴 정보를 가져오는데 실패했습니다.');
                const menu = await response.json();
                setInitialData({
                    korName: menu.korName,
                    engName: menu.engName,
                    description: menu.description,
                    price: Number(menu.price),
                    categoryId: String(menu.categoryId ?? ''),
                    images: [],
                    isAvailable: menu.isAvailable,
                    isSoldOut: false,
                    options: [],
                });
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMenu();
    }, [id]);

    const handleSubmit = async (data: MenuFormData) => {
        try {
            const response = await fetch(`/api/admin/menus/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    korName: data.korName,
                    engName: data.engName,
                    price: data.price,
                    description: data.description,
                    categoryId: data.categoryId ? Number(data.categoryId) : null,
                    isAvailable: data.isAvailable,
                }),
            });

            if (!response.ok) throw new Error('메뉴 수정에 실패했습니다.');

            alert('메뉴가 수정되었습니다.');
            router.push(`/admin/menus/${id}`);
        } catch (err) {
            alert(err instanceof Error ? err.message : '오류가 발생했습니다.');
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">메뉴 정보를 불러오는 중입니다...</div>;
    }

    if (!initialData) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-bold mb-4">메뉴를 찾을 수 없습니다</h2>
                <Link
                    href="/admin/menus"
                    className="text-blue-500 hover:underline"
                >
                    목록으로 돌아가기
                </Link>
            </div>
        );
    }

    return (
        <main className={styles.container}>
            <header className={styles.header}>
                <Link href={`/admin/menus/${id}`} className={styles.backButton} aria-label="상세 페이지로 돌아가기">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className={styles.title}>메뉴 수정</h1>
            </header>

            <MenuForm
                defaultValues={initialData}
                onSubmit={handleSubmit}
                submitLabel="수정사항 저장"
            />
        </main>
    );
}
