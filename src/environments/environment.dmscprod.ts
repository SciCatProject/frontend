// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: true,
  lbBaseURL: "",
  fileserverBaseURL: "https://scicatfileserver.esss.dk",
  externalAuthEndpoint: "/auth/msad",
  archiveWorkflowEnabled: false,
  disabledDatasetColumns: ["dataStatus"],
  columnSelectEnabled: true,
  csvEnabled: false,
  datasetReduceEnabled: false,
  editMetadataEnabled: false,
  editSampleEnable: false,
  facility: "ESS",
  fileColorEnabled: true,
  logbookEnabled: false,
  metadataPreviewEnabled: true,
  multipleDownloadEnabled: true,
  multipleDownloadAction: "http://localhost:3011/zip",
  scienceSearchEnabled: false,
  searchProposals: true,
  searchSamples: true,
  shoppingCartEnabled: true,
  tableSciDataEnabled: true,
  userProfileImageEnabled: true
};
