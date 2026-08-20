import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import {
  AppConfigInterface,
  AppConfigService,
  HelpMessages,
} from "app-config.service";
import { DEFAULT_CONFIG } from "app-config.defaults";
import { cloneDeep } from "lodash-es";
import { Observable, of } from "rxjs";
import { MockHttp } from "shared/MockStubs";

const appConfig: AppConfigInterface = {
  defaultMainPage: {
    nonAuthenticatedUser: "DATASETS",
    authenticatedUser: "DATASETS",
  },
  skipSciCatLoginPageEnabled: false,
  accessTokenPrefix: "",
  addDatasetEnabled: true,
  archiveWorkflowEnabled: true,
  datasetReduceEnabled: true,
  datasetRelationshipsEnabled: true,
  datasetJsonScientificMetadata: true,
  datasetPageSizeOptions: [5, 10, 25, 100],
  editDatasetEnabled: true,
  editDatasetSampleEnabled: true,
  editMetadataEnabled: true,
  editPublishedData: true,
  addSampleEnabled: true,
  externalAuthEndpoint: "/auth/msad",
  facility: "ESS",
  siteIcon: "site-icon.png",
  siteHeaderLogo: "site-header-logo.png",
  siteLoginLogo: "site-login-logo.png",
  siteLoginBackground: "site-login-background.png",
  loginFacilityLabel: "ESS",
  loginLdapLabel: "Ldap",
  loginLocalLabel: "Local",
  loginFacilityEnabled: true,
  loginLdapEnabled: true,
  loginLocalEnabled: true,
  fileColorEnabled: true,
  fileDownloadEnabled: true,
  gettingStarted: null,
  ingestManual: null,
  jobsEnabled: true,
  dateFormat: "yyyy-MM-dd HH:mm",
  timezone: "UTC",
  jsonMetadataEnabled: true,
  jupyterHubUrl: "https://jupyterhub.esss.lu.se/",
  landingPage: "doi2.psi.ch/detail/",
  lbBaseURL: "http://127.0.0.1:3000",
  logbookEnabled: true,
  loginFormEnabled: true,
  thumbnailFetchLimitPerPage: 500,
  maxFileUploadSizeInMb: "16mb",
  maxDirectDownloadSize: 5000000000,
  metadataFloatFormatEnabled: true,
  metadataFloatFormat: {
    significantDigits: 3,
    minCutoff: 0.001,
    maxCutoff: 1000,
  },
  metadataPreviewEnabled: true,
  metadataStructure: "",
  multipleDownloadAction: "http://localhost:3012/zip",
  multipleDownloadEnabled: true,
  multipleDownloadUseAuthToken: false,
  oAuth2Endpoints: [],
  policiesEnabled: true,
  retrieveDestinations: [],
  riotBaseUrl: "http://scitest.esss.lu.se/riot",
  scienceSearchEnabled: true,
  scienceSearchUnitsEnabled: true,
  searchPublicDataEnabled: true,
  searchSamples: true,
  sftpHost: "login.esss.dk",
  sourceFolder: "default",
  maxFileSizeWarning: "Some files are above the max size",
  shareEnabled: true,
  shoppingCartEnabled: true,
  shoppingCartOnHeader: true,
  siteTitle: "Local Ng Testing",
  siteSciCatLogo: "full",
  tableSciDataEnabled: true,
  fileserverBaseURL: "",
  fileserverButtonLabel: "",
  datasetDetailsShowMissingProposalId: true,
  helpMessages: new HelpMessages(),
  notificationInterceptorEnabled: true,
  datasetActionsEnabled: false,
  datasetActions: [],
  datasetDetailsActionsEnabled: false,
  datasetDetailsActions: [],
  datafilesActionsEnabled: false,
  datafilesActions: [],
  datasetSelectionActionsEnabled: false,
  datasetSelectionActions: [],
  batchActionsEnabled: true,
  batchActions: [],
  defaultDatasetsListSettings: {
    columns: [
      {
        name: "select",
        order: 0,
        type: "standard",
        enabled: true,
      },
      {
        name: "pid",
        order: 1,
        type: "standard",
        enabled: true,
      },
      {
        name: "datasetName",
        order: 2,
        type: "standard",
        enabled: true,
      },
      {
        name: "runNumber",
        order: 3,
        type: "standard",
        enabled: true,
      },
      {
        name: "sourceFolder",
        order: 4,
        type: "standard",
        enabled: true,
      },
      {
        name: "size",
        order: 5,
        type: "standard",
        enabled: true,
      },
      {
        name: "creationTime",
        order: 6,
        type: "standard",
        enabled: true,
      },
      {
        name: "type",
        order: 7,
        type: "standard",
        enabled: true,
      },
      {
        name: "image",
        order: 8,
        type: "standard",
        enabled: true,
      },
      {
        name: "metadata",
        order: 9,
        type: "standard",
        enabled: false,
      },
      {
        name: "proposalId",
        order: 10,
        type: "standard",
        enabled: true,
      },
      {
        name: "ownerGroup",
        order: 11,
        type: "standard",
        enabled: false,
      },
      {
        name: "dataStatus",
        order: 12,
        type: "standard",
        enabled: false,
      },
    ],
    filters: [
      {
        key: "creationLocation",
        label: "Location",
        type: "multiSelect",
        description: "Filter by creation location on the dataset",
        enabled: true,
      },
      {
        key: "pid",
        label: "Pid",
        type: "text",
        description: "Filter by dataset pid",
        enabled: true,
      },
      {
        key: "ownerGroup",
        label: "Group",
        type: "multiSelect",
        description: "Filter by owner group of the dataset",
        enabled: true,
      },
      {
        key: "type",
        label: "Type",
        type: "multiSelect",
        description: "Filter by dataset type",
        enabled: true,
      },
      {
        key: "keywords",
        label: "Keyword",
        type: "multiSelect",
        description: "Filter by keywords in the dataset",
        enabled: true,
      },
      {
        key: "creationTime",
        label: "Creation Time",
        type: "dateRange",
        description: "Filter by creation time of the dataset",
        enabled: true,
      },
    ],
    conditions: [],
  },
  ingestorComponent: {
    ingestorEnabled: true,
  },
  helpSettings: {
    enabled: false,
    htmlContent: "This is not my help",
  },
  aboutSettings: {
    enabled: false,
    htmlContent: "This is not my about",
  },
};

