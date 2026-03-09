import styles from './LoginHeader.module.css';

export default function LoginHeader() {
    return (
        <header className={styles.header}>
            <div className={styles.logoWrap}>☕</div>
            <h1 className={styles.title}>NCafe 관리자</h1>
            <p className={styles.subtitle}>관리자 계정으로 로그인하세요</p>
        </header>
    );
}
