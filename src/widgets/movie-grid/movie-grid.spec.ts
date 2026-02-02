import { TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MovieGrid } from "./movie-grid";
import { MovieCard } from "@widgets/movie-card/movie-card";
import type { MovieEntity } from "@entities/movie/model/movie.mapper";

const movies: MovieEntity[] = [
  {
    id: 1,
    title: "One",
    posterPath: null,
    backdropPath: null,
    rating: 7,
    displayRating: "7.0",
    year: "2024",
    genreIds: [10],
    overview: "Overview",
    favourite: false,
  },
  {
    id: 2,
    title: "Two",
    posterPath: null,
    backdropPath: null,
    rating: 8,
    displayRating: "8.0",
    year: "2023",
    genreIds: [11],
    overview: "Overview",
    favourite: true,
  },
];

describe("MovieGrid", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieGrid],
    }).compileComponents();
  });

  it("should pass action flag to movie cards", () => {
    const fixture = TestBed.createComponent(MovieGrid);
    const component = fixture.componentInstance;
    component.movies = movies;
    component.showActions = true;
    fixture.detectChanges();

    const cards = fixture.debugElement.queryAll(By.directive(MovieCard));
    expect(cards.length).toBe(2);
    expect(cards[0].componentInstance.showActions).equal(true);
  });

  it("emits onCardDetailsClick with movie id and index", () => {
    const fixture = TestBed.createComponent(MovieGrid);
    const component = fixture.componentInstance;
    const spy = vi.fn();
    component.onCardDetailsClick.subscribe(spy);
    component.handleCardClick(2, 1);
    expect(spy).toHaveBeenCalledWith({ movieId: 2, idx: 1 });
  });

  it("emits edit and delete outputs", () => {
    const fixture = TestBed.createComponent(MovieGrid);
    const component = fixture.componentInstance;
    const editSpy = vi.fn();
    const deleteSpy = vi.fn();
    component.onEditClick.subscribe(editSpy);
    component.onDeleteClick.subscribe(deleteSpy);

    component.handleEditClick(1);
    component.handleDeleteClick(2);

    expect(editSpy).toHaveBeenCalledWith(1);
    expect(deleteSpy).toHaveBeenCalledWith(2);
  });
});
