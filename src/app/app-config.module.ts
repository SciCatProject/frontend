import { NgModule, InjectionToken } from "@angular/core";
import { environment } from "../environments/environment";

export const APP_CONFIG = new InjectionToken<AppConfig>("app.config");

export class AppConfig {
  externalAuthEndpoint: string;
  fileserverBaseURL: string;
  synapseBaseUrl: string;
  riotBaseUrl: string;
  production: boolean;
  disabledDatasetColumns: string[];
  archiveWorkflowEnabled: boolean;
  columnSelectEnabled: boolean;
  datasetReduceEnabled: boolean;
  editMetadataEnabled: boolean;
  editSampleEnabled: boolean;
  facility: string;
  fileColorEnabled: boolean;
  gettingStarted: string;
  ingestManual: string;
  localColumns: string[];
  logbookEnabled: boolean;
  maxDirectDownloadSize: number;
  metadataPreviewEnabled: boolean;
  multipleDownloadAction?: string;
  multipleDownloadEnabled: boolean;
  scienceSearchEnabled: boolean;
  searchProposals: boolean;
  searchPublicDataEnabled: boolean;
  searchSamples: boolean;
  sftpHost: string;
  shoppingCartEnabled: boolean;
  tableSciDataEnabled: boolean;
  userProfileImageEnabled: boolean;
}

export const APP_DI_CONFIG: AppConfig = {
  externalAuthEndpoint: environment.externalAuthEndpoint,
  fileserverBaseURL: environment["fileserverBaseURL"] || null,
  synapseBaseUrl: environment["synapseBaseUrl"] || null,
  riotBaseUrl: environment["riotBaseUrl"] || null,
  production: environment.production,
  archiveWorkflowEnabled: environment["archiveWorkflowEnabled"] || null,
  columnSelectEnabled: environment["columnSelectEnabled"] || false,
  datasetReduceEnabled: environment["datasetReduceEnabled"] || false,
  disabledDatasetColumns: environment["disabledDatasetColumns"] || [],
  editMetadataEnabled: environment["editMetadataEnabled"] || null,
  editSampleEnabled: environment["editSampleEnabled"] || null,
  facility: environment["facility"] || null,
  fileColorEnabled: environment["fileColorEnabled"] || false,
  gettingStarted: environment["gettingStarted"] || null,
  ingestManual: environment["ingestManual"] || null,
  logbookEnabled: environment["logbookEnabled"] || false,
  localColumns: environment["localColumns"] || [
    "select",
    "datasetName",
    "sourceFolder",
    "size",
    "creationTime",
    "type",
    "image",
    "metadata",
    "proposalId",
    "ownerGroup",
    "dataStatus",
  ],
  maxDirectDownloadSize: environment["maxDirectDownloadSize"] || null,
  metadataPreviewEnabled: environment["metadataPreviewEnabled"] || false,
  multipleDownloadAction: environment["multipleDownloadAction"],
  multipleDownloadEnabled: environment["multipleDownloadEnabled"] || false,
  scienceSearchEnabled: environment["scienceSearchEnabled"] || null,
  searchProposals: environment["searchProposals"] || false,
  searchPublicDataEnabled: environment["searchPublicDataEnabled"] || false,
  searchSamples: environment["searchSamples"] || false,
  sftpHost: environment["sftpHost"] || null,
  shoppingCartEnabled: environment["shoppingCartEnabled"] || false,
  tableSciDataEnabled: environment["tableSciDataEnabled"] || false,
  userProfileImageEnabled: environment["userProfileImageEnabled"] || false
};

@NgModule({
  providers: [
    {
      provide: APP_CONFIG,
      useValue: APP_DI_CONFIG
    }
  ]
})
export class AppConfigModule {}
