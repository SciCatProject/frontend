import { DialogOptionData } from "../dialog/dialog.component";
import { ActionConfig } from "./configurable-action.interfaces";

/**
 * Archive/Retrieve actions built on the Jobs API. Applied by AppConfigService
 * whenever a deployment has archiveWorkflowEnabled (the flag that gated the
 * old hardcoded Archive/Retrieve buttons) but hasn't opted into its own
 * batchActionsEnabled/batchActions config, restoring the pre-configurable-
 * actions Archive/Retrieve behavior for any config that predates that
 * feature, rather than requiring every deployment to redeclare these two
 * actions themselves.
 *
 * retrieveDestinationOptions comes from the deployment's own
 * retrieveDestinations config, matching how the pre-configurable-actions
 * retrieve dialog was built.
 */
/**
 * Both actions are always visible and are enabled only when every selected
 * dataset is in the matching lifecycle state, using the same conditions as
 * the "archivable" and "retrievable" archive view modes (see
 * setArchiveViewModeAction in datasets.reducer.ts). On the dataset list they
 * are additionally enabled only in their matching view mode; they used to be
 * hidden outside it, so users had to know to switch view before the buttons
 * appeared.
 *
 * `#currentArchViewMode` is only provided by dataset-table-actions; in the
 * cart (batch-view) it resolves to the selector text itself, so that entry
 * keeps the actions usable there on the lifecycle checks alone.
 */
export function buildDefaultBatchActions(
  retrieveDestinationOptions: DialogOptionData[],
): ActionConfig[] {
  return [
    {
      id: "38be2125-cae1-4f47-801d-2b6965a7384c",
      description: "Archive selected datasets via the Jobs API.",
      order: 1,
      label: "Archive",
      mat_icon: "archive",
      type: "dialog",
      onSuccess: "xhr",
      method: "POST",
      url: "{{ @baseUrl }}/api/v3/jobs",
      authorization: [],
      headers: {
        "Content-Type": "application/json",
        Authorization: "#tokenBearer",
      },
      variables: {
        baseUrl: "#apiBaseUrl",
        username: "#user.username",
        userEmail: "#user.email",
        pids: "#DatasetsPid",
        datasetList: "#DatasetsPidEmptyFilesMap",
        lifecycles: "#DatasetsField[datasetlifecycle]",
        archiveViewMode: "#currentArchViewMode",
        totalSize: "#DatasetsTotalSize",
      },
      dialog: {
        title: "Really archive?",
        fields: [],
      },
      payload:
        '{"jobParams": {"username": "{{ @username }}"}, "emailJobInitiator": "{{ @userEmail }}", "datasetList": {{ @datasetList }}, "type": "archive"}',
      enabled:
        "['archivable', '#currentArchViewMode'].includes(@archiveViewMode) && @totalSize > 0 && @lifecycles.every((l) => l?.archivable === true && l?.retrievable !== true)",
    },
    {
      id: "dc10cd56-6d0a-4f0a-899a-f9c6726465bf",
      description: "Retrieve archived datasets via the Jobs API.",
      order: 2,
      label: "Retrieve",
      mat_icon: "cloud_download",
      type: "dialog",
      onSuccess: "xhr",
      method: "POST",
      url: "{{ @baseUrl }}/api/v3/jobs",
      authorization: [],
      headers: {
        Authorization: "#tokenBearer",
      },
      variables: {
        baseUrl: "#apiBaseUrl",
        username: "#user.username",
        userEmail: "#user.email",
        pids: "#DatasetsPid",
        datasetList: "#DatasetsPidEmptyFilesMap",
        lifecycles: "#DatasetsField[datasetlifecycle]",
        archiveViewMode: "#currentArchViewMode",
        totalPackedSize: "#DatasetsTotalPackedSize",
      },
      dialog: {
        title: "Retrieve to",
        fields: [
          {
            key: "retrieveDestination",
            label: "Destination",
            type: "select",
            required: true,
            options: retrieveDestinationOptions,
          },
        ],
      },
      payload:
        '{"jobParams": {"username": "{{ @username }}", "retrieveDestination": "{{ @dialog.retrieveDestination }}", "destinationPath": "/archive/retrieve"}, "emailJobInitiator": "{{ @userEmail }}", "datasetList": {{ @datasetList }}, "type": "retrieve"}',
      enabled:
        "['retrievable', '#currentArchViewMode'].includes(@archiveViewMode) && @totalPackedSize > 0 && @lifecycles.every((l) => l?.retrievable === true && l?.archivable !== true)",
    },
  ];
}
