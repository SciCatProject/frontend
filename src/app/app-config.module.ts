import { NgModule, InjectionToken } from "@angular/core";
import { environment } from "../environments/environment";
import { TableColumn } from "state-management/models";

export const APP_CONFIG = new InjectionToken<AppConfig>("app.config");

export class AppConfig {
  externalAuthEndpoint: string;
  fileserverBaseURL: string;
  synapseBaseUrl: string;
  riotBaseUrl: string;
  jupyterHubUrl: string;
  production: boolean;
  disabledDatasetColumns: string[];
  addDatasetEnabled: boolean;
  archiveWorkflowEnabled: boolean;
  columnSelectEnabled: boolean;
  datasetReduceEnabled: boolean;
  editDatasetSampleEnabled: boolean;
  editMetadataEnabled: boolean;
  editPublishedData: boolean;
  editSampleEnabled: boolean;
  facility: string;
  fileColorEnabled: boolean;
  gettingStarted: string;
  ingestManual: string;
  jobsEnabled: boolean;
  jsonMetadataEnabled: boolean;
  landingPage: string;
  localColumns: TableColumn[];
  logbookEnabled: boolean;
  fileDownloadEnabled: boolean;
  maxDirectDownloadSize: number;
  metadataPreviewEnabled: boolean;
  multipleDownloadAction?: string;
  multipleDownloadEnabled: boolean;
  policiesEnabled: boolean;
  scienceSearchEnabled: boolean;
  scienceSearchUnitsEnabled: boolean;
  searchProposals: boolean;
  searchPublicDataEnabled: boolean;
  searchSamples: boolean;
  sftpHost: string;
  shoppingCartEnabled: boolean;
  shoppingCartOnHeader: boolean;
  tableSciDataEnabled: boolean;
  userProfileImageEnabled: boolean;
  userNamePromptEnabled: boolean;
}

export const APP_DI_CONFIG: AppConfig = {
  externalAuthEndpoint: environment["externalAuthEndpoint"] || null,
  fileserverBaseURL: environment["fileserverBaseURL"] || null,
  synapseBaseUrl: environment["synapseBaseUrl"] || null,
  riotBaseUrl: environment["riotBaseUrl"] || null,
  jupyterHubUrl: environment["jupyterHubUrl"] || null,
  production: environment.production,
  addDatasetEnabled: environment["addDatasetEnabled"] || false,
  archiveWorkflowEnabled: environment["archiveWorkflowEnabled"] || null,
  columnSelectEnabled: environment["columnSelectEnabled"] || false,
  datasetReduceEnabled: environment["datasetReduceEnabled"] || false,
  disabledDatasetColumns: environment["disabledDatasetColumns"] || [],
  editDatasetSampleEnabled: environment["editDatasetSampleEnabled"] || false,
  editMetadataEnabled: environment["editMetadataEnabled"] || null,
  editSampleEnabled: environment["editSampleEnabled"] || null,
  facility: environment["facility"] || null,
  fileColorEnabled: environment["fileColorEnabled"] || false,
  gettingStarted: environment["gettingStarted"] || null,
  ingestManual: environment["ingestManual"] || null,
  jobsEnabled: environment["jobsEnabled"] || false,
  jsonMetadataEnabled: environment["jsonMetadataEnabled"] || false,
  logbookEnabled: environment["logbookEnabled"] || false,
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
  maxDirectDownloadSize: environment["maxDirectDownloadSize"] || null,
  fileDownloadEnabled: environment["fileDownloadEnabled"] || false,
  metadataPreviewEnabled: environment["metadataPreviewEnabled"] || false,
  multipleDownloadAction: environment["multipleDownloadAction"],
  multipleDownloadEnabled: environment["multipleDownloadEnabled"] || false,
  policiesEnabled: environment["policiesEnabled"] || false,
  scienceSearchEnabled: environment["scienceSearchEnabled"] || null,
  scienceSearchUnitsEnabled: environment["scienceSearchUnitsEnabled"] || false,
  searchProposals: environment["searchProposals"] || false,
  searchPublicDataEnabled: environment["searchPublicDataEnabled"] || false,
  searchSamples: environment["searchSamples"] || false,
  sftpHost: environment["sftpHost"] || null,
  shoppingCartEnabled: environment["shoppingCartEnabled"] || false,
  shoppingCartOnHeader: environment["shoppingCartOnHeader"] || false,
  tableSciDataEnabled: environment["tableSciDataEnabled"] || false,
  userProfileImageEnabled: environment["userProfileImageEnabled"] || false,
  userNamePromptEnabled: environment["userNamePromptEnabled"] || false,
  landingPage: environment["landingPage"] || null,
  editPublishedData: environment["editPublishedData"] || true,
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
