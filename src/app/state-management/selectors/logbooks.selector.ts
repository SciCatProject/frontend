import { createSelector, createFeatureSelector } from "@ngrx/store";
import { LogbookState } from "../state/logbooks.store";

const getLogbookState = createFeatureSelector<LogbookState>("logbooks");

export const getLogbooks = createSelector(
  getLogbookState,
  state => state.logbooks
);

export const getLogbook = createSelector(
  getLogbookState,
  state => state.logbook
);
