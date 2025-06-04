import { createFeatureSelector, createSelector } from "@ngrx/store";
import { InstrumentState } from "state-management/state/instruments.store";
import { selectTablesSettings } from "./user.selectors";

const selectInstrumentState =
  createFeatureSelector<InstrumentState>("instruments");

export const selectInstruments = createSelector(
  selectInstrumentState,
  (state) => state.instruments,
);

export const selectCurrentInstrument = createSelector(
  selectInstrumentState,
  (state) => state.currentInstrument,
);

export const selectInstrumentsCount = createSelector(
  selectInstrumentState,
  (state) => state.totalCount,
);

export const selectFilters = createSelector(
  selectInstrumentState,
  (state) => state.filters,
);

export const selectPage = createSelector(selectFilters, (filters) => {
  const { skip, limit } = filters;
  return skip / limit;
});

export const selectInstrumentsPerPage = createSelector(
  selectFilters,
  (filters) => filters.limit,
);

export const selectInstrumentsWithCountAndTableSettings = createSelector(
  selectInstruments,
  selectInstrumentsCount,
  selectTablesSettings,
  (instruments, count, tablesSettings) => {
    return {
      instruments,
      count,
      tablesSettings,
    };
  },
);
