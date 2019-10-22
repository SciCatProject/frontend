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
    { name: "ownerGroup", order: 10, enabled: false },
    { name: "dataStatus", order: 11, enabled: false },
    { name: "derivedDatasetsNum", order: 12, enabled: false }
  ],
  facility: "ESS",
  userProfileImageEnabled: true
};
