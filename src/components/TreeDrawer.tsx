'use client';

import Link from 'next/link';
import { Person, FamilyData } from '@/lib/types';
import PersonMedallion from './PersonMedallion';
import styles from './TreeDrawer.module.css';

interface TreeDrawerProps {
  person: Person | null;
  data: FamilyData;
  onClose: () => void;
}

export default function TreeDrawer({ person, data, onClose }: TreeDrawerProps) {
  if (!person) return null;

  const father = person.fatherId ? data.people.find(p => p.id === person.fatherId) : null;
  const mother = person.motherId ? data.people.find(p => p.id === person.motherId) : null;
  const children = data.people.filter(p => p.fatherId === person.id || p.motherId === person.id);
  const spouseIds = (person.spouses || []).map(s => s.personId).filter(Boolean);
  const spouses = data.people.filter(p => spouseIds.includes(p.id));

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <aside className={styles.drawer} onClick={e => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label="Fechar">&times;</button>

        <div className={styles.profile}>
          <PersonMedallion person={person} size="lg" />
          <h3 className={styles.name}>{person.fullName}</h3>
          {person.nickname && <span className={styles.nickname}>&ldquo;{person.nickname}&rdquo;</span>}
          <span className={styles.dates}>
            {person.birth?.date || '?'}{person.death?.date ? ` — ${person.death.date}` : ''}
          </span>
        </div>

        {person.bio && <p className={styles.bio}>{person.bio}</p>}

        <div className={styles.relations}>
          {father && (
            <div className={styles.relation}>
              <span className={styles.relLabel}>Pai</span>
              <span className={styles.relName}>{father.fullName}</span>
            </div>
          )}
          {mother && (
            <div className={styles.relation}>
              <span className={styles.relLabel}>Mãe</span>
              <span className={styles.relName}>{mother.fullName}</span>
            </div>
          )}
          {spouses.length > 0 && spouses.map(s => (
            <div key={s.id} className={styles.relation}>
              <span className={styles.relLabel}>Cônjuge</span>
              <span className={styles.relName}>{s.fullName}</span>
            </div>
          ))}
          {children.length > 0 && (
            <div className={styles.relation}>
              <span className={styles.relLabel}>Filhos</span>
              <span className={styles.relName}>{children.map(c => c.fullName).join(', ')}</span>
            </div>
          )}
        </div>

        <Link href={`/pessoa/${person.id}/`} className={styles.profileLink}>
          Ver perfil completo &rarr;
        </Link>
      </aside>
    </div>
  );
}
