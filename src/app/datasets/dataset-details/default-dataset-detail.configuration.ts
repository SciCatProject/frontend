import { CustomizationItem } from "state-management/models";

/**
 * The built-in layout mirrors the former static dataset details page. It is
 * used when a deployment does not provide a customization (or explicitly
 * provides an empty one), keeping the configurable component useful with
 * minimal backend configurations.
 */
export const DEFAULT_DATASET_DETAIL_CUSTOMIZATION = [
  { type: "statusBanner", label: "Status Banner", order: -1, row: 1, col: 10 },
  {
    type: "regular",
    label: "General Information",
    order: 0,
    row: 1,
    col: 10,
    fields: [
      { element: "text", source: "datasetName", order: 0 },
      { element: "linky", source: "description", order: 1 },
      { element: "copy", source: "pid", order: 2 },
      { element: "text", source: "type", order: 3 },
      { element: "date", source: "creationTime", order: 4 },
      { element: "tag", source: "keywords", order: 5 },
      { element: "tag", source: "sharedWith", order: 6 },
    ],
  },
  {
    type: "regular",
    label: "Creator Information",
    order: 1,
    row: 1,
    col: 5,
    fields: [
      { element: "text", source: "owner", order: 0 },
      { element: "linky", source: "principalInvestigator", order: 1 },
      { element: "text", source: "investigator", order: 2 },
      { element: "linky", source: "orcidOfOwner", order: 3 },
      { element: "linky", source: "contactEmail", order: 4 },
      { element: "text", source: "ownerGroup", order: 5 },
      { element: "text", source: "accessGroups", order: 6 },
    ],
  },
  {
    type: "regular",
    label: "File Information",
    order: 2,
    row: 1,
    col: 5,
    fields: [
      { element: "text", source: "sourceFolder", order: 0 },
      { element: "text", source: "size", order: 1 },
      { element: "text", source: "dataFormat", order: 2 },
    ],
  },
  {
    type: "regular",
    label: "Related Documents",
    order: 3,
    row: 1,
    col: 10,
    fields: [
      {
        element: "internalLink",
        source: "proposalIds",
        internalLinkLabel: "id",
        order: 0,
      },
      {
        element: "internalLink",
        source: "sampleIds",
        internalLinkLabel: "description",
        order: 1,
      },
      {
        element: "internalLink",
        source: "instrumentIds",
        internalLinkLabel: "name",
        order: 2,
      },
      {
        element: "internalLink",
        source: "inputDatasets",
        internalLinkLabel: "id",
        order: 3,
      },
      { element: "text", source: "creationLocation", order: 4 },
      { element: "text", source: "techniques", order: 5 },
    ],
  },
  {
    type: "regular",
    label: "Derived Data",
    order: 4,
    row: 1,
    col: 10,
    fields: [
      { element: "text", source: "usedSoftware", order: 0 },
      { element: "text", source: "jobParameters", order: 1 },
      { element: "text", source: "jobLogData", order: 2 },
    ],
  },
  {
    type: "attachments",
    label: "Attachments",
    order: 5,
    row: 1,
    col: 10,
    options: { limit: 100, size: "medium" },
  },
  {
    type: "scientificMetadata",
    label: "Scientific Metadata",
    order: 6,
    row: 1,
    col: 10,
    viewMode: "table",
  },
  {
    type: "datasetJsonView",
    label: "Dataset Json View",
    order: 7,
    row: 1,
    col: 10,
  },
] as unknown as CustomizationItem[];
