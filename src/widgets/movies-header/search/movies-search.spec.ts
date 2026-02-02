import { TestBed } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MovieActionsService } from "@features/movies/movie-actions.service";
import { type TmdbSearchMovie, TmdbService } from "@shared/api/tmdb.service";
import { of } from "rxjs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MoviesSearch } from "./movies-search";

describe("MoviesSearch", () => {
  const tmdbServiceMock = {
    searchMovies: vi.fn((query: string) =>
      of<TmdbSearchMovie>({
        results: [
          {
            adult: false,
            backdrop_path: null,
            genre_ids: [],
            id: 123,
            original_language: "en",
            original_title: "Test Movie",
            overview: "Overview",
            popularity: 0,
            poster_path: null,
            release_date: "2024-01-01",
            title: "Test Movie",
            video: false,
            vote_average: 7.5,
            vote_count: 10,
          },
        ],
      }),
    ),
  };

  const actionsMock = {
    goToDetails: vi.fn(),
  };

  beforeEach(async () => {
    tmdbServiceMock.searchMovies.mockClear();
    actionsMock.goToDetails.mockClear();
    vi.useFakeTimers();
    await TestBed.configureTestingModule({
      imports: [MoviesSearch, NoopAnimationsModule],
      providers: [
        { provide: TmdbService, useValue: tmdbServiceMock },
        { provide: MovieActionsService, useValue: actionsMock },
      ],
    }).compileComponents();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("calls searchMovies after debounce", () => {
    const fixture = TestBed.createComponent(MoviesSearch);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.searchControl.setValue("Inception");
    vi.advanceTimersByTime(351);

    expect(tmdbServiceMock.searchMovies).toHaveBeenCalledWith("Inception");
  });

  it("does not search for short queries", () => {
    const fixture = TestBed.createComponent(MoviesSearch);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.searchControl.setValue("ab");
    vi.advanceTimersByTime(351);

    expect(tmdbServiceMock.searchMovies).not.toHaveBeenCalledWith("ab");
  });

  it("navigates to first result on enter", () => {
    const fixture = TestBed.createComponent(MoviesSearch);
    const component = fixture.componentInstance;
    (component as unknown as { latestResults: { id: number; title: string }[] }).latestResults = [
      { id: 123, title: "Test Movie" },
    ];

    component.searchControl.setValue("Test Movie");
    component.onEnter();

    expect(actionsMock.goToDetails).toHaveBeenCalledWith(123);
  });
});
