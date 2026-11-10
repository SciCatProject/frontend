import { FieldFilterMode } from "shared/modules/dynamic-material-table/models/table-field.model";
import {
  ColumnFilters,
  columnFilterToMongo,
  parseDateFilter,
} from "shared/modules/dynamic-material-table/utilizes/column-filter";

/*
 * Well-known dataset fields have a fixed search mode, chosen so the query can
 * use an index where one exists. Any other column, including user-added ones,
 * uses a case-insensitive "contains" search.
 */
export const DATASET_COLUMN_FILTER_MODES: Record<string, FieldFilterMode> = {
  pid: "prefix",
  datasetName: "prefix",
  runNumber: "prefix",
  sourceFolder: "prefix",
  creationLocation: "prefix",
  sourceFolderHost: "exact",
  owner: "exact",
  ownerEmail: "exact",
  contactEmail: "exact",
  orcidOfOwner: "exact",
  ownerGroup: "exact",
  accessGroups: "exact",
  principalInvestigator: "exact",
  proposalId: "exact",
  proposalIds: "exact",
  sampleId: "exact",
  sampleIds: "exact",
  instrumentId: "exact",
  instrumentIds: "exact",
  type: "exact",
  keywords: "exact",
  techniques: "exact",
  license: "exact",
  version: "exact",
  size: "size",
  packedSize: "size",
  numberOfFiles: "number",
  numberOfFilesArchived: "number",
  isPublished: "boolean",
  scientificMetadataValid: "boolean",
  creationTime: "date",
  createdAt: "date",
  updatedAt: "date",
  startTime: "date",
  endTime: "date",
};

/* Columns whose content is computed or an object, so there's nothing to match on */
export const DATASET_NON_FILTERABLE_COLUMNS = [
  "select",
  "image",
  "dataStatus",
  "instrumentName",
  "metadata",
  "scientificMetadata",
];

export const datasetColumnFilterMode = (field: string): FieldFilterMode =>
  DATASET_COLUMN_FILTER_MODES[field] ?? "contains";

/* Builds the v4 "where" conditions for column filters keyed by field path */
export const datasetColumnFiltersToQuery = (
  columnFilters: ColumnFilters = {},
): Record<string, unknown> =>
  Object.entries(columnFilters).reduce(
    (query, [field, value]) => {
      const mode = datasetColumnFilterMode(field);
      if (mode === "date") {
        const range = parseDateFilter(value);
        if (range) {
          query[field] = {
            ...(range.begin && { $gte: { $date: range.begin } }),
            ...(range.end && { $lt: { $date: range.end } }),
          };
        }
        return query;
      }
      const expression = columnFilterToMongo(mode, value);
      if (expression !== null) {
        query[field] = expression;
      }
      return query;
    },
    {} as Record<string, unknown>,
  );
