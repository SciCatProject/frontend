export const INGESTOR_API_ENDPOINTS_V1 = {
  DATASET: "dataset",
  TRANSFER: "transfer",
  OTHER: {
    VERSION: 'version',
  },
  EXTRACTOR: 'extractor',
};

export interface IPostExtractorEndpoint {
  filePath: string,
  methodName: string,
}

export interface IPostDatasetEndpoint {
  metaData: string
}