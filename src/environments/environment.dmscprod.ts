// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: true,
  lbBaseURL: "https://scicatapi.esss.dk",
  fileserverBaseURL: "https://scicatfileserver.esss.dk",
  externalAuthEndpoint: "/auth/msad",
  archiveWorkflowEnabled: false,
  disabledDatasetColumns: ["archiveStatus", "retrieveStatus","dataStatus"],
  userProfileImageEnabled: true,
  facility: "ESS",
  tableSciDataEnabled: true,
  columnSelectEnabled: true,
  metadataPreviewEnabled: true,
  fileColorEnabled: true
};
