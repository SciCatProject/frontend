import { NgModule, InjectionToken } from "@angular/core";
import { environment } from "../environments/environment";

export const APP_CONFIG = new InjectionToken<AppConfig>("app.config");

export class AppConfig {
  externalAuthEndpoint: string;
  fileserverBaseURL: string;
  production: boolean;
  disabledDatasetColumns: string[];
  archiveWorkflowEnabled: boolean;
  editMetadataEnabled: boolean;
  editSampleEnabled: boolean;
  csvEnabled: boolean;
  scienceSearchEnabled: boolean;
  facility: string;
  shoppingCartEnabled: boolean;
  multipleDownloadEnabled: boolean;
  multipleDownloadAction?: string;
  columnSelectEnabled: boolean;
  userProfileImageEnabled: boolean;
  logbookEnabled: boolean;
  tableSciDataEnabled: boolean;
  fileColorEnabled: boolean;
  metadataPreviewEnabled: boolean;
  ingestManual: string;
}

export const APP_DI_CONFIG: AppConfig = {
  externalAuthEndpoint: environment.externalAuthEndpoint,
  fileserverBaseURL: environment["fileserverBaseURL"] || null,
  production: environment.production,
  disabledDatasetColumns: environment["disabledDatasetColumns"] || [],
  archiveWorkflowEnabled: environment["archiveWorkflowEnabled"] || null,
  editMetadataEnabled: environment["editMetadataEnabled"] || null,
  editSampleEnabled: environment["editSampleEnabled"] || null,
  csvEnabled: environment["csvEnabled"] || null,
  scienceSearchEnabled: environment["scienceSearchEnabled"] || null,
  facility: environment["facility"] || null,
  shoppingCartEnabled: environment["shoppingCartEnabled"] || false,
  multipleDownloadEnabled: environment["multipleDownloadEnabled"] || false,
  multipleDownloadAction: environment["multipleDownloadAction"],
  columnSelectEnabled: environment["columnSelectEnabled"] || false,
  userProfileImageEnabled: environment["userProfileImageEnabled"] || false,
  logbookEnabled: environment["logbookEnabled"] || false,
  tableSciDataEnabled: environment["tableSciDataEnabled"] || false,
  fileColorEnabled: environment["fileColorEnabled"] || false,
  metadataPreviewEnabled: environment["metadataPreviewEnabled"] || false,
  ingestManual: environment["ingestManual"] || null,
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
