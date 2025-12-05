import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AdminState } from "state-management/state/admin.store";

const selectAdminState = createFeatureSelector<AdminState>("admin");

export const selectConfig = createSelector(
  selectAdminState,
  (state) => state.config,
);
