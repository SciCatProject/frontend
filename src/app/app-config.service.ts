import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { timeout } from "rxjs/operators";
import { TableColumn } from "state-management/models";

export interface OAuth2Endpoint {
  authURL: string;
  displayImage?: string | null;
  displayText: string;
}

export class RetrieveDestinations {
  location?: string | null;
  option = "";
}

export interface AppConfig {
  accessTokenPrefix: string;
  addDatasetEnabled: boolean;
  archiveWorkflowEnabled: boolean;
  datasetReduceEnabled: boolean;
  editDatasetSampleEnabled: boolean;
  editMetadataEnabled: boolean;
  editPublishedData: boolean;
  editSampleEnabled: boolean;
  externalAuthEndpoint: string | null;
  facility: string | null;
  fileColorEnabled: boolean;
  fileDownloadEnabled: boolean;
  gettingStarted: string | null;
  ingestManual: string | null;
  jobsEnabled: boolean;
  jsonMetadataEnabled: boolean;
  jupyterHubUrl: string | null;
  landingPage: string | null;
  lbBaseURL: string;
  localColumns: TableColumn[];
  logbookEnabled: boolean;
  loginFormEnabled: boolean;
  maxDirectDownloadSize: number | null;
  metadataPreviewEnabled: boolean;
  metadataStructure: string;
  multipleDownloadAction: string | null;
  multipleDownloadEnabled: boolean;
  oAuth2Endpoints: OAuth2Endpoint[];
  policiesEnabled: boolean;
  retrieveDestinations?: RetrieveDestinations[];
  riotBaseUrl: string | null;
  scienceSearchEnabled: boolean;
  scienceSearchUnitsEnabled: boolean;
  searchPublicDataEnabled: boolean;
  searchSamples: boolean;
  sftpHost: string | null;
  shareEnabled: boolean;
  shoppingCartEnabled: boolean;
  shoppingCartOnHeader: boolean;
  tableSciDataEnabled: boolean;
  fileserverBaseURL: string;
  fileserverButtonLabel: string | undefined;
}

@Injectable()
export class AppConfigService {
  private appConfig: Object = {};

  constructor(private http: HttpClient) {}

  async loadAppConfig(): Promise<void> {
    try {
      this.appConfig = await this.http
        .get("/client/config.json")
        .pipe(timeout(2000))
        .toPromise();
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
