import { createFeatureSelector, createSelector } from "@ngrx/store";
import { RuntimeConfigState } from "state-management/state/runtimeConfig.store";

const selectRunTimeConfigState =
  createFeatureSelector<RuntimeConfigState>("runtimeConfig");

export const selectConfig = createSelector(
  selectRunTimeConfigState,
  (state) => state.config,
);
