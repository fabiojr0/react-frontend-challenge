# CineDash - Instruções

## Projeto Escolhido
CineDash - Dashboard de curadoria e descoberta de filmes usando a API do TMDB.

## Pré-requisitos
- Node.js 18+
- npm ou yarn
- Conta no [TMDB](https://www.themoviedb.org/) (para API key)
- Projeto no [Supabase](https://supabase.com/) (para autenticação)

## Configuração

1. Clone o repositório:
```bash
git clone <repo-url>
cd react-frontend-challenge
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Preencha o arquivo `.env` com suas credenciais:
- `VITE_TMDB_API_KEY`: Token de leitura da API do TMDB (Read Access Token obtido em https://www.themoviedb.org/settings/api)
- `VITE_SUPABASE_URL`: URL do seu projeto Supabase
- `VITE_SUPABASE_ANON_KEY`: Chave anon/public do Supabase

4. Configure o Supabase:
   - Crie um projeto no Supabase
   - Habilite a autenticação por email/senha em Authentication > Providers > Email

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção |
| `npm run preview` | Preview do build de produção |
| `npm run lint` | Executa o ESLint |
| `npm test` | Executa os testes em modo watch |
| `npm run test:run` | Executa os testes uma vez |

## Funcionalidades

- **Autenticação**: Login/Registro com Supabase (email + senha, validação com Zod)
- **Dashboard**: Listagem de filmes trending, busca com debounce, filtros (gênero, ano, nota mínima), paginação
- **Detalhes do Filme**: Sinopse, elenco, trailer do YouTube, nota, gêneros
- **Minha Lista (Watchlist)**: Tabela com TanStack Table, ordenação, persistência com Zustand
- **Tema Dark/Light**: Persistido via Zustand
- **Responsivo**: Layout adaptável para mobile e desktop
