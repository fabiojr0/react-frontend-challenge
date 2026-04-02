import { supabase } from "@/shared/config";
import type { Movie } from "@/shared/types";

export const watchlistService = {
  async fetch(userId: string): Promise<Movie[]> {
    const { data, error } = await supabase
      .from("watchlist")
      .select("movie_id, movie_data")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data ?? []).map((row) => row.movie_data as Movie);
  },

  async add(userId: string, movie: Movie) {
    const { error } = await supabase.from("watchlist").insert({
      user_id: userId,
      movie_id: movie.id,
      movie_data: movie,
    });

    if (error && error.code !== "23505") throw error; // ignora duplicata
  },

  async remove(userId: string, movieId: number) {
    const { error } = await supabase
      .from("watchlist")
      .delete()
      .eq("user_id", userId)
      .eq("movie_id", movieId);

    if (error) throw error;
  },
};
