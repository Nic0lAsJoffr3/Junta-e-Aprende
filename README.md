# Junta&Aprende

Jogo educacional de associação entre perguntas e respostas, com pontuação por acertos e tempo de conclusão.

## Acesso

https://junta.e.aprende.nicolasjoffre.com.br/

## Funcionalidades

- Entrada por código ou QR Code.
- Perguntas e respostas embaralhadas.
- Associações visuais entre os itens.
- Resultado com correção das respostas.
- Ranking dos dez melhores resultados.
- Destaques em ouro, prata e bronze.
- Atualização automática do ranking a cada cinco segundos.
- Temas visuais e modo claro ou escuro.

## Tecnologias

<p align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" width="45" alt="HTML5">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" width="45" alt="CSS3">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="45" alt="JavaScript">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg" width="45" alt="Supabase">
</p>


## Estrutura

```text
├── index.html
├── tela.html
├── config.html
├── adm.html
├── css/
│   ├── base.css
│   ├── layout.css
│   ├── components.css
│   └── tela.css
├── js/
│   ├── supabase.js
│   ├── config.js
│   ├── scoring.js
│   ├── index.js
│   └── tela.js
└── assets/
```

## Configuração

1. Configure o cliente `juntaDB` em `js/supabase.js`.
2. Prepare as tabelas `games`, `game_items` e `game_scores`.
3. Configure as permissões de acesso no Supabase.
4. Hospede os arquivos em um servidor HTTP.
5. Atualize `SITE_URL` em `js/tela.js` caso utilize outro domínio.

## Uso

O jogador acessa a partida pelo código ou QR Code, informa seu nome e associa as perguntas às respostas.

Para abrir a apresentação:

```text
tela.html?code=CODIGO
```

Pressione `F` para alternar a tela cheia.

## Pontuação

- Valor-base por acerto: `20000 / total de perguntas`.
- Desconto de dez pontos por segundo completo.
- Piso de cem pontos por acerto, limitado ao valor-base.
- Resultado salvo no Supabase.

O campo `reset_version` separa os resultados de cada rodada. Recarregue a apresentação após reiniciar uma partida.

## Autor

Nícolas Joffre De Souza
