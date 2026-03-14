import { MenuResponse } from '@/app/admin/menus/_components/MenuList/useMenus';
import styles from './MenuCard.module.css';
import Image from 'next/image';
import { Sparkles, ShoppingBasket } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/app/_context/CartContext';

interface MenuCardProps {
    menu: MenuResponse;
}

export default function MenuCard({ menu }: MenuCardProps) {
    const { addToCart } = useCart();

    if (!menu.isAvailable) return null;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart({
            id: menu.id,
            korName: menu.korName,
            engName: menu.engName,
            price: menu.price,
            imageSrc: menu.imageSrc,
        });
    };

    return (
        <Link href={`/menu/${menu.id}`} className={styles.card}>
            {menu.isSoldOut && (
                <div className={styles.soldOutOverlay}>
                    <span className={styles.soldOutBadge}>다음에 만나요! (품절)</span>
                </div>
            )}
            
            <div className={styles.imageWrapper}>
                {menu.imageSrc ? (
                    <Image
                        src={`/images/${menu.imageSrc}`}
                        alt={menu.korName}
                        fill
                        className={styles.image}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className={styles.noImage}>
                        <Sparkles size={48} strokeWidth={1} />
                        <span>맛있는 간식 준비 중!</span>
                    </div>
                )}
            </div>

            <div className={styles.content}>
                <h3 className={styles.name}>{menu.korName}</h3>
                <p className={styles.engName}>{menu.engName}</p>
                <div className={styles.footer}>
                    <span className={styles.price}>{menu.price.toLocaleString()}원</span>
                    <button 
                        className={styles.cartButton} 
                        onClick={handleAddToCart}
                        title="장바구니에 담기"
                    >
                        <ShoppingBasket size={24} />
                    </button>
                </div>
            </div>
        </Link>
    );
}
