import { TableColumn } from "state-management/models";

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=development` then `environment.development.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: true,
  lbBaseURL: "https://dacat-development.psi.ch",
  archiveWorkflowEnabled: true,
  externalAuthEndpoint: "/auth/msad",
  editMetadataEnabled: true,
  editSampleEnabled: true,
  editPublishedData: true,
  scienceSearchEnabled: true,
  disabledDatasetColumns: [],
  facility: "PSI",
  multipleDownloadEnabled: true,
  shoppingCartEnabled: true,
  shoppingCartOnHeader: true,
  columnSelectEnabled: true,
  ingestManual: "http://melanie.gitpages.psi.ch/SciCatPages/",
  gettingStarted: "http://melanie.gitpages.psi.ch/SciCatPages/SciCatGettingStartedSLSSummary.pdf",
  jupyterHubUrl: "https://jupyterhub.apps.ocp4a.psi.ch/hub/login",

  fileserverBaseURL: "http://127.0.0.1:8889",
  synapseBaseUrl: "https://scitest.esss.lu.se",
  riotBaseUrl: "http://scitest.esss.lu.se/riot",
  datasetReduceEnabled: true,
  fileColorEnabled: true,
  jsonMetadataEnabled: true,
  localColumns: [
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
    // { name: "derivedDatasetsNum", order: 12, type: "standard", enabled: true }
  ] as TableColumn[],
  logbookEnabled: true,
  metadataPreviewEnabled: true,
  maxDirectDownloadSize: 5000000000,
  multipleDownloadAction: "http://localhost:3011/zip",
  searchProposals: true,
  searchSamples: true,
  sftpHost: "login.esss.dk",
  tableSciDataEnabled: true,
  userProfileImageEnabled: true,
  searchPublicDataEnabled: true,
  landingPage: "doi2.psi.ch/detail/",
  fileDownloadEnabled: false,
  jobsEnabled: true,
  policiesEnabled: true
};
