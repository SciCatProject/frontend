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
  scienceSearchEnabled: true,
  disabledDatasetColumns: [],
  facility: "PSI",
  multipleDownloadEnabled: true,
  shoppingCartEnabled: true,
  columnSelectEnabled: true,
  ingestManual: "https://melanie.gitpages.psi.ch/SciCatPages/",
  gettingStarted: "https://melanie.gitpages.psi.ch/SciCatPages/SciCatGettingStartedSLSSummary.pdf",

  fileserverBaseURL: "http://127.0.0.1:8889",
  synapseBaseUrl: "https://scitest.esss.lu.se",
  riotBaseUrl: "http://scitest.esss.lu.se/riot",
  datasetReduceEnabled: true,
  fileColorEnabled: true,
  localColumns: [
    { name: "select", order: 0, enabled: true },
    { name: "datasetName", order: 1, enabled: true },
    { name: "runNumber", order: 2, enabled: true },
    { name: "sourceFolder", order: 3, enabled: true },
    { name: "size", order: 4, enabled: true },
    { name: "creationTime", order: 5, enabled: true },
    { name: "type", order: 6, enabled: true },
    { name: "image", order: 7, enabled: true },
    { name: "metadata", order: 8, enabled: true },
    { name: "proposalId", order: 9, enabled: true },
    { name: "ownerGroup", order: 10, enabled: true },
    { name: "dataStatus", order: 11, enabled: true },
    { name: "derivedDatasetsNum", order: 12, enabled: true }
  ],
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
  landingPage: "doi2.psi.ch/detail/"
};
