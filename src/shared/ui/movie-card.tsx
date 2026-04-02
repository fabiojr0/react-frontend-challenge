import { Link } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import type { Movie } from "@/shared/types";
import { getImageUrl } from "@/shared/config";
import { useWatchlistStore } from "@/features/watchlist/store";
import { cn } from "@/lib/utils";
import { Badge, Button } from "@/shared/ui";
import { Skeleton } from "@/shared/ui";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const { addMovie, removeMovie, isInWatchlist } = useWatchlistStore();
  const inWatchlist = isInWatchlist(movie.id);
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";

  function handleWatchlistToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (inWatchlist) {
      removeMovie(movie.id);
    } else {
      addMovie(movie);
    }
  }

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="group relative flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={getImageUrl(movie.poster_path)}
          alt={movie.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
        />
        <Badge
          className="absolute left-2 top-2 flex items-center gap-1 bg-black/70 text-yellow-400"
        >
          <Star className="h-3 w-3 fill-yellow-400" />
          {movie.vote_average.toFixed(1)}
        </Badge>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 bg-black/50 text-white hover:bg-black/70"
          onClick={handleWatchlistToggle}
          aria-label={inWatchlist ? "Remover da watchlist" : "Adicionar à watchlist"}
        >
          <Heart
            className={cn(
              "h-4 w-4",
              inWatchlist && "fill-red-500 text-red-500",
            )}
          />
        </Button>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 text-sm font-semibold leading-tight">
          {movie.title}
        </h3>
        <span className="text-xs text-muted-foreground">{releaseYear}</span>
      </div>
    </Link>
  );
}

export function MovieCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm">
      <Skeleton className="aspect-[2/3] w-full" />
      <div className="flex flex-col gap-2 p-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  );
}
