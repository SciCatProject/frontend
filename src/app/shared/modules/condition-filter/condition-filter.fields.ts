import { FilterConditionRelation } from "state-management/models";

// The fields of the Advanced search. To add a field or to change an icon,
// edit this file: the field list and the quick picks follow.

/** Icons by kind of field, a field can also name any other Material icon. */
export const FIELD_ICONS = {
  metadata: "science",
  text: "label_outline",
  date: "event",
} as const;

/** The value of the field list for scientific metadata, it is not a dataset field. */
export const METADATA_FIELD = "scientificMetadata";

export interface DatasetField {
  key: string;
  label: string;
  icon: string;
  /** `IN` matches any of the values, `CONTAINS` matches text, `RANGE` is a date range. */
  relation: Extract<FilterConditionRelation, "IN" | "CONTAINS" | "RANGE">;
  /** Also a chip in an empty row. */
  quickPick?: boolean;
}

export const DATASET_FIELDS: DatasetField[] = [
  // lists
  {
    key: "keywords",
    label: "Keywords",
    icon: FIELD_ICONS.text,
    relation: "IN",
    quickPick: true,
  },
  {
    key: "proposalIds",
    label: "Proposal IDs",
    icon: FIELD_ICONS.text,
    relation: "IN",
  },
  {
    key: "sampleIds",
    label: "Sample IDs",
    icon: FIELD_ICONS.text,
    relation: "IN",
  },
  {
    key: "instrumentIds",
    label: "Instrument IDs",
    icon: FIELD_ICONS.text,
    relation: "IN",
  },
  { key: "type", label: "Type", icon: FIELD_ICONS.text, relation: "IN" },
  {
    key: "ownerGroup",
    label: "Owner group",
    icon: FIELD_ICONS.text,
    relation: "IN",
  },
  {
    key: "creationLocation",
    label: "Creation location",
    icon: FIELD_ICONS.text,
    relation: "IN",
  },
  // dates
  {
    key: "creationTime",
    label: "Creation time",
    icon: FIELD_ICONS.date,
    relation: "RANGE",
    quickPick: true,
  },
  // text
  {
    key: "datasetName",
    label: "Dataset name",
    icon: FIELD_ICONS.text,
    relation: "CONTAINS",
    quickPick: true,
  },
  {
    key: "owner",
    label: "Owner",
    icon: FIELD_ICONS.text,
    relation: "CONTAINS",
  },
  {
    key: "sourceFolder",
    label: "Source folder",
    icon: FIELD_ICONS.text,
    relation: "CONTAINS",
  },
  {
    key: "description",
    label: "Description",
    icon: FIELD_ICONS.text,
    relation: "CONTAINS",
  },
];

export const getDatasetField = (key: string): DatasetField | undefined =>
  DATASET_FIELDS.find((field) => field.key === key);

/** An entry of the field dropdown, scientific metadata is one of them. */
export interface FieldOption {
  value: string;
  label: string;
  icon: string;
  quickPick: boolean;
  dataCy: string;
}

const METADATA_OPTION: FieldOption = {
  value: METADATA_FIELD,
  label: "Scientific metadata",
  icon: FIELD_ICONS.metadata,
  quickPick: true,
  dataCy: "condition-field-metadata",
};

/** All fields in alphabetical order. */
export const getFieldOptions = (datasetFields: DatasetField[]): FieldOption[] =>
  [
    ...datasetFields.map(({ key, label, icon, quickPick }) => ({
      value: key,
      label,
      icon,
      quickPick: !!quickPick,
      dataCy: "condition-field-dataset",
    })),
    METADATA_OPTION,
  ].sort((a, b) => a.label.localeCompare(b.label));

/** The chips of an empty row, scientific metadata first. */
export const getQuickPicks = (options: FieldOption[]): FieldOption[] =>
  options
    .filter(({ quickPick }) => quickPick)
    .sort(
      (a, b) =>
        Number(b.value === METADATA_FIELD) - Number(a.value === METADATA_FIELD),
    );
