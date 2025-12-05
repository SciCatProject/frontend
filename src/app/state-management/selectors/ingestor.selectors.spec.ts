import * as fromSelectors from "./ingestor.selectors";
import { IngestorState } from "state-management/state/ingestor.store";
import {
  mockIngestionRequestInformation,
  mockMethodItems,
  mockFolderNodes,
} from "shared/MockStubs";

describe("Ingestor Selectors", () => {
  const mockIngestorState: IngestorState = {
    ingestorEndpoint: {
      mailDomain: "",
      description: "example facility",
      facilityBackend: "http://localhost:3000",
    },
    ingestorStatus: {
      versionResponse: { version: "1.0.0" },
      healthResponse: { status: "ok" },
      validEndpoint: true,
    },
    ingestorAuth: {
      userInfoResponse: null,
      authIsDisabled: false,
    },
    error: "Test error",
    connectingBackend: false,
    ingestorTransferList: { transfers: [] },
    ingestorTransferListDetailView: { transfers: [] },
    ingestionObject: mockIngestionRequestInformation,
    ingestorExtractionMethods: { methods: mockMethodItems, total: 2 },
    ingestorBrowserActiveNode: { folders: mockFolderNodes, total: 3 },
    renderView: "all",
    transferListRequestOptions: { page: 1, pageNumber: 5 },
    updateEditorFromThirdParty: false,
    noRightsError: false,
    ingestionObjectApiInformation: {
      ingestionDatasetLoading: true,
      extractorMetaDataReady: false,
      extractMetaDataRequested: false,
      metaDataExtractionFailed: false,
      extractorMetaDataStatus: "",
      extractorMetadataProgress: 0,
    },
  } as any;

  const mockState = {
    ingestor: mockIngestorState,
  };

  it("should select the ingestor state", () => {
    const result = fromSelectors.selectIngestorState(mockState);
    expect(result).toEqual(mockIngestorState);
  });

  it("should select ingestorEndpoint", () => {
    const result = fromSelectors.selectIngestorEndpoint(mockState);
    expect(result).toEqual({
      mailDomain: "",
      description: "example facility",
      facilityBackend: "http://localhost:3000",
    });
  });

  it("should select ingestorStatus", () => {
    const result = fromSelectors.selectIngestorStatus(mockState);
    expect(result).toEqual({
      versionResponse: { version: "1.0.0" },
      healthResponse: { status: "ok" },
      validEndpoint: true,
    });
  });

  it("should select ingestorAuth", () => {
    const result = fromSelectors.selectIngestorAuth(mockState);
    expect(result).toEqual({
      userInfoResponse: null,
      authIsDisabled: false,
    });
  });

  it("should select ingestorError", () => {
    const result = fromSelectors.selectIngestorError(mockState);
    expect(result).toBe("Test error");
  });

  it("should select ingestorConnecting", () => {
    const result = fromSelectors.selectIngestorConnecting(mockState);
    expect(result).toBe(false);
  });

  it("should select ingestorTransferList", () => {
    const result = fromSelectors.selectIngestorTransferList(mockState);
    expect(result).toEqual({ transfers: [] });
  });

  it("should select ingestorTransferDetailList", () => {
    const result = fromSelectors.selectIngestorTransferDetailList(mockState);
    expect(result).toEqual({ transfers: [] });
  });

  it("should select ingestionObject", () => {
    const result = fromSelectors.selectIngestionObject(mockState);
    expect(result).toEqual(mockIngestionRequestInformation);
  });

  it("should select ingestorExtractionMethods", () => {
    const result = fromSelectors.selectIngestorExtractionMethods(mockState);
    expect(result).toEqual({ methods: mockMethodItems, total: 2 });
  });

  it("should select ingestorBrowserActiveNode", () => {
    const result = fromSelectors.selectIngestorBrowserActiveNode(mockState);
    expect(result).toEqual({ folders: mockFolderNodes, total: 3 });
  });

  it("should select ingestorRenderView", () => {
    const result = fromSelectors.selectIngestorRenderView(mockState);
    expect(result).toBe("all");
  });

  it("should select ingestorTransferListRequestOptions", () => {
    const result =
      fromSelectors.selectIngestorTransferListRequestOptions(mockState);
    expect(result).toEqual({ page: 1, pageNumber: 5 });
  });

  it("should select updateEditorFromThirdParty", () => {
    const result = fromSelectors.selectUpdateEditorFromThirdParty(mockState);
    expect(result).toBe(false);
  });

  it("should select noRightsError", () => {
    const result = fromSelectors.selectNoRightsError(mockState);
    expect(result).toBe(false);
  });

  it("should select isIngestDatasetLoading", () => {
    const result = fromSelectors.selectIsIngestDatasetLoading(mockState);
    expect(result).toBe(true);
  });

  it("should select ingestionObjectAPIInformation", () => {
    const result = fromSelectors.selectIngestionObjectAPIInformation(mockState);
    expect(result).toEqual(mockIngestorState.ingestionObjectApiInformation);
  });
});
