'use client';

import { useState, useMemo } from 'react';
import TimelineCard from '@/components/TimelineCard';
import SearchBar from '@/components/SearchBar';
import GoldDivider from '@/components/GoldDivider';
import familyData from '@/data/cipriano.family.json';
import { FamilyData, Person, HistoricalEvent } from '@/lib/types';
import styles from './page.module.css';

interface TimelineItem {
  id: string;
  date: string;
  sortDate: number;
  title: string;
  description?: string;
  tags: string[];
  type: 'birth' | 'death' | 'event';
}

function parseDate(d?: string): number {
  if (!d) return 0;
  const clean = d.replace(/[~?]/g, '').trim();
  const match = clean.match(/(\d{4})/);
  return match ? parseInt(match[1]) : 0;
}

function buildTimeline(data: FamilyData): TimelineItem[] {
  const items: TimelineItem[] = [];

  data.people.forEach((p: Person) => {
    if (p.birth?.date) {
      items.push({
        id: `birth-${p.id}`,
        date: p.birth.date,
        sortDate: parseDate(p.birth.date),
        title: `Nascimento de ${p.fullName}`,
        description: p.birth.place ? `Local: ${p.birth.place}` : undefined,
        tags: ['nascimento'],
        type: 'birth',
      });
    }
    if (p.death?.date) {
      items.push({
        id: `death-${p.id}`,
        date: p.death.date,
        sortDate: parseDate(p.death.date),
        title: `Falecimento de ${p.fullName}`,
        description: p.death.place ? `Local: ${p.death.place}` : undefined,
        tags: ['falecimento'],
        type: 'death',
      });
    }
  });

  data.historicalEvents.forEach((e: HistoricalEvent) => {
    items.push({
      id: e.id,
      date: e.date || '?',
      sortDate: parseDate(e.date),
      title: e.title,
      description: e.description,
      tags: ['evento'],
      type: 'event',
    });
  });

  return items.sort((a, b) => a.sortDate - b.sortDate);
}

type FilterType = 'all' | 'birth' | 'death' | 'event';

export default function LinhaDoTempoPage() {
  const data = familyData as FamilyData;
  const allItems = useMemo(() => buildTimeline(data), [data]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let items = allItems;
    if (filter !== 'all') items = items.filter(i => i.type === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(i => i.title.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q));
    }
    return items;
  }, [allItems, filter, search]);

  return (
    <div className={styles.page}>
      <div className="container-narrow">
        <header className={styles.header}>
          <h1 className={styles.title}>Linha do Tempo</h1>
          <p className={styles.subtitle}>A história da Família Cipriano em ordem cronológica</p>
        </header>

        <div className={styles.toolbar}>
          <SearchBar value={search} onChange={setSearch} placeholder="Filtrar eventos..." />
          <div className={styles.filters}>
            {(['all', 'birth', 'death', 'event'] as FilterType[]).map(f => (
              <button
                key={f}
                className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`}
                onClick={() => setFilter(f)}
              >
                {{ all: 'Todos', birth: 'Nascimentos', death: 'Falecimentos', event: 'Eventos' }[f]}
              </button>
            ))}
          </div>
        </div>

        <GoldDivider />

        <div className={styles.timeline}>
          {filtered.length === 0 && (
            <p className={styles.empty}>Nenhum evento encontrado.</p>
          )}
          {filtered.map((item, i) => (
            <TimelineCard
              key={item.id}
              date={item.date}
              title={item.title}
              description={item.description}
              tags={item.tags}
              isLast={i === filtered.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
