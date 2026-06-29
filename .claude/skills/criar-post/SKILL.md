---
name: criar-post
description: >-
  Monta um post do Instagram (imagem de fundo + overlay editorial na identidade
  visual do The AI Collective) e renderiza um PNG 1080x1350 em out/. Use quando
  a pessoa disser "cria um post", "monta um post", "faz um post pro instagram",
  "arte do post", "post de divulgacao", "post de anuncio do evento", "capa do
  carrossel", "make a post", "create an instagram post", "post cover".
---

# Criar post (imagem de fundo + overlay do AI Collective)

Pega uma imagem principal e coloca por cima o overlay editorial do The AI
Collective (barra de topo, chip da conta com o "C", manchete em serifa com uma
palavra em laranja, subtitulo com seta). Sai um PNG pronto pra postar.

## A coisa mais importante
Posts NAO precisam de chave de API. O render e 100% local. A `FAL_KEY` so entra
se voce for GERAR a imagem de fundo com IA (skill `gerar-imagem`). Tem uma foto?
Ja da pra fazer o post agora.

## Quando usar
A pessoa quer a arte de um post / capa de carrossel. Gatilhos: "cria um post de
divulgacao", "monta a arte do evento", "make an instagram post".

## Passo a passo
1. Escolha a imagem de fundo (hero). Tem foto? Use ela. O estilo da marca e foto de GENTE (bastidor, evento, pessoas), nao logo solto. Sem foto? Gere uma com a skill `gerar-imagem`.
2. Escreva a manchete. Regra de ouro do AI Collective: lidere com a coisa mais ambiciosa E verdadeira, nunca a burocratica ("Floripa entrou no mapa de uma das maiores comunidades de IA do mundo", nao "Floripa agora tem um chapter"). Curta, cabe em ~4 linhas.
3. Escolha 1 palavra ou frase pro destaque laranja (o `--accent`).
4. Escreva 1 linha de subtitulo de apoio.
5. Rode o comando. Sai um PNG em `out/`.
6. Mostre o PNG. Antes de postar a legenda (caption), rode pela skill `humanizer` (regra do repo do chapter). Numeros: use o piso publicado (70k+), nunca o teto.

## Comando exato
```bash
node scripts/render-post.mjs \
  --hero assets/samples/floripa-night.png \
  --headline "O que acontece quando 80 pessoas de IA entram na mesma" \
  --accent "sala?" \
  --subtitle "Primeiro encontro do chapter. Vem." \
  --carousel
```
Opcoes uteis:
`--hero` foto de fundo (caminho, ou URL, ou uma imagem de `assets/generated/`).
`--edition "Junho 2026"` rotulo no canto superior direito.
`--page "01"` numero de pagina (pra carrossel), em vez de `--carousel`.
`--handle "@aicollectivefloripa"` e `--kicker "AI Collective Florianopolis"`.
`--color "#FF630D"` troca a cor de destaque (padrao = laranja da marca).
`--darken 0.2` escurece a foto (texto legivel em foto clara).
`--focusx 0.5 --focusy 0.3 --zoom 1.2` enquadra a foto (0..1, e zoom >= 1).

## Slide de conteudo (carrossel)
Para um slide de conteudo (titulo menor + corpo de texto), use `--content` e `--body`:
```bash
node scripts/render-post.mjs --hero <foto> --content \
  --headline "O que vai rolar no encontro" \
  --body "Lightning talks, demos ao vivo e muito networking. Tudo de graca."
```

## Editor visual (mais facil que a CLI)
`npm run ui` abre uma pagina pra soltar a foto, arrastar pra enquadrar, escrever,
trocar capa/conteudo, e baixar o post (ou o carrossel inteiro em .zip). Sem chave.

## Exemplo real (verificado)
Saida: `out/post-...png`, 1080x1350, identidade do AI Collective (serifa branca +
"sala?" em laranja, chip com o "C", seta laranja no subtitulo).

## Observacoes
- Formato: 1080x1350 (feed retrato 4:5). Para story/reel use a skill `criar-video`.
- A fonte da manchete (e o corpo do slide de conteudo) se ajusta sozinha pra caber em QUALQUER caminho (CLI e editor): manchete longa nunca estoura pra fora da arte.
- Preview ao vivo pra ajustar texto: `npm run ui` (editor) ou `npm run studio` (Remotion).
