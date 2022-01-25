import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TableColumn } from "state-management/models";

interface OAuth2Endpoint {
  displayText: string;
  displayImage?: string | null;
  authURL: string;
}

interface RetrieveDestinations {
  option: string;
  location?: string | null;
}

export interface AppConfig {
  lbBaseURL: string;
  externalAuthEndpoint: string | null;
  fileserverBaseURL: string | null;
  synapseBaseUrl: string | null;
  riotBaseUrl: string | null;
  jupyterHubUrl: string | null;
  disabledDatasetColumns: string[];
  addDatasetEnabled: boolean;
  archiveWorkflowEnabled: boolean;
  columnSelectEnabled: boolean;
  datasetReduceEnabled: boolean;
  editDatasetSampleEnabled: boolean;
  editMetadataEnabled: boolean;
  editPublishedData: boolean;
  editSampleEnabled: boolean;
  facility: string | null;
  fileColorEnabled: boolean;
  gettingStarted: string | null;
  ingestManual: string | null;
  jobsEnabled: boolean;
  jsonMetadataEnabled: boolean;
  landingPage: string | null;
  localColumns: TableColumn[];
  logbookEnabled: boolean;
  fileDownloadEnabled: boolean;
  maxDirectDownloadSize: number | null;
  metadataPreviewEnabled: boolean;
  multipleDownloadAction: string | null;
  multipleDownloadEnabled: boolean;
  policiesEnabled: boolean;
  scienceSearchEnabled: boolean;
  scienceSearchUnitsEnabled: boolean;
  searchProposals: boolean;
  searchPublicDataEnabled: boolean;
  searchSamples: boolean;
  sftpHost: string | null;
  shareEnabled: boolean;
  shoppingCartEnabled: boolean;
  shoppingCartOnHeader: boolean;
  tableSciDataEnabled: boolean;
  metadataStructure: string;
  userProfileImageEnabled: boolean;
  userNamePromptEnabled: boolean;
  loginFormEnabled: boolean;
  oAuth2Endpoints: OAuth2Endpoint[];
  retrieveDestinations?: RetrieveDestinations[];
}

@Injectable()
export class AppConfigService {
  private appConfig: Object = {};

  constructor(private http: HttpClient) {}

  async loadAppConfig(): Promise<void> {
    try {
      this.appConfig = await this.http.get("/api/v3/config").toPromise();
    } catch (err) {
      console.log("No config available in backend, trying with local config.");
      try {
        this.appConfig = await this.http.get("/assets/config.json").toPromise();
      } catch (err) {
        console.error("No config provided.");
      }
    }
  }

  getConfig(): AppConfig {
    return this.appConfig as AppConfig;
  }
}
