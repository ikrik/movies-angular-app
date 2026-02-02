import type { TmdbMovieResult } from "@shared/api/tmdb.service";

export interface MovieEntity {
  id: number;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  rating: number;
  displayRating: string;
  year: string;
  genreIds: number[];
  overview: string;
  favourite: boolean;
}

export const mapTmdbMovieToEntity = (movie: TmdbMovieResult): MovieEntity => ({
  id: movie.id,
  title: movie.title,
  posterPath: movie.poster_path,
  backdropPath: movie.backdrop_path,
  rating: movie.vote_average,
  displayRating: movie.vote_average.toFixed(1),
  year: movie.release_date ? movie.release_date.slice(0, 4) : "—",
  genreIds: movie.genre_ids,
  overview: movie.overview,
  favourite: false,
});
