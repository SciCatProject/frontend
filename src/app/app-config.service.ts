import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { mergeWith } from "lodash-es";
import { firstValueFrom, of } from "rxjs";
import { catchError, timeout } from "rxjs/operators";
import {
  DatasetDetailComponentConfig,
  IngestorComponentConfig,
  LabelsLocalization,
  ListSettings,
  TableColumn,
} from "state-management/models";
import { DEFAULT_CONFIG } from "./app-config.defaults";

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
  ingestor: boolean;
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

export class MetadataFloatFormat {
  significantDigits: number;
  minCutoff: number; // using scientific notation below this cutoff
  maxCutoff: number; // using scientific notation above this cutoff
}

export class DefaultTab {
  proposal: string;
}

export interface AppConfigInterface {
  skipSciCatLoginPageEnabled?: boolean;
  accessTokenPrefix: string;
  addDatasetEnabled: boolean;
  archiveWorkflowEnabled: boolean;
  datasetJsonScientificMetadata: boolean;
  datasetReduceEnabled: boolean;
  datasetDetailsShowMissingProposalId: boolean;
  datasetActionsEnabled: boolean;
  datasetActions: any[];
  datafilesActionsEnabled: boolean;
  datafilesActions: any[];
  datasetDetailsActionsEnabled: boolean;
  datasetDetailsActions: any[];
  datasetSelectionActionsEnabled: boolean;
  datasetSelectionActions: any[];
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
  metadataFloatFormat?: MetadataFloatFormat;
  metadataFloatFormatEnabled?: boolean;
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
  siteIcon: string | null;
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
  hideEmptyMetadataTable?: boolean;
  ingestorComponent?: IngestorComponentConfig;
  defaultTab?: DefaultTab;
  statusBannerMessage?: string;
  statusBannerCode?: "INFO" | "WARN";
  labelMaps?: {
    filters?: Record<string, string>;
  };
  additionalConfigs?: string[];
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
  private mergedConfigUrls = new Set<string>(); // Processed config URLs to prevent circular references

  constructor(private http: HttpClient) {}

  /**
   * Custom merge to replace arrays instead of merging them
   */
  private mergeObjects(config: AppConfigInterface, overrides: Partial<AppConfigInterface>): AppConfigInterface {
    return mergeWith(
      config,
      overrides,
      (objVal, srcVal) =>
        Array.isArray(objVal) && Array.isArray(srcVal) ? srcVal : undefined,
    );
  }

  private loadConfigFromUrl(url: string): Promise<Partial<AppConfigInterface>> {
    return firstValueFrom(
      this.http.get<Partial<AppConfigInterface>>(url)
        .pipe(timeout(2000))
        .pipe(catchError(() => {
          console.error(`Error loading config from ${url}`);
          return of({} as Partial<AppConfigInterface>);
        }),
      ),
    );
  }

  /**
   * Depth-first merging of config files
   *
   * Only the first occurrence of each additional config URL will be merged to prevent
   * circular references.
   */
  private async loadAdditionalConfigs(config: AppConfigInterface): Promise<AppConfigInterface> {
    if (!config.additionalConfigs) {
      return config;
    }
    for (const url of config.additionalConfigs) {
      if (this.mergedConfigUrls.has(url)) {
        continue;
      }
      const additionalConfig = await this.loadConfigFromUrl(url);
      config = this.mergeObjects(config, additionalConfig);
      this.mergedConfigUrls.add(url);
      config = await this.loadAdditionalConfigs(config);
    }
    return config;
  }

  async loadAppConfig(): Promise<void> {
    // Load config from the frontend
    // This is done first to provide lbBaseURL
    let configObject = DEFAULT_CONFIG;
    configObject = await this.loadAdditionalConfigs(configObject);

    this.appConfig = Object.assign({}, this.appConfig, configObject);

    // Set some defaults
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

    if (config.metadataFloatFormatEnabled && !config.metadataFloatFormat) {
      config.metadataFloatFormat = {
        significantDigits: 3,
        minCutoff: 0.001,
        maxCutoff: 1000,
      };
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
