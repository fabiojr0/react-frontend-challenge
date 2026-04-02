import { create } from "zustand";
import { supabase } from "@/shared/config";
import { watchlistService } from "../services/watchlist-service";
import type { Movie } from "@/shared/types";

interface WatchlistState {
  movies: Movie[];
  loading: boolean;
  addMovie: (movie: Movie) => void;
  removeMovie: (movieId: number) => void;
  isInWatchlist: (movieId: number) => boolean;
  fetchWatchlist: () => Promise<void>;
}

async function getUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export const useWatchlistStore = create<WatchlistState>()((set, get) => ({
  movies: [],
  loading: false,

  fetchWatchlist: async () => {
    const userId = await getUserId();
    if (!userId) return;

    set({ loading: true });
    try {
      const movies = await watchlistService.fetch(userId);
      set({ movies });
    } finally {
      set({ loading: false });
    }
  },

  addMovie: (movie) => {
    const state = get();
    if (state.movies.some((m) => m.id === movie.id)) return;

    set({ movies: [...state.movies, movie] });

    getUserId().then((userId) => {
      if (userId) watchlistService.add(userId, movie);
    });
  },

  removeMovie: (movieId) => {
    set((state) => ({
      movies: state.movies.filter((m) => m.id !== movieId),
    }));

    getUserId().then((userId) => {
      if (userId) watchlistService.remove(userId, movieId);
    });
  },

  isInWatchlist: (movieId) => get().movies.some((m) => m.id === movieId),
}));
