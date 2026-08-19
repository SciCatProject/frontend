# Datafiles Actions documentation

Datafiles actions are configurable actions specific to all or selected datafiles. They are shown as button in the "Datafiles" tab under the individual dataset page.
The button can be configured with text or icon or both.
At the moment there are only two kind of actions: form and json-download.

## Configuration
The configuration of the datafiles actions is done by adding an array of action objects under the __datafilesActions__ key of the SciCat frontend configuration file.
Each object in the array configure one action.

## Individual action configuration
The action configuration is a json object wiuth the following keys:
- __id__: unique id of the action.  
  Used for management and tracking purposes.  
  - _Type_: string  
  - _Required_: true  
  - _Example_: "eed8efec-4354-11ef-a3b5-d75573a5d37f",
- __description__: description of the action.  
  Not shown in the FE, used only for management purposes.
  - _Type_: string   
  - _Optional_: true 
- __order__: order in which the related button is rendered in the tab.  
  The action are ordered from left to right in ascending order.  
  - _Type_: integer  
  - _Optional_: true
  - _Example_: 5
- __label__: String shown in related button.  
  If no label is provided, an icon should be defined and the button will use only the icom.  
  - _Type_: string
  - _Optional_: true
  - _Example_: Download All  
  - _Notes_: at least on of the following properties should be present: `label` or `icon` or `mat_icon` 
- __files__: which files should be provided when the action is triggered.  
  - _Type_: string
  - _Allowed values_: `selected` , `all`
- __mat_icon__: material icon to be shown on the left of the associated button.  
  If not provided, the actions should contain at least _label_ or _icon_.  
  - _Type_: string
  - _Example_: "download",
  - _Notes_: at least on of the following properties should be present: `label` or `icon` or `mat_icon` 
- __icon__: icon to be shown on the left of the associated button.  
  If not provided, the actions should contain at least _label_ or _mat_icon_.  
  All browser supported formats are accepted. The path must be a valid one.  
  - _Type_: string
  - _Example_: "/assets/icons/jupyter_logo.png",
  - _Notes_: at least on of the following properties should be present: `label` or `icon` or `mat_icon` 
- __type__: type of action.  
  The canonical list of supported values is the `ACTION_TYPES` array exported from
  [configurable-action.interfaces.ts](./configurable-action.interfaces.ts) — treat that as the
  single source of truth; this table just describes what each one does. Configs with a `type`
  (or `onSuccess`) value outside that list are logged as a console warning on app startup.
  - _Type_: string
  - _Allowed values_: 
    - `form`
    The action will be triggered as a form submission
    - `json-download`
    The action will be triggered with a json payload and it expects to save the results as a file
    - `link`
    The action will be triggered by navigating to the configured `url`
    - `xhr`
    The action will be triggered as an XHR/HTTP request
    - `dialog`
    The action will open a configurable dialog before triggering the next step
- __url__: this is the url to be used when triggering the request.  
  - _Type_: string 
  - _Example_: "https://zip.scicatproject.org/download/all",
- __target__ : if type is set to `form`, it specified if the form should be submitted in the current browser windows/tab or in an another.  
Please review the offical documentation for this attribute https://www.w3schools.com/TAgs/att_form_target.asp
  - _Type_: string  
  - _Example_: ": "_blank",
- __enabled__: condition when the action can be triggered and the related button should be active.  
  The string may contains the keywords listed below and any logical expression of them.  
  - _Type_: string
  - _Examples_: "#SizeLimit"  or  "#Selected && #SizeLimit",
  - _Keywords_: The string can contain any of the following keywords in a logical expression.   
    The expression will be calculated everytime one of the keywords changes value.
    - #SizeLimit :   
      True if the total size of the files is below the limit indicated in configuration under the key `maxDirectDownloadSize`.
    - #Selected :
      True if one or more files are selected in the list.  
- __authorization__: indicate which user has access to the action and can see the related button.  
  - _Type_: string[]
  - _Examples_: ["#datasetAccess", "#datasetPublic"]
  - _Allowed values_: 
    - "#datasetAccess": users that have access to the dataset
    - "#datasetPublic": if the dataset is public
- __variables__: values calculated from the current action context before the action is triggered.  
  Variables can be selectors, static strings, or references to other variables.
  They can then be reused in conditions and inputs with the `@variableName` syntax, or in templated fields with `{{ @variableName }}` where templating is supported.
  - _Type_: object
  - _Optional_: true
  - _Example_:
    ```
    {
      "datasetPid": "#Dataset0Pid",
      "filesPath": "#Dataset0SelectedFilesPath",
      "firstFile": "@filesPath[0]"
    }
    ```
