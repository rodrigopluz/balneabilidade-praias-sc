![version](https://img.shields.io/badge/version-1.0.0-blue.svg)
[![license](https://img.shields.io/apm/l/vim-mode.svg)](LICENSE)
![Build Status](https://api.travis-ci.org/cakephp/app.png)

# Raspagem de Dados - Balneabilidade IMA

Sistema de monitoramento da balneabilidade das praias de Santa Catarina.

## Requisitos

- Node.js >= 18.19.1
- Yarn >= 1.22.22

## Instalação

```bash
# Instalar dependências
yarn install

# Configurar Husky (pre-push hook)
yarn prepare
```

## Scripts

### Desenvolvimento

```bash
# Executar ambos frontend e backend
yarn dev

# Executar apenas o frontend
yarn dev:frontend

# Executar apenas o backend
yarn dev:backend
```

### Testes

```bash
# Executar todos os testes
yarn test

# Executar testes com cobertura
yarn test:coverage

# Executar testes do frontend
yarn workspace @balneabilidade/client test

# Executar testes do backend
yarn workspace @balneabilidade/server test

# Executar testes do frontend com cobertura
yarn workspace @balneabilidade/client test:coverage

# Executar testes do backend com cobertura
yarn workspace @balneabilidade/server test:coverage
```

### Build

```bash
# Build do frontend
yarn workspace @balneabilidade/client build

# Build do backend
yarn workspace @balneabilidade/server build
```

### Linting

```bash
# Linting do frontend
yarn workspace @balneabilidade/client lint

# Linting do backend
yarn workspace @balneabilidade/server lint
```

## Estrutura do Projeto

```
vite-react/
├── packages/
│   ├── client/          # Frontend (React + Vite)
│   │   ├── src/
│   │   │   ├── component/    # Componentes React
│   │   │   ├── data/        # Dados estáticos
│   │   │   ├── i18n/        # Internacionalização
│   │   │   └── test/        # Testes unitários
│   │   └── vitest.config.ts
│   └── server/          # Backend (Express + TypeScript)
│       ├── src/
│       │   ├── test/         # Testes unitários
│       │   ├── ima.ts        # Roteador da API IMA
│       │   ├── index.ts      # Entry point
│       │   └── utils.ts      # Funções utilitárias
│       └── vitest.config.ts
├── .husky/              # Git hooks
│   └── pre-push         # Hook que executa testes antes do push
├── package.json
└── yarn.lock
```

## Pre-push Hook

Antes de fazer `git push`, o Husky executa automaticamente:

1. Testes do frontend com cobertura
2. Testes do backend com cobertura

Se os testes falharem ou a cobertura for inferior a 95%, o push será bloqueado.

## Cobertura de Testes

- **Linhas**: >= 95%
- **Funções**: >= 70%
- **Branches**: >= 70%

## Tecnologias

### Frontend

- React 18
- Vite
- Vitest
- Chart.js / react-chartjs-2
- Bootstrap 5
- TypeScript

### Backend

- Express
- TypeScript
- Vitest
- Zod (validação)
- JSDOM (parsing HTML)
- node-fetch

## API

### Endpoints

- `GET /` - Informações da API
- `GET /health` - Status de saúde
- `POST /api/ima/chart` - Dados de balneabilidade

### Parâmetros

```json
{
  "municipio": "2",
  "ano": "2026"
}
```

## Browser Suportados

<img src="https://s3.amazonaws.com/creativetim_bucket/github/browser/chrome.png" width="64" height="64"> <img src="https://s3.amazonaws.com/creativetim_bucket/github/browser/firefox.png" width="64" height="64"> <img src="https://s3.amazonaws.com/creativetim_bucket/github/browser/edge.png" width="64" height="64"> <img src="https://s3.amazonaws.com/creativetim_bucket/github/browser/safari.png" width="64" height="64"> <img src="https://s3.amazonaws.com/creativetim_bucket/github/browser/opera.png" width="64" height="64">

## Autor

<table>
  <tr>
    <td>
      <img src="https://avatars2.githubusercontent.com/u/8739638?s=460&v=4" width="100">
    </td>
    <td>
      :octocat: Rodrigo Pereira<br />
      <a href="mailto:rodrigopluz@gmail.com">:point_right: rodrigopluz@gmail.com</a><br />
    </td>
  </tr>
</table>

## Licença

MIT
