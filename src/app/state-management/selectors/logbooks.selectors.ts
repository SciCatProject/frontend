import { createSelector, createFeatureSelector } from "@ngrx/store";
import { LogbookState } from "../state/logbooks.store";

const getLogbookState = createFeatureSelector<LogbookState>("logbooks");

export const getLogbooks = createSelector(
  getLogbookState,
  state => state.logbooks
);

export const getCurrentLogbook = createSelector(
  getLogbookState,
  state => state.currentLogbook
);

export const getEntriesCount = createSelector(
  getLogbookState,
  state => state.totalCount
);

export const getHasPrefilledFilters = createSelector(
  getLogbookState,
  state => state.hasPrefilledFilters
);

export const getFilters = createSelector(
  getLogbookState,
  state => state.filters
);

export const getEntriesPerPage = createSelector(
  getFilters,
  filters => filters.limit
);

export const getPage = createSelector(getFilters, filters => {
  const { skip, limit } = filters;
  return skip / limit;
});
