import { FilterConditionRelation } from "state-management/models";

// The fields of the Advanced search. To add a field, add a line to DATASET_FIELDS.

/** The value of the field list for scientific metadata, it is not a dataset field. */
export const METADATA_FIELD = "scientificMetadata";

export interface DatasetField {
  key: string;
  label: string;
  /** `IN` matches any of the values, `CONTAINS` matches text, `RANGE` is a date range. */
  relation: Extract<FilterConditionRelation, "IN" | "CONTAINS" | "RANGE">;
}

export const DATASET_FIELDS: DatasetField[] = [
  // lists
  { key: "keywords", label: "Keywords", relation: "IN" },
  { key: "proposalIds", label: "Proposal IDs", relation: "IN" },
  { key: "sampleIds", label: "Sample IDs", relation: "IN" },
  { key: "instrumentIds", label: "Instrument IDs", relation: "IN" },
  { key: "type", label: "Type", relation: "IN" },
  { key: "ownerGroup", label: "Owner group", relation: "IN" },
  { key: "creationLocation", label: "Creation location", relation: "IN" },
  // dates
  { key: "creationTime", label: "Creation time", relation: "RANGE" },
  // text
  { key: "datasetName", label: "Dataset name", relation: "CONTAINS" },
  { key: "owner", label: "Owner", relation: "CONTAINS" },
  { key: "sourceFolder", label: "Source folder", relation: "CONTAINS" },
  { key: "description", label: "Description", relation: "CONTAINS" },
];

export const getDatasetField = (key: string): DatasetField | undefined =>
  DATASET_FIELDS.find((field) => field.key === key);

/** An entry of the field dropdown, scientific metadata is one of them. */
export interface FieldOption {
  value: string;
  label: string;
  dataCy: string;
}

/** All fields in alphabetical order. */
export const getFieldOptions = (datasetFields: DatasetField[]): FieldOption[] =>
  [
    ...datasetFields.map(({ key, label }) => ({
      value: key,
      label,
      dataCy: "condition-field-dataset",
    })),
    {
      value: METADATA_FIELD,
      label: "Scientific metadata",
      dataCy: "condition-field-metadata",
    },
  ].sort((a, b) => a.label.localeCompare(b.label));
