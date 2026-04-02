# CineDash

Dashboard de curadoria e descoberta de filmes utilizando a API do TMDB. Produto interno para curadores de cinema selecionarem filmes para o catálogo de um streaming.

## Funcionalidades

### Autenticação
- Login e registro com Supabase (email + senha)
- Validação de formulários com Zod (email válido, senha > 6 caracteres, confirmação de senha)
- Sessão persistida automaticamente ao recarregar a página
- Rotas protegidas: apenas usuários autenticados acessam o dashboard

### Dashboard de Descoberta
- Listagem de filmes trending/popular com paginação
- Busca com debounce (300ms) para não sobrecarregar a API
- Filtros avançados: gênero (combobox com busca), range de ano, nota mínima (slider)
- Botão para resetar todos os filtros

### Minha Lista (Watchlist)
- Adicionar/remover filmes da lista de favoritos
- Tabela com TanStack Table: Poster, Título (link direto), Gênero, Data de Lançamento, Rating, Ações
- Ordenação por Título, Data ou Rating
- Persistência via Zustand persist middleware (sobrevive ao refresh)

### Detalhes do Filme
- Rota dinâmica `/movie/:id` com backdrop, poster, sinopse, elenco (scroll horizontal estilizado), trailer do YouTube
- Botão para adicionar/remover da watchlist

### UI/UX
- Tema Dark/Light (amarelo com preto) persistido via Zustand
- Layout responsivo (mobile + desktop) com navegação bottom bar no mobile
- Feedback visual: skeletons de loading, toasts de erro/sucesso

## Tech Stack

| Categoria | Tecnologia |
|-----------|-----------|
| Core | React 19, TypeScript (Strict), Vite |
| Server State | TanStack Query |
| Client State | Zustand (com persist) |
| Routing | React Router v6 |
| UI | Shadcn/ui pattern + TailwindCSS v4 |
| Tabelas | TanStack Table |
| Formulários | React Hook Form + Zod |
| Auth | Supabase |
| Testes | Vitest + React Testing Library |

## Arquitetura

Feature-Sliced Design (FSD) com separação clara entre UI, lógica e dados.

```
src/
├── app/           # Providers, Router
├── features/      # Auth, Movies, Theme, Watchlist
├── pages/         # Login, Dashboard, Movie, Watchlist
├── shared/        # Config, Types, UI components
├── widgets/       # Layout
└── lib/           # Utilitários
```

Veja [ARCHITECTURE.md](ARCHITECTURE.md) para detalhes das decisões técnicas e [INSTRUCTIONS.md](INSTRUCTIONS.md) para instruções de setup.
