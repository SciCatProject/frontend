import { createReducer, Action, on } from "@ngrx/store";
import { IngestorHelper } from "ingestor/ingestor-page/helper/ingestor.component-helper";
import * as fromActions from "state-management/actions/ingestor.actions";
import {
  IngestorState,
  initialIngestorState,
} from "state-management/state/ingestor.store";

export const ingestorReducer = (state: undefined, action: Action) => {
  if (action.type.indexOf("[Ingestor]") !== -1) {
    console.log("Action came in! " + action.type);
  }
  return reducer(state, action);
};
const reducer = createReducer(
  initialIngestorState,
  on(
    fromActions.setRenderViewFromThirdParty,
    (state, { renderView }): IngestorState => ({
      ...state,
      renderView: renderView,
      updateEditorFromThirdParty: true,
    }),
  ),
  on(
    fromActions.getBrowseFilePathSuccess,
    (state, { ingestorBrowserActiveNode }): IngestorState => ({
      ...state,
      ingestorBrowserActiveNode: ingestorBrowserActiveNode,
    }),
  ),
  on(
    fromActions.getBrowseFilePathFailure,
    (state, { err }): IngestorState => ({
      ...state,
      ingestorBrowserActiveNode: null,
      error: JSON.stringify(err),
    }),
  ),
  on(
    fromActions.getExtractionMethodsSuccess,
    (state, { extractionMethods }): IngestorState => ({
      ...state,
      ingestorExtractionMethods: extractionMethods,
    }),
  ),
  on(
    fromActions.getExtractionMethodsFailure,
    (state, { err }): IngestorState => ({
      ...state,
      ingestorExtractionMethods: null,
      error: JSON.stringify(err),
    }),
  ),
  on(
    fromActions.setIngestorEndpoint,
    (state, { ingestorEndpoint }): IngestorState => ({
      ...state,
      ingestorEndpoint,
    }),
  ),
  on(
    fromActions.connectIngestor,
    (state): IngestorState => ({
      ...state,
      connectingBackend: true,
    }),
  ),
  on(
    fromActions.connectIngestorSuccess,
    (
      state,
      { versionResponse, userInfoResponse, authIsDisabled, healthResponse },
    ): IngestorState => ({
      ...state,
      connectingBackend: false,
      ingestorStatus: {
        versionResponse,
        healthResponse,
        validEndpoint: true,
      },
      ingestorAuth: {
        userInfoResponse,
        authIsDisabled,
      },
    }),
  ),
  on(
    fromActions.connectIngestorFailure,
    (state, { err }): IngestorState => ({
      ...state,
      connectingBackend: false,
      ingestorStatus: {
        ...state.ingestorStatus,
        validEndpoint: false,
      },
      error: JSON.stringify(err),
    }),
  ),
  on(
    fromActions.updateTransferListSuccess,
    (state, { transferList, page, pageNumber }): IngestorState => ({
      ...state,
      ingestorTransferList: transferList,
      transferListRequestOptions: {
        page,
        pageNumber,
      },
    }),
  ),
  on(
    fromActions.updateTransferListDetailSuccess,
    (state, { transferListDetailView }): IngestorState => ({
      ...state,
      ingestorTransferListDetailView: transferListDetailView,
    }),
  ),
  on(
    fromActions.updateIngestionObject,
    (state, { ingestionObject }): IngestorState => ({
      ...state,
      ingestionObject: {
        ...ingestionObject,
      },
    }),
  ),
  on(
    fromActions.updateIngestionObjectAPIInformation,
    (state, { ingestionObjectApiInformation }): IngestorState => ({
      ...state,
      ingestionObjectApiInformation: {
        ...state.ingestionObjectApiInformation,
        ...ingestionObjectApiInformation,
      },
    }),
  ),
  on(
    fromActions.resetIngestionObject,
    (state, { ingestionObject }): IngestorState => ({
      ...state,
      ingestionObject:
        ingestionObject ?? IngestorHelper.createEmptyRequestInformation(),
      ingestionObjectApiInformation: IngestorHelper.createEmptyAPIInformation(),
    }),
  ),
  on(
    fromActions.updateIngestionObjectFromThirdParty,
    (state, { ingestionObject }): IngestorState => ({
      ...state,
      ingestionObject,
      updateEditorFromThirdParty: true,
    }),
  ),
  on(
    fromActions.resetIngestionObjectFromThirdPartyFlag,
    (state): IngestorState => ({
      ...state,
      updateEditorFromThirdParty: false,
    }),
  ),
  on(
    fromActions.ingestDatasetSuccess,
    (state, { response }): IngestorState => ({
      ...state,
      ingestionObjectApiInformation: {
        ...state.ingestionObjectApiInformation,
        ingestionRequestErrorMessage: "",
      },
      ingestionObject: {
        ...state.ingestionObject,
        ingestionRequest: response,
      },
    }),
  ),
  on(
    fromActions.createDatasetSuccess,
    (state, { dataset }): IngestorState => ({
      ...state,
      ingestionObjectApiInformation: {
        ...state.ingestionObjectApiInformation,
        ingestionRequestErrorMessage: "",
      },
      ingestionObject: {
        ...state.ingestionObject,
        ingestionRequest: {
          transferId: dataset.pid,
          status: dataset.datasetName,
        },
      },
    }),
  ),
  on(
    fromActions.ingestDatasetFailure,
    (state, { err }): IngestorState => ({
      ...state,
      ingestionObjectApiInformation: {
        ...state.ingestionObjectApiInformation,
        ingestionRequestErrorMessage:
          (err as any).error ??
          (err as any).error?.error ??
          err.message ??
          JSON.stringify(err),
      },
      error: JSON.stringify(err),
    }),
  ),
  on(
    fromActions.resetIngestDataset,
    (state): IngestorState => ({
      ...state,
      ingestionObject: {
        ...state.ingestionObject,
        ingestionRequest: null,
      },
      ingestionObjectApiInformation: {
        ...state.ingestionObjectApiInformation,
        ingestionRequestErrorMessage: "",
      },
    }),
  ),
  on(
    fromActions.resetIngestorComponent,
    (): IngestorState => initialIngestorState,
  ),
  on(
    fromActions.setNoRightsError,
    (state, { noRightsError }): IngestorState => ({
      ...state,
      noRightsError,
      ingestorAuth: {
        ...state.ingestorAuth,
        userInfoResponse: {
          logged_in: false,
        },
      },
    }),
  ),
  on(
    fromActions.setIngestDatasetLoading,
    (state, { ingestionDatasetLoading }): IngestorState => ({
      ...state,
      ingestionObjectApiInformation: {
        ...state.ingestionObjectApiInformation,
        ingestionDatasetLoading,
      },
    }),
  ),
);
