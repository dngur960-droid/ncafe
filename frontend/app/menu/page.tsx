'use client';

import { useState } from 'react';

import CategoryTabs from './_components/CategoryTabs/CategoryTabs';
import MenuList from './_components/MenuList/MenuList';
import styles from './menu.module.css';
import { Search } from 'lucide-react';
import Image from 'next/image';

export default function UserMenuPage() {
    const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="paper-bg" style={{ minHeight: '100vh' }}>


            <main className={styles.menuPage}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                        <Image 
                            src="/theme/quokka_icons.png" 
                            alt="Quokka Icons" 
                            width={300} 
                            height={80} 
                            style={{ objectFit: 'contain', height: 'auto' }}
                        />
                    </div>
                    <h1 className={styles.pageTitle}>쿼카네 간식 보따리</h1>
                    <p className={styles.pageSubtitle}>쿼카 친구들이 정성을 다해 준비한 영양 만점 메뉴들이에요! 🐾</p>
                </div>

                <div className={styles.searchContainer}>
                    <div className={styles.searchInputWrapper}>
                        <Search className={styles.searchIcon} size={24} />
                        <input
                            type="text"
                            placeholder="찾고 싶은 메뉴 이름을 적어주세요!"
                            className={styles.searchInput}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <CategoryTabs
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                />

                <MenuList
                    selectedCategory={selectedCategory}
                    searchQuery={searchQuery}
                />
            </main>

            <footer style={{ textAlign: 'center', padding: '4rem 0', color: '#8b5a3c', opacity: 0.6 }}>
                <p>© 2026 NCAFE KIDS CAFE - 세상에서 가장 따뜻한 놀이터</p>
            </footer>
        </div>
    );
}
