import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getFamilyData, getPersonById, getAllPersonIds, getChildren } from '@/lib/data';
import PersonMedallion from '@/components/PersonMedallion';
import PersonCard from '@/components/PersonCard';
import PhotoGallery from '@/components/PhotoGallery';
import GoldDivider from '@/components/GoldDivider';
import styles from './page.module.css';

export function generateStaticParams() {
  return getAllPersonIds().map(id => ({ id }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const person = getPersonById(params.id);
  return {
    title: person ? `${person.fullName} — Família Cipriano` : 'Membro não encontrado',
  };
}

export default function PessoaPage({ params }: { params: { id: string } }) {
  const data = getFamilyData();
  const person = getPersonById(params.id);

  if (!person) return notFound();

  const father = person.fatherId ? data.people.find(p => p.id === person.fatherId) : null;
  const mother = person.motherId ? data.people.find(p => p.id === person.motherId) : null;
  const children = getChildren(person.id);
  const spouseIds = (person.spouses || []).map(s => s.personId).filter(Boolean) as string[];
  const spouses = data.people.filter(p => spouseIds.includes(p.id));

  return (
    <div className={styles.page}>
      <div className="container-narrow">
        <Link href="/arvore/" className={styles.back}>&larr; Voltar à árvore</Link>

        {/* ─── Profile header ─── */}
        <header className={styles.profile}>
          <PersonMedallion person={person} size="lg" />
          <div className={styles.profileInfo}>
            <h1 className={styles.name}>{person.fullName}</h1>
            {person.nickname && (
              <span className={styles.nickname}>&ldquo;{person.nickname}&rdquo;</span>
            )}
            <div className={styles.dates}>
              {person.birth?.date && <span>Nasc. {person.birth.date}</span>}
              {person.birth?.place && <span className={styles.place}>{person.birth.place}</span>}
              {person.death?.date && <span>Falec. {person.death.date}</span>}
              {person.death?.place && <span className={styles.place}>{person.death.place}</span>}
            </div>
            {person.tags && person.tags.length > 0 && (
              <div className={styles.tags}>
                {person.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
              </div>
            )}
          </div>
        </header>

        <GoldDivider />

        {/* ─── Bio ─── */}
        {person.bio && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Biografia</h2>
            <p className={styles.bio}>{person.bio}</p>
          </section>
        )}

        {/* ─── Photos ─── */}
        {person.photos && person.photos.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Galeria</h2>
            <PhotoGallery photos={person.photos} personName={person.fullName} />
          </section>
        )}

        {/* ─── Relations ─── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Relações Familiares</h2>
          <div className={styles.relations}>
            {father && (
              <div className={styles.relGroup}>
                <h3 className={styles.relLabel}>Pai</h3>
                <PersonCard person={father} compact />
              </div>
            )}
            {mother && (
              <div className={styles.relGroup}>
                <h3 className={styles.relLabel}>Mãe</h3>
                <PersonCard person={mother} compact />
              </div>
            )}
            {spouses.length > 0 && (
              <div className={styles.relGroup}>
                <h3 className={styles.relLabel}>Cônjuge{spouses.length > 1 ? 's' : ''}</h3>
                {spouses.map(s => <PersonCard key={s.id} person={s} compact />)}
              </div>
            )}
            {children.length > 0 && (
              <div className={styles.relGroup}>
                <h3 className={styles.relLabel}>Filhos</h3>
                {children.map(c => <PersonCard key={c.id} person={c} compact />)}
              </div>
            )}
          </div>
        </section>

        {/* ─── Sources ─── */}
        {person.sources && person.sources.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Fontes</h2>
            <ul className={styles.sources}>
              {person.sources.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
