---
name: gerar-imagem
description: >-
  Gera uma imagem a partir de texto usando fal.ai (Flux) e salva em
  assets/generated/. Use quando a pessoa disser "gera uma imagem de...",
  "cria uma imagem", "faz uma arte de...", "quero uma foto de...",
  "generate an image", "create an image of...", "make a picture of...".
---

# Gerar imagem (texto para imagem)

Transforma um prompt de texto numa imagem PNG/JPG salva em `assets/generated/`.

## Quando usar
A pessoa quer uma imagem a partir de uma descricao. Exemplos de gatilho:
"gera uma imagem de um por do sol em Floripa", "cria um logo minimalista",
"faz um banner", "generate an image of a robot mascot".

## Passo a passo
1. Pegue a descricao da pessoa. Se estiver vaga, melhore com a skill `prompt-de-imagem` antes.
2. Escolha o formato: vertical (padrao, bom para reel), horizontal ou square.
3. Rode o comando abaixo com o prompt.
4. Leia o caminho impresso e mostre para a pessoa. Diga que da para usar num video depois.

## Comando exato
```bash
node scripts/generate-image.mjs "PROMPT AQUI" --aspect vertical
```
Formatos: `--aspect vertical` (1080x1920) | `--aspect horizontal` (1920x1080) | `--aspect square` (1080x1080).
Modelo melhor (mais lento e mais caro): adicione `--model fal-ai/flux/dev`.

## Exemplo real
Pessoa: "gera uma imagem de um por do sol em Floripa, estilo fotografico"
```bash
node scripts/generate-image.mjs "por do sol sobre o mar em Florianopolis, morros ao fundo, luz dourada, fotografico, alta qualidade" --aspect vertical
```
Saida: `assets/generated/image-por-do-sol-sobre-o-mar-em-florianop-1782600000000.png`

## Observacoes
- Precisa da `FAL_KEY` no arquivo `.env`. Sem chave, o script avisa o que fazer.
- Modelo padrao: `fal-ai/flux/schnell` (rapido e barato, ~US$ 0,003 por imagem). Verificado em 2026-06-27.
- A imagem fica em `assets/generated/` e ja serve de entrada para a skill `criar-video`.
