import styles from './PersonMedallion.module.css';
import { Person } from '@/lib/types';

interface PersonMedallionProps {
  person: Person;
  size?: 'sm' | 'md' | 'lg';
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter((_, i, a) => i === 0 || i === a.length - 1)
    .map(w => w[0])
    .join('')
    .toUpperCase();
}

export default function PersonMedallion({ person, size = 'md' }: PersonMedallionProps) {
  const hasPhoto = person.photos && person.photos.length > 0;

  return (
    <div className={`${styles.medallion} ${styles[size]}`}>
      {hasPhoto ? (
        <img
          src={person.photos![0]}
          alt={person.fullName}
          className={styles.photo}
        />
      ) : (
        <div className={styles.initials}>
          <span>{getInitials(person.fullName)}</span>
        </div>
      )}
    </div>
  );
}
