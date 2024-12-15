import { JsonSchema } from '@jsonforms/core';

export interface IExtractionMethod {
  name: string;
  schema: string; // Base64 encoded JSON schema
};

export interface IIngestionRequestInformation {
  selectedPath: string;
  selectedMethod: IExtractionMethod;
  selectedResolvedDecodedSchema: JsonSchema;
  scicatHeader: Object;
  userMetaData: {
    organizational: Object,
    sample: Object,
  };
  extractorMetaData: {
    instrument: Object,
    acquisition: Object,
  };
  extractorMetaDataReady: boolean;
  extractMetaDataRequested: boolean;
  mergedMetaDataString: string;

  apiErrorInformation: {
    metaDataExtraction: boolean;
  }
}

// There are many more... see DerivedDataset.ts
export interface ISciCatHeader {
  datasetName: string;
  description: string;
  creationLocation: string;
  dataFormat: string;
  ownerGroup: string;
  type: string;
  license: string;
  keywords: string[];
  filePath: string;
  scientificMetadata: IScientificMetadata;
}

export interface IScientificMetadata {
  organizational: Object;
  sample: Object;
  acquisition: Object;
  instrument: Object;
}

export interface IDialogDataObject {
  createNewTransferData: IIngestionRequestInformation;
  backendURL: string;
  onClickNext: (step: number) => void;
}

export class IngestorHelper {
  static createEmptyRequestInformation = (): IIngestionRequestInformation => {
    return {
      selectedPath: '',
      selectedMethod: { name: '', schema: '' },
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
      mergedMetaDataString: '',
      apiErrorInformation: {
        metaDataExtraction: false,
      },
    };
  };

  static mergeUserAndExtractorMetadata(userMetadata: Object, extractorMetadata: Object, space: number): string {
    return JSON.stringify({ ...userMetadata, ...extractorMetadata }, null, space);
  };
}

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
      items: { type: "string" }
    },
    // scientificMetadata: { type: "string" } ; is created during the ingestor process
  },
  required: ["datasetName", "creationLocation", "dataFormat", "ownerGroup", "type", "license", "keywords", "scientificMetadata", "filePath"]
}