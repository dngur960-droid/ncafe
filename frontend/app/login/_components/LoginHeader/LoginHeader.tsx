import Image from 'next/image';
import styles from './LoginHeader.module.css';

export default function LoginHeader() {
    return (
        <header className={styles.header}>
            <div className={styles.logoWrap}>
                <Image 
                    src="/theme/quokka_mascot.png" 
                    alt="Quokka" 
                    width={80} 
                    height={80} 
                    className={styles.mascot}
                />
            </div>
            <h1 className={styles.title}>NCafe 관리자</h1>
            <p className={styles.subtitle}>따뜻한 쿼카의 커피 한 잔과 함께 시작해요</p>
        </header>
    );
}
