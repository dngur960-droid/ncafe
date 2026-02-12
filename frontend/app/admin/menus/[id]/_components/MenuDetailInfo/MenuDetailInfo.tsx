import { Info } from 'lucide-react';
import styles from './MenuDetailInfo.module.css';
import { format } from 'date-fns';
<<<<<<< HEAD
import { useParams } from 'next/navigation';
import { useMenuDetail } from './useMenuDetail';

export default function MenuDetailInfo() {
    const params = useParams();
    const id = params.id as string;
    const { menuDetail: menu, loading, error } = useMenuDetail(id);

    if (loading) return <div className={styles.loading}>정보를 불러오는 중...</div>;
    if (error) return <div className={styles.error}>정보를 불러오지 못했습니다.</div>;
    if (!menu) return null;
=======
import { useMenuDetail } from './useMenuDetail';

export default function MenuDetailInfo({ id }: { id: number }) {

    console.log('id : ' + id);
    const { menu } = useMenuDetail(id);

    console.log(menu);
>>>>>>> acd0828dfdf61b419e0c5a38f70f4ab06fe7708e

    return (
        <section className={styles.card}>
            <h2 className={styles.sectionTitle}>
                <Info size={20} />
                기본 정보
            </h2>

            <div className={styles.row}>
                <span className={styles.label}>한글명</span>
                <span className={styles.value}>{menu?.korName}</span>
            </div>

            <div className={styles.row}>
                <span className={styles.label}>영문명</span>
                <span className={styles.value}>{menu?.engName}</span>
            </div>

            <div className={styles.row}>
                <span className={styles.label}>카테고리</span>
                <span className={styles.value}>
<<<<<<< HEAD
                    {menu.categoryName}
=======
                    {menu?.categoryName}
>>>>>>> acd0828dfdf61b419e0c5a38f70f4ab06fe7708e
                </span>
            </div>

            <div className={styles.row}>
                <span className={styles.label}>가격</span>
<<<<<<< HEAD
                <span className={styles.value}>{Number(menu.price).toLocaleString()}원</span>
=======
                <span className={styles.value}>{menu?.price?.toLocaleString()}원</span>
>>>>>>> acd0828dfdf61b419e0c5a38f70f4ab06fe7708e
            </div>

            <div className={styles.row}>
                <span className={styles.label}>판매 상태</span>
<<<<<<< HEAD
                <span className={`${styles.badge} ${menu.isAvailable ? styles.badgeAvailable : styles.badgeSoldOut}`}>
                    {menu.isAvailable ? '판매 중' : '숨김'}
=======
                <span className={`${styles.badge} ${menu?.isAvailable ? styles.badgeAvailable : styles.badgeSoldOut}`}>
                    {menu?.isAvailable ? '판매중' : '품절'}
>>>>>>> acd0828dfdf61b419e0c5a38f70f4ab06fe7708e
                </span>
            </div>

            <div className={styles.row}>
                <span className={styles.label}>등록일</span>
<<<<<<< HEAD
                <span className={styles.value}>
                    {menu.createdAt ? format(new Date(menu.createdAt), 'yyyy-MM-dd HH:mm') : '-'}
                </span>
=======
                <span className={styles.value}>{menu?.createdAt ? format(new Date(menu.createdAt), 'yyyy-MM-dd') : ''}</span>
>>>>>>> acd0828dfdf61b419e0c5a38f70f4ab06fe7708e
            </div>

            <div className={styles.descriptionWrapper}>
                <span className={styles.descriptionLabel}>설명</span>
<<<<<<< HEAD
                <p className={styles.description}>{menu.description || '설명이 없습니다.'}</p>
=======
                <p className={styles.description}>{menu?.description}</p>
>>>>>>> acd0828dfdf61b419e0c5a38f70f4ab06fe7708e
            </div>
        </section>
    );
}

