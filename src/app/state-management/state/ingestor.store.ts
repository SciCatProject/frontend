import {
  OtherHealthResponse,
  OtherVersionResponse,
  UserInfo,
} from "shared/sdk/models/ingestor/models";

interface IngestorAuthentication {
  userInfoResponse: UserInfo | null;
  authIsDisabled: boolean;
}

interface IngestorStatus {
  versionResponse: OtherVersionResponse | null;
  healthResponse: OtherHealthResponse | null;
  validEndpoint: boolean;
}

export interface IngestorState {
  ingestorStatus: IngestorStatus;
  ingestorAuth: IngestorAuthentication | null;
  error: any | null;
}
export const initialIngestorState: IngestorState = {
  ingestorStatus: {
    versionResponse: null,
    healthResponse: null,
    validEndpoint: true,
  },
  ingestorAuth: null,
  error: null,
};
