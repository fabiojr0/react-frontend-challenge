import { describe, it, expect, beforeEach } from "vitest";
import { useWatchlistStore } from "../watchlist-store";
import type { Movie } from "@/shared/types";

const mockMovie: Movie = {
  id: 1,
  title: "Test Movie",
  overview: "Test overview",
  poster_path: "/test.jpg",
  backdrop_path: "/test-bg.jpg",
  release_date: "2024-01-01",
  vote_average: 8.5,
  vote_count: 100,
  genre_ids: [28, 12],
  popularity: 100,
  original_language: "en",
  adult: false,
  video: false,
};

const mockMovie2: Movie = {
  ...mockMovie,
  id: 2,
  title: "Test Movie 2",
};

describe("watchlistStore", () => {
  beforeEach(() => {
    useWatchlistStore.setState({ movies: [] });
  });

  it("deve adicionar um filme à watchlist", () => {
    useWatchlistStore.getState().addMovie(mockMovie);
    expect(useWatchlistStore.getState().movies).toHaveLength(1);
    expect(useWatchlistStore.getState().movies[0].id).toBe(1);
  });

  it("não deve adicionar filmes duplicados", () => {
    useWatchlistStore.getState().addMovie(mockMovie);
    useWatchlistStore.getState().addMovie(mockMovie);
    expect(useWatchlistStore.getState().movies).toHaveLength(1);
  });

  it("deve remover um filme da watchlist", () => {
    useWatchlistStore.getState().addMovie(mockMovie);
    useWatchlistStore.getState().addMovie(mockMovie2);
    useWatchlistStore.getState().removeMovie(1);
    expect(useWatchlistStore.getState().movies).toHaveLength(1);
    expect(useWatchlistStore.getState().movies[0].id).toBe(2);
  });

  it("deve verificar se o filme está na watchlist", () => {
    useWatchlistStore.getState().addMovie(mockMovie);
    expect(useWatchlistStore.getState().isInWatchlist(1)).toBe(true);
    expect(useWatchlistStore.getState().isInWatchlist(999)).toBe(false);
  });
});
