import { createSelector, createFeatureSelector } from "@ngrx/store";
import { LogbookState } from "../state/logbooks.store";

const selectLogbookState = createFeatureSelector<LogbookState>("logbooks");

export const selectLogbooks = createSelector(
  selectLogbookState,
  (state) => state.logbooks,
);

export const selectCurrentLogbook = createSelector(
  selectLogbookState,
  (state) => state.currentLogbook,
);

export const selectEntriesCount = createSelector(
  selectLogbookState,
  (state) => state.totalCount,
);

export const selectHasPrefilledFilters = createSelector(
  selectLogbookState,
  (state) => state.hasPrefilledFilters,
);

export const selectFilters = createSelector(
  selectLogbookState,
  (state) => state.filters,
);

export const selectEntriesPerPage = createSelector(
  selectFilters,
  (filters) => filters.limit,
);

export const selectPage = createSelector(selectFilters, (filters) => {
  const { skip, limit } = filters;
  return skip / limit;
});

export const selectLogbooksDashboardPageViewModel = createSelector(
  selectCurrentLogbook,
  selectEntriesCount,
  selectEntriesPerPage,
  selectPage,
  selectFilters,
  (logbook, entriesCount, entriesPerPage, currentPage, filters) => ({
    logbook,
    entriesCount,
    entriesPerPage,
    currentPage,
    filters,
  }),
);
