import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { merge } from "lodash-es";
import { firstValueFrom, forkJoin, of } from "rxjs";
import { catchError, timeout } from "rxjs/operators";
import {
  DatasetDetailComponentConfig,
  IngestorComponentConfig,
  LabelsLocalization,
  ListSettings,
  TableColumn,
} from "state-management/models";

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

export enum MainPageOptions {
  DATASETS = "/datasets",
  PROPOSALS = "/proposals",
  INSTRUMENTS = "/instruments",
  SAMPLES = "/samples",
}

export class MainPageConfiguration {
  nonAuthenticatedUser: keyof typeof MainPageOptions;
  authenticatedUser: keyof typeof MainPageOptions;
}

export class MainMenuOptions {
  datasets: boolean;
  ingestor:boolean;
  files: boolean;
  instruments: boolean;
  jobs: boolean;
  policies: boolean;
  proposals: boolean;
  publishedData: boolean;
  samples: boolean;
}

export class MainMenuConfiguration {
  nonAuthenticatedUser: MainMenuOptions;
  authenticatedUser: MainMenuOptions;
}

export interface AppConfigInterface {
  skipSciCatLoginPageEnabled?: boolean;
  accessTokenPrefix: string;
  addDatasetEnabled: boolean;
  archiveWorkflowEnabled: boolean;
  datasetJsonScientificMetadata: boolean;
  datasetReduceEnabled: boolean;
  datasetDetailsShowMissingProposalId: boolean;
  datafilesActionsEnabled: boolean;
  datafilesActions: any[];
  editDatasetEnabled: boolean;
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
  localColumns?: TableColumn[]; // localColumns is deprecated and should be removed in the future
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
  sourceFolder?: string;
  maxFileSizeWarning?: string;
  shareEnabled: boolean;
  shoppingCartEnabled: boolean;
  shoppingCartOnHeader: boolean;
  siteTitle: string | null;
  siteSciCatLogo: string | null;
  siteHeaderLogo: string | null;
  siteLoginBackground: string | null;
  siteLoginLogo: string | null;
  tableSciDataEnabled: boolean;
  fileserverBaseURL: string;
  fileserverButtonLabel: string | undefined;
  helpMessages?: HelpMessages;
  notificationInterceptorEnabled: boolean;
  pidSearchMethod?: string;
  metadataEditingUnitListDisabled?: boolean;
  defaultDatasetsListSettings?: ListSettings;
  defaultProposalsListSettings?: ListSettings;
  thumbnailFetchLimitPerPage: number;
  maxFileUploadSizeInMb?: string;
  datasetDetailComponent?: DatasetDetailComponentConfig;
  labelsLocalization?: LabelsLocalization;
  dateFormat?: string;
  defaultMainPage?: MainPageConfiguration;
  siteHeaderLogoUrl?: string;
  mainMenu?: MainMenuConfiguration;
  supportEmail?: string;
  checkBoxFilterClickTrigger?: boolean;
  ingestorComponent?: IngestorComponentConfig;
  depositorURL: string;
  datasetOneDepIntegration?: boolean;
}

function isMainPageConfiguration(obj: any): obj is MainPageConfiguration {
  const validKeys = Object.keys(MainPageOptions);
  return (
    obj &&
    typeof obj === "object" &&
    validKeys.includes(obj.nonAuthenticatedUser) &&
    validKeys.includes(obj.authenticatedUser)
  );
}

@Injectable({
  providedIn: "root",
})
export class AppConfigService {
  private appConfig: object = {};
  private configsSize = 4;

  constructor(private http: HttpClient) {}

  private async loadAndMerge(files: string[]): Promise<object> {
    const requests = files.map((f) =>
      this.http.get(`/assets/${f}`).pipe(catchError(() => of({}))),
    );
    const configs = await firstValueFrom(forkJoin(requests));
    return configs.reduce((acc, cfg) => merge(acc, cfg), {});
  }

  private async mergeConfig(): Promise<object> {
    const normalConfigFiles = Array.from(
      { length: this.configsSize },
      (_, i) => `config.${i}.json`,
    );
    const overrideConfigFiles = Array.from(
      { length: this.configsSize },
      (_, i) => `config.override.${i}.json`,
    );
    return await this.loadAndMerge([
      "config.json",
      ...normalConfigFiles,
      "config.override.json",
      ...overrideConfigFiles,
    ]);
  }

  async loadAppConfig(): Promise<void> {
    try {
      const config = await this.http
        .get("/api/v3/admin/config")
        .pipe(timeout(2000))
        .toPromise();
      this.appConfig = Object.assign({}, this.appConfig, config);
    } catch (err) {
      console.log("No config available in backend, trying with local config.");
      try {
        const config = await this.mergeConfig();
        this.appConfig = Object.assign({}, this.appConfig, config);
      } catch (err) {
        console.error("No config provided.");
      }
    }

    const config: AppConfigInterface = this.appConfig as AppConfigInterface;
    if (
      "defaultMainPage" in config &&
      isMainPageConfiguration(config.defaultMainPage)
    ) {
      config.defaultMainPage.nonAuthenticatedUser = Object.keys(
        MainPageOptions,
      ).includes(config.defaultMainPage.nonAuthenticatedUser)
        ? config.defaultMainPage.nonAuthenticatedUser
        : "DATASETS";
      config.defaultMainPage.authenticatedUser = Object.keys(
        MainPageOptions,
      ).includes(config.defaultMainPage.authenticatedUser)
        ? config.defaultMainPage.authenticatedUser
        : "DATASETS";
    } else {
      config.defaultMainPage = {
        nonAuthenticatedUser: "DATASETS",
        authenticatedUser: "DATASETS",
      } as MainPageConfiguration;
    }

    if (!config.dateFormat) {
      config.dateFormat = "yyyy-MM-dd HH:mm";
    }

    this.appConfig = config;
  }

  getConfig(): AppConfigInterface {
    if (!this.appConfig) {
      console.error("AppConfigService: Configuration not loaded!");
    }

    return this.appConfig as AppConfigInterface;
  }
}
