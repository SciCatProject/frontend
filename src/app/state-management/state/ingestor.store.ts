import { renderView } from "ingestor/ingestor-metadata-editor/ingestor-metadata-editor.component";
import {
  IngestionRequestInformation,
  IngestorHelper,
} from "ingestor/ingestor-page/helper/ingestor.component-helper";
import {
  GetBrowseDatasetResponse,
  GetExtractorResponse,
  GetTransferResponse,
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
  ingestorEndpoint: string | null;
  ingestorTransferList: GetTransferResponse | null;
  transferListRequestOptions: {
    page: number;
    pageNumber: number;
  };
  ingestorExtractionMethods: GetExtractorResponse | null;
  ingestionObject: IngestionRequestInformation;
  ingestorBrowserActiveNode: GetBrowseDatasetResponse | null;
  renderView: renderView;
  connectingBackend: boolean;
  error: any | null;
}
export const initialIngestorState: IngestorState = {
  ingestorStatus: {
    versionResponse: null,
    healthResponse: null,
    validEndpoint: true,
  },
  ingestorAuth: null,
  ingestorEndpoint: null,
  ingestorTransferList: null,
  transferListRequestOptions: {
    page: 0,
    pageNumber: 100,
  },
  ingestorExtractionMethods: null,
  ingestionObject: IngestorHelper.createEmptyRequestInformation(),
  ingestorBrowserActiveNode: null,
  connectingBackend: false,
  error: null,
  renderView: "all",
};
