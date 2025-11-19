import { renderView } from "ingestor/ingestor-metadata-editor/ingestor-metadata-editor.component";
import {
  APIInformation,
  IngestorAutodiscovery,
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
  validEndpoint: boolean | null;
}

export interface IngestorState {
  ingestorStatus: IngestorStatus;
  ingestorAuth: IngestorAuthentication | null;
  ingestorEndpoint: IngestorAutodiscovery | null;
  ingestorTransferList: GetTransferResponse | null;
  ingestorTransferListDetailView: GetTransferResponse | null;
  transferListRequestOptions: {
    page: number;
    pageNumber: number;
  };
  ingestorExtractionMethods: GetExtractorResponse | null;

  ingestionObject: IngestionRequestInformation;
  ingestionObjectApiInformation: APIInformation;

  ingestorBrowserActiveNode: GetBrowseDatasetResponse | null;
  renderView: renderView;
  updateEditorFromThirdParty: boolean;
  connectingBackend: boolean;
  noRightsError: boolean;
  error: any | null;
}
export const initialIngestorState: IngestorState = {
  ingestorStatus: {
    versionResponse: null,
    healthResponse: null,
    validEndpoint: null,
  },
  ingestorAuth: null,
  ingestorEndpoint: {
    mailDomain: "",
    description: "",
    facilityBackend: "",
  },
  ingestorTransferList: null,
  ingestorTransferListDetailView: null,
  transferListRequestOptions: {
    page: 0,
    pageNumber: 100,
  },
  ingestorExtractionMethods: null,
  ingestionObject: IngestorHelper.createEmptyRequestInformation(),
  ingestionObjectApiInformation: IngestorHelper.createEmptyAPIInformation(),

  ingestorBrowserActiveNode: null,
  connectingBackend: false,
  updateEditorFromThirdParty: false,
  noRightsError: false,
  error: null,
  renderView: "all",
};
