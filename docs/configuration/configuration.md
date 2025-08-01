# SciCat Frontend Configuration
SciCat frontend can be configured using a json object containing the entries listed below.
The json configuration object can be provided together with the app or through a URL.
Most of the time it is provided upon request directly from SciCat BE through the endpoint `/admin/config`

## Configuration Options
- skipSciCatLoginPageEnabled:
  - Type: boolean;
  - Description:
- accessTokenPrefix: 
  - Type: string;
  - Description:
- addDatasetEnabled: 
  - Type: boolean;
  - Description:
- archiveWorkflowEnabled: 
  - Type: boolean;
  - Description:
- datasetJsonScientificMetadata: 
  - Type: boolean;
  - Description:  
- datasetReduceEnabled:
  - Type: boolean;
  - Description: 
- datasetDetailsShowMissingProposalId:
  - Type: boolean;
  - Description:  
- datafilesActionsEnabled:
  - Type: boolean;
  - Description:
- datafilesActions:
  - Type:  any[];
  - Description:
- editDatasetEnabled:
  - Type: boolean;
  - Description:
- editDatasetSampleEnabled:
  - Type: boolean;
  - Description:
- editMetadataEnabled:
  - Type: boolean;
  - Description:
- editPublishedData:
  - Type: boolean;
  - Description:
- addSampleEnabled:
  - Type: boolean;
  - Description:
- externalAuthEndpoint:
  - Type: string | null;
  - Description:
- facility:
  - Type: string | null;
  - Description:
- loginFacilityLabel:
  - Type: string | null;
  - Description:
- loginLdapLabel:
  - Type: string | null;
  - Description:
- loginLocalLabel:
  - Type: string | null;
  - Description:
- loginFacilityEnabled:
  - Type: boolean;
  - Description:
- loginLdapEnabled:
  - Type: boolean;
  - Description:
- loginLocalEnabled:
  - Type: boolean;
  - Description:
- fileColorEnabled:
  - Type: boolean;
  - Description:
- fileDownloadEnabled:
  - Type: boolean;
  - Description:
- gettingStarted:
  - Type: string | null;
  - Description:
- ingestManual:
  - Type: string | null;
  - Description:
- jobsEnabled:
  - Type: boolean;
  - Description:
- jsonMetadataEnabled:
  - Type: boolean;
  - Description:
- jupyterHubUrl:
  - Type: string | null;
  - Description:
- landingPage:
  - Type: string | null;
  - Description:
- lbBaseURL:
  - Type: string;
  - Description:
- localColumns?:
  - Type: TableColumn[]; // localColumns is deprecated and should be removed in the future
  - Description:
- logbookEnabled:
  - Type: boolean;
  - Description:
- loginFormEnabled:
  - Type: boolean;
  - Description:
- maxDirectDownloadSize:
  - Type: number | null;
  - Description:
- metadataPreviewEnabled:
  - Type: boolean;
  - Description:
- metadataStructure:
  - Type: string;
  - Description:
- multipleDownloadAction:
  - Type: string | null;
  - Description:
- multipleDownloadEnabled:
  - Type: boolean;
  - Description:
- multipleDownloadUseAuthToken:
  - Type: boolean;
  - Description:
- oAuth2Endpoints:
  - Type: OAuth2Endpoint[];
  - Description:
- policiesEnabled:
  - Type: boolean;
  - Description:
- retrieveDestinations?:
  - Type: RetrieveDestinations[];
  - Description:
- riotBaseUrl:
  - Type: string | null;
  - Description:
- scienceSearchEnabled:
  - Type: boolean;
  - Description:
- scienceSearchUnitsEnabled:
  - Type: boolean;
  - Description:
- searchPublicDataEnabled:
  - Type: boolean;
  - Description:
- searchSamples:
  - Type: boolean;
  - Description:
- sftpHost:
  - Type: string | null;
  - Description:
- sourceFolder?:
  - Type: string;
  - Description:
- maxFileSizeWarning?:
  - Type: string;
  - Description:
- shareEnabled:
  - Type: boolean;
  - Description:
- shoppingCartEnabled:
  - Type: boolean;
  - Description:
- shoppingCartOnHeader:
  - Type: boolean;
  - Description:
### siteTitle:
  - Type: string | null;
  - Description: String shown at the center of the header. If left empty, no string is presented.
  - Default: None
