---
name: gerar-clip-ia
description: >-
  Gera um clip de video curto por IA (fal.ai, modelos tipo Kling/Veo) a partir
  de texto ou de uma imagem, e salva em assets/generated/ para usar dentro de um
  video Remotion. Use quando a pessoa disser "gera um clip de IA", "cria um
  video de IA de...", "anima essa imagem", "faz um video gerado por IA",
  "generate an AI clip", "ai video of...", "animate this image".
---

# Gerar clip de IA (texto/imagem para video por IA)

Cria um clip curto (cerca de 5s) com um modelo de video do fal.ai. Da para usar
sozinho ou como uma cena dentro do Remotion.

## Atencao com custo
Modelos de video custam dinheiro de verdade (Kling ~US$ 0,35 por clip de 5s).
Antes de um evento: defina um limite de gasto no painel do fal.ai, mantenha a
duracao em 5s, e evite gerar muitas vezes seguidas.

## Quando usar
A pessoa quer um video GERADO por IA (nao a montagem de imagens). Gatilhos:
"gera um clip de IA de ondas", "anima essa foto", "ai video of a robot".

## Passo a passo
1. Pegue a descricao do movimento (o que acontece na cena).
2. Texto para video: so passe o prompt. Imagem para video (animar uma foto): passe `--image`.
3. Rode o comando. Pode levar de 30s a alguns minutos.
4. Mostre o caminho do MP4. Para compor com outras imagens, use a skill `criar-video`.

## Comando exato
```bash
# texto para video
node scripts/generate-clip.mjs "ondas quebrando na praia ao por do sol, camera lenta" --duration 5

# imagem para video (anima uma imagem existente)
node scripts/generate-clip.mjs "leve movimento de camera, nuvens passando" --image assets/generated/image-xxx.png --duration 5
```

## Exemplo real
Pessoa: "anima a imagem do por do sol, com um movimento suave de camera"
```bash
node scripts/generate-clip.mjs "movimento suave de camera para frente, ondas se movendo devagar" --image assets/generated/image-por-do-sol-1782600000000.png --duration 5
```
Saida: `assets/generated/clip-movimento-suave-de-camera-1782600000000.mp4`

## Observacoes
- Precisa da `FAL_KEY` no `.env`.
- Modelos padrao (verificados em 2026-06-27): texto para video `fal-ai/kling-video/v2.5-turbo/pro/text-to-video`; imagem para video `fal-ai/kling-video/v2.5-turbo/pro/image-to-video`.
- Mais barato e descartavel: `--model fal-ai/ltx-video` (~US$ 0,02, qualidade menor).
