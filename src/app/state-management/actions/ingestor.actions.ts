import { createAction, props } from "@ngrx/store";
import {
  OtherHealthResponse,
  OtherVersionResponse,
  UserInfo,
} from "shared/sdk/models/ingestor/models";

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
