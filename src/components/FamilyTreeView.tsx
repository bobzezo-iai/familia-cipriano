'use client';

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { Person, FamilyData } from '@/lib/types';
import TreeDrawer from './TreeDrawer';
import SearchBar from './SearchBar';
import styles from './FamilyTreeView.module.css';

/* ─── Layout constants ─── */
const NODE_W = 140;
const NODE_H = 160;
const H_GAP = 40;
const V_GAP = 80;
const COUPLE_GAP = 20;

interface TreeNode {
  person: Person;
  x: number;
  y: number;
  generation: number;
}

/* ─── Build generation map ─── */
function assignGenerations(people: Person[]): Map<string, number> {
  const gen = new Map<string, number>();
  const byId = new Map(people.map(p => [p.id, p]));

  function walk(id: string): number {
    if (gen.has(id)) return gen.get(id)!;
    const p = byId.get(id);
    if (!p) { gen.set(id, 0); return 0; }
    const parentGens: number[] = [];
    if (p.fatherId && byId.has(p.fatherId)) parentGens.push(walk(p.fatherId));
    if (p.motherId && byId.has(p.motherId)) parentGens.push(walk(p.motherId));
    const g = parentGens.length > 0 ? Math.max(...parentGens) + 1 : 0;
    gen.set(id, g);
    return g;
  }

  people.forEach(p => walk(p.id));

  /* Adjust roots without parents to generation 0 */
  const minGen = Math.min(...Array.from(gen.values()));
  if (minGen > 0) gen.forEach((v, k) => gen.set(k, v - minGen));

  return gen;
}

/* ─── Layout nodes ─── */
function layoutNodes(data: FamilyData): TreeNode[] {
  const gens = assignGenerations(data.people);
  const byGen = new Map<number, Person[]>();

  data.people.forEach(p => {
    const g = gens.get(p.id) ?? 0;
    if (!byGen.has(g)) byGen.set(g, []);
    byGen.get(g)!.push(p);
  });

  const nodes: TreeNode[] = [];
  const maxPerRow = Math.max(...Array.from(byGen.values()).map(a => a.length), 1);

  byGen.forEach((people, gen) => {
    const rowWidth = people.length * (NODE_W + H_GAP) - H_GAP;
    const startX = (maxPerRow * (NODE_W + H_GAP) - H_GAP) / 2 - rowWidth / 2;

    people.forEach((person, i) => {
      nodes.push({
        person,
        x: startX + i * (NODE_W + H_GAP),
        y: gen * (NODE_H + V_GAP) + 40,
        generation: gen,
      });
    });
  });

  return nodes;
}

/* ─── Get initials ─── */
function getInitials(name: string): string {
  return name.split(' ').filter((_, i, a) => i === 0 || i === a.length - 1).map(w => w[0]).join('').toUpperCase();
}

