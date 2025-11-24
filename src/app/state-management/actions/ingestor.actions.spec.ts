import * as fromActions from "./ingestor.actions";
import {
  mockIngestionRequestInformation,
  mockAPIInformation,
  mockMethodItems,
  mockFolderNode,
} from "shared/MockStubs";

describe("Ingestor Actions", () => {
  describe("setIngestorEndpoint", () => {
    it("should create an action with endpoint", () => {
      const action = fromActions.setIngestorEndpoint({
        ingestorEndpoint: {
          mailDomain: "",
          description: "",
          facilityBackend: "http://localhost:3000",
        },
      });

      expect(action.type).toBe("[Ingestor] Set ingestor endpoint");
      expect(action.ingestorEndpoint).toEqual({
        mailDomain: "",
        description: "",
        facilityBackend: "http://localhost:3000",
      });
    });
  });

  describe("connectIngestor", () => {
    it("should create an action", () => {
      const action = fromActions.connectIngestor();

      expect(action.type).toBe("[Ingestor] Connect Ingestor");
    });
  });

  describe("connectIngestorSuccess", () => {
    it("should create an action with connection details", () => {
      const versionResponse = { version: "1.0.0" };
      const userInfoResponse = { logged_in: true };
      const healthResponse = { status: "ok" };

      const action = fromActions.connectIngestorSuccess({
        versionResponse,
        userInfoResponse,
        authIsDisabled: false,
        healthResponse,
      });

      expect(action.type).toBe("[Ingestor] Completed Ingestor Connection");
      expect(action.versionResponse).toEqual(versionResponse);
      expect(action.userInfoResponse).toEqual(userInfoResponse);
      expect(action.authIsDisabled).toBe(false);
      expect(action.healthResponse).toEqual(healthResponse);
    });
  });

  describe("connectIngestorFailure", () => {
    it("should create an action with error", () => {
      const error = new Error("Connection failed");
      const action = fromActions.connectIngestorFailure({ err: error });

      expect(action.type).toBe("[Ingestor] Failed to connect to Ingestor ");
      expect(action.err).toEqual(error);
    });
  });

  describe("startConnectingIngestor", () => {
    it("should create an action", () => {
      const action = fromActions.startConnectingIngestor();

      expect(action.type).toBe("[Ingestor] Start connecting Ingestor");
    });
  });

  describe("stopConnectingIngestor", () => {
    it("should create an action", () => {
      const action = fromActions.stopConnectingIngestor();

      expect(action.type).toBe("[Ingestor] Stop connecting Ingestor");
    });
  });

  describe("updateTransferList", () => {
    it("should create an action with all parameters", () => {
      const action = fromActions.updateTransferList({
        transferId: "transfer-123",
        page: 1,
        pageNumber: 50,
      });

      expect(action.type).toBe("[Ingestor] Update transfer list");
      expect(action.transferId).toBe("transfer-123");
      expect(action.page).toBe(1);
      expect(action.pageNumber).toBe(50);
    });

    it("should create an action with optional parameters", () => {
      const action = fromActions.updateTransferList({});

      expect(action.type).toBe("[Ingestor] Update transfer list");
      expect(action.transferId).toBeUndefined();
      expect(action.page).toBeUndefined();
    });
  });

  describe("updateTransferListSuccess", () => {
    it("should create an action with transfer list", () => {
      const transferList = { transfers: [], total: 0 };
      const action = fromActions.updateTransferListSuccess({
        transferList,
        page: 1,
        pageNumber: 50,
      });

      expect(action.type).toBe("[Ingestor] Update Transfer List Success");
      expect(action.transferList).toEqual(transferList);
      expect(action.page).toBe(1);
      expect(action.pageNumber).toBe(50);
    });
  });

  describe("updateTransferListDetailSuccess", () => {
    it("should create an action with detail view", () => {
      const transferListDetailView = { transfers: [], total: 0 };
      const action = fromActions.updateTransferListDetailSuccess({
        transferListDetailView,
      });

      expect(action.type).toBe(
        "[Ingestor] Update Transfer List Detail Success",
      );
      expect(action.transferListDetailView).toEqual(transferListDetailView);
    });
  });

  describe("updateTransferListFailure", () => {
    it("should create an action with error", () => {
      const error = new Error("Update failed");
      const action = fromActions.updateTransferListFailure({ err: error });

      expect(action.type).toBe("[Ingestor] Update Transfer List Failure");
      expect(action.err).toEqual(error);
    });
  });

  describe("resetIngestionObject", () => {
    it("should create an action with ingestion object", () => {
      const action = fromActions.resetIngestionObject({
        ingestionObject: mockIngestionRequestInformation,
      });

      expect(action.type).toBe("[Ingestor] Reset Ingestion Object");
      expect(action.ingestionObject).toEqual(mockIngestionRequestInformation);
    });

    it("should create an action without ingestion object", () => {
      const action = fromActions.resetIngestionObject({});

      expect(action.type).toBe("[Ingestor] Reset Ingestion Object");
      expect(action.ingestionObject).toBeUndefined();
    });
  });

  describe("updateIngestionObject", () => {
    it("should create an action with ingestion object", () => {
      const action = fromActions.updateIngestionObject({
        ingestionObject: mockIngestionRequestInformation,
      });

      expect(action.type).toBe("[Ingestor] Update Ingestion Object");
      expect(action.ingestionObject).toEqual(mockIngestionRequestInformation);
    });
  });

  describe("updateIngestionObjectFromThirdParty", () => {
    it("should create an action with ingestion object", () => {
      const action = fromActions.updateIngestionObjectFromThirdParty({
        ingestionObject: mockIngestionRequestInformation,
      });

      expect(action.type).toBe(
        "[Ingestor] Update Ingestion Object from Third Party",
      );
      expect(action.ingestionObject).toEqual(mockIngestionRequestInformation);
    });
  });

  describe("updateIngestionObjectAPIInformation", () => {
    it("should create an action with API information", () => {
      const action = fromActions.updateIngestionObjectAPIInformation({
        ingestionObjectApiInformation: mockAPIInformation,
      });

      expect(action.type).toBe(
        "[Ingestor] Update Ingestion Object API Information",
      );
      expect(action.ingestionObjectApiInformation).toEqual(mockAPIInformation);
    });
  });

  describe("resetIngestionObjectFromThirdPartyFlag", () => {
    it("should create an action", () => {
      const action = fromActions.resetIngestionObjectFromThirdPartyFlag();

      expect(action.type).toBe(
        "[Ingestor] Reset Ingestion Object from Third Party Flag",
      );
    });
  });

  describe("getExtractionMethods", () => {
    it("should create an action with pagination", () => {
      const action = fromActions.getExtractionMethods({
        page: 1,
        pageNumber: 50,
      });

      expect(action.type).toBe("[Ingestor] Get Extraction Methods");
      expect(action.page).toBe(1);
      expect(action.pageNumber).toBe(50);
    });
  });

  describe("getExtractionMethodsSuccess", () => {
    it("should create an action with extraction methods", () => {
      const extractionMethods = { methods: mockMethodItems, total: 2 };
      const action = fromActions.getExtractionMethodsSuccess({
        extractionMethods,
      });

      expect(action.type).toBe("[Ingestor] Get Extraction Methods Success");
      expect(action.extractionMethods).toEqual(extractionMethods);
    });
  });

  describe("getExtractionMethodsFailure", () => {
    it("should create an action with error", () => {
      const error = new Error("Failed to get methods");
      const action = fromActions.getExtractionMethodsFailure({ err: error });

      expect(action.type).toBe("[Ingestor] Get Extraction Methods Failure");
      expect(action.err).toEqual(error);
    });
  });

  describe("getBrowseFilePath", () => {
    it("should create an action with path and pagination", () => {
      const action = fromActions.getBrowseFilePath({
        path: "/test/path",
        page: 1,
        pageNumber: 50,
      });

      expect(action.type).toBe("[Ingestor] Get Browse File Path");
      expect(action.path).toBe("/test/path");
      expect(action.page).toBe(1);
      expect(action.pageNumber).toBe(50);
    });
  });

  describe("getBrowseFilePathSuccess", () => {
    it("should create an action with browser node", () => {
      const node = { folders: [mockFolderNode], total: 1 };
      const action = fromActions.getBrowseFilePathSuccess({
        ingestorBrowserActiveNode: node,
      });

      expect(action.type).toBe("[Ingestor] Get Browse File Path Success");
      expect(action.ingestorBrowserActiveNode).toEqual(node);
    });
  });

  describe("getBrowseFilePathFailure", () => {
    it("should create an action with error", () => {
      const error = new Error("Browse failed");
      const action = fromActions.getBrowseFilePathFailure({ err: error });

      expect(action.type).toBe("[Ingestor] Get Browse File Path Failure");
      expect(action.err).toEqual(error);
    });
  });

  describe("ingestDataset", () => {
    it("should create an action with ingestion dataset", () => {
      const ingestionDataset = {
        metaData: "{}",
        userToken: "token-123",
        autoArchive: true,
      };
      const action = fromActions.ingestDataset({ ingestionDataset });

      expect(action.type).toBe("[Ingestor] Ingest Dataset");
      expect(action.ingestionDataset).toEqual(ingestionDataset);
    });
  });

  describe("setIngestDatasetLoading", () => {
    it("should create an action with loading state", () => {
      const action = fromActions.setIngestDatasetLoading({
        ingestionDatasetLoading: true,
      });

      expect(action.type).toBe("[Ingestor] Set Ingest Dataset Loading");
      expect(action.ingestionDatasetLoading).toBe(true);
    });
  });

  describe("ingestDatasetSuccess", () => {
    it("should create an action with response", () => {
      const response = { transferId: "transfer-123", status: "success" };
      const action = fromActions.ingestDatasetSuccess({ response });

      expect(action.type).toBe("[Ingestor] Ingest Dataset Success");
      expect(action.response).toEqual(response);
    });
  });

  describe("ingestDatasetFailure", () => {
    it("should create an action with error", () => {
      const error = new Error("Ingestion failed");
      const action = fromActions.ingestDatasetFailure({ err: error });

      expect(action.type).toBe("[Ingestor] Ingest Dataset Failure");
      expect(action.err).toEqual(error);
    });
  });

  describe("resetIngestDataset", () => {
    it("should create an action", () => {
      const action = fromActions.resetIngestDataset();

      expect(action.type).toBe("[Ingestor] Reset Ingest Dataset");
    });
  });

  describe("cancelTransfer", () => {
    it("should create an action with request body", () => {
      const requestBody = { transferId: "transfer-123" };
      const action = fromActions.cancelTransfer({ requestBody });

      expect(action.type).toBe("[Ingestor] Cancel Transfer");
      expect(action.requestBody).toEqual(requestBody);
    });
  });

  describe("setRenderViewFromThirdParty", () => {
    it("should create an action with render view", () => {
      const action = fromActions.setRenderViewFromThirdParty({
        renderView: "requiredOnly",
      });

      expect(action.type).toBe("[Ingestor] Set Render View");
      expect(action.renderView).toBe("requiredOnly");
    });
  });

  describe("resetIngestorComponent", () => {
    it("should create an action", () => {
      const action = fromActions.resetIngestorComponent();

      expect(action.type).toBe("[Ingestor] Reset Ingestor Component");
    });
  });

  describe("setNoRightsError", () => {
    it("should create an action with error flag and error", () => {
      const error = new Error("No rights");
      const action = fromActions.setNoRightsError({
        noRightsError: true,
        err: error,
      });

      expect(action.type).toBe("[Ingestor] Set No Rights Error");
      expect(action.noRightsError).toBe(true);
      expect(action.err).toEqual(error);
    });
  });

  describe("createDatasetAction", () => {
    it("should create an action with dataset", () => {
      const dataset = {
        datasetName: "Test Dataset",
        type: "raw",
      } as any;
      const action = fromActions.createDatasetAction({ dataset });

      expect(action.type).toBe("[Ingestor] Create Dataset");
      expect(action.dataset).toEqual(dataset);
    });
  });

  describe("createDatasetSuccess", () => {
    it("should create an action with created dataset", () => {
      const dataset = {
        pid: "dataset-123",
        datasetName: "Test Dataset",
      } as any;
      const action = fromActions.createDatasetSuccess({ dataset });

      expect(action.type).toBe("[Ingestor] Create Dataset Success");
      expect(action.dataset).toEqual(dataset);
    });
  });
});
