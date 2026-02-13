import FamilyTreeView from '@/components/FamilyTreeView';
import { getFamilyData } from '@/lib/data';
import styles from './page.module.css';

export const metadata = {
  title: 'Árvore Genealógica — Família Cipriano',
};

export default function ArvorePage() {
  const data = getFamilyData();

  return (
    <div className={styles.page}>
      <div className="container">
        <header className={styles.header}>
          <h1 className={styles.title}>Árvore Genealógica</h1>
          <p className={styles.subtitle}>
            Navegue pela árvore interativa. Use zoom, arraste para explorar, e clique nos membros para ver detalhes.
          </p>
        </header>
        <FamilyTreeView data={data} />
      </div>
    </div>
  );
}
