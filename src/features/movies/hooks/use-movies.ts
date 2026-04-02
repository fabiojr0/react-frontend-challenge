import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { tmdbService } from "../services";

export function useTrendingMovies(page: number) {
  return useQuery({
    queryKey: ["movies", "trending", page],
    queryFn: () => tmdbService.getTrending(page),
    placeholderData: keepPreviousData,
  });
}

export function usePopularMovies(page: number) {
  return useQuery({
    queryKey: ["movies", "popular", page],
    queryFn: () => tmdbService.getPopular(page),
    placeholderData: keepPreviousData,
  });
}

export function useSearchMovies(query: string, page: number) {
  return useQuery({
    queryKey: ["movies", "search", query, page],
    queryFn: () => tmdbService.searchMovies(query, page),
    enabled: query.length > 0,
    placeholderData: keepPreviousData,
  });
}

export function useMovieDetails(id: number) {
  return useQuery({
    queryKey: ["movie", id],
    queryFn: () => tmdbService.getMovieDetails(id),
  });
}

export function useMovieCredits(id: number) {
  return useQuery({
    queryKey: ["movie", id, "credits"],
    queryFn: () => tmdbService.getMovieCredits(id),
  });
}

export function useMovieVideos(id: number) {
  return useQuery({
    queryKey: ["movie", id, "videos"],
    queryFn: () => tmdbService.getMovieVideos(id),
  });
}

export function useGenres() {
  return useQuery({
    queryKey: ["genres"],
    queryFn: () => tmdbService.getGenres(),
    staleTime: Infinity,
  });
}

export function useDiscoverMovies(
  filters: {
    genre?: string;
    yearStart?: string;
    yearEnd?: string;
    minRating?: string;
  },
  page: number
) {
  const params: Record<string, string | number> = {
    page,
    sort_by: "popularity.desc",
  };

  if (filters.genre) params.with_genres = filters.genre;
  if (filters.yearStart) params["primary_release_date.gte"] = `${filters.yearStart}-01-01`;
  if (filters.yearEnd) {
    // supports both "YYYY-MM-DD" (date input) and "YYYY" (year only)
    params["primary_release_date.lte"] = filters.yearEnd.includes("-")
      ? filters.yearEnd
      : `${filters.yearEnd}-12-31`;
  }
  if (filters.minRating) params["vote_average.gte"] = filters.minRating;

  const hasFilters = filters.genre || filters.yearStart || filters.yearEnd || filters.minRating;

  return useQuery({
    queryKey: ["movies", "discover", filters, page],
    queryFn: () => tmdbService.discoverMovies(params),
    enabled: !!hasFilters,
    placeholderData: keepPreviousData,
  });
}
