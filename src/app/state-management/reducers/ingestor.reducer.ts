import { createReducer, Action, on } from "@ngrx/store";
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
    fromActions.setIngestorEndpoint,
    (state, { ingestorEndpoint }): IngestorState => ({
      ...state,
      ingestorEndpoint,
    }),
  ),
  on(
    fromActions.startConnectingIngestor,
    (state): IngestorState => ({
      ...state,
      connectingBackend: true,
    }),
  ),
  on(
    fromActions.stopConnectingIngestor,
    (state): IngestorState => ({
      ...state,
      connectingBackend: false,
    }),
  ),
  on(
    fromActions.connectIngestor,
    (state): IngestorState => ({
      ...state,
    }),
  ),
  on(
    fromActions.connectIngestorSuccess,
    (
      state,
      { versionResponse, userInfoResponse, authIsDisabled, healthResponse },
    ): IngestorState => ({
      ...state,
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
      ingestorStatus: {
        ...state.ingestorStatus,
        validEndpoint: false,
      },
      error: err,
    }),
  ),
  on(
    fromActions.updateTransferListSuccess,
    (state, { transferList }): IngestorState => ({
      ...state,
      ingestorTransferList: transferList,
    }),
  ),
);
