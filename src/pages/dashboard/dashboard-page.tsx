import { useState, useMemo, useRef, useEffect } from "react";
import {
  useGenres,
  useTrendingMovies,
  useSearchMovies,
  useDiscoverMovies,
  useDebounce,
} from "@/features/movies/hooks";
import { MovieCard, MovieCardSkeleton } from "@/shared/ui/movie-card";
import { Pagination } from "@/shared/ui/pagination";
import { Input } from "@/shared/ui";
import { Star, X, RotateCcw } from "lucide-react";
import { Button } from "@/shared/ui";
import { cn } from "@/lib/utils";

function GenreCombobox({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? "";

  const filtered = useMemo(() => {
    if (!query) return options;
    const lower = query.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(lower));
  }, [options, query]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative w-56">
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar gênero..."
          value={open ? query : selectedLabel || ""}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => {
            setOpen(true);
            setQuery("");
          }}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors",
            "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          )}
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange("");
              setQuery("");
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      {open && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-border bg-popover shadow-lg">
          {filtered.length === 0 ? (
            <p className="px-3 py-2 text-sm text-muted-foreground">Nenhum resultado</p>
          ) : (
            filtered.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setQuery("");
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center px-3 py-2 text-sm transition-colors hover:bg-accent",
                  opt.value === value && "bg-accent font-medium"
                )}
              >
                {opt.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function RatingSlider({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const numValue = value ? Number(value) : 0;

  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        min={0}
        max={9}
        step={0.5}
        value={numValue}
        onChange={(e) => {
          const v = Number(e.target.value);
          onChange(v === 0 ? "" : String(v));
        }}
        className="h-2 w-36 cursor-pointer appearance-none rounded-full bg-muted accent-primary"
      />
      <span className="flex min-w-14 items-center gap-1 text-sm font-medium">
        {numValue > 0 ? (
          <>
            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
            {numValue}+
          </>
        ) : (
          <span className="text-muted-foreground">Qualquer</span>
        )}
      </span>
    </div>
  );
}

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

  const genreOptions = useMemo(
    () => [
      { value: "", label: "Todos os gêneros" },
      ...(genres?.genres.map((g) => ({ value: String(g.id), label: g.name })) ?? []),
    ],
    [genres]
  );

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value);
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
            <label className="text-sm font-medium">Gênero</label>
            <GenreCombobox
              options={genreOptions}
              value={genre}
              onChange={(v) => { setGenre(v); setPage(1); }}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Ano</label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="De"
                min={1900}
                max={2030}
                value={yearStart}
                onChange={(e) => {
                  setYearStart(e.target.value);
                  setPage(1);
                }}
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">—</span>
              <Input
                type="number"
                placeholder="Até"
                min={1900}
                max={2030}
                value={yearEnd}
                onChange={(e) => {
                  setYearEnd(e.target.value);
                  setPage(1);
                }}
                className="w-24"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Nota mínima</label>
            <RatingSlider
              value={minRating}
              onChange={(v) => { setMinRating(v); setPage(1); }}
            />
          </div>
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setGenre("");
                setYearStart("");
                setYearEnd("");
                setMinRating("");
                setPage(1);
              }}
              className="mb-0.5 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              Limpar filtros
            </Button>
          )}
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
