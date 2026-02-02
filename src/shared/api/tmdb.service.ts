import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Config } from "@shared/config/config.service";
import type { Observable } from "rxjs";

export interface TmdbMovieResult {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface TmdbSearchMovie {
  results: TmdbMovieResult[];
}

export interface TmdbDiscoverResponse {
  page: number;
  results: TmdbMovieResult[];
  total_pages: number;
  total_results: number;
}

export interface TmdbGenre {
  id: number;
  name: string;
}

export interface TmdbMovieDetails {
  adult: boolean;
  backdrop_path: string | null;
  genres: TmdbGenre[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  runtime: number | null;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

@Injectable({ providedIn: "root" })
export class TmdbService {
  private readonly config = inject(Config);
  private readonly http = inject(HttpClient);

  private readonly baseUrl = this.config.get("apiUrl");

  getPopularMovies(page = 1): Observable<TmdbDiscoverResponse> {
    const url = `${this.baseUrl}/discover/movie`;
    const params = new HttpParams()
      .set("include_adult", "false")
      .set("include_video", "false")
      .set("language", "en-US")
      .set("page", String(page))
      .set("sort_by", "popularity.desc");

    return this.http.get<TmdbDiscoverResponse>(url, { params });
  }

  getMovieDetails(movieId: number): Observable<TmdbMovieDetails> {
    const url = `${this.baseUrl}/movie/${movieId}`;
    const params = new HttpParams().set("language", "en-US");

    return this.http.get<TmdbMovieDetails>(url, { params });
  }

  searchMovies(query: string): Observable<TmdbSearchMovie> {
    const url = `${this.baseUrl}/search/movie`;
    const params = new HttpParams().set("query", query);

    return this.http.get<TmdbSearchMovie>(url, { params });
  }
}
