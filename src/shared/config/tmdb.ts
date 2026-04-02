import { ENV } from "./env";

export async function tmdbFetch<T>(
  endpoint: string,
  params?: Record<string, string | number>
): Promise<T> {
  const url = new URL(`${ENV.TMDB_BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", ENV.TMDB_API_KEY);
  url.searchParams.set("language", "pt-BR");

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export function getImageUrl(path: string | null, size = "w500"): string {
  if (!path) return "/placeholder-movie.svg";
  return `${ENV.TMDB_IMAGE_BASE_URL}/${size}${path}`;
}
