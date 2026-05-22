# EQI Challenge Backend

As instruções para o desafio estão em [CHALLENGE.md](CHALLENGE.md).

Sistema de recebimento de leads via webhook. Integra com a plataforma **LeadFlow** para captura e persistência de leads de campanhas de marketing.

## Stack

- [NestJS](https://nestjs.com/) — framework
- [TypeORM](https://typeorm.io/) — ORM
- [SQLite](https://www.sqlite.org/) via `better-sqlite3` — banco de dados local

## Setup

### Pré Requisitos
- Projeto foi criado com Node `22.22.1`, recomenda-se o uso da mesma versão.
- Projeto utiliza 

### Crie o arquivo de ambiente
```bash
cp .env.example .env
```

### Instale as dependências
```bash
npm install
```

### Rode as migrations (o banco é criado automaticamente na pasta `database/`)
```bash
npm run migrations:up
```

### Rode o projeto
```bash
npm run start:dev
```

## Variáveis de ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `PORT` | Porta da aplicação | `3000` |
| `DATABASE_PATH` | Caminho do arquivo SQLite | `database/leads.sqlite` |
| `LEADFLOW_WEBHOOK_SECRET` | Chave secreta para validação HMAC | — |

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/v1/webhooks/leadflow` | Recebe webhook da LeadFlow (v1) |
| GET | `/leads` | Lista todos os leads |

## Testes

```bash
npm run test
npm run test:cov
```