### siteSciCatLogo:
  - Type: string | null;
  - Options: icon, full
  - Description: Type of SciCat logo shown in the app header.   
    If `icon` is selected, the compact logo of SciCat is shown, which is contained in the file `src/assets/images/scicat-header-logo-icon.png`.
    If `full` is selected, the full SciCat logo is shown. The full logo is saved in the file `src/assets/images/scicat-header-logo-full.png`.
  - Required
### siteHeaderLogo:
  - Type: string | null;
  - Description: Name of the file with that contains the logo of the facility/lab/company/legal entity that runs the instance of scicat. This shuld be only the name of the file. The path is relative to _`src/assets/images`_.  
  If SciCat FE is run in a container using the official release image, the file should be mounted in the container under the path just mentioned.
  - Example: assets/images/ess-logo-small.png
  - Default: None
  - Required
### siteHeaderLogoLink:
  - Type: string;
  - Description: This string will tell which url should be shown when th euser click on the side logo in the header. It can be an in-app path or a full URL.
  - Examples:  
    If we want to show the datasets list when the user click on the site logo, the value should be set to _`/datasets`_.  
    If we want to link to the main facility web site, the value should be set to the public facing website of the facility: _`https://my.facility.site`_
  - Optional
- siteLoginBackground:
  - Type: string | null;
  - Description:
- siteLoginLogo:
  - Type: string | null;
  - Description:
- tableSciDataEnabled:
  - Type: boolean;
  - Description:
- fileserverBaseURL:
  - Type: string;
  - Description:
- fileserverButtonLabel:
  - Type: string | undefined;
  - Description:
- helpMessages?:
  - Type: HelpMessages;
  - Description:
- notificationInterceptorEnabled:
  - Type: boolean;
  - Description:
- pidSearchMethod?:
  - Type: string;
  - Description:
- metadataEditingUnitListDisabled?:
  - Type: boolean;
  - Description:
- defaultDatasetsListSettings:
  - Type: DatasetsListSettings;
  - Description:
- labelMaps:
  - Type: LabelMaps;
  - Description:
- thumbnailFetchLimitPerPage:
  - Type: number;
  - Description:
- maxFileUploadSizeInMb?:
  - Type: string;
  - Description:
- datasetDetailComponent?:
  - Type: DatasetDetailComponentConfig;
  - Description:
- labelsLocalization?:
  - Type: LabelsLocalization;
  - Description:
- dateFormat?:
  - Type: string;
  - Description:
### defaultMainPage:
  - Type: MainPageConfiguration;  
  - Definition:
    ```
    {
      nonAuthenticatedUser: keyof typeof MainPageOptions;
      authenticatedUser: keyof typeof MainPageOptions;
    }
    ```
  - Description: esplicitly configure which is the in-app page that the users are redirected to when visiting the main FE url. As you can see from the structure, sites can define different main pages for authenticated and non-authenticated users.
  - Options: DATASETS, PROPOSALS, INSTRUMENTS, SAMPLES (as defined in enum `MainPagesOptions`)
  - Default: DATASETS
  - Optional
### mainMenu:
  - Type: MainMenuConfiguration;
  - Definitions:
    ```
    MainMenuConfiguration {
      nonAuthenticatedUser: MainMenuOptions;
      authenticatedUser: MainMenuOptions;
    }

    MainMenuOptions {
      datasets: boolean;
      files: boolean;
      instruments: boolean;
      jobs: boolean;
      policies: boolean;
      proposals: boolean;
      publishedData: boolean;
      samples: boolean;
    }
    ```
  - Description:  
  Main menu configuration which controls which menu items are active. There are two configurations, one for authenticated and one for non-auhtenticated users. If not configured, the FE will show a `No menu items configured` element. Each menu item might have additional conditions to be visible.
  - Example:  
  The following example will instruct the FE to show a menu with items datasets, instruments, proposals, and samples to non authenticated users. While for authenticated users, the menu will have all the items enabled, except for policies.
    ```
    "mainMenu": {
      "nonAuthenticatedUser": {
        "datasets": true,
        "files": false,
        "instruments": true,
        "jobs": false,
        "policies": false,
        "proposals": true,
        "publishedData": true,
        "samples": false
      },
      "authenticatedUser": {
        "datasets": true,
        "files": true,
        "instruments": true,
        "jobs": true,
        "policies": false,
        "proposals": true,
        "publishedData": true,
        "samples": true
      }
    }
    ```
  - Optional
### supportEmail:
  - Type: string;
  - Description:
  - Optional