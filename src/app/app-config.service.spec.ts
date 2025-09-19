import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import {
  AppConfigInterface,
  AppConfigService,
  HelpMessages,
} from "app-config.service";
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
  datasetJsonScientificMetadata: true,
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
  jsonMetadataEnabled: true,
  jupyterHubUrl: "https://jupyterhub.esss.lu.se/",
  landingPage: "doi2.psi.ch/detail/",
  lbBaseURL: "http://127.0.0.1:3000",
  logbookEnabled: true,
  loginFormEnabled: true,
  thumbnailFetchLimitPerPage: 500,
  maxFileUploadSizeInMb: "16mb",
  maxDirectDownloadSize: 5000000000,
  metadataPreviewEnabled: true,
  metadataStructure: "",
  multipleDownloadAction: "http://localhost:3012/zip",
  multipleDownloadEnabled: true,
  multipleDownloadUseAuthToken: false,
  imprintUrl = "https://example.com/imprint",
  privacyUrl = "https://example.com/privacy",
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
  datafilesActionsEnabled: true,
  datafilesActions: [
    {
      id: "eed8efec-4354-11ef-a3b5-d75573a5d37f",
      order: 4,
      label: "Download All",
      files: "all",
      mat_icon: "download",
      url: "",
      target: "_blank",
      enabled: "#SizeLimit",
      authorization: ["#datasetAccess", "#datasetPublic"],
    },
    {
      id: "3072fafc-4363-11ef-b9f9-ebf568222d26",
      order: 3,
      label: "Download Selected",
      files: "selected",
      mat_icon: "download",
      url: "",
      target: "_blank",
      enabled: "#Selected && #SizeLimit",
      authorization: ["#datasetAccess", "#datasetPublic"],
    },
    {
      id: "4f974f0e-4364-11ef-9c63-03d19f813f4e",
      order: 2,
      label: "Notebook All",
      files: "all",
      icon: "/assets/icons/jupyter_logo.png",
      url: "",
      target: "_blank",
      authorization: ["#datasetAccess", "#datasetPublic"],
    },
    {
      id: "fa3ce6ee-482d-11ef-95e9-ff2c80dd50bd",
      order: 1,
      label: "Notebook Selected",
      files: "selected",
      icon: "/assets/icons/jupyter_logo.png",
      url: "",
      target: "_blank",
      enabled: "#Selected",
      authorization: ["#datasetAccess", "#datasetPublic"],
    },
  ],
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
  });

  describe("#getConfig()", () => {
    const mockConfigResponses: Record<string, object> = {
      "/assets/config.json": {
        accessTokenPrefix: "",
        lbBaseURL: "http://127.0.0.1:3000",
        gettingStarted: null,
        mainMenu: { nonAuthenticatedUser: { datasets: true } },
      },
      "/assets/config.0.json": { accessTokenPrefix: "Bearer " },
      "/assets/config.override.json": {
        gettingStarted: "aGettingStarted",
        addDatasetEnabled: true,
        mainMenu: { nonAuthenticatedUser: { files: true } },
      },
      "/assets/config.override.0.json": { siteTitle: "Test title" },
    };

    const mergedConfig = {
      accessTokenPrefix: "Bearer ",
      lbBaseURL: "http://127.0.0.1:3000",
      gettingStarted: "aGettingStarted",
      addDatasetEnabled: true,
      siteTitle: "Test title",
      mainMenu: { nonAuthenticatedUser: { datasets: true, files: true } },
    };

    const mockHttpGet = (backendError = false) => {
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

    it("should merge multiple config JSONs", async () => {
      mockHttpGet();
      const config = await service["mergeConfig"]();
      expect(config).toEqual(mergedConfig);
    });

    it("should return the merged appConfig", async () => {
      mockHttpGet(true);
      await service.loadAppConfig();

      expect(service["appConfig"]).toEqual(
        jasmine.objectContaining(mergedConfig),
      );
      expect(service["http"].get).toHaveBeenCalledWith("/api/v3/admin/config");
      expect(service["http"].get).toHaveBeenCalledWith("/assets/config.json");
      expect(service["http"].get).toHaveBeenCalledWith("/assets/config.0.json");
      expect(service["http"].get).toHaveBeenCalledWith(
        "/assets/config.override.json",
      );
      expect(service["http"].get).toHaveBeenCalledWith(
        "/assets/config.override.0.json",
      );
    });
  });
});
