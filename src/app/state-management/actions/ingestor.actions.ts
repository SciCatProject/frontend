import { createAction, props } from "@ngrx/store";
import {
  GetTransferResponse,
  OtherHealthResponse,
  OtherVersionResponse,
  UserInfo,
} from "shared/sdk/models/ingestor/models";

export const setIngestorEndpoint = createAction(
  "[Ingestor] Set ingestor endpoint",
  props<{ ingestorEndpoint: string }>(),
);

export const connectIngestor = createAction("[Ingestor] Connect Ingestor");

export const connectIngestorSuccess = createAction(
  "[Ingestor] Completed Ingestor Connection",
  props<{
    versionResponse: OtherVersionResponse;
    userInfoResponse: UserInfo;
    authIsDisabled: boolean;
    healthResponse: OtherHealthResponse;
  }>(),
);

export const connectIngestorFailure = createAction(
  "[Ingestor] Failed to connect to Ingestor ",
  props<{ err: Error }>(),
);

export const startConnectingIngestor = createAction(
  "[Ingestor] Start connecting Ingestor",
);

export const stopConnectingIngestor = createAction(
  "[Ingestor] Stop connecting Ingestor",
);

export const updateTransferList = createAction(
  "[Ingestor] Update transfer list",
  props<{ transferId: string; page: number; pageNumber: number }>(),
);

export const updateTransferListSuccess = createAction(
  "[Ingestor] Update Transfer List Success",
  props<{ transferList: GetTransferResponse }>(),
);

export const updateTransferListFailure = createAction(
  "[Ingestor] Update Transfer List Failure",
  props<{ err: Error }>(),
);
