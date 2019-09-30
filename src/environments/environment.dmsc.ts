// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: true,
  lbBaseURL: "https://kubetest02.dm.esss.dk:32223",
  fileserverBaseURL: "https://kubetest04.dm.esss.dk:32223",
  externalAuthEndpoint: "/auth/msad",
  archiveWorkflowEnabled: false,
  editMetadataEnabled: true,
  columnSelectEnabled: true,
  editSampleEnabled: true,
  disabledDatasetColumns: ["archiveStatus", "retrieveStatus"],
  shoppingCartEnabled: true,
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
  facility: "ESS",
  userProfileImageEnabled: true
};
