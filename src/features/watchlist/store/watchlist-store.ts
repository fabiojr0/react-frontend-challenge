import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Movie } from "@/shared/types";

interface WatchlistState {
  movies: Movie[];
  addMovie: (movie: Movie) => void;
  removeMovie: (movieId: number) => void;
  isInWatchlist: (movieId: number) => boolean;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      movies: [],
      addMovie: (movie) =>
        set((state) => {
          if (state.movies.some((m) => m.id === movie.id)) return state;
          return { movies: [...state.movies, movie] };
        }),
      removeMovie: (movieId) =>
        set((state) => ({
          movies: state.movies.filter((m) => m.id !== movieId),
        })),
      isInWatchlist: (movieId) => get().movies.some((m) => m.id === movieId),
    }),
    { name: "cinedash-watchlist" }
  )
);
