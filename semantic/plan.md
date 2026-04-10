# Plano de Melhorias - Semantic UI

## 1. Segurança
- [ ] Corrigir configuração SSL
- [ ] Sanitizar inputs/outputs
- [ ] Adicionar headers de segurança

## 2. UX/UI
- [ ] Atualizar Chart.js 2.5.0 → 4.x
- [ ] Adicionar seletor de ano
- [ ] Substituir `alert()` por Semantic UI Modal
- [ ] Corrigir ordem de carregamento de scripts
- [ ] Corrigir lang="en" → lang="pt-BR"
- [ ] Usar paleta de cores Semantic UI

## 3. Refatoração
- [ ] **CRÍTICO**: Extrair lógica comum (partilhada com materialize)
- [ ] Criar módulo JS compartilhado para parsing de dados
- [ ] Externalizar municípios para JSON

## 4. Performance
- [ ] Considerar usar versão modular do Semantic UI
- [ ] Lazy loading do chart
