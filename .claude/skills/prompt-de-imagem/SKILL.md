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
Entrega o prompt. Use `gerar-imagem` apenas se a geração também estiver no pedido autorizado.

## Quando usar
Antes de gerar, quando a ideia ainda esta vaga, ou quando a pessoa pede ajuda
com a descricao. Gatilhos: "me ajuda com o prompt", "melhora esse prompt".

## A receita (6 partes)
Use os critérios pertinentes à imagem; não é preciso preencher campos irrelevantes nem seguir uma ordem fixa:
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
2. Especifique apenas as escolhas visuais que ajudem o resultado; preserve as intenções dadas.
3. Mostre o prompt final e o formato sugerido.
4. Se a geração já foi pedida, siga com `gerar-imagem`; caso contrário, entregue o prompt sem disparar serviço pago.

## Exemplo real
Pessoa: "queria uma imagem de Floripa pro reel"
Prompt sugerido (vertical):
> por do sol sobre o mar em Florianopolis, morros verdes ao fundo, praia tranquila,
> estilo fotografico cinematografico, luz dourada de fim de tarde, plano aberto de
> drone, alta qualidade, nitido
Se a geração estiver autorizada:
```bash
node scripts/generate-image.mjs "por do sol sobre o mar em Florianopolis, morros verdes ao fundo, praia tranquila, estilo fotografico cinematografico, luz dourada de fim de tarde, plano aberto de drone, alta qualidade, nitido" --aspect vertical
```

## Dica
Menos enrolacao, mais substantivos concretos. Modelos tipo Flux respondem melhor
a descricoes diretas do que a frases longas e abstratas.