- __payload__: json string to be send in the request body when the action is triggered. 
  Make sure that the string is properly escaped
  - _Type_: string
  - _Example_:  
    Raw (as it should be in the action configuration )
    ```
    "{\"template_id\":\"c975455e-ede3-11ef-94fb-138c9cd51fc0\",\"parameters\":{\"dataset\":\"{{ datasetPid }}\",\"directory\":\"{{ sourceFolder }}\",\"files\": {{ filesPath }},\"jwt\":\"{{ jwt }}\",\"scicat_url\":\"https://my.scicat.instance\",\"file_server_url\":\"sftserver2.esss.dk\",\"file_server_port\":\"22\"}}",
    ```
    Formatted (for human consumption)
    ```
    {
      "template_id": "c975455e-ede3-11ef-94fb-138c9cd51fc0",
      "parameters": {
        "dataset": "{{ datasetPid }}",
        "directory": "{{ sourceFolder }}",
        "files": {{ filesPath }},
        "jwt": "{{ jwt }}",
        "scicat_url": "https://my.scicat.instance",
        "file_server_url": "my.sft.server",
        "file_server_port": "22"
      }
    }
    ```
  - _Keywords_: The string can contain the following keywords. They will be substituted with the value indicated:
    - {{ datasetPid }}: pid of the current dataset 
    - {{ sourceFolder }}: source folder of the current dataset
    - {{ jwt }}: curren tJWT token of the user logged in
    - {{ filesPath }}: array containing the list of the the file paths associated with the current dataset. The list might contain all the files or only the selected ones, depending on the value of the field _files_.
- __filename__: name of the file that should be saved by the browser if the action type is set to _json_download_.
  - _Type_: string 
  - _Example_: "{{ uuid }}.ipynb"
  - _Keywords_: The string can contain any of the following keywords. They are substituted with the value indicated.
    - {{ uuid }}: random uuid v4 generated for each request.
- __dialog__: configuration for a confirmation or parameters dialog modal to be prompted to the user before the action is executed.
  - _Type_: object
  - _Optional_: true
  - _Fields_:
    - `title` (string): Header text displayed at the top of the dialog modal.
    - `description` (string): Explanatory prompt message shown below the title.
    - `width` (string): CSS width dimension value for formatting the window layout container bounds.
    - `fields` (object[]): Form element configurations layout array mapping user selections to context variables.

## Variable and selector resolution
Configurable actions can define a `variables` object. Each entry is resolved before the action condition and request data are evaluated. This makes it possible to extract values from datasets, reuse them in other variables, and inject them into action configuration fields.

Variable resolution follows this order:
1. The component reads every `@variableName` reference and builds a dependency graph.
2. Variables that are referenced by other variables are resolved first.
3. References like `@variableName` are replaced with the resolved value.
4. References to array values can use `@variableName[index]`, for example `@filesPath[0]`.
5. The final value is checked against the supported selector patterns below.
6. If no selector pattern matches, the value is kept as-is.

Cyclic dependencies should be avoided. If one is detected, the component logs an error and continues resolving the remaining variables.

For example:
```
"variables": {
  "filesPath": "#Dataset0SelectedFilesPath",
  "firstFile": "@filesPath[0]",
  "datasetPid": "#Dataset0Pid",
  "creationTime": "#Dataset[0]Field[creationTime]",
  "creationDate": "#date_format(@creationTime, yyyy-MM-dd)"
}
```

In this example, `filesPath` is resolved first as an array of selected file paths. `firstFile` then reads the first entry from that array. `creationDate` first substitutes `@creationTime`, then formats the resulting date value.

Supported selector patterns:

