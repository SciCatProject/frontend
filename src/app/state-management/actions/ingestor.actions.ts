import { createAction, props } from "@ngrx/store";
import { IngestionRequestInformation } from "ingestor/ingestor-page/helper/ingestor.component-helper";
import {
  GetBrowseDatasetResponse,
  GetExtractorResponse,
  GetTransferResponse,
  OtherHealthResponse,
  OtherVersionResponse,
  PostDatasetRequest,
  PostDatasetResponse,
  DeleteTransferRequest,
  UserInfo,
} from "shared/sdk/models/ingestor/models";
import { renderView } from "ingestor/ingestor-metadata-editor/ingestor-metadata-editor.component";
import {
  DatasetsControllerCreateV3Request,
  OutputDatasetObsoleteDto,
} from "@scicatproject/scicat-sdk-ts-angular";

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
  props<{ transferId?: string; page?: number; pageNumber?: number }>(),
);

export const updateTransferListSuccess = createAction(
  "[Ingestor] Update Transfer List Success",
  props<{
    transferList: GetTransferResponse;
    page: number;
    pageNumber: number;
  }>(),
);

export const updateTransferListDetailSuccess = createAction(
  "[Ingestor] Update Transfer List Detail Success",
  props<{ transferListDetailView: GetTransferResponse }>(),
);

export const updateTransferListFailure = createAction(
  "[Ingestor] Update Transfer List Failure",
  props<{ err: Error }>(),
);

export const updateIngestionObject = createAction(
  "[Ingestor] Update Ingestion Object",
  props<{ ingestionObject: IngestionRequestInformation }>(),
);

export const updateIngestionObjectFromThirdParty = createAction(
  "[Ingestor] Update Ingestion Object from Third Party",
  props<{ ingestionObject: IngestionRequestInformation }>(),
);

export const resetIngestionObjectFromThirdPartyFlag = createAction(
  "[Ingestor] Reset Ingestion Object from Third Party Flag",
);

export const getExtractionMethods = createAction(
  "[Ingestor] Get Extraction Methods",
  props<{ page: number; pageNumber: number }>(),
);

export const getExtractionMethodsSuccess = createAction(
  "[Ingestor] Get Extraction Methods Success",
  props<{ extractionMethods: GetExtractorResponse }>(),
);

export const getExtractionMethodsFailure = createAction(
  "[Ingestor] Get Extraction Methods Failure",
  props<{ err: Error }>(),
);

export const getBrowseFilePath = createAction(
  "[Ingestor] Get Browse File Path",
  props<{ path: string; page: number; pageNumber: number }>(),
);

export const getBrowseFilePathSuccess = createAction(
  "[Ingestor] Get Browse File Path Success",
  props<{ ingestorBrowserActiveNode: GetBrowseDatasetResponse }>(),
);

export const getBrowseFilePathFailure = createAction(
  "[Ingestor] Get Browse File Path Failure",
  props<{ err: Error }>(),
);

export const ingestDataset = createAction(
  "[Ingestor] Ingest Dataset",
  props<{ ingestionDataset: PostDatasetRequest }>(),
);

export const setIngestDatasetLoading = createAction(
  "[Ingestor] Set Ingest Dataset Loading",
  props<{ ingestionDatasetLoading: boolean }>(),
);

export const ingestDatasetSuccess = createAction(
  "[Ingestor] Ingest Dataset Success",
  props<{ response: PostDatasetResponse }>(),
);

export const ingestDatasetFailure = createAction(
  "[Ingestor] Ingest Dataset Failure",
  props<{ err: Error }>(),
);

export const resetIngestDataset = createAction(
  "[Ingestor] Reset Ingest Dataset",
);

export const cancelTransfer = createAction(
  "[Ingestor] Cancel Transfer",
  props<{ requestBody: DeleteTransferRequest }>(),
);

export const setRenderViewFromThirdParty = createAction(
  "[Ingestor] Set Render View",
  props<{ renderView: renderView }>(),
);

export const resetIngestorComponent = createAction(
  "[Ingestor] Reset Ingestor Component",
);

export const setNoRightsError = createAction(
  "[Ingestor] Set No Rights Error",
  props<{ noRightsError: boolean; err: Error }>(),
);

export const createDatasetAction = createAction(
  "[Ingestor] Create Dataset",
  props<{ dataset: DatasetsControllerCreateV3Request }>(),
);

export const createDatasetSuccess = createAction(
  "[Ingestor] Create Dataset Success",
  props<{ dataset: OutputDatasetObsoleteDto }>(),
);
