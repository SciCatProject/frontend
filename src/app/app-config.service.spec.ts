import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { AppConfig, AppConfigService, HelpMessages } from "app-config.service";
import { of } from "rxjs";
import { MockHttp } from "shared/MockStubs";

const appConfig: AppConfig = {
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
  localColumns: [
    {
      name: "select",
      order: 0,
      type: "standard",
      enabled: true,
    },
    {
      name: "datasetName",
      order: 1,
      type: "standard",
      enabled: true,
    },
    {
      name: "runNumber",
      order: 2,
      type: "standard",
      enabled: true,
    },
    {
      name: "sourceFolder",
      order: 3,
      type: "standard",
      enabled: true,
    },
    {
      name: "size",
      order: 4,
      type: "standard",
      enabled: true,
    },
    {
      name: "creationTime",
      order: 5,
      type: "standard",
      enabled: true,
    },
    {
      name: "type",
      order: 6,
      type: "standard",
      enabled: true,
    },
    {
      name: "image",
      order: 7,
      type: "standard",
      enabled: true,
    },
    {
      name: "metadata",
      order: 8,
      type: "standard",
      enabled: true,
    },
    {
      name: "proposalId",
      order: 9,
      type: "standard",
      enabled: true,
    },
    {
      name: "ownerGroup",
      order: 10,
      type: "standard",
      enabled: false,
    },
    {
      name: "dataStatus",
      order: 11,
      type: "standard",
      enabled: false,
    },
  ],
  logbookEnabled: true,
  loginFormEnabled: true,
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
  shareEnabled: true,
  shoppingCartEnabled: true,
  shoppingCartOnHeader: true,
  tableSciDataEnabled: true,
  fileserverBaseURL: "",
  fileserverButtonLabel: "",
  datasetDetailsShowMissingProposalId: true,
  helpMessages: new HelpMessages(),
  notificationInterceptorEnabled: true,
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
