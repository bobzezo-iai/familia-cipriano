import Link from 'next/link';
import { Person } from '@/lib/types';
import PersonMedallion from './PersonMedallion';
import styles from './PersonCard.module.css';

interface PersonCardProps {
  person: Person;
  compact?: boolean;
}

function formatLifespan(person: Person): string {
  const b = person.birth?.date || '?';
  const d = person.death?.date;
  return d ? `${b} — ${d}` : `${b} —`;
}

export default function PersonCard({ person, compact }: PersonCardProps) {
  return (
    <Link href={`/pessoa/${person.id}/`} className={`${styles.card} ${compact ? styles.compact : ''}`}>
      <PersonMedallion person={person} size={compact ? 'sm' : 'md'} />
      <div className={styles.info}>
        <h4 className={styles.name}>{person.fullName}</h4>
        {person.nickname && (
          <span className={styles.nickname}>&ldquo;{person.nickname}&rdquo;</span>
        )}
        <span className={styles.dates}>{formatLifespan(person)}</span>
        {!compact && person.tags && person.tags.length > 0 && (
          <div className={styles.tags}>
            {person.tags.map(tag => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
