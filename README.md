# AI Collective Content Lab

**English:** see the [English version](#english-short-version) below.

Um jeito simples de **criar conteudo com IA**: voce joga uma foto, escreve uma
frase, e sai uma arte de post, carrossel ou reel com a identidade do **The AI
Collective**. De graca e sem programar.

Quer ir alem? Da pra GERAR a imagem de fundo (ou um clipe) por IA, e da pra deixar
tudo com a SUA marca editando um arquivo so (veja "Como trocar de marca" abaixo).

Feito para os chapters do The AI Collective (comecou no de Florianopolis), pra
plateia mista, quem nao programa inclusa.

---

## Comece em 3 passos (sem chave, sem codigo)

```bash
./scripts/setup.sh   # 1. instala tudo (so na primeira vez)
npm run ui           # 2. abre o editor no navegador
```

**3.** Solte uma foto, escreva a manchete, clique em **Baixar**.

Pronto: um PNG 1080x1350 com a cara do The AI Collective. Posts nao precisam de
chave de API nenhuma (o render e local, na sua maquina).

No editor voce ainda pode:
- Arrastar a foto na previa pra enquadrar (ou usar os sliders de posicao e zoom).
- Contar com o auto-fit: a manchete encolhe sozinha pra caber, nunca estoura.
- Montar carrossel: adicione slides, alterne entre "Capa" e "Conteudo", e baixe tudo num .zip.

---

## O caminho mais rapido pelo Claude Code (post, sem chave nenhuma)

Posts nao precisam de API. O render e local. Voce so precisa de uma foto.

**1. Instale**

```bash
./scripts/setup.sh
```

**2. Abra a pasta no Claude Code e fale**

```
cria um post sobre o primeiro encontro do chapter em Floripa
```

Sai um PNG 1080x1350 em `out/`, com a cara do The AI Collective.

A chave do fal.ai (passo abaixo) so entra se voce quiser GERAR a imagem de fundo
com IA, em vez de usar uma foto sua.

---

## Quickstart completo (com geracao de imagem por IA)

**1.** `./scripts/setup.sh`

**2.** Cole sua chave do fal.ai no arquivo `.env` (gratis em https://fal.ai/dashboard/keys)

```
FAL_KEY=cole-sua-chave-aqui
```

**3.** No Claude Code:

```
gera uma imagem de pessoas numa mesa de coworking em Floripa
```
```
cria um post com essa imagem, manchete "O primeiro encontro do chapter"
```

---

## Menu de skills

Abra a pasta no Claude Code e fale em portugues normal. As skills disparam sozinhas.

| Skill | O que voce fala | O que recebe | Precisa de chave? |
| --- | --- | --- | --- |
| **criar-post** | "cria um post de divulgacao do evento" | um PNG 1080x1350 (identidade AIC) | nao |
| **gerar-imagem** | "gera uma imagem de pessoas num coworking" | um PNG em `assets/generated/` | sim (fal.ai) |
| **prompt-de-imagem** | "me ajuda a melhorar esse prompt" | um prompt pronto pra gerar | nao |
| **criar-video** | "monta um reel com essas imagens" | um MP4 em `out/` | nao |
| **gerar-clip-ia** | "gera um clip de IA de ondas na praia" | um MP4 feito por IA | sim (fal.ai) |

Sem Claude Code, da para usar pelo terminal:

```bash
npm run post -- --hero assets/samples/floripa-night.png --headline "O primeiro encontro" --accent "do chapter"
npm run image -- "pessoas num coworking em Floripa"
npm run studio                 # preview ao vivo (composicoes Post, Reel, Slideshow)
```

---

## Identidade visual do The AI Collective

Tudo isto vive num unico arquivo, **`src/brand.config.mjs`** (a fonte de verdade
que o render, o editor e a CLI leem). Os valores vem da marca real
(aicollective.com), verificado em 2026-06-28.

| Item | Valor (no `brand.config.mjs`) |
| --- | --- |
| Laranja da marca (acento) | `#FF630D` (no site, o token CSS e o quase igual `#f97316`) |
| Fundo escuro / scrim | `#0C0A09` (stone-950) |
| Tinta (texto na foto) | `#FFFFFF` |
| Secundario | `#78726D` (stone-500) |
| Manchete (serifa) | Georgia Pro (proprietaria) -> usamos a gratis **Source Serif 4** |
| Texto (sans) | **Open Sans** (a fonte real da marca, gratis) |
| Marca | o "C" circlemark (recriado do SVG oficial), laranja |
| Tagline | "The Human Side of AI." |

Posts e videos usam a MESMA marca (mesmas cores, mesmas fontes). Fontes da
pesquisa: og:image, CSS e favicon de aicollective.com, mais a voz/numeros do
`social-strategy.md` do chapter. O kit oficial (vetores do logo, variantes) fica
em https://www.aicollective.com/press. Para producao seria, peca os vetores pra HQ.

## Como trocar de marca (deixe com a sua cara)

O motor e neutro. A marca do AI Collective e so o exemplo padrao. Tudo o que
define "a marca" (cores, fontes, logo, @ e etiqueta) vive em UM arquivo:
**`src/brand.config.mjs`**. Abra ele e mude o que quiser:

```js
export const BRAND = {
  colors: {
    accent: "#FF630D",   // <- a cor de destaque (troque pela sua)
    bg: "#0C0A09",       // <- o fundo escuro
    ink: "#FFFFFF",      // <- a cor do texto sobre a foto
    // ...
  },
  fonts: { display: "Source Serif 4", body: "Open Sans" }, // <- suas fontes
  logoPath: "M130.8,...",  // <- o path (d="...") do SVG do seu logo
};

export const CHAPTER = {
  handle: "@aicollectivefloripa",        // <- o @ que aparece no post
  label: "AI Collective Florianópolis",  // <- a etiqueta do topo e a marca do video
};
```

**Teste em 30 segundos:** troque o `accent` pela sua cor, salve, rode `npm run ui`,
e o editor inteiro (e os posts) ja saem na cor nova.

**Se trocar a FONTE**, troque tambem os nomes em dois lugares (so uma vez):
- `ui/index.html`: a tag `<link>` do Google Fonts, la no topo.
- `src/brand.tsx`: os dois `loadFont` do `@remotion/google-fonts`.

So isso. Posts, carrossel, reels e o editor passam a sair com a sua marca. Nao
precisa cacar cor ou texto espalhado pelo codigo: e sempre esse arquivo.

**Regra de copy (do chapter):** lidere com a coisa mais ambiciosa E verdadeira,
nunca a burocratica. Numero: piso publicado (70k+), nunca o teto. Passe toda
legenda pela skill `humanizer` antes de postar. Sem travessao.

---

## Trocar de provider (geracao por IA)

O padrao e **fal.ai** (uma chave, imagem e video juntos). So o fal.ai vem
implementado. Para adicionar outro: copie `scripts/lib/providers/fal.mjs`,
implemente `generateImage` e `generateClip`, e ligue no `switch` de
`scripts/lib/providers/index.mjs`.

| Provider | Como ligar | Estado |
| --- | --- | --- |
| **fal.ai** (padrao) | `PROVIDER=fal` + `FAL_KEY` | pronto |
| Replicate | `PROVIDER=replicate` + `REPLICATE_API_TOKEN` | a implementar |
| Google Gemini | `PROVIDER=gemini` + `GEMINI_API_KEY` | a implementar |
| OpenAI | `PROVIDER=openai` + `OPENAI_API_KEY` | a implementar |

## Modelos usados (verificados em 2026-06-27)

| Uso | Modelo no fal.ai | Custo aproximado |
| --- | --- | --- |
| Imagem (padrao) | `fal-ai/flux/schnell` | ~US$ 0,003 por imagem |
| Imagem (qualidade) | `fal-ai/flux/dev` | ~US$ 0,025 por imagem |
| Video texto | `fal-ai/kling-video/v2.5-turbo/pro/text-to-video` | ~US$ 0,35 por 5s |
| Video imagem | `fal-ai/kling-video/v2.5-turbo/pro/image-to-video` | ~US$ 0,35 por 5s |
| Video barato | `fal-ai/ltx-video` | ~US$ 0,02 por clip |

Posts nao gastam nada (render local). Imagem por IA e barata. Video por IA custa
de verdade: ponha um limite de gasto no painel do fal.ai antes de um evento.

---

## Troubleshooting

**"Falta a chave FAL_KEY"**
So aparece quando voce tenta GERAR imagem/clip por IA. Para posts, ignore: use `--hero` com uma foto sua. Para gerar por IA, cole a chave no `.env`.

**"node: command not found"**
Instale o Node 18+ em https://nodejs.org e rode `./scripts/setup.sh` de novo.

**Render de video travando (pouca RAM)**
```bash
node scripts/render-video.mjs --concurrency 2
```

**Quero ajustar o texto antes de salvar**
Use o editor visual, que mostra a previa ao vivo enquanto voce digita:
```bash
npm run ui
```
(`npm run studio` abre o Remotion Studio, a versao avancada com painel de props.)

---

## English (short version)

Make **Instagram posts in The AI Collective visual identity** (a hero photo plus
an editorial overlay), generate AI images, and render reels, all from Claude Code.
Built for AI Collective chapters (started with Florianopolis).

**Posts need no API key** (local render, bring any photo). The fal.ai key is only
for generating hero images or AI clips.

1. `./scripts/setup.sh`
2. **Easiest, no code:** run `npm run ui`, drop a photo, type the headline, download the PNG (or the whole carousel as a `.zip`).
3. Or, in Claude Code, say: `cria um post sobre o evento` (or in English, `make a post about our first meetup`)
4. Optional, for AI image generation: paste a fal.ai key into `.env`

**Rebrand (white-label):** edit one file, `src/brand.config.mjs` (colors, fonts,
logo path, handle/label). See "Como trocar de marca" above.

**Skills:** `criar-post` (photo + AIC overlay to PNG), `gerar-imagem` (text to
image), `prompt-de-imagem` (prompt help), `criar-video` (images to MP4 reel),
`gerar-clip-ia` (AI video clip).

Identity (orange `#FF630D`, stone neutrals, Source Serif 4 + Open Sans, the "C"
mark) is grounded in aicollective.com. No secrets are committed (`.env` is gitignored).

Licenca MIT. Credito: AI Collective Florianopolis.
