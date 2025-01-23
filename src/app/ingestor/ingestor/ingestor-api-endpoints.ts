export const INGESTOR_API_ENDPOINTS_V1 = {
  DATASET: "dataset",
  TRANSFER: "transfer",
  OTHER: {
    VERSION: "version",
  },
  EXTRACTOR: "extractor",
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
