import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import type { SortingState } from "@tanstack/react-table";
import { ArrowUpDown, Trash2 } from "lucide-react";
import { useWatchlistStore } from "@/features/watchlist/store";
import { useGenres } from "@/features/movies/hooks";
import { getImageUrl } from "@/shared/config";
import { Button, Badge } from "@/shared/ui";
import type { Movie } from "@/shared/types";

const columnHelper = createColumnHelper<Movie>();

export function WatchlistPage() {
  const { movies, removeMovie } = useWatchlistStore();
  const { data: genres } = useGenres();
  const [sorting, setSorting] = useState<SortingState>([]);

  const genreMap = useMemo(() => {
    if (!genres) return new Map<number, string>();
    return new Map(genres.genres.map((g) => [g.id, g.name]));
  }, [genres]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("poster_path", {
        header: "Poster",
        cell: (info) => (
          <img
            src={getImageUrl(info.getValue(), "w92")}
            alt={info.row.original.title}
            className="h-16 w-11 rounded object-cover"
          />
        ),
        enableSorting: false,
      }),
      columnHelper.accessor("title", {
        header: ({ column }) => (
          <button
            type="button"
            className="flex items-center gap-1 font-semibold"
            onClick={() => column.toggleSorting()}
          >
            Title
            <ArrowUpDown className="h-4 w-4" />
          </button>
        ),
        cell: (info) => (
          <span className="font-medium text-white">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("genre_ids", {
        header: "Genres",
        cell: (info) => (
          <div className="flex flex-wrap gap-1">
            {info.getValue().map((id) => (
              <Badge key={id} variant="secondary" className="text-xs">
                {genreMap.get(id) ?? String(id)}
              </Badge>
            ))}
          </div>
        ),
        enableSorting: false,
      }),
      columnHelper.accessor("release_date", {
        header: ({ column }) => (
          <button
            type="button"
            className="flex items-center gap-1 font-semibold"
            onClick={() => column.toggleSorting()}
          >
            Release Date
            <ArrowUpDown className="h-4 w-4" />
          </button>
        ),
        cell: (info) => {
          const value = info.getValue();
          if (!value) return <span className="text-gray-500">-</span>;
          return new Date(value).toLocaleDateString("pt-BR");
        },
      }),
      columnHelper.accessor("vote_average", {
        header: ({ column }) => (
          <button
            type="button"
            className="flex items-center gap-1 font-semibold"
            onClick={() => column.toggleSorting()}
          >
            Rating
            <ArrowUpDown className="h-4 w-4" />
          </button>
        ),
        cell: (info) => (
          <span className="flex items-center gap-1 text-yellow-400">
            <span>&#9733;</span>
            {info.getValue().toFixed(1)}
          </span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeMovie(info.row.original.id)}
            aria-label={`Remove ${info.row.original.title}`}
          >
            <Trash2 className="h-4 w-4 text-red-400" />
          </Button>
        ),
      }),
    ],
    [genreMap, removeMovie],
  );

  const table = useReactTable({
    data: movies,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Minha Lista</h1>
        <span className="text-sm text-gray-400">
          {movies.length} {movies.length === 1 ? "filme" : "filmes"}
        </span>
      </div>

      {movies.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-gray-800 bg-gray-900/50 py-20">
          <p className="text-lg text-gray-400">
            Sua lista está vazia.
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Adicione filmes para acompanhar aqui.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-800">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-800 bg-gray-900/80 text-gray-400">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-4 py-3">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-800">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="transition-colors hover:bg-gray-800/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
