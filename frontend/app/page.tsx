
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { MoveRight, MapPin, Phone, ChefHat } from "lucide-react";

export default function Home() {
  return (
    <div className={styles.page}>

      {/* Header (Transparent overlay) */}
      <header className={styles.header}>
        <div className={styles.logo}>
          NCAFE <span style={{ color: '#22c55e' }}>.</span>
        </div>

        <nav className={styles.nav}>
          <Link href="#" className={styles.navItem}>NCAFE</Link>
          <Link href="/menu" className={styles.navItem}>MENU</Link>
          <Link href="#" className={styles.navItem}>EVENT</Link>
          <Link href="/admin/menus" className={styles.navItem}>STORE</Link>
          <Link href="#" className={styles.navItem}>FRANCHISE</Link>
        </nav>

        <div className={styles.topMenu}>
          <Link href="#">HOME</Link>
          <Link href="#">SIGN UP</Link>
          <Link href="#">LOGIN</Link>
          <Link href="#">SITEMAP</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <Image
            src="/images/cafe_hero_topdown.png"
            alt="Cafe Top Down View"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
        <div className={styles.heroOverlay}></div>

        <div className={styles.heroContent}>
          <span className={styles.heroTag}>COFFEE & DESSERT</span>
          <h1 className={styles.heroTitle}>
            NCAFE BAKERY
          </h1>
          <p className={styles.heroSubtitle}>
            앤카페는 엄선된 친환경 재료만을 사용합니다.
          </p>

          <div className={styles.heroDots}>
            <div className={`${styles.dot} ${styles.dotActive}`}></div>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
          </div>
        </div>
      </section>

      {/* Bottom Banners overlapping Hero */}
      <div className={styles.bannerContainer}>
        {/* Box 1: Location */}
        <div className={`${styles.bannerBox} ${styles.boxLocation}`}>
          <p>찾아오시는 길</p>
          <h3>Location</h3>
          <div className={styles.heroDots}>
            <div className={`${styles.dot} ${styles.dotActive}`}></div>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
          </div>
        </div>

        {/* Box 2: Menu */}
        <Link href="/menu" className={`${styles.bannerBox} ${styles.boxMenu}`}>
          <div className={styles.boxMenuBackground}>
            <Image
              src="/images/cafe_breakfast_toast.png"
              alt="Breakfast Menu"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className={styles.boxMenuOverlay}></div>
          <span className={styles.menuBorderBox}>
            메뉴안내
          </span>
        </Link>

        {/* Box 3: Customer */}
        <div className={`${styles.bannerBox} ${styles.boxCustomer}`}>
          <div className={styles.customerTitle}>창업문의</div>
          <p>Customer Center</p>
          <div className={styles.customerPhone}>1544-0000</div>
          <div className={styles.customerIcon}>
            <ChefHat size={48} color="#ddd" strokeWidth={1} />
          </div>
        </div>
      </div>

    </div>
  );
}
