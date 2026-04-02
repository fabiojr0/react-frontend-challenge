Você deve construir o CineDash, um dashboard de curadoria e descoberta de filmes utilizando a API do TMDB. Imagine que este é um produto interno usado por curadores de cinema para selecionar quais filmes entrarão no catálogo de um streaming.

---

## O Objetivo

O desafio consiste em desenvolver uma aplicação Front-end que consuma uma API pública, focando na criação de interfaces ricas (Dashboards, Tabelas, Filtros) e na gestão eficiente de estado e dados assíncronos.

Use o supabase para a autencicação, persistencia, lista de favoritos 

Autenticação (Simulada): Como não temos backend, a autenticação deve ser tratada no front-end:
Tela de Login com validação via Zod (Email válido e senha > 6 caracteres).
Apenas usuários autenticados podem acessar a busca e a estante.
Diferencial: Persistir a sessão do usuário ao recarregar a página.

Dashboard de Descoberta:
Listagem de filmes (Trending/Popular) com paginação ou infinite scroll.
Requisito Técnico: Implementar Debounce no input para não floodar a API.
Paginação: Implementar paginação (botões ou infinite scroll).
Filtros Avançados: Filtrar por Gênero, Ano de Lançamento e Nota Mínima (Rating).

Minha Lista (Watchlist):
Adicionar/Remover filmes de uma lista de favoritos.
Colunas: Título, Gênero, Data de Lançamento, Rating e Ações.
Ordenação: Permitir ordenar a tabela por Título, Gênero ou Rating.
Persistência: Os dados do dashboard devem sobreviver ao refresh da página (uso de persist middleware do Zustand).

Detalhes do Filme:
Rota dinâmica (/movie/:id) exibindo sinopse, elenco, nota e trailer (se houver).
Botão para adicionar/remover do dashboard.

---

## Tech Stack Obrigatória

Para alinhar com a nossa stack atual e garantir uma avaliação justa, exigimos o uso das seguintes tecnologias. **Por favor, não utilize alternativas (ex: Redux ou Context API para estado global complexo) a menos que justificável no seu README.**

- **Core:** React 18+, TypeScript (Strict), Vite.
- **Server State & Cache:** TanStack Query.
- **Client State:** Zustand.
- **Routing:** TanStack Router (Preferencial) ou React Router v6 (com Data Loaders).
- **UI Components:** Shadcn/ui + TailwindCSS.
- **Formulários:** React Hook Form ou TanStack Form + Zod (validação).
- **Testes:** Vitest + React Testing Library.

> **Diferencial:** Implementação de `TanStack Table` para listagens complexas.

---

### 1. Arquitetura e Organização

- Uso de **Feature-Sliced Design (FSD)**, Clean Architecture ou uma estrutura modular sólida.
- Separação clara entre UI (Componentes), Lógica (Hooks) e Dados (Services/Adapters).
- Código limpo, legível e seguindo princípios SOLID.

### 2. Qualidade Técnica

- Domínio do **TypeScript** (evitar `any`, tipagem correta de generics e props).
- Uso correto do **TanStack Query** (cache keys, invalidation, prefetching).
- Tratamento de erros e estados de loading (Skeletons, Error Boundaries).
- Performance (memorização onde necessário, debouncing em buscas).

### 3. Testes e Confiabilidade

- Não buscamos 100% de cobertura, mas sim **testes significativos**.
- Testes unitários em hooks complexos e utilitários.
- Testes de integração nos fluxos principais (ex: Adicionar item à lista, filtrar tabela).

### 4. Documentação e Git

- Histórico de commits organizado.
- Arquivo `INSTRUCTIONS.md` com instruções claras de como rodar o projeto e qual projeto foi escolhido.
- Arquivo `ARCHITECTURE.md` explicando suas decisões técnicas (Por que usou X? Como resolveu Y?).



Layout responsivo e fluido.
Feedback visual para o usuário (Loadings, Skeletons, Toasts de erro/sucesso).
Tema Dark/Light (persistido via Zustand).
Feature-Sliced Design (FSD) ou Clean Architecture adaptada ao Frontend.
Isolamento de regras de negócio (hooks customizados vs componentes de UI).