| Selector | Result |
| --- | --- |
| `#Dataset0Pid` | PID of the first dataset |
| `#Dataset0FilesPath` | Paths of all files in the first dataset |
| `#Dataset0FilesTotalSize` | Total size of all files in the first dataset |
| `#Dataset0SourceFolder` | Source folder of the first dataset |
| `#Dataset0SelectedFilesPath` | Paths of selected files in the first dataset |
| `#Dataset0SelectedFilesCount` | Number of selected files in the first dataset |
| `#Dataset0SelectedFilesTotalSize` | Total size of selected files in the first dataset |
| `#Dataset[n]Field[fieldName]` | Value of `fieldName` from dataset `n` |
| `#DatasetsPid` | PIDs of all datasets |
| `#DatasetsFilesPath` | Paths of all files from all datasets |
| `#DatasetsFilesTotalSize` | Total size of all files from all datasets |
| `#DatasetsSourceFolder` | Source folders of all datasets |
| `#DatasetsSelectedFilesPath` | Paths of all selected files from all datasets |
| `#DatasetsSelectedFilesCount` | Total number of selected files from all datasets |
| `#DatasetsSelectedFilesTotalSize` | Total size of all selected files from all datasets |
| `#DatasetsField[fieldName]` | Values of `fieldName` from all datasets |
| `#Instruments[n]Field[fieldName]` | Value of `fieldName` from instrument `n` |
| `#date_format(value, format)` | Date formatted with Angular `DatePipe` format syntax |
| `#DatasetsPidEmptyFilesMap` | JSON string with all dataset PIDs and empty files arrays |
| `#DatasetsTotalSize` | Sum of `size` across all datasets |
| `#DatasetsTotalPackedSize` | Sum of `packedSize` across all datasets |

Indexes are zero-based. If a selector cannot be resolved, the resulting value can be empty or undefined depending on the selector and the available action items.

## Example
The following is the configuration example provided together with the code.
The configuration below will create the following 5 buttons under the "Datafiles" tab of the dataset in the order provided:
1. Notebook Selected  
   Create a jupyter notebook properly populated in order to download the selected files and use the dataset metadata in the python environment.
   The jupyter notebook is created by a different services that needs to be correctly configured and it is assumed that expects in input data coming from a submission form.
2. Notebook All (Form)  
   Create a jupyter notebook properly populated in order to download all the files and use the dataset metadata in the python environment.
   The jupyter notebook is created by a different services that needs to be correctly configured and it is assumed that expects in input data coming from a submission form.
3. Notebook All (Download JSON)  
   Create a jupyter notebook properly populated in order to download all the files and use the dataset metadata in the python environment.
   The jupyter notebook is created by a different services that needs to be correctly configured. We assume that the service expects input data in a specific json format specified under payload.
4. Download Selected  
   Triggers the download of a zip file containing only the selected files.
   The zip file is created by an external service, which needs to be properly configured.
5. Donwload ASll  
   Triggers the download of a zip file containing all the dataset files
   The zip file is created by an external service, which needs to be properly configured.
6. Custom Action with Dialog  
   Triggers a custom processing workflow by showing a UI configuration modal window first. The captured values from user selection elements and configuration inputs are then processed dynamically when executing the command pipeline sequence.
  
Configuration
```
{
  "datafilesActions" : [
    {
      "id": "eed8efec-4354-11ef-a3b5-d75573a5d37f",
      "order": 5,
      "label": "Download All",
      "files": "all",
      "mat_icon": "download",
      "type": "form",
      "url": "https://zip.scicatproject.org/download/all",
      "target": "_blank",
      "enabled": "#SizeLimit",
      "authorization": ["#datasetAccess", "#datasetPublic"]
    },
    {
      "id": "3072fafc-4363-11ef-b9f9-ebf568222d26",
      "order": 4,
      "label": "Download Selected",
      "files": "selected",
      "mat_icon": "download",
      "type": "form",
      "url": "https://zip.scicatproject.org/download/selected",
      "target": "_blank",
      "enabled": "#Selected && #SizeLimit",
      "authorization": ["#datasetAccess", "#datasetPublic"]
    },
    {
      "id": "4f974f0e-4364-11ef-9c63-03d19f813f4e",
      "order": 2,
      "label": "Notebook All (Form)",
      "files": "all",
      "icon": "/assets/icons/jupyter_logo.png",
      "type": "form",
      "url": "https://www.scicat.info/notebook/all",
      "target": "_blank",
      "authorization": ["#datasetAccess", "#datasetPublic"]
    },
    {
      "id": "0cd5b592-0b1a-11f0-a42c-23e177127ee7",
      "order": 3,
      "label": "Notebook All (Download JSON)",
      "files": "all",
      "type": "json-download",
      "icon": "/assets/icons/jupyter_logo.png",
      "url": "https://www.sciwyrm.info/notebook",
      "target": "_blank",
      "authorization": ["#datasetAccess", "#datasetPublic"],
      "payload": "{\"template_id\":\"c975455e-ede3-11ef-94fb-138c9cd51fc0\",\"parameters\":{\"dataset\":\"{{ datasetPid }}\",\"directory\":\"{{ sourceFolder }}\",\"files\": {{ filesPath }},\"jwt\":\"{{ jwt }}\",\"scicat_url\":\"https://my.scicat.instance\",\"file_server_url\":\"my.sft.server\",\"file_server_port\":\"22\"}}",
      "filename": "{{ uuid }}.ipynb"
    },
    {
      "id": "fa3ce6ee-482d-11ef-95e9-ff2c80dd50bd",
      "order": 1,
      "label": "Notebook Selected",
      "files": "selected",
      "icon": "/assets/icons/jupyter_logo.png",
      "type": "form",
      "url": "https://www.scicat.info/notebook/selected",
      "target": "_blank",
      "enabled": "#Selected",
      "authorization": ["#datasetAccess", "#datasetPublic"]
    },
    {
      "id": "b18274d0-bfd8-4a5c-89a1-026859336ab2",
      "order": 6,
      "label": "Custom Action with Dialog",
      "files": "selected",
      "mat_icon": "settings",
      "type": "json-download",
      "url": "https://api.scicatproject.org/actions/process",
      "target": "_blank",
      "enabled": "#Selected",
      "authorization": ["#datasetAccess"],
      "dialog": {
        "title": "Configure Download Parameters",
        "description": "Please select the processing cluster and format options for your download.",
        "width": "500px",
        "fields": [
          {
            "id": "cluster",
            "label": "Target Cluster",
            "type": "select",
            "required": true,
            "options": ["Cluster-A", "Cluster-B", "Cluster-C"]
          },
          {
            "id": "compress",
            "label": "Enable Compression",
            "type": "boolean",
            "default": true
          }
        ]
      }
    }
  ]
}
```

