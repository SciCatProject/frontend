import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IngestorState } from "state-management/state/ingestor.store";

export const selectIngestorState =
  createFeatureSelector<IngestorState>("ingestor");

export const selectIngestorEndpoint = createSelector(
  selectIngestorState,
  (state) => state.ingestorEndpoint,
);

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

export const selectIngestorConnecting = createSelector(
  selectIngestorState,
  (state) => state.connectingBackend,
);

export const selectIngestorTransferList = createSelector(
  selectIngestorState,
  (state) => state.ingestorTransferList,
);

export const selectIngestorTransferDetailList = createSelector(
  selectIngestorState,
  (state) => state.ingestorTransferListDetailView,
);

export const selectIngestionObject = createSelector(
  selectIngestorState,
  (state) => state.ingestionObject,
);

export const selectIngestorExtractionMethods = createSelector(
  selectIngestorState,
  (state) => state.ingestorExtractionMethods,
);

export const selectIngestorBrowserActiveNode = createSelector(
  selectIngestorState,
  (state) => state.ingestorBrowserActiveNode,
);

export const selectIngestorRenderView = createSelector(
  selectIngestorState,
  (state) => state.renderView,
);

export const selectIngestorTransferListRequestOptions = createSelector(
  selectIngestorState,
  (state) => state.transferListRequestOptions,
);

export const selectUpdateEditorFromThirdParty = createSelector(
  selectIngestorState,
  (state) => state.updateEditorFromThirdParty,
);
