export const INGESTOR_API_ENDPOINTS_V1 = {
  AUTH: {
    LOGIN: "login",
    LOGOUT: "logout",
    USERINFO: "userinfo",
  },
  DATASET: "dataset",
  TRANSFER: "transfer",
  OTHER: {
    VERSION: "version",
    HEALTH: "health",
  },
  EXTRACTOR: "extractor",
  METADATA: "metadata",
};

export interface PostExtractorEndpoint {
  filePath: string;
  methodName: string;
}

export interface PostDatasetEndpoint {
  metaData: string;
}

export const apiGetHealth = () => {
  console.log("Health check"); // TODO IMPLEMENT
};
