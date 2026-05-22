# Desafio Técnico — Backend EQI

## Contexto

Este sistema recebe leads via webhook da plataforma **LeadFlow** e os persiste no banco de dados.

A integração atual (v1) está funcionando. A LeadFlow anunciou uma nova versão da API (v2) com mudanças no contrato do webhook — e você precisa adaptar o sistema para suportá-la.

A especificação completa da v2 está em [`docs/leadflow-v2-spec.md`](./docs/leadflow-v2-spec.md).

---

## O que você deve implementar

1. **Suporte ao webhook v2** seguindo a especificação em `docs/leadflow-v2-spec.md`
2. **Validação de assinatura HMAC** nas requisições v2 (a chave secreta vem da variável `LEADFLOW_WEBHOOK_SECRET`)
3. **Persistência dos novos campos** da v2, incluindo a classificação derivada do `score`
4. **Headers de depreciação** na v1 conforme especificado
5. **Versionamento de rota** para ambos os endpoints coexistirem

---

## Critérios de avaliação

- Compreensão do código existente antes de sair modificando
- Coerência da solução com os padrões já estabelecidos no projeto
- Qualidade da modelagem (entidade, DTOs, separação de responsabilidades)
- Tratamento correto de erros e respostas HTTP
- Testes — ao menos para a lógica de classificação por score e validação de assinatura
- O uso de IA é permitido, tanto que o repositório tem configurações para rodar com Claude Code e Opencode, mas a compreensão das modificações é essencial para a avaliação.

---

## Entrega

- Fork o repositório
- Crie uma Pull Request com suas alterações
- Documente suas alterações na abertura da Pull Request
- Será realizada uma sessão de revisão, para entendimento das modificações

Tempo estimado: **2 a 3 horas**
