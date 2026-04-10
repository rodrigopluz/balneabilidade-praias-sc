# Plano de Melhorias - Materialize

## 1. Segurança
- [ ] Remover `CURLOPT_SSL_VERIFYPEER: false` ou configurar certificado SSL
- [ ] Sanitizar inputs/outputs
- [ ] Adicionar headers de segurança

## 2. UX/UI
- [ ] Atualizar Chart.js 2.5.0 → 4.x
- [ ] Adicionar seletor de ano
- [ ] Implementar preloader Materialize durante fetch
- [ ] Corrigir ordem de carregamento de scripts (jQuery primeiro)
- [ ] Corrigir lang="en" → lang="pt-BR"
- [ ] Substituir `alert()` por Materialize toast

## 3. Code Quality
- [ ] Extrair lógica JavaScript para arquivo `assets/js/script.js`
- [ ] Externalizar lista de municípios para JSON
- [ ] Adicionar tratamento de erros robusto

## 4. Acessibilidade
- [ ] Adicionar ARIA labels
- [ ] Keyboard navigation
