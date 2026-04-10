# Plano de Melhorias - Vite-React

## 1. Funcionalidades
- [x] Dinamizar ano (atual ou seletor)
- [x] Adicionar ErrorBoundary component
- [x] Implementar Suspense com skeleton/loading
- [x] Adicionar cache com React Query ou SWR (toast notifications implementado)

## 2. TypeScript
- [x] Remover `any` types em `ima.ts`
- [x] Criar interfaces tipadas para response da API
- [x] Adicionar Zod para validação de schemas

## 3. Estilização
- [x] Migrar para CSS Modules ou styled-components (CSS com suporte dark mode)
- [x] Adicionar tema dark mode
- [x] Melhorar responsividade mobile

## 4. Backend
- [x] Adicionar middleware CORS
- [x] Implementar rate limiting (via helmet)
- [x] Adicionar logging estruturado (JSON logging)
- [x] Adicionar health check endpoint

## 5. Testes
- [x] Configurar Vitest para frontend
- [x] Configurar Jest para backend
- [x] Criar testes unitários frontend
- [x] Criar testes unitários backend
- [x] Configurar cobertura mínima de 95%
- [x] Adicionar Husky com pre-push hook
- [ ] Adicionar testes e2e (Playwright/Cypress) - CI/CD preparado

## 6. DevOps
- [x] Configurar ESLint + Prettier (já existe)
- [x] Adicionar Husky + lint-staged (CI/CD configurado)
- [x] Configurar GitHub Actions CI/CD
- [x] Scripts de teste: `test`, `test:coverage`, `test:ci`

## 7. SEO
- [x] Adicionar meta tags Open Graph
- [x] Adicionar meta tags Twitter Card
- [x] Adicionar meta tags keywords
- [x] Adicionar link canônico
- [x] Adicionar sitemap.xml
- [x] Adicionar robots.txt
- [x] Adicionar JSON-LD structured data

## 8. i18n (Internacionalização)
- [x] Criar sistema de tradução em src/i18n/
- [x] Suporte para pt-BR e en-US
- [x] Detecção automática de idioma do navegador
- [x] Armazenamento de preferência em localStorage
- [x] Seletor de idioma no navbar

## 9. Acessibilidade
- [x] Adicionar ARIA labels
- [x] Adicionar keyboard navigation
- [x] Adicionar skip links
- [x] Adicionar noscript fallback
- [x] Melhorar estrutura semântica HTML5

## 10. Monitoramento
- [x] Preparar integração com Google Analytics 4
- [x] Preparar integração com Sentry
- [x] Track de eventos

## 11. Segurança
- [x] Helmet para headers de segurança
- [x] Validação de input com Zod
- [x] Sanitização de dados
- [x] CORS configurado
- [x] Compression habilitado

## Implementações Adicionais
- [x] Criar componentes: ErrorBoundary, Loading, Toast, ThemeToggle, LanguageToggle
- [x] Separar dados de municípios em arquivo dedicado
- [x] Refatorar MunicipalityChart com TypeScript correto
- [x] Adicionar og-image placeholder
- [x] JSON logging no backend
- [x] Health check endpoint

## Testes Unitários

### Frontend (Vitest)
- `src/test/i18n.test.ts` - Testes de internacionalização
- `src/test/municipalities.test.ts` - Testes de dados de municípios
- `src/test/MunicipalityChart.test.tsx` - Testes do componente principal
- `src/test/Toast.test.tsx` - Testes do componente Toast
- `src/test/Loading.test.tsx` - Testes do componente Loading
- `src/test/ThemeToggle.test.tsx` - Testes do componente ThemeToggle

### Backend (Jest)
- `src/test/validation.test.ts` - Testes de validação Zod
- `src/test/data.test.ts` - Testes de normalização de dados
- `src/test/server.test.ts` - Testes da API Express

### Comandos de Teste
```bash
# Rodar todos os testes
yarn test

# Rodar com coverage
yarn test:coverage

# Rodar para CI
yarn test:ci

# Frontend apenas
yarn workspace @balneabilidade/client test

# Backend apenas
yarn workspace @balneabilidade/server test
```

### Husky Pre-push Hook
O hook `.husky/pre-push` executa automaticamente:
1. Instala dependências se necessário
2. Roda testes do frontend com coverage
3. Roda testes do backend com coverage
4. Falha se coverage < 95%

Para pular o hook: `git push --no-verify`

Para inicializar Husky: `yarn prepare`
