import { getFamilyData, getRoots, getDescendants } from '@/lib/data';
import BranchCard from '@/components/BranchCard';
import GoldDivider from '@/components/GoldDivider';
import styles from './page.module.css';

export const metadata = {
  title: 'Ramos — Família Cipriano',
};

export default function RamosPage() {
  const data = getFamilyData();
  const roots = getRoots();

  /* If no clear roots, use people from generation 0 (no parents in dataset) */
  const branches = roots.length > 0
    ? roots
    : data.people.filter(p => !p.fatherId && !p.motherId);

  return (
    <div className={styles.page}>
      <div className="container">
        <header className={styles.header}>
          <h1 className={styles.title}>Ramos da Família</h1>
          <p className={styles.subtitle}>
            Cada ramo parte de um ancestral raiz e mostra seus descendentes
          </p>
        </header>

        <GoldDivider />

        <div className={styles.grid}>
          {branches.map(root => (
            <BranchCard
              key={root.id}
              rootPerson={root}
              descendants={getDescendants(root.id)}
            />
          ))}
        </div>

        {branches.length === 0 && (
          <p className={styles.empty}>Nenhum ramo identificado ainda.</p>
        )}
      </div>
    </div>
  );
}
