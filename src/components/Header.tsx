'use client';

import { useState } from 'react';
import Link from 'next/link';
import CoatOfArms from './CoatOfArms';
import styles from './Header.module.css';

const NAV_LINKS = [
  { href: '/',                label: 'Início' },
  { href: '/arvore/',         label: 'Árvore' },
  { href: '/linha-do-tempo/', label: 'Linha do Tempo' },
  { href: '/ramos/',          label: 'Ramos' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <CoatOfArms variant="compact" />
          <div className={styles.logoText}>
            <span className={styles.family}>Família</span>
            <span className={styles.surname}>Cipriano</span>
          </div>
        </Link>

        <nav className={`${styles.nav} ${menuOpen ? styles.open : ''}`}>
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.navLink}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      <div className={styles.goldLine} />
    </header>
  );
}
