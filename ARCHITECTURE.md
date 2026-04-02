# CineDash - Arquitetura

## Visão Geral

O CineDash segue uma arquitetura inspirada em **Feature-Sliced Design (FSD)**, adaptada para o escopo do projeto. A estrutura prioriza a separação de responsabilidades e a modularidade.

## Decisões Técnicas

### Server State: TanStack Query
- **Cache automático**: Filmes e gêneros são cacheados, evitando requisições desnecessárias
- **`placeholderData: keepPreviousData`**: Mantém dados anteriores durante paginação, evitando flicker
- **`staleTime`**: Configurado para 5 minutos por padrão, gêneros com `Infinity` (raramente mudam)
- **Keys hierárquicas**: `["movies", "trending", page]` permite invalidação granular

### Client State: Zustand
- **Watchlist store**: Lista de filmes favoritos, persistida com `persist` middleware no localStorage
- **Theme store**: Tema dark/light, também persistido
- **Por que Zustand?**: API simples, suporte nativo a persist, sem boilerplate de providers

### Autenticação: Supabase
- **Login/Registro real**: Usa Supabase Auth com email/senha
- **Sessão persistida**: O Supabase persiste a sessão automaticamente via localStorage
- **Listener de mudanças**: `onAuthStateChange` mantém o estado sincronizado

### Validação: Zod + React Hook Form
- **Schema Zod**: Email válido e senha > 6 caracteres
- **React Hook Form**: Gerencia estado do formulário com re-renders mínimos
- **`zodResolver`**: Integração entre os dois

### UI: Shadcn/ui Pattern + TailwindCSS
- **Componentes estilo Shadcn**: Button, Input, Card, Badge, Select, Dialog, Skeleton
- **TailwindCSS v4**: Variáveis CSS para tema dark/light
- **`cn()` utility**: Merge de classes Tailwind com clsx + tailwind-merge

### Tabela: TanStack Table
- **Watchlist**: Usa TanStack Table com ordenação (título, data, nota)
- **Column helpers**: Tipagem forte das colunas
- **Sorting**: Estado controlado com `SortingState`

### Busca com Debounce
- **Hook customizado `useDebounce`**: Atrasa a busca em 300ms para não sobrecarregar a API
- **Experiência fluida**: Mostra resultados anteriores enquanto busca (keepPreviousData)

### Roteamento: React Router v6
- **Rotas protegidas**: `ProtectedRoute` redireciona para login se não autenticado
- **Rota pública**: `PublicRoute` redireciona para dashboard se já autenticado
- **Rota dinâmica**: `/movie/:id` para detalhes do filme

### Testes: Vitest + React Testing Library
- **Stores**: Testes unitários para watchlist e theme stores
- **Hooks**: Teste do useDebounce com fake timers
- **Foco em lógica**: Testes nos hooks e stores que contêm regras de negócio
