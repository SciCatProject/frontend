import { JsonSchema } from "@jsonforms/core";
import { UserInfo } from "ingestor/model/userInfo";

export interface ExtractionMethod {
  name: string;
  schema: string; // Base64 encoded JSON schema
}

export interface IngestionRequestInformation {
  selectedPath: string;
  selectedMethod: ExtractionMethod;
  selectedResolvedDecodedSchema: JsonSchema;
  scicatHeader: object;
  userMetaData: {
    organizational: object;
    sample: object;
  };
  extractorMetaData: {
    instrument: object;
    acquisition: object;
  };
  mergedMetaDataString: string;

  apiInformation: {
    extractMetaDataRequested: boolean;
    extractorMetaDataReady: boolean;
    metaDataExtractionFailed: boolean;
    extractorMetadataProgress: number;
    extractorMetaDataStatus: string;
  };
}

export interface TransferDataListEntry {
  transferId: string;
  status: string;
}

// There are many more... see DerivedDataset.ts
export interface SciCatHeader {
  datasetName: string;
  description: string;
  creationLocation: string;
  dataFormat: string;
  ownerGroup: string;
  type: string;
  license: string;
  keywords: string[];
  sourceFolder: string;
  scientificMetadata: ScientificMetadata;
  principalInvestigator: string;
  ownerEmail: string;
  contactEmail: string;
  investigator: string;
  creationTime: string;
  owner: string;
}

export interface ScientificMetadata {
  organizational: object;
  sample: object;
  acquisition: object;
  instrument: object;
}

export interface MetadataExtractorResult {
  cmdStdErr: string;
  cmdStdOut: string;
  result: string;
}

export interface DialogDataObject {
  createNewTransferData: IngestionRequestInformation;
  userInfo: UserInfo;
  backendURL: string;
  onClickNext: (step: number) => void;
  onStartUpload: () => Promise<boolean>;
}

export class IngestorHelper {
  static createEmptyRequestInformation = (): IngestionRequestInformation => {
    return {
      selectedPath: "",
      selectedMethod: { name: "", schema: "" },
      selectedResolvedDecodedSchema: {},
      scicatHeader: {},
      userMetaData: {
        organizational: {},
        sample: {},
      },
      extractorMetaData: {
        instrument: {},
        acquisition: {},
      },
      mergedMetaDataString: "",
      apiInformation: {
        metaDataExtractionFailed: false,
        extractMetaDataRequested: false,
        extractorMetaDataReady: false,
        extractorMetadataProgress: 0,
        extractorMetaDataStatus: "",
      },
    };
  };

  static mergeUserAndExtractorMetadata(
    userMetadata: object,
    extractorMetadata: object,
    space: number,
  ): string {
    return JSON.stringify(
      { ...userMetadata, ...extractorMetadata },
      null,
      space,
    );
  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const SciCatHeader_Schema: JsonSchema = {
  type: "object",
  properties: {
    datasetName: { type: "string" },
    description: { type: "string" },
    creationLocation: { type: "string" },
    dataFormat: { type: "string" },
    ownerGroup: { type: "string" },
    type: { type: "string" },
    license: { type: "string" },
    keywords: {
      type: "array",
      items: { type: "string" },
    },
    sourceFolder: { type: "string", readOnly: true }, // disabled, because its selected in the first step
    principalInvestigator: { type: "string" },
    ownerEmail: { type: "string" },
    contactEmail: { type: "string" },
    investigator: { type: "string" },
    creationTime: { type: "string" },
    owner: { type: "string" },
  },
  required: [
    "datasetName",
    "creationLocation",
    "dataFormat",
    "ownerGroup",
    "type",
    "sourceFolder",
    "principalInvestigator",
    "ownerEmail",
    "contactEmail",
    "investigator",
    "creationTime",
    "owner",
  ],
};

export const isBase64 = (str: string) => {
  try {
    return btoa(atob(str)) === str;
  } catch {
    return false;
  }
};

export const decodeBase64ToUTF8 = (base64: string) => {
  const text = atob(base64);
  const length = text.length;
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    bytes[i] = text.charCodeAt(i);
  }
  const decoder = new TextDecoder(); // default is utf-8
  return decoder.decode(bytes);
};
