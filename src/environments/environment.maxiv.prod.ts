export const environment = {
  production: true,
  lbBaseURL: "http://scicat.maxiv.lu.se",
  externalAuthEndpoint: "/auth/msad",
  archiveWorkflowEnabled: false,
  disabledDatasetColumns: [
    "select",
    "archiveStatus",
    "retrieveStatus",
    "ownerGroup",
  ],
  facility: "MAX IV",
  shoppingCartEnabled: false,
  fileDownloadEnabled: true,
  jobsEnabled: true,
  jsonMetadataEnabled: true,
  policiesEnabled: true,
};
