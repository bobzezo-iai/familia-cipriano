'use client';

import { useState } from 'react';
import styles from './PhotoGallery.module.css';

interface PhotoGalleryProps {
  photos: string[];
  personName?: string;
}

export default function PhotoGallery({ photos, personName }: PhotoGalleryProps) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (!photos || photos.length === 0) return null;

  return (
    <>
      <div className={styles.grid}>
        {photos.map((photo, i) => (
          <button
            key={photo}
            className={styles.thumb}
            onClick={() => setLightbox(i)}
            aria-label={`Ver foto ${i + 1}${personName ? ` de ${personName}` : ''}`}
          >
            <img src={photo} alt={`Foto ${i + 1}`} className={styles.thumbImg} />
          </button>
        ))}
      </div>

      {lightbox !== null && (
        <div className={styles.overlay} onClick={() => setLightbox(null)}>
          <button className={styles.close} onClick={() => setLightbox(null)} aria-label="Fechar">
            &times;
          </button>
          <button
            className={`${styles.arrow} ${styles.arrowLeft}`}
            onClick={e => { e.stopPropagation(); setLightbox((lightbox - 1 + photos.length) % photos.length); }}
            aria-label="Anterior"
          >
            &#8249;
          </button>
          <img
            src={photos[lightbox]}
            alt={`Foto ${lightbox + 1}`}
            className={styles.fullImg}
            onClick={e => e.stopPropagation()}
          />
          <button
            className={`${styles.arrow} ${styles.arrowRight}`}
            onClick={e => { e.stopPropagation(); setLightbox((lightbox + 1) % photos.length); }}
            aria-label="Próxima"
          >
            &#8250;
          </button>
          <span className={styles.counter}>{lightbox + 1} / {photos.length}</span>
        </div>
      )}
    </>
  );
}
