import { createFeatureSelector, createSelector } from "@ngrx/store";
import {
  DepositorState,
  OneDepState,
  EmpiarSchemaState,
} from "state-management/state/depositor.store";

export const selectDepositorState =
  createFeatureSelector<DepositorState>("depositor");
export const selectOneDepState = createFeatureSelector<OneDepState>("onedep");
export const selectEMPIARState =
  createFeatureSelector<EmpiarSchemaState>("empiar");

export const selectDeposition = createSelector(
  selectOneDepState,
  (state) => state.depositionCreated,
);

export const selectCurrentFileID = createSelector(
  selectOneDepState,
  (state) => state.currentFileID,
);

export const selectEmpiarSchema = createSelector(
  selectEMPIARState,
  (state) => state?.schema,
);