import {
  TestBed,
} from "@angular/core/testing";
import {APP_DI_CONFIG, AppConfigModule, OAuth2Endpoint, AppConfig } from "app-config.module";
import { environment } from "../environments/environment";


// see https://testing-angular.com/testing-modules/
describe("AppConfigModule", () =>{

  beforeEach( () => {
    TestBed.configureTestingModule({
      imports: [AppConfigModule],
    });
  });
  
  it("initializes", () => {
    const module = TestBed.inject(AppConfigModule);
    expect(module).toBeTruthy();
  });

  
  describe("initial environment", () =>{
    
    it("initialized", () => {
      expect(environment.loginFormEnabled).toBeTruthy();
      expect(environment.oAuth2Endpoints.length).toEqual(0);
    });
  });

  describe("AppConfig init", () =>{
    it ("constructs", () => {
      const appConfig: AppConfig = {
        lbBaseURL: "lbBaseURL",
        externalAuthEndpoint: "externalAuthEndpoint",
        fileserverBaseURL: "fileserverBaseURL",
        synapseBaseUrl:  "synapseBaseUrl",
        riotBaseUrl:  "riotBaseUrl",
        jupyterHubUrl:  "jupyterHubUrl",
        production: false,
        disabledDatasetColumns: ["disabledDatasetColumns"],
        addDatasetEnabled: false,
        archiveWorkflowEnabled: false,
        columnSelectEnabled: false,
        datasetReduceEnabled: false,
        editDatasetSampleEnabled: false,
        editMetadataEnabled: false,
        editPublishedData: false,
        editSampleEnabled: false,
        facility: "facility",
        fileColorEnabled: false,
        gettingStarted: "gettingStarted",
        ingestManual: "ingestManual",
        jobsEnabled: false,
        jsonMetadataEnabled: false,
        landingPage: "landingPage",
        localColumns: [],
        logbookEnabled: false,
        fileDownloadEnabled: false,
        maxDirectDownloadSize: 5,
        metadataPreviewEnabled: false,
        multipleDownloadAction: null,
        multipleDownloadEnabled: false,
        policiesEnabled: false,
        scienceSearchEnabled: false,
        scienceSearchUnitsEnabled: false,
        searchProposals: false,
        searchPublicDataEnabled: false,
        searchSamples: false,
        sftpHost: "sftpHpst",
        shoppingCartEnabled: false,
        shoppingCartOnHeader: false,
        tableSciDataEnabled: false,
        metadataStructure: "",
        userProfileImageEnabled: false,
        userNamePromptEnabled: false,
        loginFormEnabled: false,
        oAuth2Endpoints: []
      };
      expect(appConfig.lbBaseURL).toEqual("lbBaseURL");
      appConfig.lbBaseURL = "lbBaseURL2";
      expect(appConfig.lbBaseURL).toEqual("lbBaseURL2");
      expect(appConfig.externalAuthEndpoint).toEqual("externalAuthEndpoint");
      expect(appConfig.fileserverBaseURL).toEqual("fileserverBaseURL");
      expect(appConfig.riotBaseUrl).toEqual("riotBaseUrl");
      expect(appConfig.jupyterHubUrl).toEqual("jupyterHubUrl");
      expect(appConfig.production).toBeFalsy();
      expect(appConfig.disabledDatasetColumns[0]).toEqual("disabledDatasetColumns");
    });
  });
  
  describe("oauth endpoint", () => {

    const endpoint: OAuth2Endpoint = {
      displayText: "test",
      authURL: "foo/bar"
    };

    it("is valid", () => {
      expect(endpoint.displayText).toEqual("test");
      expect(endpoint.authURL).toEqual("foo/bar");
      expect(endpoint.displayImage).toBeUndefined();
    });

  });


  describe("APP_DI_CONFIG", () =>{
    
    it("initialized", () => {
      expect(APP_DI_CONFIG.loginFormEnabled).toBeTruthy();
      expect(APP_DI_CONFIG.oAuth2Endpoints.length).toEqual(0);
    });
  });
});

