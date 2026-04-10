# Plano de Melhorias - Bootstrap

## 1. Segurança
- [x] Remover `CURLOPT_SSL_VERIFYPEER: false` e usar certificado SSL válido
- [x] Sanitizar todos os inputs/outputs com `htmlspecialchars()`
- [x] Adicionar headers de segurança (CSP, X-Frame-Options)
- [x] Adicionar Content Security Policy (CSP)
- [x] Adicionar Strict-Transport-Security (HSTS)
- [x] Adicionar Referrer-Policy e Permissions-Policy

## 2. UX/UI
- [x] Atualizar Chart.js 2.5.0 → 4.x
- [x] Adicionar seletor de ano dinâmico
- [x] Implementar loading spinner durante requisições
- [x] Substituir `alert()` por toast notifications
- [x] Corrigir lang="en" → lang="pt-BR"
- [x] Adicionar ícone SVG inline para favicon

## 3. Performance
- [x] Implementar cache inteligente com ETags
- [x] Atualizar jQuery para versão mais recente (3.7.1)
- [x] Consolidar assets locais e CDN
- [x] Adicionar preconnect e dns-prefetch para CDNs
- [x] Lazy loading do Chart.js (carrega apenas quando necessário)

## 4. Acessibilidade
- [x] Adicionar ARIA labels ao select
- [x] Adicionar keyboard navigation
- [x] Melhorar contraste de cores
- [x] Adicionar skip links e navegação semântica
- [x] Adicionar role="combobox" para selects
- [x] Adicionar alt text em SVGs
- [x] Adicionar noscript fallback para gráfico
- [x] Melhorar estrutura semântica HTML5

## 5. Manutenção
- [x] Extrair municípios para arquivo JSON externo
- [x] Adicionar comentários JSDoc

## 6. SEO
- [x] Adicionar meta tags Open Graph
- [x] Adicionar meta tags Twitter Card
- [x] Adicionar meta tags keywords
- [x] Adicionar link canônico
- [x] Adicionar hreflang alternativo
- [x] Adicionar sitemap.xml
- [x] Adicionar robots.txt
- [x] Adicionar JSON-LD structured data
- [x] Criar OG image (assets/img/og-image.svg)

## 7. i18n (Internacionalização)
- [x] Criar sistema de tradução em assets/js/i18n.js
- [x] Suporte para pt-BR e en-US
- [x] Detecção automática de idioma do navegador
- [x] Armazenamento de preferência em localStorage
- [x] Seletor de idioma no navbar

## 8. Monitoramento
- [x] Criar módulo Analytics (assets/js/analytics.js)
- [x] Configurar Google Analytics 4
- [x] Configurar Sentry para error tracking
- [x] Track de eventos e pageviews
- [x] Anonimização de IP no Analytics

## 9. CI/CD
- [x] Criar GitHub Actions workflow (.github/workflows/ci.yml)
- [x] PHP Lint
- [x] JavaScript Lint (ESLint)
- [x] Testes de API endpoint
- [x] Validação HTML
- [x] Lighthouse CI
- [x] Security scan
- [x] Deploy automatizado via RSYNC

## 10. Refatoração
- [x] Criar arquivo includes/seo.php para headers SEO
- [x] Lazy loading do Chart.js
- [x] Separar Analytics em módulo próprio
- [x] Separar i18n em módulo próprio
- [x] Código mais modular e manutenível

## Implementações Adicionais
- [x] Criar arquivo `assets/data/municipalities.json`
- [x] Refatorar JavaScript para IIFE com 'use strict'
- [x] Melhorar gráfico com tooltips e legendas melhoradas
- [x] Adicionar estilo responsivo para mobile
- [x] Adicionar suporte a reduced-motion
- [x] Validação de input com filter_input()
- [x] CORS headers configuráveis
- [x] Headers de cache otimizados
