# Família Cipriano — Museu Digital

Árvore genealógica interativa e museu digital da Família Cipriano.
Projeto 100% estático, sem backend, sem APIs, gratuito no Vercel.

---

## Tecnologias

- **Next.js 14** (App Router, static export)
- **TypeScript**
- **CSS Modules** + CSS Custom Properties
- **SVG** para visualização da árvore genealógica

---

## Como Rodar Localmente

```bash
# 1. Instalar dependências
npm install

# 2. Gerar dados a partir do intake (opcional, JSON já incluso)
npm run build:data

# 3. Rodar em desenvolvimento
npm run dev
# Abrir http://localhost:3000

# 4. Build de produção
npm run build
```

---

## Estrutura do Projeto

```
familia-cipriano/
├── public/
│   ├── brasao/
│   │   └── brasao-cipriano.svg       # Brasão da família
│   └── photos/
│       ├── people/{personId}/         # Fotos por pessoa
│       │   ├── profile.jpg            # Foto principal
│       │   ├── 01.jpg, 02.jpg...      # Galeria
│       ├── events/{eventId}/          # Fotos de eventos
│       ├── documents/{docId}/         # Documentos digitalizados
│       └── placeholder/              # Placeholders
├── scripts/
│   └── build-family-data.mjs         # Conversor intake → JSON
├── src/
│   ├── app/                          # Páginas Next.js
│   │   ├── page.tsx                  # Home
│   │   ├── arvore/page.tsx           # Árvore interativa
│   │   ├── pessoa/[id]/page.tsx      # Perfil de membro
│   │   ├── linha-do-tempo/page.tsx   # Timeline
│   │   └── ramos/page.tsx            # Ramos familiares
│   ├── components/                   # Componentes React
│   ├── data/
│   │   ├── intake/
│   │   │   ├── cipriano.intake.template.md  # Template vazio
│   │   │   └── cipriano.intake.md           # Dados preenchidos
│   │   └── cipriano.family.json     # JSON gerado (dados do site)
│   ├── lib/
│   │   ├── types.ts                 # TypeScript types
│   │   └── data.ts                  # Helpers de dados
│   └── theme/
│       ├── coatOfArmsPalette.ts     # Paleta heráldica
│       └── theme.css                # Tema CSS global
├── next.config.js                   # Config Next.js (static export)
├── package.json
└── README.md
```

---

## Workflow de Coleta de Dados

### 1. Coletar dados e fotos
- Usar WhatsApp, Google Drive, e-mail
- Pedir: nome completo, apelido, datas, local, pais, cônjuge, filhos
- Coletar fotos (formato JPG preferido)

### 2. Triagem
- Organizar fotos por pessoa/evento
- Anotar fontes (certidão, relato oral, foto, documento)

### 3. Renomear e Organizar Arquivos
```
# Criar pasta da pessoa
mkdir -p public/photos/people/cipriano_nome_sobrenome_1950/

# Renomear foto principal
cp foto.jpg public/photos/people/cipriano_nome_sobrenome_1950/profile.jpg

# Demais fotos em ordem
cp foto2.jpg public/photos/people/cipriano_nome_sobrenome_1950/01.jpg
cp foto3.jpg public/photos/people/cipriano_nome_sobrenome_1950/02.jpg
```

**Regras de nomeação:**
- Sem espaços, sem acentos, tudo minúsculo
- Preferir `.jpg`
- Formato do personId: `cipriano_{primeiroNome}_{ultimoNome}_{yyyy}`
- Se ano desconhecido: usar `0000`

### 4. Preencher o Intake
Edite `src/data/intake/cipriano.intake.md` adicionando blocos [PESSOA] e [EVENTO].

### 5. Gerar o JSON
```bash
npm run build:data
```
O script:
- Valida IDs duplicados
- Alerta referências quebradas
- Detecta inconsistências de idade
- Auto-detecta fotos em `public/photos/people/{id}/`

### 6. Build + Deploy
```bash
npm run build   # Gera site estático em /out
```

---

## Deploy no Vercel (Grátis)

### Opção A: Via GitHub
1. Crie um repositório no GitHub
2. Push o projeto:
   ```bash
   git init
   git add .
   git commit -m "Museu Digital - Família Cipriano"
   git remote add origin https://github.com/SEU_USER/familia-cipriano.git
   git push -u origin main
   ```
3. Acesse [vercel.com](https://vercel.com) e importe o repositório
4. Framework: Next.js (auto-detectado)
5. Build Command: `npm run build`
6. Output Directory: `out`
7. Deploy!

### Opção B: Via CLI
```bash
npm i -g vercel
vercel          # Seguir instruções
vercel --prod   # Deploy de produção
```

---

## Como Adicionar uma Pessoa

1. Abra `src/data/intake/cipriano.intake.md`
2. Copie um bloco `[PESSOA]` existente
3. Preencha todos os campos
4. Adicione fotos em `public/photos/people/{id}/`
5. Execute `npm run build:data`
6. Verifique no `npm run dev`
7. Commit e deploy

## Como Trocar o Brasão

1. Substitua `public/brasao/brasao-cipriano.svg` (ou `.png`)
2. Se usar PNG, atualize a extensão em `src/components/CoatOfArms.tsx`
3. Rebuild

---

## Guia de Curadoria Genealógica

### Padronização de Nomes
- Use o nome completo conforme documento oficial
- Apelidos no campo específico (não no nome)
- Para mulheres casadas: nome de solteira + sobrenome do cônjuge

### Datas Aproximadas
- `~1920` → aproximadamente 1920
- `1920?` → data incerta
- `~1920-06` → aproximadamente junho de 1920
- Sempre preservar o marcador de aproximação

### Fontes e Proveniência
Sempre registrar a fonte, mesmo que seja "relato oral":
- `Certidão de nascimento` → documento oficial
- `Relato oral de [nome]` → testemunho
- `Foto de família` → evidência visual
- `Registro paroquial` → documento religioso
- `Jornal [nome], [data]` → publicação

### Consistência
- Ao adicionar uma pessoa, verifique se pai/mãe já existem
- Mantenha os IDs dos cônjuges simétricos (ambos se referenciam)
- Filhos devem constar tanto no campo "Filhos" dos pais quanto no "Pai/Mãe" do filho
- Use o script de validação para detectar inconsistências

### Fotos
- Resolução mínima sugerida: 800x800px para perfil
- Recortar rostos de fotos de grupo como perfil
- Preservar fotos originais em resolução completa
- Documentos: escanear em 300 DPI mínimo

### Privacidade
- Pessoas vivas: pedir consentimento antes de publicar
- Dados sensíveis: avaliar se devem ser públicos
- Considerar versão pública vs. versão familiar

---

## Páginas do Site

| Rota | Descrição |
|------|-----------|
| `/` | Home com brasão, estatísticas e membros em destaque |
| `/arvore/` | Árvore genealógica interativa (zoom, pan, busca) |
| `/pessoa/{id}/` | Perfil completo com galeria, bio e relações |
| `/linha-do-tempo/` | Cronologia com filtros por tipo |
| `/ramos/` | Ramos familiares agrupados por ancestral raiz |

---

## Licença

Projeto privado da Família Cipriano. Uso pessoal e familiar.
