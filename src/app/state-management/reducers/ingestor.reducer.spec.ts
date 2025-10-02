import { ingestorReducer } from "./ingestor.reducer";
import * as fromActions from "state-management/actions/ingestor.actions";
import { initialIngestorState } from "state-management/state/ingestor.store";
import {
  mockIngestionRequestInformation,
  mockMethodItems,
} from "shared/MockStubs";

describe("IngestorReducer", () => {
  describe("undefined action", () => {
    it("should return the default state", () => {
      const action = { type: "NOOP" } as any;
      const result = ingestorReducer(undefined, action);

      expect(result).toEqual(initialIngestorState);
    });
  });

  describe("setRenderViewFromThirdParty", () => {
    it("should set render view and update flag", () => {
      const action = fromActions.setRenderViewFromThirdParty({
        renderView: "requiredOnly",
      });
      const result = ingestorReducer(undefined, action);

      expect(result.renderView).toBe("requiredOnly");
      expect(result.updateEditorFromThirdParty).toBe(true);
    });
  });

  describe("getBrowseFilePathSuccess", () => {
    it("should set active node on success", () => {
      const mockNode = {
        folders: [
          {
            name: "test",
            path: "/test",
            children: true,
            probablyDataset: false,
          },
        ],
        total: 1,
      };
      const action = fromActions.getBrowseFilePathSuccess({
        ingestorBrowserActiveNode: mockNode,
      });
      const result = ingestorReducer(undefined, action);

      expect(result.ingestorBrowserActiveNode).toEqual(mockNode);
    });
  });

  describe("getBrowseFilePathFailure", () => {
    it("should set error and clear active node on failure", () => {
      const error = new Error("Failed to browse");
      const action = fromActions.getBrowseFilePathFailure({ err: error });
      const result = ingestorReducer(undefined, action);

      expect(result.ingestorBrowserActiveNode).toBeNull();
      expect(result.error).toBe(JSON.stringify(error));
    });
  });

  describe("getExtractionMethodsSuccess", () => {
    it("should set extraction methods on success", () => {
      const mockMethods = { methods: mockMethodItems, total: 2 };
      const action = fromActions.getExtractionMethodsSuccess({
        extractionMethods: mockMethods,
      });
      const result = ingestorReducer(undefined, action);

      expect(result.ingestorExtractionMethods).toEqual(mockMethods);
    });
  });

  describe("getExtractionMethodsFailure", () => {
    it("should set error and clear extraction methods on failure", () => {
      const error = new Error("Failed to get methods");
      const action = fromActions.getExtractionMethodsFailure({ err: error });
      const result = ingestorReducer(undefined, action);

      expect(result.ingestorExtractionMethods).toBeNull();
      expect(result.error).toBe(JSON.stringify(error));
    });
  });

  describe("setIngestorEndpoint", () => {
    it("should set ingestor endpoint", () => {
      const endpoint = "http://localhost:3000";
      const action = fromActions.setIngestorEndpoint({
        ingestorEndpoint: endpoint,
      });
      const result = ingestorReducer(undefined, action);

      expect(result.ingestorEndpoint).toBe(endpoint);
    });
  });

  describe("connectIngestor", () => {
    it("should set connecting flag to true", () => {
      const action = fromActions.connectIngestor();
      const result = ingestorReducer(undefined, action);

      expect(result.connectingBackend).toBe(true);
    });
  });

  describe("connectIngestorSuccess", () => {
    it("should set connection status on success", () => {
      const versionResponse = { version: "1.0.0" };
      const healthResponse = { status: "ok" };
      const userInfoResponse = { logged_in: true };
      const authIsDisabled = false;

      const action = fromActions.connectIngestorSuccess({
        versionResponse,
        userInfoResponse,
        authIsDisabled,
        healthResponse,
      });
      const result = ingestorReducer(undefined, action);

      expect(result.connectingBackend).toBe(false);
      expect(result.ingestorStatus.validEndpoint).toBe(true);
      expect(result.ingestorStatus.versionResponse).toEqual(versionResponse);
      expect(result.ingestorStatus.healthResponse).toEqual(healthResponse);
      expect(result.ingestorAuth.userInfoResponse).toEqual(userInfoResponse);
      expect(result.ingestorAuth.authIsDisabled).toBe(false);
    });
  });

  describe("connectIngestorFailure", () => {
    it("should set error and invalid endpoint on failure", () => {
      const error = new Error("Connection failed");
      const action = fromActions.connectIngestorFailure({ err: error });
      const result = ingestorReducer(undefined, action);

      expect(result.connectingBackend).toBe(false);
      expect(result.ingestorStatus.validEndpoint).toBe(false);
      expect(result.error).toBe(JSON.stringify(error));
    });
  });

  describe("updateTransferListSuccess", () => {
    it("should update transfer list with pagination", () => {
      const transferList = { transfers: [], total: 0 };
      const page = 1;
      const pageNumber = 50;

      const action = fromActions.updateTransferListSuccess({
        transferList,
        page,
        pageNumber,
      });
      const result = ingestorReducer(undefined, action);

      expect(result.ingestorTransferList).toEqual(transferList);
      expect(result.transferListRequestOptions.page).toBe(page);
      expect(result.transferListRequestOptions.pageNumber).toBe(pageNumber);
    });
  });

  describe("updateTransferListDetailSuccess", () => {
    it("should update transfer detail list", () => {
      const transferListDetailView = { transfers: [] };
      const action = fromActions.updateTransferListDetailSuccess({
        transferListDetailView,
      });
      const result = ingestorReducer(undefined, action);

      expect(result.ingestorTransferListDetailView).toEqual(
        transferListDetailView,
      );
    });
  });

  describe("updateIngestionObject", () => {
    it("should update ingestion object", () => {
      const action = fromActions.updateIngestionObject({
        ingestionObject: mockIngestionRequestInformation,
      });
      const result = ingestorReducer(undefined, action);

      expect(result.ingestionObject).toEqual(mockIngestionRequestInformation);
    });
  });

  describe("updateIngestionObjectAPIInformation", () => {
    it("should update API information", () => {
      const apiInfo = {
        ingestionDatasetLoading: true,
        extractorMetaDataReady: true,
        extractMetaDataRequested: false,
        metaDataExtractionFailed: false,
        extractorMetadataProgress: 0,
        extractorMetaDataStatus: "",
        ingestionRequestErrorMessage: "",
      };
      const action = fromActions.updateIngestionObjectAPIInformation({
        ingestionObjectApiInformation: apiInfo,
      });
      const result = ingestorReducer(undefined, action);

      expect(result.ingestionObjectApiInformation.ingestionDatasetLoading).toBe(
        true,
      );
      expect(result.ingestionObjectApiInformation.extractorMetaDataReady).toBe(
        true,
      );
    });
  });

  describe("resetIngestionObject", () => {
    it("should reset ingestion object to provided value", () => {
      const customObject = {
        ...mockIngestionRequestInformation,
        selectedPath: "/custom",
      };
      const action = fromActions.resetIngestionObject({
        ingestionObject: customObject,
      });
      const result = ingestorReducer(undefined, action);

      expect(result.ingestionObject.selectedPath).toBe("/custom");
    });

    it("should reset to empty when no object provided", () => {
      const action = fromActions.resetIngestionObject({
        ingestionObject: null,
      });
      const result = ingestorReducer(undefined, action);

      expect(result.ingestionObject).toBeDefined();
    });
  });

  describe("updateIngestionObjectFromThirdParty", () => {
    it("should update object and set third party flag", () => {
      const action = fromActions.updateIngestionObjectFromThirdParty({
        ingestionObject: mockIngestionRequestInformation,
      });
      const result = ingestorReducer(undefined, action);

      expect(result.ingestionObject).toEqual(mockIngestionRequestInformation);
      expect(result.updateEditorFromThirdParty).toBe(true);
    });
  });

  describe("resetIngestionObjectFromThirdPartyFlag", () => {
    it("should reset third party update flag", () => {
      // First set the flag to true
      const setFlagAction = fromActions.setRenderViewFromThirdParty({
        renderView: "all",
      });
      ingestorReducer(undefined, setFlagAction);

      // Then reset it
      const action = fromActions.resetIngestionObjectFromThirdPartyFlag();
      const result = ingestorReducer(undefined, action);

      expect(result.updateEditorFromThirdParty).toBe(false);
    });
  });

  describe("ingestDatasetSuccess", () => {
    it("should set ingestion response on success", () => {
      const response = { transferId: "123", status: "success" };
      const action = fromActions.ingestDatasetSuccess({ response });
      const result = ingestorReducer(undefined, action);

      expect(result.ingestionObject.ingestionRequest).toEqual(response);
      expect(
        result.ingestionObjectApiInformation.ingestionRequestErrorMessage,
      ).toBe("");
    });
  });

  describe("createDatasetSuccess", () => {
    it("should set dataset creation response", () => {
      const dataset = {
        pid: "dataset-123",
        datasetName: "Test Dataset",
      } as any;
      const action = fromActions.createDatasetSuccess({ dataset });
      const result = ingestorReducer(undefined, action);

      expect(result.ingestionObject.ingestionRequest.transferId).toBe(
        "dataset-123",
      );
      expect(result.ingestionObject.ingestionRequest.status).toBe(
        "Test Dataset",
      );
    });
  });

  describe("ingestDatasetFailure", () => {
    it("should set error message on failure", () => {
      const error = new Error("Bad request");
      const action = fromActions.ingestDatasetFailure({ err: error });
      const result = ingestorReducer(undefined, action);

      expect(
        result.ingestionObjectApiInformation.ingestionRequestErrorMessage,
      ).toBeDefined();
      expect(result.error).toBe(JSON.stringify(error));
    });
  });

  describe("resetIngestDataset", () => {
    it("should clear ingestion request and errors", () => {
      // First set up state with a request and error
      const successAction = fromActions.ingestDatasetSuccess({
        response: { transferId: "123", status: "done" },
      });
      ingestorReducer(undefined, successAction);

      // Then reset
      const resetAction = fromActions.resetIngestDataset();
      const result = ingestorReducer(undefined, resetAction);

      expect(result.ingestionObject.ingestionRequest).toBeNull();
      expect(
        result.ingestionObjectApiInformation.ingestionRequestErrorMessage,
      ).toBe("");
    });
  });

  describe("resetIngestorComponent", () => {
    it("should reset entire state to initial", () => {
      // Build up some modified state
      const setEndpointAction = fromActions.setIngestorEndpoint({
        ingestorEndpoint: "http://test.com",
      });
      const connectAction = fromActions.connectIngestor();
      ingestorReducer(undefined, setEndpointAction);
      ingestorReducer(undefined, connectAction);

      // Then reset everything
      const resetAction = fromActions.resetIngestorComponent();
      const result = ingestorReducer(undefined, resetAction);

      expect(result).toEqual(initialIngestorState);
    });
  });

  describe("setNoRightsError", () => {
    it("should set no rights error and update auth status", () => {
      const error = new Error("No rights");
      const action = fromActions.setNoRightsError({
        noRightsError: true,
        err: error,
      });
      const result = ingestorReducer(undefined, action);

      expect(result.noRightsError).toBe(true);
      expect(result.ingestorAuth.userInfoResponse.logged_in).toBe(false);
    });
  });

  describe("setIngestDatasetLoading", () => {
    it("should set loading state", () => {
      const action = fromActions.setIngestDatasetLoading({
        ingestionDatasetLoading: true,
      });
      const result = ingestorReducer(undefined, action);

      expect(result.ingestionObjectApiInformation.ingestionDatasetLoading).toBe(
        true,
      );
    });
  });
});
