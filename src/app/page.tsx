import Link from 'next/link';
import CoatOfArms from '@/components/CoatOfArms';
import GoldDivider from '@/components/GoldDivider';
import PersonCard from '@/components/PersonCard';
import { getFamilyData } from '@/lib/data';
import styles from './page.module.css';

export default function HomePage() {
  const data = getFamilyData();
  const featured = data.people.slice(0, 4);

  return (
    <div className={styles.page}>
      {/* ─── Hero ─── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <CoatOfArms variant="hero" />
          <h1 className={styles.title}>Família Cipriano</h1>
          <p className={styles.subtitle}>Museu Digital &mdash; Preservando nossa história</p>
          <GoldDivider />
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNum}>{data.people.length}</span>
              <span className={styles.statLabel}>Membros</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>
                {new Set(Array.from(new Map(data.people.map(p => [
                  p.fatherId || p.motherId ? 1 : 0,
                  true,
                ])).keys())).size > 0
                  ? Math.max(...data.people.map(p => {
                      let gen = 0;
                      let curr: typeof p | undefined = p;
                      const byId = new Map(data.people.map(x => [x.id, x]));
                      while (curr?.fatherId || curr?.motherId) {
                        gen++;
                        curr = byId.get(curr.fatherId || curr.motherId || '');
                      }
                      return gen;
                    })) + 1
                  : 1}
              </span>
              <span className={styles.statLabel}>Gerações</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>{data.historicalEvents.length}</span>
              <span className={styles.statLabel}>Eventos</span>
            </div>
          </div>
          <div className={styles.ctas}>
            <Link href="/arvore/" className={styles.ctaPrimary}>
              Explorar a Árvore
            </Link>
            <Link href="/linha-do-tempo/" className={styles.ctaSecondary}>
              Linha do Tempo
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Featured ─── */}
      <section className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Membros em Destaque</h2>
          <GoldDivider />
          <div className={styles.grid}>
            {featured.map(person => (
              <PersonCard key={person.id} person={person} />
            ))}
          </div>
          <div className={styles.seeAll}>
            <Link href="/ramos/" className={styles.ctaSecondary}>
              Ver todos os ramos &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ─── About ─── */}
      <section className={styles.section}>
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <h2 className={styles.sectionTitle}>Sobre Este Museu</h2>
          <GoldDivider />
          <p className={styles.about}>
            Este museu digital foi criado para preservar e celebrar a memória da Família Cipriano.
            Aqui você encontra a árvore genealógica interativa, fotos históricas, documentos e
            relatos que contam a trajetória da nossa família ao longo das gerações.
          </p>
        </div>
      </section>
    </div>
  );
}
