import { FilterConditionRelation } from "state-management/models";

// The fields of the Advanced search. DATASET_FIELDS are the defaults, the config can replace them.

/** The value of the field list for scientific metadata, it is not a dataset field. */
export const METADATA_FIELD = "scientificMetadata";

/** A field of scientific metadata is written like `scientificMetadata.detector.distance`. */
export const METADATA_PREFIX = `${METADATA_FIELD}.`;

/** The prefix is matched in any case, the key is written with the prefix as it is in the data. */
export const isMetadataFieldKey = (key: string): boolean =>
  key.length > METADATA_PREFIX.length &&
  key.slice(0, METADATA_PREFIX.length).toLowerCase() ===
    METADATA_PREFIX.toLowerCase();

const toMetadataFieldKey = (key: string): string =>
  `${METADATA_PREFIX}${key.slice(METADATA_PREFIX.length)}`;

export interface DatasetField {
  key: string;
  label: string;
  /**
   * A dataset field: `IN` matches any of the values, `CONTAINS` matches text, `RANGE` is a date
   * range. Scientific metadata: the operator the row starts with, `EQUAL_TO` when missing.
   */
  relation: FilterConditionRelation;
  /**
   * Config only: the value the row starts with. Values are separated by commas, `IN` takes any
   * number of them and `RANGE` two bounds ("from, to"). A list works as well.
   */
  value?: string | number | (string | number)[];
  /** Config only: the unit of the value of scientific metadata. */
  unit?: string;
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
    text: "Description, Owner and Dataset name contain the text you type, in upper or lower case.",
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
    text: "Creation time, Start time and End time take a start and an end date, either one can be left empty.",
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

const TYPE_OF_RELATION: Partial<Record<FilterConditionRelation, FieldType>> = {
  CONTAINS: "text",
  IN: "list",
  RANGE: "date",
};

const METADATA_RELATIONS: FilterConditionRelation[] = [
  "EQUAL_TO",
  "GREATER_THAN",
  "LESS_THAN",
  "GREATER_THAN_OR_EQUAL",
  "LESS_THAN_OR_EQUAL",
  "RANGE",
];

export const DATASET_FIELDS: DatasetField[] = [
  // lists
  { key: "pid", label: "PID", relation: "IN" },
  { key: "ownerGroup", label: "Group", relation: "IN" },
  { key: "keywords", label: "Keywords", relation: "IN" },
  { key: "proposalIds", label: "Proposal IDs", relation: "IN" },
  { key: "sampleIds", label: "Sample IDs", relation: "IN" },
  { key: "instrumentIds", label: "Instrument IDs", relation: "IN" },
  { key: "type", label: "Type", relation: "IN" },
  // dates
  { key: "creationTime", label: "Creation time", relation: "RANGE" },
  { key: "startTime", label: "Start time", relation: "RANGE" },
  { key: "endTime", label: "End time", relation: "RANGE" },
  // text
  { key: "creationLocation", label: "Location", relation: "CONTAINS" },
  { key: "datasetName", label: "Dataset name", relation: "CONTAINS" },
  { key: "owner", label: "Owner", relation: "CONTAINS" },
  { key: "description", label: "Description", relation: "CONTAINS" },
];

/** The fields the side panel had, the dialog opens with them when no fields are configured. */
export const SIDE_PANEL_FIELDS = [
  "creationLocation",
  "pid",
  "ownerGroup",
  "type",
  "keywords",
  "creationTime",
];

/** A range can be written as a text, "from, to": one value is the lower bound. */
const toFieldValue = (
  relation: FilterConditionRelation,
  value: DatasetField["value"],
): DatasetField["value"] =>
  relation === "RANGE" &&
  (typeof value === "string" || typeof value === "number")
    ? [0, 1].map((index) => String(value).split(",")[index]?.trim() ?? "")
    : value;

let datasetFields = DATASET_FIELDS;
let hasConfig = false;
let prefilledKeys = SIDE_PANEL_FIELDS;

/**
 * The fields of the config (`advancedSearchFields`), without any valid one the defaults are used.
 * Without saved filters the dialog opens with a row for every field of the config, without a
 * config for the fields the side panel had.
 * The labels are the ones of the localization (`labelsLocalization`), then the ones of the defaults.
 */
export function setDatasetFields(
  fields?: Partial<DatasetField>[] | null,
  labels?: Record<string, string> | null,
): void {
  const valid = (Array.isArray(fields) ? fields : []).flatMap((field) => {
    if (!field?.key) return [];
    const metadata = isMetadataFieldKey(field.key);
    const relation = metadata
      ? METADATA_RELATIONS.includes(field.relation)
        ? field.relation
        : "EQUAL_TO"
      : field.relation;
    if (!metadata && !(relation in TYPE_OF_RELATION)) return [];
    const { unit } = field;
    const key = metadata ? toMetadataFieldKey(field.key) : field.key;
    return [
      { key, relation, value: toFieldValue(relation, field.value), unit },
    ];
  });
  const labelOf = (key: string): string =>
    labels?.[key] ??
    (isMetadataFieldKey(key)
      ? (labels?.[`${key}.value`] ?? key.slice(METADATA_PREFIX.length))
      : DATASET_FIELDS.find((field) => field.key === key)?.label) ??
    key;

  hasConfig = valid.length > 0;
  datasetFields = (valid.length ? valid : DATASET_FIELDS).map(
    ({ key, relation, value, unit }: Partial<DatasetField>) => ({
      key,
      relation,
      label: labelOf(key),
      ...(value !== undefined && { value }),
      ...(unit && { unit }),
    }),
  );
  setPrefilledFields(
    valid.length ? valid.map(({ key }) => key) : SIDE_PANEL_FIELDS,
  );
}

export const getDatasetFields = (): DatasetField[] => datasetFields;

/** True when the fields come from the config, not from the defaults. */
export const hasConfiguredFields = (): boolean => hasConfig;

export const getDatasetField = (key: string): DatasetField | undefined =>
  datasetFields.find((field) => field.key === key);

/** The fields the dialog opens with, an empty list starts it with a row for scientific metadata. */
export function setPrefilledFields(keys: string[]): void {
  prefilledKeys = keys;
}

/** The dialog opens with an empty row for each of these fields when there are no saved filters. */
export const getPrefilledFields = (): DatasetField[] =>
  prefilledKeys.map(getDatasetField).filter((field) => !!field);

/** An entry of the field dropdown, scientific metadata is one of them. */
export interface FieldOption {
  value: string;
  label: string;
  type: FieldType;
  dataCy: string;
}

/** All fields in the order they are listed, scientific metadata is the last. */
export const getFieldOptions = (
  datasetFields: DatasetField[],
): FieldOption[] => [
  // the fields of scientific metadata are rows with the kind of scientific metadata
  ...datasetFields
    .filter(({ key }) => !isMetadataFieldKey(key))
    .map(({ key, label, relation }) => ({
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
];
