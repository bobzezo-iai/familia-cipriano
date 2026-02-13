# ============================================================================
# MUSEU DIGITAL - FAMÍLIA CIPRIANO
# Template de Intake de Dados Familiares
# ============================================================================
#
# INSTRUÇÕES DE USO:
# 1. Copie este arquivo e renomeie para cipriano.intake.md
# 2. Preencha os blocos [PESSOA] e [EVENTO] abaixo
# 3. Para adicionar mais pessoas/eventos, copie o bloco inteiro e cole abaixo
# 4. Execute: npm run build:data
#    O script lerá cipriano.intake.md e gerará o JSON em src/data/
#
# CONVENÇÕES:
# - IDs: cipriano_{primeiroNome}_{ultimoNome}_{anoNascimento}
#   Se ano desconhecido: 0000. Ex: cipriano_jose_cipriano_0000
# - Datas aproximadas: use ~ ou ? (ex: ~1920, 1945?, ~1945-03)
# - Referências: use o ID ou nome completo da pessoa
# - Múltiplos valores: separe com vírgula
# - Campos vazios: deixe em branco (não escreva "N/A" ou "-")
# - Fotos: caminhos a partir de /public (ex: /photos/people/id/profile.jpg)
#   Se vazio, o script auto-detecta em public/photos/people/{ID}/
# - Tags: patriarca, matriarca, fundador, pioneiro, agricultor, professor, etc.
#
# ============================================================================

---

[PESSOA]
ID sugerido:
Nome completo:
Apelido/como era conhecido:
Sexo: (M/F/Outro/Não informado)
Nascimento:  / Local:
Falecimento:  / Local:
Pai (nome ou ID):
Mãe (nome ou ID):
Cônjuges/Uniões:
Filhos:
Bio curta (3-8 linhas):

Tags:
Fotos (paths):
Fontes/Notas:

---

[EVENTO]
ID sugerido:
Título:
Data (ou aproximada):
Descrição:

Pessoas envolvidas (IDs):
Fotos (paths):
Fontes/Notas:

---
