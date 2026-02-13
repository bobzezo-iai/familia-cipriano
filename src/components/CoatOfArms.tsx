import styles from './CoatOfArms.module.css';

interface CoatOfArmsProps {
  variant: 'compact' | 'hero' | 'watermark';
}

export default function CoatOfArms({ variant }: CoatOfArmsProps) {
  return (
    <div className={`${styles.coat} ${styles[variant]}`} aria-hidden={variant === 'watermark'}>
      <img
        src="/brasao/brasao-cipriano.svg"
        alt="Brasão da Família Cipriano"
        className={styles.image}
        width={variant === 'hero' ? 200 : variant === 'compact' ? 48 : 400}
        height={variant === 'hero' ? 240 : variant === 'compact' ? 58 : 480}
      />
      {variant === 'hero' && <div className={styles.glow} />}
    </div>
  );
}
