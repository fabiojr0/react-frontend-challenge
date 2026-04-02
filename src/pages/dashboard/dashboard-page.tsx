import { useState } from "react";
import {
  useGenres,
  useTrendingMovies,
  useSearchMovies,
  useDiscoverMovies,
  useDebounce,
} from "@/features/movies/hooks";
import { MovieCard, MovieCardSkeleton } from "@/shared/ui/movie-card";
import { Pagination } from "@/shared/ui/pagination";
import { Input, Select } from "@/shared/ui";

const RATING_OPTIONS = [
  { value: "", label: "Qualquer nota" },
  { value: "5", label: "5+" },
  { value: "6", label: "6+" },
  { value: "7", label: "7+" },
  { value: "8", label: "8+" },
  { value: "9", label: "9+" },
];

export function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [genre, setGenre] = useState("");
  const [yearStart, setYearStart] = useState("");
  const [yearEnd, setYearEnd] = useState("");
  const [minRating, setMinRating] = useState("");

  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data: genres } = useGenres();

  const filters = { genre, yearStart, yearEnd, minRating };
  const hasFilters = !!(genre || yearStart || yearEnd || minRating);
  const hasSearch = debouncedSearch.length > 0;

  const trendingQuery = useTrendingMovies(page);
  const searchMoviesQuery = useSearchMovies(debouncedSearch, page);
  const discoverQuery = useDiscoverMovies(filters, page);

  const activeQuery = hasSearch
    ? searchMoviesQuery
    : hasFilters
      ? discoverQuery
      : trendingQuery;

  const movies = activeQuery.data?.results ?? [];
  const totalPages = Math.min(activeQuery.data?.total_pages ?? 1, 500);
  const isLoading = activeQuery.isLoading;

  const genreOptions = [
    { value: "", label: "Todos os generos" },
    ...(genres?.genres.map((g) => ({ value: String(g.id), label: g.name })) ?? []),
  ];

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value);
    setPage(1);
  }

  function handleGenreChange(value: string) {
    setGenre(value);
    setPage(1);
  }

  function handleMinRatingChange(value: string) {
    setMinRating(value);
    setPage(1);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
      <h1 className="text-3xl font-bold tracking-tight">Descobrir Filmes</h1>

      {/* Search */}
      <Input
        placeholder="Buscar filmes..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="max-w-md"
      />

      {/* Filters */}
      {!hasSearch && (
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Genero</label>
            <Select
              options={genreOptions}
              value={genre}
              onChange={handleGenreChange}
              className="w-48"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Ano (de)</label>
            <Input
              type="number"
              placeholder="Ex: 2000"
              value={yearStart}
              onChange={(e) => {
                setYearStart(e.target.value);
                setPage(1);
              }}
              className="w-28"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Ano (ate)</label>
            <Input
              type="number"
              placeholder="Ex: 2025"
              value={yearEnd}
              onChange={(e) => {
                setYearEnd(e.target.value);
                setPage(1);
              }}
              className="w-28"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Nota minima</label>
            <Select
              options={RATING_OPTIONS}
              value={minRating}
              onChange={handleMinRatingChange}
              className="w-36"
            />
          </div>
        </div>
      )}

      {/* Movie Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {isLoading
          ? Array.from({ length: 20 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))
          : movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
      </div>

      {/* Empty state */}
      {!isLoading && movies.length === 0 && (
        <p className="text-center text-muted-foreground">
          Nenhum filme encontrado.
        </p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
