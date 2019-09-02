// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  lbBaseURL: "",
  fileserverBaseURL: "/fileserver",
  synapseBaseUrl: "https://scicat06.esss.lu.se:8448",
  riotBaseUrl: "http://scicat05.esss.lu.se",
  externalAuthEndpoint: "/auth/msad",
  disabledDatasetColumns: ["dataStatus"],
  archiveWorkflowEnabled: false,
  columnSelectEnabled: true,
  csvEnabled: false,
  datasetReduceEnabled: true,
  editMetadataEnabled: true,
  editSampleEnabled: true,
  facility: "ESS",
  fileColorEnabled: true,
  logbookEnabled: true,
  metadataPreviewEnabled: true,
  multipleDownloadEnabled: true,
  searchProposals: true,
  scienceSearchEnabled: true,
  searchSamples: true,
  shoppingCartEnabled: true,
  tableSciDataEnabled: true,
  userProfileImageEnabled: true
};
