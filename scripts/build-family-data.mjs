#!/usr/bin/env node

/**
 * ═══════════════════════════════════════════════════════════════
 * FAMÍLIA CIPRIANO — Conversor de Intake para JSON
 * ═══════════════════════════════════════════════════════════════
 *
 * Lê src/data/intake/cipriano.intake.md
 * Gera src/data/cipriano.family.json
 *
 * Uso: node scripts/build-family-data.mjs
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const INTAKE_PATH = join(ROOT, 'src/data/intake/cipriano.intake.md');
const OUTPUT_PATH = join(ROOT, 'src/data/cipriano.family.json');
const PHOTOS_DIR = join(ROOT, 'public/photos/people');

/* ─── Colors ─── */
const C = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
};

function log(msg) { console.log(msg); }
function ok(msg) { log(`${C.green}✓${C.reset} ${msg}`); }
function warn(msg) { log(`${C.yellow}⚠${C.reset} ${msg}`); }
function err(msg) { log(`${C.red}✗${C.reset} ${msg}`); }

/* ─── Known field labels (to avoid capturing next field as value) ─── */
const KNOWN_LABELS = [
  'ID sugerido', 'Nome completo', 'Apelido/como era conhecido', 'Sexo',
  'Nascimento', 'Falecimento', 'Pai \\(nome ou ID\\)', 'Mãe \\(nome ou ID\\)',
  'Cônjuges/Uniões', 'Filhos', 'Bio curta', 'Bio curta \\(3-8 linhas\\)',
  'Tags', 'Fotos \\(paths\\)', 'Fontes/Notas',
  'Título', 'Data \\(ou aproximada\\)', 'Descrição',
  'Pessoas envolvidas \\(IDs\\)',
];

function isFieldLabel(str) {
  return KNOWN_LABELS.some(label => {
    const re = new RegExp(`^${label}:`, 'i');
    return re.test(str.trim());
  });
}

/* ─── Parse helpers ─── */
function extractField(block, fieldName) {
  const regex = new RegExp(`^${fieldName}:\\s*(.*)$`, 'mi');
  const match = block.match(regex);
  if (!match) return '';
  const value = match[1].trim();
  // If the captured value looks like another field label, it's actually empty
  if (isFieldLabel(value)) return '';
  return value;
}

function extractMultilineField(block, fieldName) {
  const regex = new RegExp(`^${fieldName}:\\s*\\n([\\s\\S]*?)(?=^[A-ZÀ-Ú][a-zà-ú].*:|^---|\$)`, 'mi');
  const match = block.match(regex);
  if (match) return match[1].trim();
  // Fallback: single-line after the label
  const singleLine = new RegExp(`^${fieldName}:\\s*\\n(.+)`, 'mi');
  const m2 = block.match(singleLine);
  if (m2 && !isFieldLabel(m2[1])) return m2[1].trim();
  return extractField(block, fieldName);
}

function splitList(str) {
  if (!str) return [];
  return str.split(',').map(s => s.trim()).filter(Boolean);
}

function parseDate(dateStr) {
  if (!dateStr) return 0;
  const clean = dateStr.replace(/[~?]/g, '').trim();
  const match = clean.match(/(\d{4})/);
  return match ? parseInt(match[1]) : 0;
}

