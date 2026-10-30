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

/** The four kinds of filter, the field dropdown shows the icon of the kind of each field. */
export type FieldType = "text" | "list" | "date" | "metadata";

export const FIELD_TYPES: Record<FieldType, { icon: string; label: string }> = {
  text: { icon: "text_fields", label: "Contains the text" },
  list: { icon: "data_array", label: "Any of the values, separated by commas" },
  date: { icon: "event", label: "From a date to a date" },
  metadata: { icon: "science", label: "Key, operator and value" },
};

/** What the dialog tells about each kind of filter, with an example of what is typed. */
export const FIELD_GUIDE: {
  type: FieldType;
  title: string;
  text: string;
  typed: string;
  finds: string;
}[] = [
  {
    type: "text",
    title: "Text",
    text: "Description, Owner, Dataset name and Source folder contain the text you type, in upper or lower case.",
    typed: "ope",
    finds: "finds OpenBeam and open beam",
  },
  {
    type: "list",
    title: "List",
    text: "Keywords, Type, IDs and the like take values separated by commas, any one of them is enough.",
    typed: "beam, test",
    finds: "finds datasets with the keyword beam or test",
  },
  {
    type: "date",
    title: "Date",
    text: "Creation time takes a start and an end date, either one can be left empty.",
    typed: "2026-01-01 to 2026-02-01",
    finds: "finds datasets created in between",
  },
  {
    type: "metadata",
    title: "Scientific metadata",
    text: "Pick a key, an operator and a value, and a unit if the value has one.",
    typed: "temperature ≥ 20 celsius",
    finds: "finds datasets that were at least this warm",
  },
];

const TYPE_OF_RELATION: Record<DatasetField["relation"], FieldType> = {
  CONTAINS: "text",
  IN: "list",
  RANGE: "date",
};

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
  type: FieldType;
  dataCy: string;
}

/** All fields in alphabetical order. */
export const getFieldOptions = (datasetFields: DatasetField[]): FieldOption[] =>
  [
    ...datasetFields.map(({ key, label, relation }) => ({
      value: key,
      label,
      type: TYPE_OF_RELATION[relation],
      dataCy: "condition-field-dataset",
    })),
    {
      value: METADATA_FIELD,
      label: "Scientific metadata",
      type: "metadata" as FieldType,
      dataCy: "condition-field-metadata",
    },
  ].sort((a, b) => a.label.localeCompare(b.label));
