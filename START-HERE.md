# Comece aqui

O caminho mais curto. Uma acao por linha. Faca de cima para baixo.

---

## Passo 1. Baixe o projeto

```bash
git clone <url-do-repo>
cd ai-collective-content-lab
```

---

## Passo 2. Rode o setup

```bash
./scripts/setup.sh
```

Isso instala tudo.

---

## Passo 3 (jeito mais facil). Abra o editor visual

```bash
npm run ui
```

Abre uma pagina no navegador.

Solte uma imagem.

Escreva a manchete.

Baixe o PNG.

Sem codigo, sem chave.

---

## Passo 3 (alternativa). Abra a pasta no Claude Code

Diga isto:

```
cria um post sobre o primeiro encontro do chapter em Floripa
```

O post sai em `out/` (PNG 1080x1350, com a cara do The AI Collective).

Nao precisa de chave nenhuma para isso.

---

## Passo 4 (opcional). Gerar a imagem de fundo com IA

Pegue uma chave gratis aqui:

https://fal.ai/dashboard/keys

Abra o arquivo `.env`.

Cole a chave depois de `FAL_KEY=`.

Agora diga no Claude Code:

```
gera uma imagem de pessoas num coworking em Floripa
```

E depois:

```
cria um post com essa imagem
```

---

## Passo 5 (opcional). Virar em reel

```
monta um reel com essas imagens
```

O video sai em `out/`.

---

Travou? Abra o `README.md`, secao **Troubleshooting**.
