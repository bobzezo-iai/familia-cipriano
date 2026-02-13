# CLAUDE.md — Família Cipriano · Museu Digital

## Sobre o Projeto
Árvore genealógica interativa e museu digital da Família Cipriano.
100% estático, sem backend, sem APIs, deploy gratuito no Vercel.

## Stack
- **Next.js 14** (App Router, `output: "export"`)
- **TypeScript**
- **CSS Modules** + CSS Custom Properties (sem Tailwind)
- **SVG** para visualização da árvore genealógica

## Comandos
```bash
npm run dev          # Servidor de desenvolvimento (localhost:3000)
npm run build:data   # Gera JSON a partir do intake .md
npm run build        # build:data + next build (gera /out estático)
```

## Estrutura Importante
```
src/data/cipriano.family.json          # Dados da família (fonte de verdade do site)
src/data/intake/cipriano.intake.md     # Intake legível/editável (gera o JSON)
src/data/intake/cipriano.intake.template.md  # Template vazio para copiar
scripts/build-family-data.mjs          # Conversor intake → JSON
src/lib/types.ts                       # Types: Person, Relationship, HistoricalEvent, FamilyData
src/lib/data.ts                        # Helpers de acesso aos dados
src/theme/coatOfArmsPalette.ts         # Paleta heráldica
src/theme/theme.css                    # CSS variables e classes globais
```

## Paleta de Cores (obrigatória)
- navy: `#0B1020` (fundo)
- gold: `#C8A95A` (destaque/accent)
- burgundy: `#8B1E2D` (accent2)
- ivory: `#F3F1EA` (texto)
- paper: `#F6F3EA`
- Usar via CSS custom properties: `var(--color-navy)`, `var(--color-gold)`, etc.

## Convenções de Código
- Componentes: CSS Modules (`.module.css`), nunca inline styles extensivos
- Componentes interativos: marcar com `'use client'`
- Fontes: Cormorant Garamond (display/títulos) + Inter (body)
- Sem emojis em código/comentários

## Convenções de Dados
- **personId**: `cipriano_{primeiroNome}_{ultimoNome}_{yyyy}` (ano 0000 se desconhecido)
- **eventId**: `evento_{slug}_{yyyy}`
- Fotos: `public/photos/people/{personId}/profile.jpg`, `01.jpg`, `02.jpg`...
- Sem espaços, sem acentos nos nomes de arquivo, tudo minúsculo
- Datas aproximadas: preservar `~` e `?` como string
- Sempre registrar fonte (mesmo "relato oral")

## Páginas
| Rota | Arquivo | Descrição |
|------|---------|-----------|
| `/` | `src/app/page.tsx` | Home hero + destaque |
| `/arvore/` | `src/app/arvore/page.tsx` | Árvore interativa |
| `/pessoa/[id]/` | `src/app/pessoa/[id]/page.tsx` | Perfil completo |
| `/linha-do-tempo/` | `src/app/linha-do-tempo/page.tsx` | Timeline filtrada |
| `/ramos/` | `src/app/ramos/page.tsx` | Ramos por ancestral |

## Workflow de Adição de Dados
1. Adicionar fotos em `public/photos/people/{personId}/`
2. Editar `src/data/cipriano.family.json` (ou o intake.md + rodar build:data)
3. `npm run build` para validar
4. Testar com `npm run dev`

## Família Cipriano — Estrutura Real
- **Patriarca**: José Antônio Cipriano + Maria Eduarda da Silva
- **7 filhos**: Hélio, José, Rose, Maria, Kátia, Ozana, Marilu
- **Netos documentados**: ramo do Hélio (5 filhos com Elizabeth Meyer) + Carlos (filho do José)
- José Augusto Meyer Cipriano: falecido (in memoriam)
- Sobrenomes de casamento: Mueller (Rose), Metzner (Kátia), Boaventura (Marilu)
