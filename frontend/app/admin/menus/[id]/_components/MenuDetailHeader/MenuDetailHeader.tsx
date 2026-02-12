'use client';

import Link from 'next/link';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import styles from './MenuDetailHeader.module.css';



interface MenuDetailHeaderProps {
<<<<<<< HEAD
    id: string;
}

export default function MenuDetailHeader({ id }: MenuDetailHeaderProps) {
=======
    title: string;
}

export default function MenuDetailHeader({ title }: MenuDetailHeaderProps) {
>>>>>>> acd0828dfdf61b419e0c5a38f70f4ab06fe7708e
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
<<<<<<< HEAD
                    href={`/admin/menus/${id}/edit`}
=======
                    href={`/admin/menus/${1}/edit`}
>>>>>>> acd0828dfdf61b419e0c5a38f70f4ab06fe7708e
                    className={`${styles.actionButton} ${styles.editButton}`}
                >
                    <Edit2 size={16} />
                    수정
                </Link>
                <button
<<<<<<< HEAD
=======
                    onClick={() => { }}
>>>>>>> acd0828dfdf61b419e0c5a38f70f4ab06fe7708e
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                >
                    <Trash2 size={16} />
                    삭제
                </button>
            </div>
        </header>
    );
}
