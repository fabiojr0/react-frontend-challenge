import { tmdbFetch } from "@/shared/config";
import type {
  TMDBResponse,
  Movie,
  MovieDetails,
  MovieCredits,
  MovieVideos,
  Genre,
} from "@/shared/types";

export const tmdbService = {
  getTrending: (page = 1) =>
    tmdbFetch<TMDBResponse<Movie>>("/trending/movie/week", { page }),

  getPopular: (page = 1) =>
    tmdbFetch<TMDBResponse<Movie>>("/movie/popular", { page }),

  searchMovies: (query: string, page = 1) =>
    tmdbFetch<TMDBResponse<Movie>>("/search/movie", { query, page }),

  getMovieDetails: (id: number) =>
    tmdbFetch<MovieDetails>(`/movie/${id}`),

  getMovieCredits: (id: number) =>
    tmdbFetch<MovieCredits>(`/movie/${id}/credits`),

  getMovieVideos: (id: number) =>
    tmdbFetch<MovieVideos>(`/movie/${id}/videos`),

  getGenres: () =>
    tmdbFetch<{ genres: Genre[] }>("/genre/movie/list"),

  discoverMovies: (params: {
    page?: number;
    with_genres?: string;
    "primary_release_date.gte"?: string;
    "primary_release_date.lte"?: string;
    "vote_average.gte"?: string;
    sort_by?: string;
  }) =>
    tmdbFetch<TMDBResponse<Movie>>("/discover/movie", params as Record<string, string | number>),
};
