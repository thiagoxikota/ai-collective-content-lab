#!/usr/bin/env bash
# Setup do AI Collective Content Lab. Idempotente: pode rodar de novo sem medo.
set -e

cd "$(dirname "$0")/.."

bold=$(printf '\033[1m'); green=$(printf '\033[1;32m'); yellow=$(printf '\033[1;33m')
red=$(printf '\033[1;31m'); reset=$(printf '\033[0m'); line="------------------------------------------------------------"

echo ""
echo "${bold}AI Collective Content Lab  .  setup${reset}"
echo "$line"

# 1. Node
if ! command -v node >/dev/null 2>&1; then
  echo "${red}Node nao encontrado.${reset}"
  echo "Instale o Node 18+ em https://nodejs.org e rode este setup de novo."
  exit 1
fi
NODE_MAJOR=$(node -p "process.versions.node.split('.')[0]")
if [ "$NODE_MAJOR" -lt 18 ]; then
  echo "${red}Node $(node -v) e antigo.${reset}  Precisa de Node 18 ou mais novo."
  exit 1
fi
echo "${green}OK${reset}  Node $(node -v)"

# 2. Dependencias
echo ""
echo "Instalando dependencias (pode levar 1 a 3 minutos)..."
npm install --no-audit --no-fund
echo "${green}OK${reset}  dependencias instaladas"

# 3. .env
echo ""
if [ -f .env ]; then
  echo "${green}OK${reset}  .env ja existe (nao foi sobrescrito)"
else
  cp .env.example .env
  echo "${green}OK${reset}  .env criado a partir de .env.example"
fi

# 4. Navegador do Remotion (para renderizar video)
echo ""
echo "Preparando o navegador de render do Remotion..."
npx remotion browser ensure || echo "${yellow}aviso${reset}  baixa sozinho no primeiro render se faltar"

# 5. Proximo passo
echo ""
echo "$line"
echo "${bold}Tudo pronto.${reset}  Jeito mais facil (sem codigo, sem chave):"
echo ""
echo "   ${bold}npm run ui${reset}"
echo ""
echo "Abre o editor no navegador: solte uma foto, escreva a manchete, baixe o PNG."
echo ""
echo "Prefere o Claude Code? Abra a pasta e diga: ${bold}\"cria um post sobre o evento\"${reset}"
echo "Posts nao precisam de chave. O PNG sai em ${bold}out/${reset}."
echo ""
echo "${bold}Opcional${reset} (so para gerar a imagem de fundo com IA):"
echo "   1. Pegue uma chave gratis:  ${bold}https://fal.ai/dashboard/keys${reset}"
echo "   2. Cole no arquivo ${bold}.env${reset} depois de ${bold}FAL_KEY=${reset}"
echo "$line"
echo ""
