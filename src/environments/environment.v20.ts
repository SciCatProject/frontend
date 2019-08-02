// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: true,
  lbBaseURL: "http://172.30.242.21:3001",
  fileserverBaseURL: "https://kubetest04.dm.esss.dk:32223",
  externalAuthEndpoint: "/auth/msad",
  archiveWorkflowEnabled: false,
  editMetadataEnabled: false,
  columnSelectEnabled: true,
  editSampleEnabled: true,
  disabledDatasetColumns: ["archiveStatus", "retrieveStatus", "dataStatus"],
  shoppingCartEnabled: true,
  facility: "ESS",
  userProfileImageEnabled: true,
  tableSciDataEnabled: true
};