/* ─── Parse PESSOA block ─── */
function parsePerson(block) {
  const id = extractField(block, 'ID sugerido');
  const fullName = extractField(block, 'Nome completo');
  const nickname = extractField(block, 'Apelido/como era conhecido');
  const sex = extractField(block, 'Sexo') || 'Não informado';

  // Birth
  const birthLine = extractField(block, 'Nascimento');
  let birthDate = '', birthPlace = '';
  if (birthLine) {
    const parts = birthLine.split('/').map(s => s.replace(/Local:/i, '').trim());
    birthDate = parts[0] || '';
    birthPlace = parts[1] || '';
  }

  // Death
  const deathLine = extractField(block, 'Falecimento');
  let deathDate = '', deathPlace = '';
  if (deathLine) {
    const parts = deathLine.split('/').map(s => s.replace(/Local:/i, '').trim());
    deathDate = parts[0] || '';
    deathPlace = parts[1] || '';
  }

  const fatherId = extractField(block, 'Pai \\(nome ou ID\\)');
  const motherId = extractField(block, 'Mãe \\(nome ou ID\\)');

  // Spouses
  const spouseLine = extractField(block, 'Cônjuges/Uniões');
  const spouses = [];
  if (spouseLine) {
    const parts = spouseLine.split(',').map(s => s.trim()).filter(Boolean);
    // Format: personId, type, year (groups of 3) or just personId
    if (parts.length >= 3 && !parts[1].includes('_')) {
      for (let i = 0; i < parts.length; i += 3) {
        spouses.push({
          personId: parts[i] || undefined,
          type: parts[i + 1] || undefined,
          year: parts[i + 2] || undefined,
        });
      }
    } else {
      parts.forEach(p => spouses.push({ personId: p }));
    }
  }

  const childrenIds = splitList(extractField(block, 'Filhos'));
  const bio = extractMultilineField(block, 'Bio curta \\(3-8 linhas\\)') ||
              extractMultilineField(block, 'Bio curta');
  const tags = splitList(extractField(block, 'Tags'));
  const photoLine = extractField(block, 'Fotos \\(paths\\)');
  const photos = photoLine ? splitList(photoLine) : [];
  const sourceLine = extractField(block, 'Fontes/Notas');
  const sources = sourceLine ? sourceLine.split('.').map(s => s.trim()).filter(s => s.length > 2) : [];

  const person = { id, fullName };
  if (nickname) person.nickname = nickname;
  person.sex = sex;
  if (birthDate || birthPlace) person.birth = {};
  if (birthDate) person.birth.date = birthDate;
  if (birthPlace) person.birth.place = birthPlace;
  if (deathDate || deathPlace) person.death = {};
  if (deathDate) person.death.date = deathDate;
  if (deathPlace) person.death.place = deathPlace;
  if (fatherId) person.fatherId = fatherId;
  if (motherId) person.motherId = motherId;
  if (spouses.length > 0) person.spouses = spouses;
  if (childrenIds.length > 0) person.childrenIds = childrenIds;
  if (bio) person.bio = bio;
  if (tags.length > 0) person.tags = tags;
  person.photos = photos;
  if (sources.length > 0) person.sources = sources;

  return person;
}

/* ─── Parse EVENTO block ─── */
function parseEvent(block) {
  const id = extractField(block, 'ID sugerido');
  const title = extractField(block, 'Título');
  const date = extractField(block, 'Data \\(ou aproximada\\)');
  const description = extractMultilineField(block, 'Descrição');
  const personIds = splitList(extractField(block, 'Pessoas envolvidas \\(IDs\\)'));
  const photoLine = extractField(block, 'Fotos \\(paths\\)');
  const photos = photoLine ? splitList(photoLine) : [];
  const sourceLine = extractField(block, 'Fontes/Notas');
  const sources = sourceLine ? sourceLine.split('.').map(s => s.trim()).filter(s => s.length > 2) : [];

  const event = { id, title };
  if (date) event.date = date;
  if (description) event.description = description;
  if (personIds.length > 0) event.personIds = personIds;
  event.photos = photos;
  if (sources.length > 0) event.sources = sources;

  return event;
}

/* ─── Auto-detect photos ─── */
function autoDetectPhotos(person) {
  if (person.photos && person.photos.length > 0) return;

  const personDir = join(PHOTOS_DIR, person.id);
  if (!existsSync(personDir)) return;

  try {
    const files = readdirSync(personDir)
      .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
      .sort((a, b) => {
        if (a === 'profile.jpg') return -1;
        if (b === 'profile.jpg') return 1;
        return a.localeCompare(b);
      });

    person.photos = files.map(f => `/photos/people/${person.id}/${f}`);
    if (files.length > 0) ok(`  Auto-detectou ${files.length} foto(s) para ${person.id}`);
  } catch { /* ignore */ }
}

/* ─── Build relationships ─── */
function buildRelationships(people) {
  const rels = [];
  const added = new Set();

  people.forEach(p => {
    // Parent-child
    if (p.fatherId) {
      const key = `pc:${p.fatherId}->${p.id}`;
      if (!added.has(key)) {
        rels.push({ type: 'parent-child', from: p.fatherId, to: p.id });
        added.add(key);
      }
    }
    if (p.motherId) {
      const key = `pc:${p.motherId}->${p.id}`;
      if (!added.has(key)) {
        rels.push({ type: 'parent-child', from: p.motherId, to: p.id });
        added.add(key);
      }
    }

    // Marriage
    (p.spouses || []).forEach(sp => {
      if (!sp.personId) return;
      const pair = [p.id, sp.personId].sort().join('<>');
      const key = `m:${pair}`;
      if (!added.has(key)) {
        rels.push({
          type: 'marriage',
          from: p.id,
          to: sp.personId,
          year: sp.year || undefined,
          unionType: sp.type || undefined,
        });
        added.add(key);
      }
    });
  });

  return rels;
}