## Batch actions: migrating from the hardcoded Archive/Retrieve buttons

Before configurable actions existed, the "Archive" and "Retrieve" buttons on the dataset selection/batch view were hardcoded Angular components (`ArchivingService`, `onArchive()`/`onRetrieve()`) that dispatched `submitJobAction` to the store, which the Jobs effects then POSTed to the Jobs API. That code has been removed. Archive/Retrieve are now just another pair of configurable actions, driven by two new keys on the app config:

- `batchActionsEnabled` (boolean): shows a `<configurable-actions>` row (gated the same way as `datafilesActionsEnabled`, `datasetDetailsActionsEnabled`, etc.) wherever batch/selection actions are rendered.
- `batchActions` (`ActionConfig[]`): the actions rendered in that row.

**You do not need to configure anything to keep the old behavior.** `AppConfigService.loadAppConfig()` calls `applyDefaultBatchActions(config)` (see `app-config.service.ts`), which defaults `batchActionsEnabled: true` and `batchActions` to the built-in Archive/Retrieve actions (defined in `configurable-actions.defaults.ts`, see below) whenever:

- `archiveWorkflowEnabled` is `true` — the same flag that gated the old hardcoded Archive/Retrieve buttons (`*ngIf="appConfig.archiveWorkflowEnabled"` in `batch-view.component.html` and `dataset-table-actions.component.html`), **and**
- `batchActionsEnabled` is falsy — either absent from your config (the common case for any config written before this feature existed) or explicitly set to `false`.

If your config already sets `batchActionsEnabled: true` with its own `batchActions`, it is left untouched — the defaults only fill the gap for configs that haven't opted in yet. Note that `batchActionsEnabled: false` alone does **not** disable batch actions when `archiveWorkflowEnabled` is `true` — it's treated the same as "not configured yet", and the defaults still apply. To render no batch actions while keeping `archiveWorkflowEnabled` true for other purposes, opt in explicitly with an empty array: `"batchActionsEnabled": true, "batchActions": []` — that satisfies the truthy check, so the defaulting logic is skipped and the `<configurable-actions>` row simply has nothing to render.

The built-in Retrieve action's dialog also pulls its destination options directly from your existing `retrieveDestinations` config (the same key the old retrieve dialog used) — see `applyDefaultBatchActions` in `app-config.service.ts`, which maps `retrieveDestinations` to `{option, tooltip}` pairs before building the defaults. You do not need to duplicate destinations anywhere.

If you want to fully customize Archive/Retrieve (different URL, extra fields, different labels), set `batchActionsEnabled: true` and provide your own `batchActions` array using the same shape as any other action config — see the examples below.

## Example configurations: Archive and Retrieve

These are the actual built-in defaults (from `configurable-actions.defaults.ts`), reproduced here as a starting point for a custom `batchActions` array. Both submit directly to the Jobs API (`POST {apiBaseUrl}/api/v3/jobs`) with the same request shape the old `ArchivingService` used to build (`jobParams`, `emailJobInitiator`, `datasetList`, `type`).

