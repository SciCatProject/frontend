import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IngestorState } from "state-management/state/ingestor.store";

export const selectIngestorState =
  createFeatureSelector<IngestorState>("ingestor");

export const selectIngestorStatus = createSelector(
  selectIngestorState,
  (state) => state.ingestorStatus,
);

export const selectIngestorAuth = createSelector(
  selectIngestorState,
  (state) => state.ingestorAuth,
);

export const selectIngestorError = createSelector(
  selectIngestorState,
  (state) => state.error,
);
