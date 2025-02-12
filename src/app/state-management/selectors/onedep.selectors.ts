import { createFeatureSelector, createSelector } from "@ngrx/store";
import { OneDepState } from "state-management/state/onedep.store";

export const selectOneDepState = createFeatureSelector<OneDepState>("onedep");

export const selectDeposition = createSelector(
  selectOneDepState,
  (state) => state.depositionCreated,
);

export const selectDepID = createSelector(
  selectDeposition,
  (deposition) => deposition?.depID,
);

export const selectCurrentFileID = createSelector(
  selectOneDepState,
  (state) => state.currentFileID,
);
