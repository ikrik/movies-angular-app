# Task Brief

## Objective

Build a production-quality Angular application that demonstrates strong frontend engineering fundamentals:

- scalable architecture
- reliable state management
- robust async/data handling
- smooth navigation UX
- persistence across refreshes
- maintainable UI components

This is not a demo-only prototype. The expectation is a thoughtful implementation that can be extended without major rewrites.

## Required Stack (minimum expectations)

- Angular `19+` (or latest stable)
- RxJS
- Standalone Components
- NgRx Store or **NgRx SignalStore**
- A component library (PrimeNG or equivalent, e.g. Angular Material / Bootstrap)
- Unit testing setup (Karma/Jasmine requested in the original task)

Estimated effort: approximately **1 full week**.

## Core Product Requirements

Create a movie-style listing application (or similar items domain) that supports:

- browsing a list of items
- endless/incremental loading when the user reaches the end of the page
- a dedicated details page for a selected item
- a dedicated favorites page

## Functional Requirements

The application must allow the user to:

- update an item
- delete an item
- search and find a movie/character across the list
- add/remove movies from a favorites list
- open and view item details on a separate route
- open and view favorite movies on a separate route
- return to the correct list position after navigating back from Details or Favorites
- preserve changes after page refresh (state persistence)
- receive clear user feedback when an HTTP request fails

## Data Source

You may use:

- mock data
- a free public API (for example TMDB)
- an in-memory API

## Quality Bar

The solution should demonstrate:

- clear folder/module boundaries
- predictable state transitions
- defensive error handling
- usable loading/empty/error states
- reasonable test coverage for important components/services (optional in the brief, but strongly recommended)

## Deliverable Expectation

Provide a working application that is easy to run locally, easy to review, and clearly documents:

- setup steps
- implementation choices
- known tradeoffs (if any)
