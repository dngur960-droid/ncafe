import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import { Sparkles, Coffee, Box, Calendar, MapPin, Phone, Clock, Coins, ShieldAlert } from "lucide-react";

export default function Home() {
  return (
    <div className={styles.page}>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.popupBook}>
          <div className={styles.heroImageContainer}>
            <Image 
              src="/theme/quokka_hero.png" 
              alt="Quokka Friends Playing" 
              fill
              className={styles.heroImage}
              style={{ objectFit: 'contain', mixBlendMode: 'multiply' }}
              priority
            />
          </div>
          <div className={styles.heroContent}>
            <div className={styles.bookTape}></div>
            <span className={styles.heroTag}>#쿼카와 #함께하는 #행복공간</span>
            <h1 className={styles.heroTitle}>
              우리 아이를 위한<br />따뜻한 스케치북 카페
            </h1>
            <p className={styles.heroSubtitle}>
              귀여운 쿼카 친구들이 기다리는 엔카페! <br/> 
              손으로 그린 듯 따뜻한 공간에서 아이들의 꿈이 쑥쑥 자라나요.
            </p>
            <button className={`${styles.actionButton} sketch-border`}>쿼카와 놀러가기</button>
          </div>
        </div>

        {/* Popular Menu Preview */}
        <h2 className={styles.sectionTitle}>오늘의 인기 메뉴</h2>
        
        <div className={styles.menuGrid}>
          {/* Card 1 */}
          <div className={styles.menuCard}>
            <div className={styles.washiTape}></div>
            <div className={styles.menuImage}>
              <Image 
                src="/theme/menu_waffle.png" 
                alt="Strawberry Waffle" 
                fill 
                style={{ objectFit: 'contain', padding: '10px' }} 
              />
            </div>
            <h3 className={styles.menuName}>꿈꾸는 딸기 와플</h3>
            <span className={styles.menuPrice}>9,500원</span>
          </div>

          {/* Card 2 */}
          <div className={styles.menuCard}>
            <div className={styles.menuImage}>
              <Image 
                src="/theme/menu_latte.png" 
                alt="Cloud Latte" 
                fill 
                style={{ objectFit: 'contain', padding: '10px' }} 
              />
            </div>
            <h3 className={styles.menuName}>구름 몽글 라떼</h3>
            <span className={styles.menuPrice}>6,500원</span>
          </div>

          {/* Card 3 */}
          <div className={styles.menuCard}>
            <div className={styles.washiTape} style={{ backgroundColor: '#f4d35e' }}></div>
            <div className={styles.menuImage}>
              <Image 
                src="/theme/menu_lunchbox.png" 
                alt="Jungle Lunchbox" 
                fill 
                style={{ objectFit: 'contain', padding: '10px' }} 
              />
            </div>
            <h3 className={styles.menuName}>정글 탐험 도시락</h3>
            <span className={styles.menuPrice}>12,000원</span>
          </div>
        </div>

        {/* Facilities Section */}
        <h2 id="facilities" className={styles.sectionTitle}>키즈카페 놀이시설</h2>
        <div className={styles.facilityGrid}>
          <div className={styles.facilityCard}>
            <div className={styles.facilityImageWrapper}>
              <Image src="/theme/facility_trampoline.png" alt="Trampoline" fill style={{ objectFit: 'contain', mixBlendMode: 'multiply' }} />
            </div>
            <h3 className={styles.facilityName}>방방이 존</h3>
            <p className={styles.facilityDesc}>하늘 높이 슝슝! <br/> 스트레스 해소 1등 공신 트램펄린</p>
          </div>
          <div className={styles.facilityCard}>
            <div className={styles.facilityImageWrapper}>
              <Image src="/theme/facility_ballpit.png" alt="Ball Pit" fill style={{ objectFit: 'contain', mixBlendMode: 'multiply' }} />
            </div>
            <h3 className={styles.facilityName}>볼풀 놀이터</h3>
            <p className={styles.facilityDesc}>알록달록 공 속에서 수영하며 <br/> 창의력이 쑥쑥 자라나요</p>
          </div>
          <div className={styles.facilityCard}>
            <div className={styles.facilityImageWrapper}>
              <Image src="/theme/facility_drawing.png" alt="Drawing" fill style={{ objectFit: 'contain', mixBlendMode: 'multiply' }} />
            </div>
            <h3 className={styles.facilityName}>드로잉 스케치북</h3>
            <p className={styles.facilityDesc}>대형 스케치북에 마음껏 그리는 <br/> 우리 아이만의 상상력 공간</p>
          </div>
        </div>
      </section>

      {/* Usage Guide Section */}
      <section id="guide" className={styles.guideSection}>
        <h2 className={styles.sectionTitle} style={{ marginTop: 0 }}>이용 안내</h2>
        <div className={styles.guideGrid}>
          <div className={styles.guideBox}>
            <h3 className={styles.guideHeading}><Coins size={32} /> 입장료 안내</h3>
            <div className={styles.priceTable}>
              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>어린이 (2시간 기본)</span>
                <span className={styles.priceValue}>15,000원</span>
              </div>
              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>보호자 (웰컴 음료 포함)</span>
                <span className={styles.priceValue}>5,000원</span>
              </div>
              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>추가 요금 (10분당)</span>
                <span className={styles.priceValue}>1,200원</span>
              </div>
            </div>
          </div>
          <div className={styles.guideBox}>
            <h3 className={styles.guideHeading}><ShieldAlert size={32} /> 꼭 지켜주세요!</h3>
            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}><Clock size={24} /></div>
                <div className={styles.infoText}>
                  <h4>운영 시간</h4>
                  <p>오전 10:00 ~ 오후 8:00 (연중무휴)</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}><Sparkles size={24} /></div>
                <div className={styles.infoText}>
                  <h4>양말 착용 필수</h4>
                  <p>위생 및 안전을 위해 미끄럼 방지 양말을 신어주세요.</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}><Box size={24} /></div>
                <div className={styles.infoText}>
                  <h4>외부 음식 반입 금지</h4>
                  <p>우리 아이들의 알러지 방지를 위해 음식 반입은 안돼요.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer / Info Area */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', padding: '4rem', borderTop: '2px dashed #e6e0d4', backgroundColor: '#fdfaf3' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8b5a3c' }}>
          <MapPin size={20} />
          <span>꿈꾸는동 123-4번지</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8b5a3c' }}>
          <Phone size={20} />
          <span>02-1234-5678</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8b5a3c' }}>
          <Calendar size={20} />
          <span>오전 10:00 - 오후 8:00</span>
        </div>
        {/* Hidden Admin Link */}
        <Link href="/admin" style={{ opacity: 0.2, fontSize: '0.7rem', alignSelf: 'flex-end', color: '#8b5a3c' }}>.</Link>
      </div>
    </div>
  );
}