```json
{
  "id": "38be2125-cae1-4f47-801d-2b6965a7384c",
  "description": "Archive selected datasets via the Jobs API.",
  "order": 1,
  "label": "Archive",
  "mat_icon": "archive",
  "type": "dialog",
  "onSuccess": "xhr",
  "method": "POST",
  "url": "{{ @baseUrl }}/api/v3/jobs",
  "authorization": [],
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "#tokenBearer"
  },
  "variables": {
    "baseUrl": "#apiBaseUrl",
    "username": "#user.username",
    "userEmail": "#user.email",
    "datasetList": "#DatasetsPidEmptyFilesMap",
    "archiveViewMode": "#currentArchViewMode",
    "totalSize": "#DatasetsTotalSize"
  },
  "dialog": {
    "title": "Really archive?",
    "fields": []
  },
  "payload": "{\"jobParams\": {\"username\": \"{{ @username }}\"}, \"emailJobInitiator\": \"{{ @userEmail }}\", \"datasetList\": {{ @datasetList }}, \"type\": \"archive\"}",
  "hidden": "![undefined, '#currentArchViewMode', 'archivable'].includes(@archiveViewMode)",
  "enabled": "@totalSize > 0"
}
```

```json
{
  "id": "dc10cd56-6d0a-4f0a-899a-f9c6726465bf",
  "description": "Retrieve archived datasets via the Jobs API.",
  "order": 2,
  "label": "Retrieve",
  "mat_icon": "cloud_download",
  "type": "dialog",
  "onSuccess": "xhr",
  "method": "POST",
  "url": "{{ @baseUrl }}/api/v3/jobs",
  "authorization": [],
  "headers": {
    "Authorization": "#tokenBearer"
  },
  "variables": {
    "baseUrl": "#apiBaseUrl",
    "username": "#user.username",
    "userEmail": "#user.email",
    "datasetList": "#DatasetsPidEmptyFilesMap",
    "archiveViewMode": "#currentArchViewMode",
    "totalPackedSize": "#DatasetsTotalPackedSize"
  },
  "dialog": {
    "title": "Retrieve to",
    "fields": [
      {
        "key": "retrieveDestination",
        "label": "Destination",
        "type": "select",
        "required": true,
        "options": []
      }
    ]
  },
  "payload": "{\"jobParams\": {\"username\": \"{{ @username }}\", \"retrieveDestination\": \"{{ @dialog.retrieveDestination }}\", \"destinationPath\": \"/archive/retrieve\"}, \"emailJobInitiator\": \"{{ @userEmail }}\", \"datasetList\": {{ @datasetList }}, \"type\": \"retrieve\"}",
  "hidden": "![undefined, '#currentArchViewMode', 'retrievable'].includes(@archiveViewMode)",
  "enabled": "@totalPackedSize > 0"
}
```

A few things worth noting if you adapt these:
- `#apiBaseUrl` resolves to the SDK's own `Configuration.basePath` (the base URL every SDK service, e.g. `JobsService`, actually sends requests to) rather than reading `lbBaseURL` off the app config directly — this stays correct even if the two ever diverge. There's no generic "read any app config field" selector; `#apiBaseUrl` is the one dedicated selector for the API's base URL.
- `retrieveDestination`'s `options` is left empty (`[]`) in a custom config on purpose if you rely on `retrieveDestinations`; only the *built-in default* Retrieve action gets it auto-populated by `applyDefaultBatchActions`. A custom `batchActions` entry must supply its own `options` (statically, or by referencing `retrieveDestinations` yourself if you re-add that wiring).
- `#DatasetsPidEmptyFilesMap` already returns a JSON-stringified array, so it's interpolated as `{{ @datasetList }}` (no trailing `[]`) — using `{{ @datasetList[] }}` here would double-encode it.
- **Archive is a plain confirmation dialog, not a data-collecting one.** `type: "dialog"` + `onSuccess: "xhr"` with `dialog.fields: []` (no fields at all) renders just the title/description and Cancel/Ok buttons — clicking Ok closes the dialog with a truthy (but empty) result, which is enough to trigger the `onSuccess` step; clicking Cancel closes with no result and nothing further happens. This is the pattern to reach for whenever you want a "are you sure?" prompt without asking the user for any input — compare to Retrieve, which uses the same `type`/`onSuccess` pair but adds a real `retrieveDestination` field to actually collect a value.
- **These same two actions render on both the dataset list page (`dataset-table-actions`, which sets `currentArchViewMode`) and the cart (`batch-view`, which does not) — the `hidden` expression has two jobs, one per context, and every entry in the `.includes([...])` array is load-bearing:**
  - *Cart*: `#currentArchViewMode` has no matching key in `batch-view`'s `actionItems`, so it resolves to the *literal selector text* (`"#currentArchViewMode"`), not `undefined`. The `'#currentArchViewMode'` entry is what actually detects "not on the mode-toggle page" and makes the action always visible there (the `undefined` entry is only a defensive fallback and never actually matches in practice — the selector resolution never produces real `undefined`). If you copy this pattern for a selector that isn't always provided, remember the fallback is the selector string itself, not `undefined`.
  - *Dataset list page*: here `#currentArchViewMode` resolves to a real mode string (`'all'`, `'archivable'`, `'retrievable'`, etc.), so neither of the above two entries matches — without the trailing `'archivable'` (or `'retrievable'` for Retrieve) entry, the action would be hidden in *every* mode on this page, not just the wrong ones. That entry is what restores the old per-mode behavior (Archive only in `'archivable'` mode, Retrieve only in `'retrievable'` mode) and it's easy to drop by mistake when simplifying this expression — don't remove it.

