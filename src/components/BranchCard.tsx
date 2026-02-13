import Link from 'next/link';
import { Person } from '@/lib/types';
import PersonMedallion from './PersonMedallion';
import styles from './BranchCard.module.css';

interface BranchCardProps {
  rootPerson: Person;
  descendants: Person[];
}

export default function BranchCard({ rootPerson, descendants }: BranchCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <PersonMedallion person={rootPerson} size="lg" />
        <div className={styles.info}>
          <Link href={`/pessoa/${rootPerson.id}/`} className={styles.name}>
            {rootPerson.fullName}
          </Link>
          {rootPerson.nickname && (
            <span className={styles.nickname}>&ldquo;{rootPerson.nickname}&rdquo;</span>
          )}
          <span className={styles.count}>
            {descendants.length} descendente{descendants.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
      {descendants.length > 0 && (
        <div className={styles.list}>
          {descendants.slice(0, 6).map(p => (
            <Link key={p.id} href={`/pessoa/${p.id}/`} className={styles.descendant}>
              <PersonMedallion person={p} size="sm" />
              <span className={styles.descName}>{p.fullName}</span>
            </Link>
          ))}
          {descendants.length > 6 && (
            <span className={styles.more}>+{descendants.length - 6} mais</span>
          )}
        </div>
      )}
    </div>
  );
}
