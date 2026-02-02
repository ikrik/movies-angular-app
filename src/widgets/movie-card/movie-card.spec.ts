import { TestBed } from "@angular/core/testing";
import type { MovieEntity } from "@entities/movie/model/movie.mapper";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MovieCard } from "./movie-card";

const sampleMovie: MovieEntity = {
  id: 1,
  title: "Test Movie",
  posterPath: null,
  backdropPath: null,
  rating: 7.2,
  displayRating: "7.2",
  year: "2024",
  genreIds: [12],
  overview: "Overview",
  favourite: false,
};

describe("MovieCard", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieCard],
    }).compileComponents();
  });

  it("should emit onCardClick when card is clicked", () => {
    const fixture = TestBed.createComponent(MovieCard);
    const component = fixture.componentInstance;
    component.movie = sampleMovie;
    const spy = vi.fn();
    component.onCardClick.subscribe(spy);
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector(".movie-card") as HTMLElement;
    card.click();

    expect(spy).toHaveBeenCalledWith(sampleMovie.id);
  });

  it("should emit favorite toggle when favorite button is clicked", () => {
    const fixture = TestBed.createComponent(MovieCard);
    const component = fixture.componentInstance;
    component.movie = sampleMovie;
    const spy = vi.fn();
    component.onFavoriteToggle.subscribe(spy);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector(
      "button[aria-label='Toggle favorite']",
    ) as HTMLButtonElement;
    button.click();

    expect(spy).toHaveBeenCalledWith(sampleMovie.id);
  });

  it("should show edit/delete actions when enabled", () => {
    const fixture = TestBed.createComponent(MovieCard);
    const component = fixture.componentInstance;
    component.movie = sampleMovie;
    component.showActions = true;
    const editSpy = vi.fn();
    const deleteSpy = vi.fn();
    component.onEditClick.subscribe(editSpy);
    component.onDeleteClick.subscribe(deleteSpy);
    fixture.detectChanges();

    const editButton = fixture.nativeElement.querySelector(
      "button[aria-label='Edit movie']",
    ) as HTMLButtonElement;
    const deleteButton = fixture.nativeElement.querySelector(
      "button[aria-label='Delete movie']",
    ) as HTMLButtonElement;

    expect(editButton).toBeTruthy();
    expect(deleteButton).toBeTruthy();

    editButton.click();
    deleteButton.click();

    expect(editSpy).toHaveBeenCalledWith(sampleMovie.id);
    expect(deleteSpy).toHaveBeenCalledWith(sampleMovie.id);
  });

  it("should hide actions when disabled", () => {
    const fixture = TestBed.createComponent(MovieCard);
    const component = fixture.componentInstance;
    component.movie = sampleMovie;
    component.showActions = false;
    fixture.detectChanges();

    const editButton = fixture.nativeElement.querySelector(
      "button[aria-label='Edit movie']",
    ) as HTMLButtonElement | null;
    const deleteButton = fixture.nativeElement.querySelector(
      "button[aria-label='Delete movie']",
    ) as HTMLButtonElement | null;

    expect(editButton).toBeNull();
    expect(deleteButton).toBeNull();
  });
});
