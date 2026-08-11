# Clínica Pet

Sistema web para apoiar a gestão de uma clínica veterinária. A aplicação reúne autenticação de usuários, cadastro de pets e uma visão de vacinação em um dashboard responsivo.

> Projeto em desenvolvimento para fins acadêmicos.

## Demonstração

Adicionr capturas da tela de login e do dashboard...

## Funcionalidades

- Cadastro e login de usuários com senha criptografada.
- Rotas protegidas: o dashboard só pode ser acessado após autenticação.
- Dashboard com indicadores, alertas, filtro por pet e gráficos de vacinação.
- Cadastro rápido de pets pelo dashboard.
- Cadastro, edição e exclusão de agendamentos de vacina.
- Encerramento seguro da sessão pelo botão de saída.

## Tecnologias

### Frontend

- [Vue 3](https://vuejs.org/)
- [Quasar Framework](https://quasar.dev/)
- [Pinia](https://pinia.vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Axios](https://axios-http.com/)
- [Chart.js](https://www.chartjs.org/)

### Backend

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) para criptografia de senhas
- [dotenv](https://github.com/motdotla/dotenv) para variáveis de ambiente

## Estrutura do projeto

```text
projeto-clinica-quasar/
├── backend/                 # API Express e acesso ao PostgreSQL
│   ├── src/controllers/      # Controladores de autenticação e pets
│   ├── src/routes/           # Rotas da API
│   ├── src/services/         # Regras de negócio e consultas ao banco
│   └── .env.example          # Modelo de configuração local
├── frontend/                # Aplicação Vue/Quasar
│   └── src/
│       ├── pages/            # Login, cadastro, dashboard e vacinação
│       ├── router/           # Rotas e proteção de páginas
│       ├── services/         # Comunicação com API e sessão
│       └── stores/           # Estado de vacinação
└── README.md
```

## Pré-requisitos

- Node.js 20 ou superior
- npm
- PostgreSQL em execução

## Como executar

### 1. Clone o repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd projeto-clinica-quasar
```

### 2. Configure o backend

Crie o banco de dados no PostgreSQL:

```sql
CREATE DATABASE petmarket;
```

Copie o arquivo de exemplo e preencha as credenciais locais:

```bash
cp backend/.env.example backend/.env
```

Instale as dependências e inicie a API:

```bash
npm --prefix backend install
npm run dev:backend
```

A API será iniciada em `http://localhost:3000`.

### 3. Configure o frontend

Em outro terminal:

```bash
npm --prefix frontend install
npm run dev:frontend
```

Abra o endereço exibido pelo Quasar no navegador — normalmente `http://localhost:9000`.

## Variáveis de ambiente

Use `backend/.env.example` como modelo. Nunca envie o arquivo `backend/.env` para o repositório, pois ele contém credenciais locais.

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=petmarket
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui
```

## Rotas principais da API

| Método | Rota | Descrição |
| --- | --- | --- |
| POST | `/api/auth/register` | Cria uma conta de usuário |
| POST | `/api/auth/login` | Autentica o usuário |
| GET | `/api/pets` | Lista os pets cadastrados |
| POST | `/api/pets` | Cadastra um pet |

## Próximas melhorias

- Criar módulos próprios para agenda, consultas e perfil.
- Associar pets ao usuário autenticado.
- Centralizar os agendamentos de vacinas na API PostgreSQL.
- Adicionar recuperação de senha e validações mais completas.
- Criar testes automatizados para frontend e backend.

## Segurança

- Senhas de usuários são armazenadas com hash usando `bcrypt`.
- A senha do banco deve existir apenas no arquivo local `backend/.env`.
- Antes de publicar, confirme que nenhum segredo ou arquivo `.env` foi incluído no Git.

## Licença

Projeto acadêmico. Defina uma licença antes de reutilizá-lo ou distribuí-lo publicamente.
