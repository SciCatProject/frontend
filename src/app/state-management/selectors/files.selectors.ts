import { createFeatureSelector, createSelector } from "@ngrx/store";
import { FilesState } from "state-management/state/files.store";
import { selectSettings } from "./user.selectors";

const selectFilesState = createFeatureSelector<FilesState>("files");

export const selectAllOrigDatablocks = createSelector(
  selectFilesState,
  (state) => state.origDatablocks,
);

export const selectCurrentDatasetOrigDatablocks = createSelector(
  selectFilesState,
  (state) => state.currentDatasetOrigDatablocks,
);

export const selectCurrentOrigDatablock = createSelector(
  selectFilesState,
  (state) => state.currentOrigDatablock,
);

export const selectOrigDatablocksCount = createSelector(
  selectFilesState,
  (state) => state.totalCount,
);

export const selectCurrentDatasetOrigDatablocksCount = createSelector(
  selectFilesState,
  (state) => state.currentDatasetCount,
);

export const selectSelectedOrigDatablocks = createSelector(
  selectFilesState,
  (state) => state.selectedOrigDatablocks,
);

export const selectSelectedOrigDatablocksCount = createSelector(
  selectFilesState,
  (state) => state.selectedOrigDatablocksCount,
);

export const selectDatasetFilter = createSelector(
  selectFilesState,
  (state) => state.datasetFilter,
);

export const selectFilesWithCountAndTableSettings = createSelector(
  selectAllOrigDatablocks,
  selectOrigDatablocksCount,
  selectSettings,
  (origDatablocks, count, settings) => ({
    origDatablocks,
    count,
    tablesSettings: {
      columns: settings.fe_file_table_columns,
    },
  }),
);

export const selectCurrentDatasetFilesWithCountAndTableSettings =
  createSelector(
    selectCurrentDatasetOrigDatablocks,
    selectCurrentDatasetOrigDatablocksCount,
    selectSelectedOrigDatablocks,
    selectSettings,
    (origDatablocks, count, selectedOrigDatablocks, settings) => ({
      origDatablocks,
      count,
      selectedOrigDatablocks,
      tablesSettings: {
        columns: settings.fe_datafiles_table_columns,
      },
    }),
  );
