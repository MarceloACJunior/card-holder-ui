# card-holder-ui

Interface web (SPA) do ecossistema CardApp. Consolida os 3 microsserviços numa única aplicação
que guia o usuário pelo fluxo completo: **cadastrar cliente → solicitar análise de crédito →
criar card holder → emitir e gerenciar cartões**.

## Stack

- **React 18** + **Vite 5** + **TypeScript**
- **React Router 7** — roteamento
- **Axios** — HTTP (uma instância por API)
- **React Hook Form** + **Zod** — formulários e validação
- **Tailwind CSS** — estilização
- **react-hot-toast** — notificações

## Pré-requisitos

- **Node.js 18+**
- As 3 APIs do ecossistema rodando (`client-api:8080`, `credit-analysis-api:9001`, `card-holder-api:9002`).
  Veja o [README do card-holder-api](https://github.com/MarceloACJunior/card-holder-api) para subir tudo via Docker Compose.

## Rodando

```bash
# 1. Instalar dependências
npm install

# 2. Configurar as URLs das APIs (copie o exemplo e ajuste se necessário)
cp .env.example .env

# 3. Subir em modo desenvolvimento
npm run dev
```

Acesse **http://localhost:5173**.

> **Rede corporativa:** se o `npm install` falhar com erro de registry, rode antes:
> ```powershell
> $env:npm_config_registry = "https://registry.npmjs.org"
> ```

## Variáveis de ambiente

Definidas em `.env` (use `.env.example` como base):

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `VITE_CLIENT_API_URL` | `http://localhost:8080` | URL do `client-api` |
| `VITE_CREDIT_ANALYSIS_API_URL` | `http://localhost:9001` | URL do `credit-analysis-api` |
| `VITE_CARD_HOLDER_API_URL` | `http://localhost:9002` | URL do `card-holder-api` |

> O `.env` está no `.gitignore`. As APIs precisam liberar CORS para `http://localhost:5173`
> (já configurado via `CorsConfig` em cada serviço).

## Scripts

```bash
npm run dev       # Servidor de desenvolvimento (HMR)
npm run build     # Type-check + build de produção (gera dist/)
npm run preview   # Pré-visualiza o build de produção
npm run lint      # ESLint
```

## Estrutura

```
src/
├── api/          → instâncias Axios por microsserviço
├── components/   → Layout, PageHeader, StatusBadge, ErrorMessage
├── pages/
│   ├── clients/      → listagem, criação e detalhe de clientes
│   ├── analysis/     → listagem e solicitação de análise de crédito
│   └── cardholders/  → listagem, criação, detalhe e emissão de cartões
├── types/        → interfaces TypeScript dos DTOs
├── App.tsx       → rotas
└── main.tsx
```

## Fluxo de uso

```
1. Clientes      → cadastrar um cliente
       ↓
2. Análises      → solicitar análise de crédito para o cliente
       ↓
3. Card Holders  → criar um card holder (requer análise aprovada)
       ↓
4. Card Holders  → emitir cartões e gerenciar limites
```

## Ecossistema

| Repositório | Porta | Função |
|-------------|-------|--------|
| [client-api](https://github.com/MarceloACJunior/client-api) | 8080 | Cadastro de clientes |
| [credit-analysis-api](https://github.com/MarceloACJunior/credit-analysis-api) | 9001 | Análise de crédito |
| [card-holder-api](https://github.com/MarceloACJunior/card-holder-api) | 9002 | Portadores e cartões (orquestra o Docker Compose) |
| **card-holder-ui** | 5173 | **Este projeto** |
