import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Star, Clock, Calendar } from "lucide-react";
import { useMovieDetails, useMovieCredits, useMovieVideos } from "@/features/movies/hooks";
import { useWatchlistStore } from "@/features/watchlist/store";
import { getImageUrl } from "@/shared/config";
import { Badge, Button, Skeleton } from "@/shared/ui";
import type { MovieDetails } from "@/shared/types";
import type { Movie } from "@/shared/types";

function toMovie(details: MovieDetails): Movie {
  return {
    id: details.id,
    title: details.title,
    overview: details.overview,
    poster_path: details.poster_path,
    backdrop_path: details.backdrop_path,
    release_date: details.release_date,
    vote_average: details.vote_average,
    vote_count: details.vote_count,
    genre_ids: details.genres.map((g) => g.id),
    popularity: details.popularity,
    original_language: details.original_language,
    adult: details.adult,
    video: details.video,
  };
}

function MoviePageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Skeleton className="h-[400px] w-full rounded-none" />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-8 md:flex-row">
          <Skeleton className="h-[450px] w-[300px] shrink-0 rounded-lg" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-24 w-full" />
            <div className="flex gap-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
        <div className="mt-12 space-y-4">
          <Skeleton className="h-8 w-40" />
          <div className="flex gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="shrink-0 space-y-2">
                <Skeleton className="h-[180px] w-[120px] rounded-lg" />
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-3 w-[80px]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MoviePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const movieId = Number(id);

  const { data: movie, isLoading: isLoadingMovie } = useMovieDetails(movieId);
  const { data: credits } = useMovieCredits(movieId);
  const { data: videos } = useMovieVideos(movieId);

  const { addMovie, removeMovie, isInWatchlist } = useWatchlistStore();
  const inWatchlist = movie ? isInWatchlist(movie.id) : false;

  const trailer = videos?.results.find(
    (v) => v.site === "YouTube" && v.type === "Trailer"
  );

  if (isLoadingMovie || !movie) {
    return <MoviePageSkeleton />;
  }

  const handleWatchlistToggle = () => {
    if (inWatchlist) {
      removeMovie(movie.id);
    } else {
      addMovie(toMovie(movie));
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Backdrop */}
      <div className="relative h-[300px] w-full sm:h-[400px]">
        <img
          src={getImageUrl(movie.backdrop_path, "w1280")}
          alt={movie.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 rounded-full bg-black/40 text-white hover:bg-black/60"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 pb-16">
        <div className="-mt-32 flex flex-col gap-8 md:-mt-48 md:flex-row">
          {/* Poster */}
          <img
            src={getImageUrl(movie.poster_path, "w500")}
            alt={movie.title}
            className="h-auto w-[200px] shrink-0 self-center rounded-lg shadow-2xl md:w-[300px] md:self-start"
          />

          {/* Details */}
          <div className="relative flex-1 space-y-4 pt-4">
            <h1 className="text-3xl font-bold md:text-4xl">{movie.title}</h1>

            {movie.tagline && (
              <p className="text-lg italic text-gray-400">{movie.tagline}</p>
            )}

            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <Badge key={genre.id} variant="secondary">
                  {genre.name}
                </Badge>
              ))}
            </div>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                {movie.vote_average.toFixed(1)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {movie.runtime} min
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {movie.release_date}
              </span>
            </div>

            {/* Overview */}
            <p className="leading-relaxed text-gray-300">{movie.overview}</p>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button onClick={handleWatchlistToggle} variant={inWatchlist ? "destructive" : "default"}>
                <Heart className={`mr-2 h-4 w-4 ${inWatchlist ? "fill-current" : ""}`} />
                {inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
              </Button>
            </div>
          </div>
        </div>

        {/* Cast Section */}
        {credits && credits.cast.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 text-2xl font-semibold">Cast</h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {credits.cast.slice(0, 20).map((member) => (
                <div key={member.id} className="w-[120px] shrink-0">
                  <img
                    src={getImageUrl(member.profile_path, "w185")}
                    alt={member.name}
                    className="h-[180px] w-full rounded-lg object-cover"
                  />
                  <p className="mt-2 truncate text-sm font-medium">{member.name}</p>
                  <p className="truncate text-xs text-gray-400">{member.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Trailer Section */}
        {trailer && (
          <section className="mt-12">
            <h2 className="mb-4 text-2xl font-semibold">Trailer</h2>
            <div className="aspect-video w-full max-w-3xl overflow-hidden rounded-lg">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title={trailer.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
