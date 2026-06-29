---
name: prompt-de-imagem
description: >-
  Ajuda a escrever um bom prompt de imagem antes de gerar (sujeito, estilo, luz,
  camera, enquadramento, aspect ratio). Use quando a pessoa disser "me ajuda com
  o prompt", "melhora esse prompt de imagem", "como descrever pra IA", "esse
  prompt ta bom?", "help me with the prompt", "improve this image prompt".
---

# Prompt de imagem (escrever antes de gerar)

Transforma uma ideia solta num prompt claro, que rende uma imagem melhor.
Esta skill NAO gera a imagem. Ela monta o prompt e entao chama a skill `gerar-imagem`.

## Quando usar
Antes de gerar, quando a ideia ainda esta vaga, ou quando a pessoa pede ajuda
com a descricao. Gatilhos: "me ajuda com o prompt", "melhora esse prompt".

## A receita (6 partes)
Monte o prompt juntando, nesta ordem:
1. Sujeito. O que aparece. Seja concreto. ("um por do sol sobre o mar")
2. Contexto. Onde, o entorno. ("morros de Florianopolis ao fundo, praia vazia")
3. Estilo. Fotografico, ilustracao flat, 3D, aquarela, pixar, cinematografico.
4. Luz. Luz dourada, contraluz, neon, hora azul, luz suave de estudio.
5. Camera / enquadramento. Close, plano aberto, vista de drone, 35mm, profundidade de campo.
6. Qualidade. "alta qualidade, nitido, detalhado".

## Formato (aspect ratio)
- Post do feed (skill `criar-post`) e reel / story: vertical (`--aspect vertical`). O post sai 1080x1350 (retrato 4:5), entao a foto de fundo deve ser vertical, nunca deitada.
- Banner / capa horizontal / slide deitado: horizontal (`--aspect horizontal`)
- Logo / icone / avatar: square (`--aspect square`)

## Passo a passo
1. Leia a ideia da pessoa.
2. Preencha as 6 partes. O que faltar, sugira (sem inventar coisas que ela nao quer).
3. Mostre o prompt final e o formato sugerido.
4. Ja ofereca rodar a skill `gerar-imagem` com esse prompt.

## Exemplo real
Pessoa: "queria uma imagem de Floripa pro reel"
Prompt sugerido (vertical):
> por do sol sobre o mar em Florianopolis, morros verdes ao fundo, praia tranquila,
> estilo fotografico cinematografico, luz dourada de fim de tarde, plano aberto de
> drone, alta qualidade, nitido
Depois, gere:
```bash
node scripts/generate-image.mjs "por do sol sobre o mar em Florianopolis, morros verdes ao fundo, praia tranquila, estilo fotografico cinematografico, luz dourada de fim de tarde, plano aberto de drone, alta qualidade, nitido" --aspect vertical
```

## Dica
Menos enrolacao, mais substantivos concretos. Modelos tipo Flux respondem melhor
a descricoes diretas do que a frases longas e abstratas.
