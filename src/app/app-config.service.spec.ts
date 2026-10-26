import { HttpClient } from "@angular/common/http";
import { TestBed, fakeAsync, tick } from "@angular/core/testing";
import {
  AppConfigInterface,
  AppConfigService,
  HelpMessages,
} from "app-config.service";
import { Observable, of, throwError } from "rxjs";
import { delay } from "rxjs/operators";
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
  datasetDetailComponent: {
    enableCustomizedComponent: false,
    customization: [],
    tileRestrictedIconVisible: false,
    tileRestrictedIconGroups: ["admin"],
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

      expect(service["appConfig"]).toEqual(appConfig);
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
    const mockConfigResponses: Record<string, object> = {
      "/assets/config.json": {
        accessTokenPrefix: "",
        lbBaseURL: "http://127.0.0.1:3000",
        gettingStarted: null,
        datasetPageSizeOptions: [5, 10, 25, 100],
        defaultMainPage: {
          nonAuthenticatedUser: "DATASETS",
          authenticatedUser: "DATASETS",
        },
        mainMenu: { nonAuthenticatedUser: { datasets: true } },
        dateFormat: "yyyy-MM-dd HH:mm",
        timezone: "UTC",
        oAuth2Endpoints: [
          {
            authURL: "abcd",
          },
        ],
        helpSettings: {
          enabled: false,
          htmlContent: "This is the mockConfigResponses config.json help",
        },
        aboutSettings: {
          enabled: false,
          htmlContent: "This is the mockConfigResponses config.json about",
        },
        datasetDetailComponent: {
          enableCustomizedComponent: false,
          customization: [],
          tileRestrictedIconVisible: false,
          tileRestrictedIconGroups: ["admin"],
        },
      },
      "/assets/config.override.json": {
        accessTokenPrefix: "Bearer ",
        gettingStarted: "aGettingStarted",
        addDatasetEnabled: true,
        mainMenu: { nonAuthenticatedUser: { files: true } },
        oAuth2Endpoints: [],
        helpSettings: {
          enabled: false,
          htmlContent:
            "This is the mockConfigResponses config.override.json help",
        },
        aboutSettings: {
          enabled: false,
          htmlContent:
            "This is the mockConfigResponses config.override.json about",
        },
        datasetDetailComponent: {
          enableCustomizedComponent: false,
          customization: [],
          tileRestrictedIconVisible: false,
          tileRestrictedIconGroups: ["admin"],
        },
      },
    };

    const mergedConfig = {
      accessTokenPrefix: "Bearer ",
      lbBaseURL: "http://127.0.0.1:3000",
      gettingStarted: "aGettingStarted",
      datasetPageSizeOptions: [5, 10, 25, 100],
      addDatasetEnabled: true,
      defaultMainPage: {
        nonAuthenticatedUser: "DATASETS",
        authenticatedUser: "DATASETS",
      },
      mainMenu: { nonAuthenticatedUser: { datasets: true, files: true } },
      oAuth2Endpoints: [],
      dateFormat: "yyyy-MM-dd HH:mm",
      timezone: "UTC",
      helpSettings: {
        enabled: false,
        htmlContent:
          "This is the mockConfigResponses config.override.json help",
      },
      aboutSettings: {
        enabled: false,
        htmlContent:
          "This is the mockConfigResponses config.override.json about",
      },
      datasetDetailComponent: {
        enableCustomizedComponent: false,
        customization: [],
        tileRestrictedIconVisible: false,
        tileRestrictedIconGroups: ["admin"],
      },
    };

    const mockHttpGet = (
      configOverrideEnabled: boolean,
      backendError = false,
    ) => {
      spyOn(service["http"], "get").and.callFake(
        (url: string): Observable<any> => {
          if (url === "/api/v3/admin/config") {
            if (backendError) {
              return new Observable((sub) =>
                sub.error(new Error("No config in backend")),
              );
            }
            return of(mergedConfig);
          }
          if (url === "/assets/config.json")
            return of({
              ...(mockConfigResponses[url] || {}),
              allowConfigOverrides: configOverrideEnabled,
            });
          return of(mockConfigResponses[url] || {});
        },
      );
    };

    it("should return the AppConfig object", async () => {
      spyOn(service["http"], "get").and.returnValue(of(appConfig));
      await service.loadAppConfig();

      const config = service.getConfig();

      expect(config).toEqual(appConfig);
    });

    [true, false].forEach((configOverrideEnabled) => {
      it(`should merge ${configOverrideEnabled} multiple config JSONs`, async () => {
        mockHttpGet(configOverrideEnabled);
        const config = await service["mergeConfig"]();
        expect(config).toEqual({
          ...(configOverrideEnabled
            ? mergedConfig
            : mockConfigResponses["/assets/config.json"]),
          allowConfigOverrides: configOverrideEnabled,
        });
      });
    });

    [true, false].forEach((configOverrideEnabled) => {
      it(`should return the merged ${configOverrideEnabled} appConfig`, async () => {
        mockHttpGet(configOverrideEnabled, true);
        await service.loadAppConfig();

        expect(service["appConfig"]).toEqual({
          ...(configOverrideEnabled
            ? mergedConfig
            : mockConfigResponses["/assets/config.json"]),
          allowConfigOverrides: configOverrideEnabled,
        });
        expect(service["http"].get).toHaveBeenCalledTimes(
          configOverrideEnabled ? 3 : 2,
        );
        expect(service["http"].get).toHaveBeenCalledWith(
          "/api/v3/admin/config",
        );
        expect(service["http"].get).toHaveBeenCalledWith("/assets/config.json");
        if (configOverrideEnabled)
          expect(service["http"].get).toHaveBeenCalledWith(
            "/assets/config.override.json",
          );
      });
    });
  });

  describe("#mergeConfig() with additionalConfigs", () => {
    const CONFIG = "/assets/config.json";
    const OVERRIDE = "/assets/config.override.json";
    let consoleError: jasmine.Spy;
    let consoleWarn: jasmine.Spy;

    // Serves each URL from `responses`; `Error` values are thrown as failures.
    const mockHttpGet = (responses: Record<string, object | Error>) =>
      spyOn(service["http"], "get").and.callFake(
        (url: string): Observable<any> => {
          const response = responses[url];
          return response instanceof Error
            ? throwError(() => response)
            : of(response ?? {});
        },
      );

    beforeEach(() => {
      consoleError = spyOn(console, "error");
      consoleWarn = spyOn(console, "warn");
    });

    it("should merge config.json and config.override.json when no list is set", async () => {
      mockHttpGet({
        [CONFIG]: { allowConfigOverrides: true, facility: "root" },
        [OVERRIDE]: { facility: "override" },
      });

      const result = await service["mergeConfig"]();

      expect(result).toEqual({
        allowConfigOverrides: true,
        facility: "override",
      });
    });

    it("should treat an empty list as no list", async () => {
      mockHttpGet({ [CONFIG]: { facility: "root", additionalConfigs: [] } });

      const result = await service["mergeConfig"]();

      expect(result).toEqual({ facility: "root", additionalConfigs: [] });
    });

    it("should only use the listed sources, in list order", async () => {
      const httpGet = mockHttpGet({
        [CONFIG]: {
          facility: "root",
          siteTitle: "root",
          additionalConfigs: ["/ext.json", CONFIG],
        },
        "/ext.json": { facility: "ext", siteHeaderLogo: "ext.png" },
      });

      const result = await service["mergeConfig"]();

      expect(result).toEqual({
        facility: "root",
        siteTitle: "root",
        siteHeaderLogo: "ext.png",
        additionalConfigs: ["/ext.json", CONFIG],
      });
      expect(httpGet).toHaveBeenCalledTimes(2);
    });

    it("should discard config.json when it is not listed", async () => {
      mockHttpGet({
        [CONFIG]: { facility: "root", additionalConfigs: ["/ext.json"] },
        "/ext.json": { siteTitle: "ext" },
      });

      const result = await service["mergeConfig"]();

      expect(result).toEqual({
        siteTitle: "ext",
        additionalConfigs: ["/ext.json"],
      });
    });

    it("should fetch the sources in parallel", fakeAsync(() => {
      const list = ["/a.json", "/b.json"];
      spyOn(service["http"], "get").and.callFake(
        (url: string): Observable<any> =>
          url === CONFIG
            ? of({ additionalConfigs: list })
            : of({ siteTitle: url }).pipe(delay(1000)),
      );

      let result: Partial<AppConfigInterface> | undefined;
      service["mergeConfig"]().then((r) => (result = r));
      tick(1000);

      expect(result).toEqual({ siteTitle: "/b.json", additionalConfigs: list });
    }));

    it("should treat a single URL string as a one-element list", async () => {
      mockHttpGet({
        [CONFIG]: { facility: "root", additionalConfigs: "/ext.json" as any },
        "/ext.json": { siteTitle: "ext" },
      });

      const result = await service["mergeConfig"]();

      expect(result).toEqual({
        siteTitle: "ext",
        additionalConfigs: ["/ext.json"],
      });
    });

    it("should ignore additionalConfigs that is not a URL or list of URLs", async () => {
      const bootstrap = {
        facility: "root",
        additionalConfigs: { a: 1 } as any,
      };
      mockHttpGet({ [CONFIG]: bootstrap });

      const result = await service["mergeConfig"]();

      expect(result).toEqual(bootstrap);
    });

    it("should use the list from config.override.json when overrides are allowed", async () => {
      const list = [CONFIG, OVERRIDE, "/ext.json"];
      mockHttpGet({
        [CONFIG]: { allowConfigOverrides: true, facility: "root" },
        [OVERRIDE]: { siteTitle: "override", additionalConfigs: list },
        "/ext.json": { facility: "ext" },
      });

      const result = await service["mergeConfig"]();

      expect(result).toEqual({
        allowConfigOverrides: true,
        facility: "ext",
        siteTitle: "override",
        additionalConfigs: list,
      });
    });

    it("should let the list in config.override.json replace the one in config.json", async () => {
      const httpGet = mockHttpGet({
        [CONFIG]: {
          allowConfigOverrides: true,
          additionalConfigs: ["/from-config.json"],
        },
        [OVERRIDE]: { additionalConfigs: [OVERRIDE, "/from-override.json"] },
      });

      await service["mergeConfig"]();

      expect(httpGet).toHaveBeenCalledWith("/from-override.json");
      expect(httpGet).not.toHaveBeenCalledWith("/from-config.json");
    });

    it("should use the list from config.json when config.override.json has none", async () => {
      const list = [CONFIG, OVERRIDE];
      mockHttpGet({
        [CONFIG]: {
          allowConfigOverrides: true,
          facility: "root",
          additionalConfigs: list,
        },
        [OVERRIDE]: { facility: "override" },
      });

      const result = await service["mergeConfig"]();

      expect(result).toEqual({
        allowConfigOverrides: true,
        facility: "override",
        additionalConfigs: list,
      });
    });

    it("should drop config.override.json when overrides are allowed but it is not listed", async () => {
      mockHttpGet({
        [CONFIG]: {
          allowConfigOverrides: true,
          facility: "root",
          additionalConfigs: [CONFIG],
        },
        [OVERRIDE]: { facility: "override" },
      });

      const result = await service["mergeConfig"]();

      expect(result.facility).toBe("root");
    });

    it("should load a listed config.override.json without resolving its list when overrides are not allowed", async () => {
      const httpGet = mockHttpGet({
        [CONFIG]: { additionalConfigs: [CONFIG, OVERRIDE] },
        [OVERRIDE]: {
          facility: "override",
          additionalConfigs: ["/ignored.json"],
        },
      });

      const result = await service["mergeConfig"]();

      expect(result).toEqual({
        facility: "override",
        additionalConfigs: [CONFIG, OVERRIDE],
      });
      expect(httpGet).not.toHaveBeenCalledWith("/ignored.json");
    });

    it("should ignore additionalConfigs inside remote sources", async () => {
      const httpGet = mockHttpGet({
        [CONFIG]: { additionalConfigs: ["/ext.json"] },
        "/ext.json": { facility: "ext", additionalConfigs: ["/nested.json"] },
      });

      const result = await service["mergeConfig"]();

      expect(result.additionalConfigs).toEqual(["/ext.json"]);
      expect(httpGet).not.toHaveBeenCalledWith("/nested.json");
    });

    it("should not fetch already loaded local files again", async () => {
      const httpGet = mockHttpGet({
        [CONFIG]: {
          allowConfigOverrides: true,
          additionalConfigs: ["assets/config.json", OVERRIDE],
        },
      });

      await service["mergeConfig"]();

      expect(httpGet).toHaveBeenCalledTimes(2);
    });

    it("should only load the first 3 entries, counting local files", async () => {
      const list = [CONFIG, OVERRIDE, "/a", "/b"];
      const httpGet = mockHttpGet({
        [CONFIG]: {
          allowConfigOverrides: true,
          facility: "root",
          additionalConfigs: list,
        },
        [OVERRIDE]: { siteTitle: "override" },
        "/a": { facility: "a" },
        "/b": { facility: "b" },
      });

      const result = await service["mergeConfig"]();

      expect(result.facility).toBe("a");
      expect(result.siteTitle).toBe("override");
      expect(httpGet).not.toHaveBeenCalledWith("/b");
      expect(consoleWarn).toHaveBeenCalledTimes(1);
      expect(consoleError).not.toHaveBeenCalled();
    });

    it("should continue with the remaining entries after a failed fetch", async () => {
      mockHttpGet({
        [CONFIG]: { additionalConfigs: ["/a", "/b"] },
        "/a": new Error("Network error"),
        "/b": { facility: "b" },
      });

      const result = await service["mergeConfig"]();

      expect(result.facility).toBe("b");
      expect(consoleError).toHaveBeenCalledWith("Error loading config from /a");
    });

    it("should replace arrays instead of merging them", async () => {
      mockHttpGet({
        [CONFIG]: {
          datasetPageSizeOptions: [5, 10, 25, 100],
          additionalConfigs: [CONFIG, "/ext.json"],
        },
        "/ext.json": { datasetPageSizeOptions: [10, 20, 30] },
      });

      const result = await service["mergeConfig"]();

      expect(result.datasetPageSizeOptions).toEqual([10, 20, 30]);
    });

    it("should deep merge nested objects", async () => {
      mockHttpGet({
        [CONFIG]: {
          defaultMainPage: {
            nonAuthenticatedUser: "DATASETS",
            authenticatedUser: "DATASETS",
          },
          additionalConfigs: [CONFIG, "/ext.json"],
        },
        "/ext.json": { defaultMainPage: { authenticatedUser: "PROPOSALS" } },
      });

      const result = await service["mergeConfig"]();

      expect(result.defaultMainPage).toEqual({
        nonAuthenticatedUser: "DATASETS",
        authenticatedUser: "PROPOSALS",
      });
    });

    it("should ignore additionalConfigs from the backend config", async () => {
      const httpGet = mockHttpGet({
        "/api/v3/admin/config": { additionalConfigs: ["/ext.json"] },
      });

      await service.loadAppConfig();

      expect(httpGet).not.toHaveBeenCalledWith("/ext.json");
    });
  });
});
