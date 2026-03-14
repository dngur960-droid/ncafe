'use client';

import Link from 'next/link';
import GlobalNav from './GlobalNav';
import styles from './Header.module.css';
import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../_context/CartContext';

export default function Header() {
    const { totalItems } = useCart();

    return (
        <header className={styles.header}>
            <Link href="/" className={styles.logoLink}>
                <div className={styles.logoContainer}>
                    <div className={styles.mascotBox}>
                        <Image 
                            src="/theme/quokka_mascot.png" 
                            alt="Quokka Mascot" 
                            width={60} 
                            height={60} 
                            className={styles.mascot}
                        />
                    </div>
                    <div className={styles.logoBox}>
                        <span className={styles.logoText}>NCAFE</span>
                        <span className={styles.logoSub}>KIDS CAFE</span>
                    </div>
                </div>
            </Link>

            <div className={styles.navWrapper}>
                <Link href="/cart" className={styles.cartLink}>
                    <ShoppingBag size={28} />
                    {totalItems > 0 && (
                        <span className={styles.cartCount}>{totalItems}</span>
                    )}
                </Link>
                <GlobalNav />
            </div>
        </header>
    );
}
