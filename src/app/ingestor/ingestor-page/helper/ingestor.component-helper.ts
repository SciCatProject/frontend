import { JsonSchema, JsonSchema7 } from "@jsonforms/core";
import {
  CreateDatasetDto,
  CreateRawDatasetObsoleteDto,
  DatasetClass,
} from "@scicatproject/scicat-sdk-ts-angular";
import { isArray } from "mathjs";
import { PostDatasetResponse } from "shared/sdk/models/ingestor/postDatasetResponse";
import { UserInfo } from "shared/sdk/models/ingestor/userInfo";

export interface IngestorAutodiscovery {
  mailDomain: string;
  description?: string;
  facilityBackend: string;
}

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

  editorMode: string;
  apiInformation: {
    extractMetaDataRequested: boolean;
    extractorMetaDataReady: boolean;
    metaDataExtractionFailed: boolean;
    extractorMetadataProgress: number;
    extractorMetaDataStatus: string;
    ingestionRequestErrorMessage: string;
  };

  ingestionRequest: PostDatasetResponse | null;
  autoArchive: boolean;
}

export interface ScientificMetadata {
  organizational: object;
  sample: object;
  acquisition: object;
  instrument: object;
}

export interface DialogDataObject {
  createNewTransferData: IngestionRequestInformation;
  userInfo: UserInfo;
  backendURL: string;
  onClickNext: (step: number) => void;
  onStartUpload: () => Promise<boolean>;
}

export class IngestorHelper {
  static createMetaDataString(
    transferData: IngestionRequestInformation,
  ): string {
    const space = 2;
    const scicatMetadata: CreateDatasetDto = {
      ...(transferData.scicatHeader as CreateDatasetDto),
      scientificMetadata: {
        organizational: transferData.userMetaData["organizational"],
        sample: transferData.userMetaData["sample"],
        acquisition: transferData.extractorMetaData["acquisition"],
        instrument: transferData.extractorMetaData["instrument"],
      },
    };

    return JSON.stringify(scicatMetadata, null, space);
  }

  static saveConnectionsToLocalStorage = (connections: string[]) => {
    // Remove duplicates
    const uniqueConnections = Array.from(new Set(connections));
    const connectionsString = JSON.stringify(uniqueConnections);
    localStorage.setItem("ingestorConnections", connectionsString);
  };

