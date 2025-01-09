import { JsonSchema } from "@jsonforms/core";

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
  extractorMetaDataReady: boolean;
  extractMetaDataRequested: boolean;
  mergedMetaDataString: string;

  apiErrorInformation: {
    metaDataExtraction: boolean;
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
  filePath: string;
  scientificMetadata: ScientificMetadata;
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
  backendURL: string;
  onClickNext: (step: number) => void;
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
      extractorMetaDataReady: false,
      extractMetaDataRequested: false,
      mergedMetaDataString: "",
      apiErrorInformation: {
        metaDataExtraction: false,
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
    filePath: { type: "string", readOnly: true }, // disabled, because its selected in the first step
    type: { type: "string" },
    license: { type: "string" },
    keywords: {
      type: "array",
      items: { type: "string" },
    },
    // scientificMetadata: { type: "string" } ; is created during the ingestor process
  },
  required: [
    "datasetName",
    "creationLocation",
    "dataFormat",
    "ownerGroup",
    "type",
    "license",
    "keywords",
    "scientificMetadata",
    "filePath",
  ],
};