/* ─── Validation ─── */
function validate(people, events) {
  const warnings = [];
  const errors = [];
  const ids = new Set();

  // Check duplicate IDs
  people.forEach(p => {
    if (ids.has(p.id)) errors.push(`ID duplicado: ${p.id}`);
    ids.add(p.id);
  });
  events.forEach(e => {
    if (ids.has(e.id)) errors.push(`ID duplicado (evento): ${e.id}`);
    ids.add(e.id);
  });

  // Check broken references
  people.forEach(p => {
    if (p.fatherId && !ids.has(p.fatherId)) warnings.push(`${p.id}: pai "${p.fatherId}" não encontrado`);
    if (p.motherId && !ids.has(p.motherId)) warnings.push(`${p.id}: mãe "${p.motherId}" não encontrada`);
    (p.spouses || []).forEach(sp => {
      if (sp.personId && !ids.has(sp.personId)) warnings.push(`${p.id}: cônjuge "${sp.personId}" não encontrado`);
    });
    (p.childrenIds || []).forEach(cid => {
      if (!ids.has(cid)) warnings.push(`${p.id}: filho "${cid}" não encontrado`);
    });
  });
  events.forEach(e => {
    (e.personIds || []).forEach(pid => {
      if (!ids.has(pid)) warnings.push(`Evento ${e.id}: pessoa "${pid}" não encontrada`);
    });
  });

  // Check age consistency
  const personById = new Map(people.map(p => [p.id, p]));
  people.forEach(p => {
    const childYear = parseDate(p.birth?.date);
    if (!childYear) return;

    [p.fatherId, p.motherId].forEach(parentId => {
      if (!parentId) return;
      const parent = personById.get(parentId);
      if (!parent) return;
      const parentYear = parseDate(parent.birth?.date);
      if (!parentYear) return;
      if (parentYear >= childYear) {
        warnings.push(`${p.id}: pai/mãe ${parentId} (nasc. ${parentYear}) mais novo que filho (nasc. ${childYear})`);
      }
      if (childYear - parentYear < 12) {
        warnings.push(`${p.id}: diferença de idade com ${parentId} menor que 12 anos`);
      }
    });
  });

  return { warnings, errors };
}

/* ─── Main ─── */
function main() {
  log(`\n${C.bold}${C.cyan}═══ Família Cipriano — Build Family Data ═══${C.reset}\n`);

  // Read intake
  if (!existsSync(INTAKE_PATH)) {
    err(`Arquivo não encontrado: ${INTAKE_PATH}`);
    err('Copie o template e preencha: cipriano.intake.template.md → cipriano.intake.md');
    process.exit(1);
  }

  const raw = readFileSync(INTAKE_PATH, 'utf-8');
  log(`${C.dim}Lendo: ${INTAKE_PATH}${C.reset}`);

  // Split into blocks
  const personBlocks = [];
  const eventBlocks = [];

  const blocks = raw.split(/^---$/m).map(b => b.trim()).filter(Boolean);

  blocks.forEach(block => {
    if (block.includes('[PESSOA]')) personBlocks.push(block);
    else if (block.includes('[EVENTO]')) eventBlocks.push(block);
  });

  log(`${C.dim}Encontrou ${personBlocks.length} pessoa(s) e ${eventBlocks.length} evento(s)${C.reset}\n`);

  // Parse
  const people = personBlocks.map(parsePerson).filter(p => p.id && p.fullName);
  const events = eventBlocks.map(parseEvent).filter(e => e.id && e.title);

  // Auto-detect photos
  log(`${C.bold}Detectando fotos...${C.reset}`);
  people.forEach(autoDetectPhotos);

  // Build relationships
  const relationships = buildRelationships(people);

  // Validate
  log(`\n${C.bold}Validando...${C.reset}`);
  const { warnings, errors } = validate(people, events);

  errors.forEach(e => err(e));
  warnings.forEach(w => warn(w));

  if (errors.length > 0) {
    err(`\n${errors.length} erro(s) encontrado(s). Corrija antes de continuar.`);
    process.exit(1);
  }

  // Build output
  const output = {
    people,
    relationships,
    historicalEvents: events,
    metadata: {
      familyName: 'Cipriano',
      generatedAt: new Date().toISOString(),
      version: '1.0.0',
    },
  };

  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf-8');

  // Summary
  log(`\n${C.bold}${C.green}═══ Resumo ═══${C.reset}`);
  ok(`${people.length} pessoas`);
  ok(`${relationships.length} relações`);
  ok(`${events.length} eventos históricos`);
  if (warnings.length > 0) warn(`${warnings.length} aviso(s)`);
  ok(`JSON gerado: ${OUTPUT_PATH}`);
  log('');
}

main();
