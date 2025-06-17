import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { AppConfigInterface, AppConfigService, HelpMessages } from "app-config.service";
import { of } from "rxjs";
import { MockHttp } from "shared/MockStubs";

const appConfig: AppConfigInterface = {
  skipSciCatLoginPageEnabled: false,
  accessTokenPrefix: "",
  addDatasetEnabled: true,
  archiveWorkflowEnabled: true,
  datasetReduceEnabled: true,
  datasetJsonScientificMetadata: true,
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
  labelMaps: {
    filters: {
      LocationFilter: "Location",
      PidFilter: "Pid",
      GroupFilter: "Group",
      TypeFilter: "Type",
      KeywordFilter: "Keyword",
      DateRangeFilter: "Start Date - End Date",
      TextFilter: "Text",
    },
  },
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
      { LocationFilter: true },
      { PidFilter: true },
      { GroupFilter: true },
      { TypeFilter: true },
      { KeywordFilter: true },
      { DateRangeFilter: true },
      { TextFilter: true },
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
    it("should return the AppConfig object", async () => {
      spyOn(service["http"], "get").and.returnValue(of(appConfig));
      await service.loadAppConfig();

      const config = service.getConfig();

      expect(config).toEqual(appConfig);
    });
  });
});
