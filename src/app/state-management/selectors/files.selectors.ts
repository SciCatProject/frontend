import { createFeatureSelector, createSelector } from "@ngrx/store";
import { FilesState } from "state-management/state/files.store";
import { selectTablesSettings } from "./user.selectors";

const selectFilesState = createFeatureSelector<FilesState>("files");

export const selectAllOrigDatablocks = createSelector(
  selectFilesState,
  (state) => state.origDatablocks,
);

export const selectCurrentOrigDatablock = createSelector(
  selectFilesState,
  (state) => state.currentOrigDatablock,
);

export const selectOrigDatablocksCount = createSelector(
  selectFilesState,
  (state) => state.totalCount,
);

export const selectFilesWithCountAndTableSettings = createSelector(
  selectAllOrigDatablocks,
  selectOrigDatablocksCount,
  selectTablesSettings,
  (origDatablocks, count, tablesSettings) => ({
    origDatablocks,
    count,
    tablesSettings,
  }),
);
