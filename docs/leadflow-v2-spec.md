# LeadFlow Webhook API — Especificação v2.0

**Versão do documento:** 2.0.1
**Data de vigência:** 01/06/2026
**Depreciação da v1:** 01/08/2026

---

## Visão Geral

LeadFlow migrará todas as entregas de webhook para o formato v2. Ambos os formatos serão entregues em endpoints separados

---

## Versionamento da API

A API deve ser versionada via prefixo de rota:

```
/v1/webhooks/leadflow   ← formato antigo, depreciado
/v2/webhooks/leadflow   ← formato novo, obrigatório
```

**Regras:**
- Ambos os endpoints devem estar ativos durante o período de transição
- `/v1` deve retornar header `Deprecation: true` e `Sunset: Mon, 01 Aug 2026 00:00:00 GMT` em todas as respostas
- Versão também é indicada no header `X-LeadFlow-Version` da requisição

---

## Autenticação

Toda requisição inclui header de assinatura para verificação:

```
X-LeadFlow-Signature: sha256=<hmac_hex>
X-LeadFlow-Version: 2.0
X-LeadFlow-Delivery: <uuid>
```

**Cálculo da assinatura:**
```
HMAC-SHA256(chave_secreta, corpo_bruto_da_requisição)
```

A `chave_secreta` é fornecida no painel da LeadFlow (variável `LEADFLOW_WEBHOOK_SECRET`). Requisições com assinatura inválida **devem ser rejeitadas com 401**.

---

## Requisição

**Método:** `POST`
**Content-Type:** `application/json`

### Schema do Payload

```json
{
  "lead": {
    "id": "lead_abc123",
    "personal": {
      "full_name": "João Silva",
      "email": "joao@email.com",
      "phone": "+5511999999999"
    },
    "acquisition": {
      "channel": "google-ads",
      "campaign_id": "camp_456",
      "landing_page": "https://empresa.com.br/lp/investimentos",
      "score": 87
    },
    "metadata": {
      "received_at": "2026-05-19T10:00:00Z",
      "version": "2.0"
    }
  }
}
```

### Referência de Campos

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `lead.id` | string | sim | ID único no lado da LeadFlow |
| `lead.personal.full_name` | string | sim | Nome completo |
| `lead.personal.email` | string | sim | E-mail válido |
| `lead.personal.phone` | string | não | Formato E.164 (`+5511...`) |
| `lead.acquisition.channel` | string | sim | Origem do tráfego. Ver valores abaixo |
| `lead.acquisition.campaign_id` | string | não | Identificador da campanha |
| `lead.acquisition.landing_page` | string | não | URL de origem |
| `lead.acquisition.score` | inteiro | sim | Pontuação do lead de 0 a 100 |
| `lead.metadata.received_at` | ISO 8601 | sim | Timestamp da captura |
| `lead.metadata.version` | string | sim | Sempre `"2.0"` para v2 |

### Valores válidos para `channel`

```
google-ads | meta-ads | organic | email-campaign | referral | direct
```

### Classificação por score

| Faixa | Classificação |
|-------|--------------|
| 0–39 | frio |
| 40–69 | morno |
| 70–100 | quente |

A classificação **deve ser derivada e persistida** no momento do recebimento do lead.

---

## Respostas Esperadas

| Status | Significado |
|--------|-------------|
| `200` | Lead recebido e processado |
| `400` | Payload inválido |
| `401` | Assinatura inválida ou ausente |
| `410` | Versão depreciada fora do ar |
| `422` | Payload válido, mas rejeitado por regra de negócio |

LeadFlow realiza novas tentativas em caso de `5xx` ou timeout (3 tentativas, backoff exponencial).

---

## Mapeamento v1 → v2

| v1 | v2 |
|----|-----|
| `name` | `lead.personal.full_name` |
| `email` | `lead.personal.email` |
| `phone` | `lead.personal.phone` |
| `source` | `lead.acquisition.channel` |
| _(ausente)_ | `lead.id` |
| _(ausente)_ | `lead.acquisition.score` |
| _(ausente)_ | `lead.metadata.received_at` |
