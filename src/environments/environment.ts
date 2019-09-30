// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  lbBaseURL: "http://127.0.0.1:3000",
  fileserverBaseURL: "http://127.0.0.1:8889",
  synapseBaseUrl: "https://scitest.esss.lu.se",
  riotBaseUrl: "http://scitest.esss.lu.se/riot",
  externalAuthEndpoint: "/auth/msad",
  archiveWorkflowEnabled: false,
  columnSelectEnabled: true,
  datasetReduceEnabled: true,
  disabledDatasetColumns: [],
  editMetadataEnabled: true,
  editSampleEnabled: true,
  facility: "ESS",
  fileColorEnabled: true,
  localColumns: [
    "select",
    "datasetName",
    "runNumber",
    "sourceFolder",
    "size",
    "creationTime",
    "type",
    "image",
    "metadata",
    "proposalId"
  ],
  logbookEnabled: true,
  metadataPreviewEnabled: true,
  multipleDownloadEnabled: true,
  maxDirectDownloadSize: 5000000000,
  multipleDownloadAction: "http://localhost:3011/zip",
  scienceSearchEnabled: true,
  searchProposals: true,
  searchSamples: true,
  sftpHost: "login.esss.dk",
  shoppingCartEnabled: true,
  tableSciDataEnabled: true,
  userProfileImageEnabled: true,
  searchPublicDataEnabled: true
};
