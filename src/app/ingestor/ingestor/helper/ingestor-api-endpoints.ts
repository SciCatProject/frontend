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

export const LAST_USED_FALLBACK =
  '["http://localhost:8000", "http://localhost:8888"]';
