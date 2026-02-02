export const TMDB_IMG_BASE = "https://image.tmdb.org/t/p";

export type TmdbPosterSize =
  | "w92"
  | "w154"
  | "w185"
  | "w342"
  | "w500"
  | "w780"
  | "original";

export function tmdbPosterUrl(
  path: string | null | undefined,
  size: TmdbPosterSize,
): string | null {
  if (!path) {
    return null;
  }
  return `${TMDB_IMG_BASE}/${size}${path}`;
}
