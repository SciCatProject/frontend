import { createFeatureSelector, createSelector } from "@ngrx/store";
import { InstrumentState } from "state-management/state/instruments.store";
import { selectSettings } from "./user.selectors";

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
  selectSettings,
  (instruments, count, settings) => {
    return {
      instruments,
      count,
      tablesSettings: {
        instrumentsTable: {
          columns: settings.fe_instrument_table_columns,
        },
      },
    };
  },
);

export const selectInstrumentWithIdAndLabel = createSelector(
  selectInstruments,
  (arr) =>
    arr.map((inst) => ({
      _id: inst.pid,
      label: inst.name,
    })),
);
