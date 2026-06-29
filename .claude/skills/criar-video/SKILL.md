---
name: criar-video
description: >-
  Monta um video curto (reel ou slideshow) com Remotion a partir das imagens em
  assets/generated/ (ou das amostras) mais legendas na tela, e renderiza um MP4
  em out/. Use quando a pessoa disser "monta um video", "cria um reel", "faz um
  reel com essas imagens", "transforma em video", "gera um slideshow",
  "make a video", "create a reel", "render a video with these images".
---

# Criar video (imagens + texto para MP4)

Junta as imagens geradas em um video vertical com Ken Burns, transicoes e legendas.

## Quando usar
A pessoa quer um video a partir das imagens. Gatilhos: "monta um reel",
"faz um video com essas imagens", "cria um slideshow", "render a video".

## Passo a passo
1. Confirme que existem imagens em `assets/generated/`. Se nao houver, gere antes com a skill `gerar-imagem` (ou use as amostras de `assets/samples/`, que ja funcionam).
2. Escolha o formato (`Reel` com movimento, ou `Slideshow` mais calmo) e a orientacao (vertical e o padrao).
3. Junte as legendas, uma por imagem, separadas por barra `|`.
4. Rode o comando. O render leva de alguns segundos a ~1 minuto.
5. Mostre o caminho do MP4 em `out/`. Para conferir antes de renderizar, sugira `npm run studio` (preview ao vivo).

## Comando exato
```bash
node scripts/render-video.mjs --comp Reel --orientation vertical --seconds 3 \
  --captions "Legenda 1|Legenda 2|Legenda 3" --title "Titulo de abertura"
```
Sem `--images`, ele usa todas as imagens de `assets/generated/` (ou as amostras).
Para escolher imagens: `--images "generated/img-a.png,generated/img-b.png"`.
Da pra misturar clips de IA (mp4) com fotos: `--images "generated/clip-x.mp4,samples/floripa-night.png"`.
Orientacao: `--orientation vertical | horizontal | square`.
Composicao: `--comp Reel | Slideshow`.
`--brand "Seu Chapter"` troca a etiqueta de marca no canto (padrao = o chapter do `brand.config.mjs`).
`--accent "#FF630D"` troca a cor de destaque (padrao = laranja da marca).
`--seconds 3` segundos por imagem (1 a 15; valores fora disso sao ajustados).

## Exemplo real
Pessoa: "monta um reel vertical com as imagens que a gente gerou, legenda 'Floripa no mapa'"
```bash
node scripts/render-video.mjs --comp Reel --orientation vertical --seconds 3 \
  --captions "Floripa no mapa|Comunidade de IA|AI Collective" --title "AI Collective Floripa"
```
Saida: `out/reel-1782600000000.mp4`

## Observacoes
- Nao precisa de chave de API. Render e 100% local (Remotion usa o proprio navegador headless).
- Preview ao vivo para ajustar antes de renderizar: `npm run studio`.
- Em maquina com pouca RAM (ex: 8 GB), se travar, adicione `--concurrency 2`.
