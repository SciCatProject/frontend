import { NgModule, InjectionToken } from "@angular/core";
import { environment } from "../environments/environment";
import { TableColumn } from "state-management/models";

export const APP_CONFIG = new InjectionToken<AppConfig>("app.config");

export class OAuth2Endpoint {
  displayText = "";
  displayImage?: string | null = null;
  authURL= "";
}

export class RetrieveDestinations {
  option = "";
  location?: string | null = null;
}

export class AppConfig {
  lbBaseURL = "";
  externalAuthEndpoint: string | null = null;
  fileserverBaseURL: string | null = null;
  synapseBaseUrl: string | null = null;
  riotBaseUrl: string | null = null;
  jupyterHubUrl: string | null = null;
  production = false;
  disabledDatasetColumns: string[] = [];
  addDatasetEnabled = false;
  archiveWorkflowEnabled = false;
  columnSelectEnabled = false;
  datasetReduceEnabled = false;
  editDatasetSampleEnabled = false;
  editMetadataEnabled = false;
  editPublishedData = false;
  editSampleEnabled = false;
  facility: string | null = null;
  fileColorEnabled = false;
  gettingStarted: string | null = null;
  ingestManual: string | null = null;
  jobsEnabled = false;
  jsonMetadataEnabled = false;
  landingPage: string | null = null;
  localColumns: TableColumn[] = [];
  logbookEnabled = false;
  fileDownloadEnabled = false;
  maxDirectDownloadSize: number | null = null;
  metadataPreviewEnabled = false;
  multipleDownloadAction: string | null = null;
  multipleDownloadEnabled = false;
  policiesEnabled = false;
  scienceSearchEnabled = false;
  scienceSearchUnitsEnabled = false;
  searchProposals = false;
  searchPublicDataEnabled = false;
  searchSamples = false;
  sftpHost: string | null = null;
  shareEnabled = false;
  shoppingCartEnabled = false;
  shoppingCartOnHeader = false;
  tableSciDataEnabled = false;
  metadataStructure = "";
  userProfileImageEnabled = false;
  userNamePromptEnabled = false;
  loginFormEnabled = true;
  oAuth2Endpoints: OAuth2Endpoint[] = [];
  retrieveDestinations?: RetrieveDestinations[] = [];
}

export const APP_DI_CONFIG: AppConfig = {
  lbBaseURL: environment.lbBaseURL ?? "http://localhost:3000",
  externalAuthEndpoint: environment.externalAuthEndpoint ?? null,
  fileserverBaseURL: environment.fileserverBaseURL ?? null,
  synapseBaseUrl: environment.synapseBaseUrl ?? null,
  riotBaseUrl: environment.riotBaseUrl ?? null,
  jupyterHubUrl: environment.jupyterHubUrl ?? null,
  production: environment.production,
  addDatasetEnabled: environment.addDatasetEnabled ?? false,
  archiveWorkflowEnabled: environment.archiveWorkflowEnabled ?? false,
  columnSelectEnabled: environment.columnSelectEnabled ?? false,
  datasetReduceEnabled: environment.datasetReduceEnabled ?? false,
  disabledDatasetColumns: environment.disabledDatasetColumns ?? [],
  editDatasetSampleEnabled: environment.editDatasetSampleEnabled ?? false,
  editMetadataEnabled: environment.editMetadataEnabled ?? false,
  editSampleEnabled: environment.editSampleEnabled ?? false,
  facility: environment.facility ?? null,
  fileColorEnabled: environment.fileColorEnabled ?? false,
  gettingStarted: environment.gettingStarted ?? null,
  ingestManual: environment.ingestManual ?? null,
  jobsEnabled: environment.jobsEnabled ?? false,
  jsonMetadataEnabled: environment.jsonMetadataEnabled ?? false,
  logbookEnabled: environment.logbookEnabled ?? false,
  retrieveDestinations: environment["retrieveDestinations"] || [],
  localColumns: environment["localColumns"] || [
    { name: "select", order: 0, type: "standard", enabled: true },
    { name: "datasetName", order: 1, type: "standard", enabled: true },
    { name: "runNumber", order: 2, type: "standard", enabled: true },
    { name: "sourceFolder", order: 3, type: "standard", enabled: true },
    { name: "size", order: 4, type: "standard", enabled: true },
    { name: "creationTime", order: 5, type: "standard", enabled: true },
    { name: "type", order: 6, type: "standard", enabled: true },
    { name: "image", order: 7, type: "standard", enabled: true },
    { name: "metadata", order: 8, type: "standard", enabled: true },
    { name: "proposalId", order: 9, type: "standard", enabled: true },
    { name: "ownerGroup", order: 10, type: "standard", enabled: true },
    { name: "dataStatus", order: 11, type: "standard", enabled: true },
    { name: "derivedDatasetsNum", order: 12, type: "standard", enabled: false },
  ],
  maxDirectDownloadSize: environment.maxDirectDownloadSize ?? null,
  fileDownloadEnabled: environment.fileDownloadEnabled ?? false,
  metadataPreviewEnabled: environment.metadataPreviewEnabled ?? false,
  multipleDownloadAction: environment.multipleDownloadAction ?? null,
  multipleDownloadEnabled: environment.multipleDownloadEnabled ?? false,
  policiesEnabled: environment.policiesEnabled ?? false,
  scienceSearchEnabled: environment.scienceSearchEnabled ?? false,
  scienceSearchUnitsEnabled: environment.scienceSearchUnitsEnabled ?? false,
  searchProposals: environment.searchProposals ?? false,
  searchPublicDataEnabled: environment.searchPublicDataEnabled ?? false,
  searchSamples: environment.searchSamples ?? false,
  sftpHost: environment.sftpHost ?? null,
  shareEnabled: environment.shareEnabled ?? false,
  shoppingCartEnabled: environment.shoppingCartEnabled ?? false,
  shoppingCartOnHeader: environment.shoppingCartOnHeader ?? false,
  tableSciDataEnabled: environment.tableSciDataEnabled ?? false,
  metadataStructure: environment.metadataStructure ?? "",
  userProfileImageEnabled: environment.userProfileImageEnabled ?? false,
  userNamePromptEnabled: environment.userNamePromptEnabled ?? false,
  landingPage: environment.landingPage ?? null,
  editPublishedData: (environment.editPublishedData === undefined) ? true: environment.editPublishedData,
  oAuth2Endpoints: environment.oAuth2Endpoints ?? [],
  loginFormEnabled: (environment.loginFormEnabled == undefined) ? true: environment.loginFormEnabled
};

@NgModule({
  providers: [
    {
      provide: APP_CONFIG,
      useValue: APP_DI_CONFIG,
    },
  ],
})
export class AppConfigModule {}
