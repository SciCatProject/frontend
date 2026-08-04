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
 * `#currentArchViewMode` is only provided by dataset-table-actions (the
 * dataset list page, with its archive-view-mode toggle); batch-view (the
 * cart) has no such concept and doesn't set it. When a selector has no
 * matching context key, ConfigurableActionComponent's fallback returns the
 * selector text itself rather than undefined — hence the `#currentArchViewMode`
 * string check below is what actually detects "not in a mode-toggle page",
 * not the `typeof ... === 'undefined'` check (kept only as a defensive
 * fallback). Both actions should render unconditionally in the cart, and
 * only for their matching mode on the dataset list page.
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
        archiveViewMode: "#currentArchViewMode",
        totalSize: "#DatasetsTotalSize",
      },
      dialog: {
        title: "Really archive?",
        fields: [],
      },
      payload:
        '{"jobParams": {"username": "{{ @username }}"}, "emailJobInitiator": "{{ @userEmail }}", "datasetList": {{ @datasetList }}, "type": "archive"}',
      hidden:
        "![undefined, '#currentArchViewMode', 'archivable'].includes(@archiveViewMode)",
      enabled: "@totalSize > 0",
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
      hidden:
        "![undefined, '#currentArchViewMode', 'retrievable'].includes(@archiveViewMode)",
      enabled: "@totalPackedSize > 0",
    },
  ];
}
