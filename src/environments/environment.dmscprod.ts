// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: true,
  lbBaseURL: "",
  fileserverBaseURL: "https://scicatfileserver.esss.dk",
  synapseBaseUrl: "https://scitest.esss.lu.se",
  riotBaseUrl: "http://scitest.esss.lu.se/riot",
  externalAuthEndpoint: "/auth/msad",
  archiveWorkflowEnabled: false,
  columnSelectEnabled: true,
  csvEnabled: false,
  datasetReduceEnabled: false,
  disabledDatasetColumns: ["dataStatus"],
  editMetadataEnabled: false,
  editSampleEnable: false,
  facility: "ESS",
  fileColorEnabled: true,
  logbookEnabled: false,
  maxDirectDownloadSize: 5000000000,
  metadataPreviewEnabled: true,
  multipleDownloadEnabled: true,
  multipleDownloadAction: "https://scicatfileserver.esss.dk/zip",
  scienceSearchEnabled: false,
  searchProposals: true,
  searchPublicDataEnabled: true,
  searchSamples: true,
  sftpHost: "login.esss.dk",
  shoppingCartEnabled: true,
  tableSciDataEnabled: true,
  userProfileImageEnabled: true
};
