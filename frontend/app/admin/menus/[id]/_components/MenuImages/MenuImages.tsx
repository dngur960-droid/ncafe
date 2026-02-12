'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
<<<<<<< HEAD
import { useParams } from 'next/navigation';
import { ImageIcon } from 'lucide-react';
import styles from './MenuImages.module.css';
import { useMenuImages, MenuImage } from './useMenuImages';
import { useMenuDetail } from '../MenuDetailInfo/useMenuDetail';

export default function MenuImages() {
    const params = useParams();
    const id = params.id as string;
    const { images, loading, error } = useMenuImages(id);
    const { menuDetail } = useMenuDetail(id); // 메뉴 이름(korName)을 가져오기 위해 추가
    const [selectedImage, setSelectedImage] = useState<MenuImage | null>(null);

    const menuName = menuDetail?.korName || '메뉴';
=======
import { ImageIcon } from 'lucide-react';
import styles from './MenuImages.module.css';
import { useMenuImages, MenuImageResponse } from './useMenuImages';


export default function MenuImages({ menuId }: { menuId: number }) {

    const { images, loading } = useMenuImages(menuId);
    const [selectedImageId, setSelectedImageId] = useState<number | null>(null);

    // 선택된 이미지가 없으면 첫 번째 이미지를 기본으로 사용
    const selectedImage = selectedImageId
        ? images.find(img => img.id === selectedImageId)
        : images[0];

    // 첫 이미지가 로드될 때 selectedImageId를 설정할 수도 있지만, 
    // 위 로직(images[0])으로 처리하면 이미지가 변경될 때 자연스럽게 첫 번째가 나옴.
    // 다만 클릭 시 명시적으로 변경.

    if (loading) {
        return <div className={styles.loading}>이미지 로딩 중...</div>;
    }
>>>>>>> acd0828dfdf61b419e0c5a38f70f4ab06fe7708e

    // 기본 이미지 설정 (데이터 로드 후 첫 번째 이미지)
    const displayImage = selectedImage || (images.length > 0 ? images[0] : null);

    if (loading) return <div className={styles.loading}>이미지 로딩 중...</div>;
    // 에러 발생 시에도 빈 상태를 보여줄 수 있으므로 null 반환보다는 UI 유지

    // 이미지 기본 경로 (next.config.ts의 rewrites 설정에 맞춤)
    const baseUrl = '/images';

    const getImageUrl = (url: string) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return `${baseUrl}/${url}`;
    };

    return (
        <section className={styles.card}>
            <h2 className={styles.sectionTitle}>
                <ImageIcon size={20} />
                이미지
            </h2>

            <div className={styles.primaryImageWrapper}>
                {displayImage ? (
                    <Image
<<<<<<< HEAD
                        src={getImageUrl(displayImage.url)}
                        alt={displayImage.altText || `${menuName} 대표 이미지`}
=======
                        src={`/images/${selectedImage.srcUrl}`}
                        alt="상세 이미지"
>>>>>>> acd0828dfdf61b419e0c5a38f70f4ab06fe7708e
                        fill
                        className={styles.primaryImage}
                    />
                ) : (
                    <div className={styles.emptyState}>
                        <ImageIcon size={48} color="#9ca3af" />
                        <span>이미지 영역</span>
                    </div>
                )}
            </div>

            <div className={styles.thumbnailGrid}>
                {images.map((image) => (
                    <button
                        key={image.id}
<<<<<<< HEAD
                        className={`${styles.thumbnailWrapper} ${displayImage?.id === image.id ? styles.activeThumbnail : ''}`}
                        onClick={() => setSelectedImage(image)}
                    >
                        <Image
                            src={getImageUrl(image.url)}
                            alt={image.altText || `${menuName} 이미지`}
=======
                        className={styles.thumbnailWrapper}
                        style={{
                            borderColor: selectedImage?.id === image.id ? 'var(--color-primary-500)' : undefined
                        }}
                        onClick={() => setSelectedImageId(image.id)}
                    >
                        <Image
                            src={`/images/${image.srcUrl}`}
                            alt="썸네일"
>>>>>>> acd0828dfdf61b419e0c5a38f70f4ab06fe7708e
                            fill
                            className={styles.thumbnailImage}
                        />
                    </button>
                ))}
            </div>
        </section>
    );
}
