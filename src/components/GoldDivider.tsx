import styles from './GoldDivider.module.css';

interface GoldDividerProps {
  className?: string;
  ornament?: boolean;
}

export default function GoldDivider({ className, ornament = true }: GoldDividerProps) {
  if (!ornament) {
    return <hr className={`${styles.line} ${className || ''}`} />;
  }
  return (
    <div className={`${styles.divider} ${className || ''}`}>
      <span className={styles.lineLeft} />
      <span className={styles.diamond}>&#9670;</span>
      <span className={styles.lineRight} />
    </div>
  );
}
