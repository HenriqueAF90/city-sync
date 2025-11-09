# city-sync

POC de painel/POC para gestão de ônibus — web (React + Vite). O código-fonte da aplicação web está em `src/` (root).

## Sumário

- Tecnologias: React, TypeScript, Vite
- Estrutura principal:
	- `src/` — código-fonte da aplicação web (componentes, CSS)
	- `index.html`, `vite.config.ts` — entrada/Config do Vite

## Requisitos

- Node.js 18+ (recomendo >=18 LTS)
- npm (ou yarn/pnpm)

## Rodando no Codespaces (ou outro ambiente remoto)

1. Abra um terminal no Codespace (ou no contêiner).
2. Instale dependências (na raiz do repo):

```bash
npm install
```

3. Inicie o servidor de desenvolvimento:

```bash
npm run start
```

4. No Codespaces: abra a aba "Ports" e clique em "Open in Browser" na porta que o Vite escolher (normalmente 3000). Se o Vite escolher outra porta (ex: 3001), use a porta exibida no terminal.

> Observação: se a porta 3000 já estiver em uso, o Vite tentará a próxima porta disponível automaticamente.

## Rodando localmente (sua máquina)

1. Clone o repositório e entre na pasta do projeto.
2. Execute:

```bash
npm install
npm run start
```

3. Abra http://localhost:3000 (ou a porta informada pelo Vite).

## Build para produção

Ainda não há script de build otimizado por padrão neste POC, mas você pode gerar uma build do Vite adicionando um script `build` no `package.json` assim:

```json
"scripts": {
	"start": "vite",
	"build": "vite build",
	"preview": "vite preview --port 4173"
}
```

Depois rode:

```bash
npm run build
npm run preview
```

## Observações úteis

- O `.gitignore` já contém `node_modules/` para evitar commitar dependências.
- Favoritos e reservas são salvos no `localStorage` (chaves: `citysync_favorite_lines_v1` e `citysync_reservations`).
- O modal de reserva contém um bloco comentado onde você pode colocar um iframe do Google Maps ou uma imagem como placeholder.

## Contribuições

Abra uma issue ou envie um PR com melhorias. Posso também continuar implementando features como toasts globais, persistência da fila entre reloads e versão mobile (React Native).

---

