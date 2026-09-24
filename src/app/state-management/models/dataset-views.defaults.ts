import { ArchViewMode } from "state-management/models";
import { DatasetViewConfig } from "./dataset-view.interfaces";

/**
 * Default lifecycle views, applied whenever a deployment has
 * archiveWorkflowEnabled but hasn't configured its own datasetViews - see
 * applyDefaultDatasetViews in app-config.service.ts. These reproduce the
 * queries that used to be hardcoded in the datasets reducer's ArchViewMode
 * switch-case verbatim, so existing deployments see no behavior change.
 */
export function buildDefaultDatasetViews(): DatasetViewConfig[] {
  return [
    {
      id: ArchViewMode.all,
      label: "All",
      order: 1,
      query: {},
    },
    {
      id: ArchViewMode.archivable,
      label: "Archivable",
      order: 2,
      query: {
        "datasetlifecycle.archivable": true,
        "datasetlifecycle.retrievable": false,
      },
    },
    {
      id: ArchViewMode.retrievable,
      label: "Retrievable",
      order: 3,
      query: {
        "datasetlifecycle.retrievable": true,
        "datasetlifecycle.archivable": false,
      },
    },
    {
      id: ArchViewMode.work_in_progress,
      label: "Work In Progress",
      order: 4,
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
      order: 5,
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
            "datasetlifecycle.retrieveStatusMessage":
              "scheduleRetrieveJobFailed",
          },
        ],
      },
    },
    {
      id: ArchViewMode.user_error,
      label: "User Error",
      order: 6,
      query: {
        $or: [
          {
            "datasetlifecycle.archiveStatusMessage": "missingFilesError",
          },
        ],
      },
    },
  ];
}