describe("AppConfigService", () => {
  let service: AppConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AppConfigService,
        { provide: HttpClient, useClass: MockHttp },
      ],
    });

    service = TestBed.inject(AppConfigService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("#loadAppConfig()", () => {
    it("should load the config from the provided source", async () => {
      spyOn(service["http"], "get").and.returnValue(of(appConfig));
      await service.loadAppConfig();

      const expectedConfig = service["mergeObjects"](
        cloneDeep(DEFAULT_CONFIG),
        appConfig,
      );
      expect(service["appConfig"]).toEqual(expectedConfig);
    });

    it("should default datasetPageSizeOptions when missing", async () => {
      const configWithoutDatasetPageSizeOptions = {
        ...appConfig,
        datasetPageSizeOptions: undefined,
      };
      spyOn(service["http"], "get").and.returnValue(
        of(configWithoutDatasetPageSizeOptions),
      );

      await service.loadAppConfig();

      expect(service.getConfig().datasetPageSizeOptions).toEqual([
        5, 10, 25, 100,
      ]);
    });

    it("should not override a deployment's own batchActions when batchActionsEnabled is already truthy", async () => {
      spyOn(service["http"], "get").and.returnValue(of(appConfig));

      await service.loadAppConfig();

      expect(service.getConfig().batchActionsEnabled).toBe(true);
      expect(service.getConfig().batchActions).toEqual([]);
    });

    [undefined, false].forEach((batchActionsEnabled) => {
      it(`should default batchActionsEnabled/batchActions to the built-in Archive/Retrieve actions when archiveWorkflowEnabled is true and batchActionsEnabled is ${batchActionsEnabled}`, async () => {
        const configWithoutBatchActions = {
          ...appConfig,
          archiveWorkflowEnabled: true,
          batchActionsEnabled,
          batchActions: undefined,
        };
        spyOn(service["http"], "get").and.returnValue(
          of(configWithoutBatchActions),
        );

        await service.loadAppConfig();

        const config = service.getConfig();
        expect(config.batchActionsEnabled).toBe(true);
        expect(config.batchActions?.map((action) => action.label)).toEqual([
          "Archive",
          "Retrieve",
        ]);
      });
    });

    it("should not default batchActions when archiveWorkflowEnabled is false", async () => {
      const configWithoutArchiveWorkflow = {
        ...appConfig,
        archiveWorkflowEnabled: false,
        batchActionsEnabled: undefined,
        batchActions: undefined,
      };
      spyOn(service["http"], "get").and.returnValue(
        of(configWithoutArchiveWorkflow),
      );

      await service.loadAppConfig();

      const config = service.getConfig();
      expect(config.batchActionsEnabled).toBeUndefined();
      expect(config.batchActions).toBeUndefined();
    });

    it("should populate the defaulted Retrieve action's dialog options from retrieveDestinations", async () => {
      const configWithoutBatchActions = {
        ...appConfig,
        archiveWorkflowEnabled: true,
        batchActionsEnabled: undefined,
        batchActions: undefined,
        retrieveDestinations: [
          { option: "PSI", tooltip: "Copy to PSI" },
          { option: "URLs", tooltip: "Get download URLs" },
        ],
      };
      spyOn(service["http"], "get").and.returnValue(
        of(configWithoutBatchActions),
      );

      await service.loadAppConfig();

      const retrieveAction = service
        .getConfig()
        .batchActions?.find((action) => action.label === "Retrieve");
      expect(retrieveAction?.dialog?.fields[0].options).toEqual([
        { option: "PSI", tooltip: "Copy to PSI" },
        { option: "URLs", tooltip: "Get download URLs" },
      ]);
    });
  });

  describe("#getConfig()", () => {
    it("should return the AppConfig object", async () => {
      spyOn(service["http"], "get").and.returnValue(of(appConfig));
      await service.loadAppConfig();

      const expectedConfig = service["mergeObjects"](
        cloneDeep(DEFAULT_CONFIG),
        appConfig,
      );
      expect(service.getConfig()).toEqual(expectedConfig);
    });

    it("should layer additionalConfigs in order, with later sources overriding earlier ones", async () => {
      const localConfig = {
        addDatasetEnabled: true,
        facility: "Local Facility",
        mainMenu: { nonAuthenticatedUser: { datasets: true, files: false } },
        additionalConfigs: ["/api/v3/admin/config"],
      };
      const backendConfig = {
        addDatasetEnabled: false,
        mainMenu: { nonAuthenticatedUser: { files: true } },
      };
      spyOn(service["http"], "get").and.callFake(
        (url: string): Observable<any> => {
          if (url === "/assets/config.json") return of(localConfig);
          if (url === "/api/v3/admin/config") return of(backendConfig);
          return of({});
        },
      );

      await service.loadAppConfig();
      const config = service.getConfig();

      // The backend response is merged in after the local config, so it wins.
      expect(config.addDatasetEnabled).toBe(false);
      // Only set locally; the backend response doesn't touch it.
      expect(config.facility).toBe("Local Facility");
      // Nested objects are merged key-by-key rather than fully replaced.
      expect(config.mainMenu?.nonAuthenticatedUser?.datasets).toBe(true);
      expect(config.mainMenu?.nonAuthenticatedUser?.files).toBe(true);

      expect(service["http"].get).toHaveBeenCalledTimes(2);
      expect(service["http"].get).toHaveBeenCalledWith("/assets/config.json");
      expect(service["http"].get).toHaveBeenCalledWith("/api/v3/admin/config");
    });

    it("should not fetch the same additionalConfigs URL twice", async () => {
      spyOn(service["http"], "get").and.callFake(
        (url: string): Observable<any> => {
          if (url === "/assets/config.json") {
            return of({ additionalConfigs: ["/assets/config.json"] });
          }
          return of({});
        },
      );

      await service.loadAppConfig();

      expect(service["http"].get).toHaveBeenCalledTimes(1);
    });

    it("should tolerate a failing additionalConfigs source and keep the rest of the config", async () => {
      const localConfig = {
        facility: "Local Facility",
        additionalConfigs: ["/api/v3/admin/config"],
      };
      spyOn(service["http"], "get").and.callFake(
        (url: string): Observable<any> => {
          if (url === "/assets/config.json") return of(localConfig);
          if (url === "/api/v3/admin/config")
            return new Observable((sub) =>
              sub.error(new Error("No config in backend")),
            );
          return of({});
        },
      );

      await service.loadAppConfig();

      expect(service.getConfig().facility).toBe("Local Facility");
    });
  });
});
