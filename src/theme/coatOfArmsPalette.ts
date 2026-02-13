/** Paleta heráldica oficial — Família Cipriano */

export const palette = {
  /* ─── cores-base do brasão ─── */
  navy:     '#0B1020',
  gold:     '#C8A95A',
  burgundy: '#8B1E2D',
  ivory:    '#F3F1EA',
  paper:    '#F6F3EA',

  /* ─── tokens derivados ─── */
  bg:            '#0B1020',
  bgDark:        '#060A14',
  surface:       '#131B30',
  surfaceHover:  '#1A2440',
  text:          '#F3F1EA',
  mutedText:     'rgba(243,241,234,0.6)',
  border:        'rgba(200,169,90,0.20)',
  borderStrong:  'rgba(200,169,90,0.40)',
  accent:        '#C8A95A',
  accentHover:   '#D4BA72',
  accent2:       '#8B1E2D',
  accent2Hover:  '#A62B3C',
  shadow:        'rgba(0,0,0,0.35)',
  shadowLight:   'rgba(0,0,0,0.18)',
  shadowGold:    'rgba(200,169,90,0.10)',
} as const;

export type PaletteKey = keyof typeof palette;
export default palette;
