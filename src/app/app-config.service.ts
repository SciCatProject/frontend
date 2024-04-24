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
  tooltip?: string | null;
}

export class HelpMessages {
  ingestManual: string;
  gettingStarted: string;

  constructor(
    gettingStarted = "gives a brief description on how to get started using the data catalog.",
    ingestManual = `provides detailed information on how to make your data available to the
    catalog as well as archiving and retrieval of datasets.`,
  ) {
    this.gettingStarted = gettingStarted;
    this.ingestManual = ingestManual;
  }
}

export interface AppConfig {
  skipSciCatLoginPageEnabled?: boolean;
  accessTokenPrefix: string;
  addDatasetEnabled: boolean;
  archiveWorkflowEnabled: boolean;
  datasetJsonScientificMetadata: boolean;
  datasetReduceEnabled: boolean;
  editDatasetSampleEnabled: boolean;
  editMetadataEnabled: boolean;
  editPublishedData: boolean;
  addSampleEnabled: boolean;
  externalAuthEndpoint: string | null;
  facility: string | null;
  loginFacilityLabel: string | null;
  loginLdapLabel: string | null;
  loginLocalLabel: string | null;
  loginFacilityEnabled: boolean;
  loginLdapEnabled: boolean;
  loginLocalEnabled: boolean;
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
  multipleDownloadUseAuthToken: boolean;
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
  siteHeaderLogo: string | null;
  siteLoginBackground: string | null;
  siteLoginLogo: string | null;
  tableSciDataEnabled: boolean;
  fileserverBaseURL: string;
  fileserverButtonLabel: string | undefined;
  datasetDetailsShowMissingProposalId: boolean;
  helpMessages?: HelpMessages;
  notificationInterceptorEnabled: boolean;
  pidSearchMethod?: string;
  metadataEditingUnitListDisabled?: boolean;
}

@Injectable()
export class AppConfigService {
  private appConfig: object = {};

  constructor(private http: HttpClient) {}

  async loadAppConfig(): Promise<void> {
    try {
      this.appConfig = await this.http
        .get("/api/v3/admin/config")
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
