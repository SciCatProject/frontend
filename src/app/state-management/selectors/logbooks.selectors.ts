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

export const getFilters = createSelector(
  getLogbookState,
  state => state.filters
);
