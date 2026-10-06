import { ArchViewMode, DatasetViewMode } from "state-management/models";

/**
 * The archive workflow views that used to be hardcoded in the dataset list.
 * Applied by AppConfigService whenever a deployment has
 * archiveWorkflowEnabled but hasn't configured its own datasetViews.modes, so
 * existing configs keep the same toggles. Ids are kept equal to the old
 * ArchViewMode values because the default Archive/Retrieve batch actions
 * match on them (see configurable-actions.defaults.ts).
 */
export const DEFAULT_DATASET_VIEW_MODES: DatasetViewMode[] = [
  { id: ArchViewMode.all, label: "All", query: {} },
  {
    id: ArchViewMode.archivable,
    label: "Archivable",
    query: {
      "datasetlifecycle.archivable": true,
      "datasetlifecycle.retrievable": false,
    },
  },
  {
    id: ArchViewMode.retrievable,
    label: "Retrievable",
    query: {
      "datasetlifecycle.retrievable": true,
      "datasetlifecycle.archivable": false,
    },
  },
  {
    id: ArchViewMode.work_in_progress,
    label: "Work In Progress",
    query: {
      $or: [
        {
          "datasetlifecycle.retrievable": false,
          "datasetlifecycle.archivable": false,
          "datasetlifecycle.archiveStatusMessage": {
            $ne: "scheduleArchiveJobFailed",
          },
          "datasetlifecycle.retrieveStatusMessage": {
            $ne: "scheduleRetrieveJobFailed",
          },
        },
      ],
    },
  },
  {
    id: ArchViewMode.system_error,
    label: "System Error",
    query: {
      $or: [
        {
          "datasetlifecycle.retrievable": true,
          "datasetlifecycle.archivable": true,
        },
        {
          "datasetlifecycle.archiveStatusMessage": "scheduleArchiveJobFailed",
        },
        {
          "datasetlifecycle.retrieveStatusMessage": "scheduleRetrieveJobFailed",
        },
      ],
    },
  },
  {
    id: ArchViewMode.user_error,
    label: "User Error",
    query: {
      $or: [{ "datasetlifecycle.archiveStatusMessage": "missingFilesError" }],
    },
  },
];
