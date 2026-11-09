# 🥗 Daily Diet

Aplicação web fullstack para controle alimentar diário, registro de refeições e acompanhamento inteligente de consistência na dieta.

Construído com **Node.js + Express + TypeScript + Prisma (SQLite)** no backend e **React + TypeScript + Vite + Tailwind CSS** no frontend.

---

## ✨ Funcionalidades do Produto

- **Autenticação Completa & Isolamento por Conta**: Cadastro de usuário, login com senha criptografada (`bcrypt`) e identificação segura entre requisições via **JWT** (`Bearer Token` / Cookie `HttpOnly`). Cada usuário visualiza, edita e exclui exclusivamente suas próprias refeições.
- ** Acesso Rápido de Demonstração**: Modo de exploração em 1 clique na tela de login que provisiona uma conta demonstrativa já populada com histórico realista de refeições.
- **Diário de Refeições Agrupado por Dia**:
  - Registro completo contendo **nome**, **descrição**, **data e hora** e **indicação se está dentro ou fora da dieta**;
  - Busca instantânea (insensível a acentos) por prato ou ingrediente, além de filtros por status (`Todas`, `Na dieta`, `Fora`) e data específica;
  - Tela de feedback motivacional após cada novo registro;
  - Visualização individual detalhada da refeição, edição de todas as informações e exclusão com confirmação de segurança.
- **Painel de Estatísticas & Evolução**:
  - Percentual geral de adesão comparado à **meta pessoal configurável** do usuário (padrão: `80%`);
  - **Melhor sequência de refeições dentro da dieta** (*Best Streak*) e sequência atual em andamento;
  - Total de refeições registradas, total dentro da dieta e total fora da dieta;
  - Gráfico semanal de consistência dos últimos 7 dias.
- **Design Responsivo (Desktop & Mobile)**: Navegação lateral (*Sidebar*) em telas grandes e barra inferior otimizada para uso mobile.

---

## 🏗️ Estrutura do Projeto

```text
daily-diet/
├── backend/                  # API RESTful em Node.js + Express + TypeScript
│   ├── prisma/               # Schema SQLite, migrations e script de seed
│   ├── src/
│   │   ├── config/           # Validação de variáveis de ambiente
│   │   ├── controllers/      # Controllers HTTP (Users, Sessions, Meals, Metrics)
│   │   ├── errors/           # Classe customizada AppError
│   │   ├── lib/              # Instância do Prisma Client
│   │   ├── middlewares/      # Autenticação JWT e Error Handler global
│   │   ├── routes/           # Definição modular das rotas da API
│   │   ├── schemas/          # Schemas de validação com Zod
│   │   └── services/         # Regras de negócio, permissões e cálculo de métricas
│   └── tests/                # Testes automatizados de integração (Vitest + Supertest)
│
└── frontend/                 # SPA em React 19 + TypeScript + Vite + Tailwind CSS
    └── src/
        ├── components/       # Componentes reutilizáveis (UI, Layout, Meals, Metrics)
        ├── contexts/         # Contextos globais (AuthContext, ToastContext)
        ├── hooks/            # Custom hooks de busca e sincronização (useMeals, useMetrics)
        ├── pages/            # Telas para cada rota da aplicação
        ├── services/         # Cliente HTTP integrado à API
        ├── types/            # Contratos e interfaces TypeScript
        └── utils/            # Utilitários de data/hora e agrupamento cronológico
```

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- **Node.js** `v18+` (recomendado `v20` ou superior)
- **npm**

### 1. Configurando e rodando o Backend (`porta 3333`)

```bash
cd backend

# Instale as dependências
npm install

# Aplique as migrações do banco SQLite (cria o arquivo dev.db automaticamente)
npx prisma migrate dev

# (Opcional) Popule o banco com o usuário de demonstração
npm run db:seed

# Inicie o servidor em modo de desenvolvimento
npm run dev
```

A API ficará disponível em `http://localhost:3333/api`.

### 2. Configurando e rodando o Frontend React (`porta 5173`)

Em outro terminal, a partir da raiz do projeto:

```bash
cd frontend

# Instale as dependências
npm install

# Inicie a interface React
npm run dev
```

Acesse no navegador: **`http://localhost:5173`**

---

## 🔌 Rotas da API REST (`/api`)

| Método | Rota | Autenticação | Descrição |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/users` | Pública | Cria um novo usuário e inicia sessão |
| `POST` | `/api/sessions` | Pública | Autentica usuário com e-mail e senha |
| `POST` | `/api/sessions/demo` | Pública | Autentica/cria conta demonstrativa populada |
| `DELETE` | `/api/sessions` | Pública | Encerra a sessão atual |
| `GET` | `/api/users/me` | JWT | Retorna dados do usuário autenticado |
| `PATCH` | `/api/users/me` | JWT | Atualiza nome ou meta percentual da dieta |
| `POST` | `/api/meals` | JWT | Registra uma nova refeição vinculada ao usuário |
| `GET` | `/api/meals` | JWT | Lista todas as refeições do usuário (com busca/filtros) |
| `GET` | `/api/meals/:id` | JWT | Visualiza uma única refeição (somente do próprio autor) |
| `PUT` | `/api/meals/:id` | JWT | Edita todos os campos de uma refeição do usuário |
| `DELETE` | `/api/meals/:id` | JWT | Apaga uma refeição do usuário |
| `GET` | `/api/meals/metrics` | JWT | Recupera métricas completas e melhor sequência na dieta |

---

## 🧪 Executando os Testes Automatizados

No diretório `backend/`:

```bash
cd backend
npm test
```
