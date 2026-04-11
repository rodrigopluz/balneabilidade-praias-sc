![version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![coverage](https://img.shields.io/badge/coverage-95%25-orange)
![Apache License 2.0](https://img.shields.io/badge/license-Apache%20License%202.0-blue)

# Raspagem de Dados - Balneabilidade IMA

Sistema de monitoramento da balneabilidade das praias de Santa Catarina.

## Requisitos

- Node.js >= 18.19.1x
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

### Testes Unitários

```bash
# Executar todos os testes unitários
yarn test

# Executar testes com cobertura
yarn test:coverage

# Executar testes do frontend
yarn workspace @balneabilidade/client test

# Executar testes do backend
yarn workspace @balneabilidade/server test
```

### Testes de Integração

```bash
# Executar testes de integração do backend
yarn workspace @balneabilidade/server test:integration
```

### Testes de Performance

```bash
# Load test (requer servidor rodando na porta 3001)
yarn workspace @balneabilidade/server perf:load

# Benchmark de endpoints
yarn workspace @balneabilidade/server perf:benchmark

# k6 load test (requer k6 instalado)
yarn workspace @balneabilidade/server perf:k6

# k6 stress test
yarn workspace @balneabilidade/server perf:k6:stress
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
│   ├── client/                    # Frontend (React + Vite)
│   │   ├── src/
│   │   │   ├── component/         # Componentes React
│   │   │   ├── data/              # Dados estáticos
│   │   │   ├── i18n/              # Internacionalização
│   │   │   └── test/              # Testes unitários
│   │   └── vitest.config.ts
│   └── server/                    # Backend (Express + TypeScript)
│       ├── src/
│       │   ├── test/              # Testes unitários e integração
│       │   ├── performance/       # Scripts de performance
│       │   ├── ima.ts             # Roteador da API IMA
│       │   ├── index.ts           # Entry point
│       │   └── utils.ts           # Funções utilitárias
│       └── vitest.config.ts
├── .husky/                        # Git hooks
│   └── pre-push                   # Hook que executa testes antes do push
├── package.json
└── yarn.lock
```

## Pre-push Hook

Antes de fazer `git push`, o Husky executa automaticamente:

1. Testes do frontend com cobertura
2. Testes do backend com cobertura

Se os testes falharem ou a cobertura for inferior a 95%, o push será bloqueado.

## Testes

### Testes Unitários

- **Client**: 49 testes (Vitest)
- **Server**: 62 testes (Vitest)
- **Total**: 111 testes

### Testes de Integração

- 21 testes de endpoints da API (supertest)
- Testa fluxos completos de requisição/resposta

### Testes de Performance

Scripts disponíveis:

- `load-test-cli.js` - Load test simples com Node.js
- `benchmark.js` - Benchmark de latência por endpoint
- `load-test.js` - Load test com k6 (requer instalação do k6)
- `stress-test.js` - Stress test com k6

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
- Supertest
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

## Licença

MIT

## Browser Suportados

<img src="https://s3.amazonaws.com/creativetim_bucket/github/browser/chrome.png" width="64" height="64"> <img src="https://s3.amazonaws.com/creativetim_bucket/github/browser/firefox.png" width="64" height="64"> <img src="https://s3.amazonaws.com/creativetim_bucket/github/browser/edge.png" width="64" height="64"> <img src="https://s3.amazonaws.com/creativetim_bucket/github/browser/safari.png" width="64" height="64"> <img src="https://s3.amazonaws.com/creativetim_bucket/github/browser/opera.png" width="64" height="64">

![NODE.JS](https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white)
![REACTJS](https://img.shields.io/badge/-ReactJs-61DAFB?logo=react&logoColor=white&style=for-the-badge)

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
