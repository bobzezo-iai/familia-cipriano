import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.goldLine} />
      <div className={styles.inner}>
        <div className={styles.brand}>
          <h3 className={styles.title}>Família Cipriano</h3>
          <p className={styles.tagline}>Preservando nossa história</p>
        </div>
        <nav className={styles.nav}>
          <Link href="/">Início</Link>
          <Link href="/arvore/">Árvore</Link>
          <Link href="/linha-do-tempo/">Linha do Tempo</Link>
          <Link href="/ramos/">Ramos</Link>
        </nav>
        <p className={styles.copy}>
          &copy; {new Date().getFullYear()} Família Cipriano &mdash; Museu Digital
        </p>
      </div>
    </footer>
  );
}
