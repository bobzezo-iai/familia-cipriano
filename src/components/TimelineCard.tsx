import styles from './TimelineCard.module.css';

interface TimelineCardProps {
  date?: string;
  title: string;
  description?: string;
  tags?: string[];
  isLast?: boolean;
}

export default function TimelineCard({ date, title, description, tags, isLast }: TimelineCardProps) {
  return (
    <div className={styles.item}>
      <div className={styles.timeline}>
        <div className={styles.dot} />
        {!isLast && <div className={styles.line} />}
      </div>
      <div className={styles.card}>
        {date && <time className={styles.date}>{date}</time>}
        <h3 className={styles.title}>{title}</h3>
        {description && <p className={styles.desc}>{description}</p>}
        {tags && tags.length > 0 && (
          <div className={styles.tags}>
            {tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
          </div>
        )}
      </div>
    </div>
  );
}