  static loadConnectionsFromLocalStorage = (): string[] => {
    const connectionsString = localStorage.getItem("ingestorConnections");
    if (connectionsString) {
      const connections = JSON.parse(connectionsString);
      return connections;
    }
    return [];
  };

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
      editorMode: "INGESTION",
      apiInformation: {
        metaDataExtractionFailed: false,
        extractMetaDataRequested: false,
        extractorMetaDataReady: false,
        extractorMetadataProgress: 0,
        extractorMetaDataStatus: "",
        ingestionRequestErrorMessage: "",
      },
      ingestionRequest: null,
      autoArchive: true,
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

export const getJsonSchemaFromDto = () => {
  // Currently there is no valid schema which can be used. So we create one from the dataset class.
  // --string => string
  // --mail => string with regex
  // --readonly => string with readonly
  // --fqdn => string with regex
  // --skip => skip
  // --dateTime => string with dateTime format
  // --number => number
  // --boolean => boolean
  // --optional => optional

  // 0 => number
  // -1 => skip number
  // -2 => optional number
  const emptyDatasetForSchema: CreateRawDatasetObsoleteDto = {
    ownerGroup: "--string",
    accessGroups: [],
    isPublished: false,
    pid: "--skip",
    owner: "--string",
    contactEmail: "--mail",
    sourceFolder: "--string --readonly",
    size: -1, // skip
    numberOfFiles: -1, // skip
    creationTime: "--dateTime",
    type: "raw",
    datasetName: "--string",
    creationLocation: "--string",

    // Optional fields
    description: "--string --optional",
    license: "--string --optional",
    keywords: [],
    principalInvestigator: "--string", // skip [],
    scientificMetadata: {},
    ownerEmail: "--mail --optional",

    instrumentGroup: "--optional",
    orcidOfOwner: "--optional",
    sourceFolderHost: "--fqdn --optional",
    packedSize: -1, // skip
    numberOfFilesArchived: -1, // skip
    validationStatus: "--string --optional",
    classification: "--string --optional",
    comment: "--string --optional",
    dataQualityMetrics: -2, // optional
    startTime: "--dateTime --optional",
    endTime: "--dateTime --optional",
    dataFormat: "--string --optional",
    runNumber: "--optional",
    datasetlifecycle: undefined,

    proposalId: "--string --optional",
    sampleId: "--string --optional",
    instrumentId: "--string --optional",
    inputDatasets: [],
    usedSoftware: [],
    jobLogData: "--string --optional",
  };

  const descriptionMatrix = {
    createdBy:
      "Indicate the user who created this record. This property is added and maintained by the system.",
    updatedBy:
      "Indicate the user who updated this record last. This property is added and maintained by the system.",
    createdAt:
      "Date and time when this record was created. This field is managed by mongoose with through the timestamp settings. The field should be a string containing a date in ISO 8601 format (2024-02-27T12:26:57.313Z).",
    updatedAt:
      "Date and time when this record was updated last. This field is managed by mongoose with through the timestamp settings. The field should be a string containing a date in ISO 8601 format (2024-02-27T12:26:57.313Z).",
    ownerGroup:
      "Defines the group which owns the data, and therefore has unrestricted access to this data. Usually a pgroup like p12151.",
    accessGroups:
      "Optional additional groups which have read access to the data. Users which are members in one of the groups listed here are allowed to access this data. The special group 'public' makes data available to all users.",
    instrumentGroup:
      "Optional additional groups which have read and write access to the data. Users which are members in one of the groups listed here are allowed to access this data.",
    isPublished: "Flag is true when data are made publicly available.",
    pid: "Persistent Identifier for datasets derived from UUIDv4 and prepended automatically by site specific PID prefix like 20.500.12345/.",
    owner:
      "Owner or custodian of the dataset, usually first name + last name. The string may contain a list of persons, which should then be separated by semicolons.",
    ownerEmail:
      "Email of the owner or custodian of the dataset. The string may contain a list of emails, which should then be separated by semicolons.",
    orcidOfOwner:
      "ORCID of the owner or custodian. The string may contain a list of ORCIDs, which should then be separated by semicolons.",
    contactEmail:
      "Email of the contact person for this dataset. The string may contain a list of emails, which should then be separated by semicolons.",
    sourceFolder:
      "Absolute file path on file server containing the files of this dataset, e.g. /some/path/to/sourcefolder. In case of a single file dataset, e.g. HDF5 data, it contains the path up to, but excluding the filename. Trailing slashes are removed.",
    sourceFolderHost:
      "DNS host name of file server hosting sourceFolder, optionally including a protocol e.g. [protocol://]fileserver1.example.com.",
    size: "Total size of all source files contained in source folder on disk when unpacked.",
    packedSize:
      "Total size of all datablock package files created for this dataset.",
    numberOfFiles:
      "Total number of files in all OrigDatablocks for this dataset.",
    numberOfFilesArchived:
      "Total number of files in all Datablocks for this dataset.",
    creationTime:
      "Time when dataset became fully available on disk, i.e. all containing files have been written, or the dataset was created in SciCat. It is expected to be in ISO8601 format according to specifications for internet date/time format in RFC 3339, chapter 5.6.",
    type: "Characterize type of dataset, either 'raw' or 'derived'. Autofilled when choosing the proper inherited models.",
    validationStatus:
      "Defines a level of trust, e.g. a measure of how much data was verified or used by other persons.",
    keywords:
      "Array of tags associated with the meaning or contents of this dataset. Values should ideally come from defined vocabularies, taxonomies, ontologies or knowledge graphs.",
    description: "Free text explanation of contents of dataset.",
    datasetName:
      "A name for the dataset, given by the creator to carry some semantic meaning. Useful for display purposes e.g. instead of displaying the pid.",
    classification:
      "ACIA information about AUthenticity,COnfidentiality,INtegrity and AVailability requirements of dataset. E.g. AV(ailabilty)=medium could trigger the creation of a two tape copies.",
    license: "Name of the license under which the data can be used.",
    version:
      "Version of the API used when the dataset was created or last updated. API version is defined in code for each release. Managed by the system.",
    history: "List of objects containing old and new values.",
    datasetlifecycle:
      "Describes the current status of the dataset during its lifetime with respect to the storage handling systems.",
    techniques: "Array of techniques information, with technique name and pid.",
    relationships:
      "Array of relationships with other datasets. It contains relationship type and destination dataset.",
    sharedWith:
      "List of additional users that the dataset has been shared with.",
    scientificMetadata: "JSON object containing the scientific metadata.",
    comment:
      "Short comment provided by the user about a given dataset. This is additional to the description field.",
    dataQualityMetrics:
      "Data Quality Metrics given by the user to rate the dataset.",
    principalInvestigator:
      "First name and last name of principal investigator(s). If multiple PIs are present, use a semicolon separated list. This field is required if the dataset is a Raw dataset.",
    startTime:
      "Start time of data acquisition for the current dataset. It is expected to be in ISO8601 format according to specifications for internet date/time format in RFC 3339, chapter 5.6.",
    endTime:
      "End time of data acquisition for the current dataset. It is expected to be in ISO8601 format according to specifications for internet date/time format in RFC 3339, chapter 5.6.",
    creationLocation:
      "Unique location identifier where data was acquired. Usually in the form /Site-name/facility-name/instrumentOrBeamline-name.",
    dataFormat:
      "Defines the format of the data files in this dataset, e.g Nexus Version x.y.",
    runNumber:
      "Run number assigned by the system to the data acquisition for the current dataset.",
    proposalIds:
      "The ID of the proposal to which the dataset belongs to and it has been acquired under.",
    sampleIds:
      "Single ID or array of IDS of the samples used when collecting the data.",
    instrumentIds:
      "Id of the instrument or array of IDS of the instruments where the data contained in this dataset was created/acquired.",
    inputDatasets:
      "Array of input dataset identifiers used in producing the derived dataset. Ideally these are the global identifier to existing datasets inside this or federated data catalogs.",
    usedSoftware:
      "A list of links to software repositories which uniquely identifies the pieces of software, including versions, used for yielding the derived data.",
    jobParameters:
      "The creation process of the derived data will usually depend on input job parameters. The full structure of these input parameters are stored here.",
    jobLogData:
      "The output job logfile. Keep the size of this log data well below 15 MB.",
    proposalId: "The ID of the proposal to which the dataset belongs.",
    sampleId: "ID of the sample used when collecting the data.",
    instrumentId: "ID of the instrument where the data was created.",
  };

  const schema = {
    type: "object",
    properties: {},
    required: [],
  } as JsonSchema7;

  const regExMailFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const regExISO8601 =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;
  const regExFQDN = /^(?!:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/;
  const regExDatasetType = /raw|derived/;

  for (const key in emptyDatasetForSchema) {
    if (Object.prototype.hasOwnProperty.call(emptyDatasetForSchema, key)) {
      const value = (emptyDatasetForSchema as any)[key];

      // Decide type and add to schema
      if (typeof value === "string") {
        if (value.includes("--skip")) {
          continue; // Skip this field
        }
        schema.properties[key] = { type: "string" };

        // Depending on the value, add regex or format
        if (value.includes("--string")) {
          schema.properties[key].type = "string";
        }
        if (value.includes("--mail")) {
          schema.properties[key].type = "string";
          schema.properties[key].pattern = regExMailFormat.source;
        }
        if (value.includes("--readonly")) {
          schema.properties[key].type = "string";
          schema.properties[key].readOnly = true;
        }
        if (value.includes("--dateTime")) {
          schema.properties[key].type = "string";
          schema.properties[key].format = "date-time";
          schema.properties[key].pattern = regExISO8601.source;
        }
        if (value.includes("--fqdn")) {
          schema.properties[key].type = "string";
          schema.properties[key].pattern = regExFQDN.source;
        }
        if (value.includes("--optional")) {
          schema.properties[key].type = "string";
        }
        if (value.includes("--type")) {
          schema.properties[key].type = "string";
          schema.properties[key].format = "date-time";
          schema.properties[key].pattern = regExDatasetType.source;
        }
      } else if (typeof value === "number") {
        // If -1 skip
        if (value === -1) {
          continue; // Skip this field
        }
        schema.properties[key] = { type: "number" };
      } else if (typeof value === "boolean") {
        schema.properties[key] = { type: "boolean" };
      } else if (Array.isArray(value)) {
        schema.properties[key] = { type: "array" };
        schema.properties[key].items = { type: "string" };
      } else {
        continue; // Skip unsupported types
      }

      // Add the description from the description matrix to the schema
      if (descriptionMatrix[key]) {
        schema.properties[key].description = descriptionMatrix[key];
      }

      // Add to required fields if it is not optional
      // Wenn string ohne --optional oder --skip, wenn number > 0, the rest always required
      if (typeof value === "string") {
        if (
          value.includes("--string") &&
          !value.includes("--optional") &&
          !value.includes("--skip")
        ) {
          schema.required.push(key);
        }
      } else if (typeof value === "number") {
        if (value > 0) {
          schema.required.push(key);
        }
      } else if (isArray(value)) {
        // For arrays, if the array is not empty, add to required fields
        if (value.length > 0) {
          schema.required.push(key);
        }
      } else {
        // For all other types, add to required fields
        schema.required.push(key);
      }
    }
  }

  // Sort the keys in the schema alphabetically
  schema.properties = Object.fromEntries(
    Object.entries(schema.properties).sort(([keyA], [keyB]) =>
      keyA.localeCompare(keyB),
    ),
  );

  return schema;
};
