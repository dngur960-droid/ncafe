'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import styles from './MenuDetailHeader.module.css';



interface MenuDetailHeaderProps {
    id: string;
}

export default function MenuDetailHeader({ id }: MenuDetailHeaderProps) {
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm('정말로 이 메뉴를 삭제하시겠습니까?')) return;

        try {
            const response = await fetch(`/api/admin/menus/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('메뉴 삭제에 실패했습니다.');

            alert('메뉴가 삭제되었습니다.');
            router.push('/admin/menus');
        } catch (err) {
            alert(err instanceof Error ? err.message : '오류가 발생했습니다.');
        }
    };

    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <Link href="/admin/menus" className={styles.backButton} aria-label="목록으로 돌아가기">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className={styles.title}>메뉴상세</h1>
            </div>

            <div className={styles.actions}>
                <Link
                    href={`/admin/menus/${id}/edit`}
                    className={`${styles.actionButton} ${styles.editButton}`}
                >
                    <Edit2 size={16} />
                    수정
                </Link>
                <button
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    onClick={handleDelete}
                >
                    <Trash2 size={16} />
                    삭제
                </button>
            </div>
        </header>
    );
}
