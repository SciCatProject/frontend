import { createFeatureSelector, createSelector } from "@ngrx/store";
import { InstrumentState } from "state-management/state/instruments.store";

const getInstrumentState = createFeatureSelector<InstrumentState>(
  "instruments"
);

export const getInstruments = createSelector(
  getInstrumentState,
  state => state.instruments
);

export const getCurrentInstrument = createSelector(
  getInstrumentState,
  state => state.currentInstrument
);

export const getInstrumentsCount = createSelector(
  getInstrumentState,
  state => state.totalCount
);

export const getFilters = createSelector(
  getInstrumentState,
  state => state.filters
);

export const getPage = createSelector(getFilters, filters => {
  const { skip, limit } = filters;
  return skip / limit;
});

export const getInstrumentsPerPage = createSelector(
  getFilters,
  filters => filters.limit
);