/* ─── Component ─── */
export default function FamilyTreeView({ data }: { data: FamilyData }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.85);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selected, setSelected] = useState<Person | null>(null);
  const [search, setSearch] = useState('');

  const nodes = useMemo(() => layoutNodes(data), [data]);
  const nodeMap = useMemo(() => new Map(nodes.map(n => [n.person.id, n])), [nodes]);

  /* SVG dimensions */
  const svgW = useMemo(() => {
    if (nodes.length === 0) return 800;
    return Math.max(...nodes.map(n => n.x + NODE_W)) + 100;
  }, [nodes]);
  const svgH = useMemo(() => {
    if (nodes.length === 0) return 600;
    return Math.max(...nodes.map(n => n.y + NODE_H)) + 100;
  }, [nodes]);

  /* ─── Center view ─── */
  const recenter = useCallback(() => {
    if (!containerRef.current) return;
    const cw = containerRef.current.clientWidth;
    const ch = containerRef.current.clientHeight;
    const newScale = Math.min(cw / svgW, ch / svgH, 1) * 0.9;
    setScale(newScale);
    setTranslate({
      x: (cw - svgW * newScale) / 2,
      y: (ch - svgH * newScale) / 2,
    });
  }, [svgW, svgH]);

  useEffect(() => { recenter(); }, [recenter]);

  /* ─── Search highlight ─── */
  const matchedId = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    const found = data.people.find(p =>
      p.fullName.toLowerCase().includes(q) ||
      (p.nickname && p.nickname.toLowerCase().includes(q))
    );
    return found?.id ?? null;
  }, [search, data.people]);

  /* Focus on matched node */
  useEffect(() => {
    if (!matchedId || !containerRef.current) return;
    const node = nodeMap.get(matchedId);
    if (!node) return;
    const cw = containerRef.current.clientWidth;
    const ch = containerRef.current.clientHeight;
    setTranslate({
      x: cw / 2 - (node.x + NODE_W / 2) * scale,
      y: ch / 2 - (node.y + NODE_H / 2) * scale,
    });
  }, [matchedId, nodeMap, scale]);

  /* ─── Mouse interactions ─── */
  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setDragging(true);
    setDragStart({ x: e.clientX - translate.x, y: e.clientY - translate.y });
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setTranslate({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const onMouseUp = () => setDragging(false);
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.08 : 0.08;
    setScale(s => Math.min(Math.max(s + delta, 0.2), 2));
  };

  /* ─── Connection lines ─── */
  const lines: { x1: number; y1: number; x2: number; y2: number; dashed: boolean }[] = [];
  nodes.forEach(node => {
    const p = node.person;
    /* parent-child */
    [p.fatherId, p.motherId].forEach(parentId => {
      if (!parentId) return;
      const parentNode = nodeMap.get(parentId);
      if (!parentNode) return;
      lines.push({
        x1: parentNode.x + NODE_W / 2,
        y1: parentNode.y + NODE_H,
        x2: node.x + NODE_W / 2,
        y2: node.y,
        dashed: false,
      });
    });
    /* marriage */
    (p.spouses || []).forEach(sp => {
      if (!sp.personId) return;
      const spNode = nodeMap.get(sp.personId);
      if (!spNode) return;
      /* Avoid duplicate lines */
      if (p.id > sp.personId) return;
      lines.push({
        x1: node.x + NODE_W / 2,
        y1: node.y + NODE_H / 2,
        x2: spNode.x + NODE_W / 2,
        y2: spNode.y + NODE_H / 2,
        dashed: true,
      });
    });
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar na árvore..." />
        <div className={styles.controls}>
          <button className={styles.btn} onClick={() => setScale(s => Math.min(s + 0.15, 2))} aria-label="Zoom in">+</button>
          <button className={styles.btn} onClick={() => setScale(s => Math.max(s - 0.15, 0.2))} aria-label="Zoom out">&minus;</button>
          <button className={styles.btn} onClick={recenter} aria-label="Recentrar">&#8982;</button>
        </div>
      </div>

      <div
        ref={containerRef}
        className={styles.canvas}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onWheel={onWheel}
      >
        <div
          className={styles.transform}
          style={{
            transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
          }}
        >
          <svg className={styles.svg} width={svgW} height={svgH} aria-hidden="true">
            {lines.map((l, i) => (
              <line
                key={i}
                x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
                stroke="rgba(200,169,90,0.35)"
                strokeWidth={1.5}
                strokeDasharray={l.dashed ? '6,4' : undefined}
              />
            ))}
          </svg>

          {nodes.map(node => {
            const p = node.person;
            const isMatch = matchedId === p.id;
            const hasPhoto = p.photos && p.photos.length > 0;

            return (
              <button
                key={p.id}
                className={`${styles.node} ${isMatch ? styles.highlight : ''}`}
                style={{ left: node.x, top: node.y, width: NODE_W, height: NODE_H }}
                onClick={() => setSelected(p)}
                aria-label={`Ver ${p.fullName}`}
              >
                <div className={styles.medallion}>
                  {hasPhoto ? (
                    <img src={p.photos![0]} alt="" className={styles.nodePhoto} />
                  ) : (
                    <span className={styles.nodeInitials}>{getInitials(p.fullName)}</span>
                  )}
                </div>
                <span className={styles.nodeName}>{p.nickname || p.fullName.split(' ')[0]}</span>
                {p.birth?.date && (
                  <span className={styles.nodeDate}>{p.birth.date}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selected && (
        <TreeDrawer person={selected} data={data} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