## Best practices

- **Use stable, unique `id`s (UUIDs).** IDs aren't just for humans: code can match on them (e.g. `AppConfigService` looks up the built-in Retrieve action by its `id` to populate its dialog). Don't reuse an `id` across unrelated actions, and don't change an existing action's `id` once deployed, in case other config or code starts depending on it.
- **Keep `enabled`/`hidden`/`authorization` expressions simple.** They're evaluated with `new Function(...)` against a small context (`variables`, `context.isAdmin`, `context.isOwner`, `context.maxSize`) — prefer chaining the documented keyword selectors (`#Length(...)`, `#MaxDownloadableSize(...)`, `#datasetOwner`, etc.) over ad hoc JavaScript, so the expression is portable and easy to review.
- **Escape `payload` carefully.** It's a JSON string embedded in a JSON config file, so every quote needs double-escaping. Validate the unescaped result parses as JSON before deploying, and watch the `{{ @var }}` vs `{{ @var[] }}` distinction — use `[]` only for values that are *not* already JSON-encoded strings (see the `#DatasetsPidEmptyFilesMap` note above).
- **Fill in `authorization` for anything beyond a demo/local config.** The built-in defaults ship with `authorization: []` (no restriction) since there's no dataset-level ownership concept for a batch-wide action; most real deployments should restrict this (e.g. `#datasetOwner`, `#userIsAdmin`) rather than leaving it open to every logged-in user.
- **Don't rely on `hidden`/`enabled`/`authorization` alone for access control** — see Security considerations below.
- **Test with `validateAllActionConfigsIn`.** Any array of `ActionConfig`-shaped objects on the app config gets scanned automatically at load time (`app-config.service.ts`) and logs a console warning for unknown `type`/`onSuccess` values — check your browser console after changing config.

## Security considerations

- **`authorization`, `enabled`, and `hidden` are UI-only gates.** They control whether a button is rendered/clickable in the browser; they do **not** protect the endpoint the action calls. Any URL configured for `xhr`/`json-download`/`form` must independently authenticate and authorize the request server-side — assume a user can trigger the underlying HTTP call even if the button would have been hidden or disabled for them.
- **`url` is fully admin-controlled, not user input** — but review it like any other outbound integration point. Actions can embed `#tokenBearer`/`#jwt` (the logged-in user's own credentials) into headers or payload sent to that `url`; only point actions at endpoints you trust with those credentials.
- **`dialog` actions feed user input into `payload`/`headers`/`url` via `@dialog.<field>` templating.** That input is inserted as a JSON string value (not raw HTML/JS), so it isn't an XSS vector for the page itself, but it is still attacker-controlled data reaching your backend — validate/sanitize it there the same as any other user-submitted field, and avoid interpolating dialog input directly into a `url` (prefer putting it in the JSON `payload` instead, which is the pattern the built-in Retrieve action follows for `retrieveDestination`).
- **CORS and cookies/tokens**: `xhr`/`json-download` actions run `fetch()` directly from the browser using the current session's token (`#tokenBearer`). Pointing an action at a third-party or otherwise untrusted origin sends that token there — keep action `url`s scoped to services you control or explicitly trust.
