# Configurable Action Component – Configuration Reference

This document details configuration options for use with the ESS **ConfigurableActionComponent**. This component is designed to generate action buttons for user workflows (such as Download, Publish, etc.) in a flexible and extensible way.

---

## Overview

Each action button is configured by an object, usually placed in a list. This object controls logic, UI, access, and integration for the action.

---

## Configuration Fields

Below are supported configuration properties, their types, and descriptions.

### 1. `id`
- **Type:** `string`
- **Description:** Unique identifier for the action.

### 2. `order`
- **Type:** `number`
- **Description:** Determines the UI order (lower first).

### 3. `label`
- **Type:** `string`
- **Description:** Display name for the action button.

### 4. `description`
- **Type:** `string`
- **Description:** *Optional*. Additional details shown in tooltips or documentation.

### 5. `type`
- **Type:** `string`
- **Accepted values:** `form`, `link`, `json-download`, `xhr`
- **Description:** Action execution mode:
    - `form`: Submits a hidden HTML form to `url`.
    - `link`: Opens URL in new tab/window.
    - `json-download`: Fetches data and starts file download.
    - `xhr`: Makes an XHR/fetch API call, optionally updating local state.

### 6. `method`
- **Type:** `string`
- **Possible values:** HTTP verbs (`GET`, `POST`, `PATCH`, etc.)
- **Default:** `"POST"` if used
- **Description:** HTTP method used (for `form`, `xhr`, `json-download`).

### 7. `url`
- **Type:** `string`
- **Description:** Destination URL for the action (may use template variables, e.g. `{{ @pid }}`).

### 8. `target`
- **Type:** `string`
- **Default:** `"_self"`
- **Description:** Target browser window/tab (`_blank`, `_self`, etc.).

### 9. `icon`
- **Type:** `string`
- **Description:** *Optional*. Path to an icon image for the button.

### 10. `mat_icon`
- **Type:** `string`
- **Description:** *Optional*. Material icon name for Angular Material `mat-icon`.

### 11. `files`
- **Type:** `"all"` | `"selected"` | `<string>`
- **Description:** Indicates file context. Common values are `all` or `selected`.

### 12. `enabled`
- **Type:** `string`
- **Description:** *Optional*. JS-style boolean expression for enabling the action. Example: `#Length(@files) && #MaxDownloadableSize(@totalSize)`

### 13. `disabled`
- **Type:** `string`
- **Description:** *Optional*. Expression that disables the action.

### 14. `hidden`
- **Type:** `string`
- **Description:** *Optional*. JS-style boolean expression for hiding the action.

### 15. `authorization`
- **Type:** `string[]`
- **Description:** List of expressions; action is available only if these pass (e.g. `["#datasetOwner && !@isPublished"]`).

### 16. `variables`
- **Type:** `object`
- **Format:** `{ key: selector | expression }`
- **Description:** Defines per-action variables, computed via selectors or expressions. Use with `@key` in templating.

    **Selector Examples:**
    - `#Dataset0Pid`: Primary dataset PID
    - `#Dataset0FilesPath`: File paths array
    - See selector details below.

### 17. `inputs`
- **Type:** `object`
- **Format:** `{ inputName: valueSelector | template }`
- **Description:** (For `"form"` actions) HTML input values sent with the form.

    - Names ending in `[]` create multiple inputs from an array value.
    - Values can use selectors, variables, or static values.

### 18. `headers`
- **Type:** `object`
- **Format:** `{ headerName: valueSelector | template }`
- **Description:** (For `xhr`/`json-download`) HTTP headers for the request.

### 19. `payload`
- **Type:** `string`
- **Special:** `"#dump"` = all variables as JSON, `"#empty"` = empty body
- **Description:** Body for request (`xhr`/`json-download`). Templating with `{{ @pid }}`, `{{ #jwt }}` etc. supported.

### 20. `filename`
- **Type:** `string`
- **Description:** *(json-download only)*. Name for downloaded file (can use template, eg: `{{ #uuid }}.ipynb`).

---

## Supported Selectors in `variables`

**From `processSelector` in the component:**
- `#Dataset0Pid`: First dataset's PID
- `#Dataset0FilesPath`: Array, all file paths in first dataset
- `#Dataset0FilesTotalSize`: Total size of all files in first dataset (bytes)
- `#Dataset0SourceFolder`: Source folder for first dataset
- `#Dataset0SelectedFilesPath`: Array, paths of selected files
- `#Dataset0SelectedFilesCount`: Number of selected files (first dataset)
- `#Dataset0SelectedFilesTotalSize`: Size of selected files total
- `#Dataset[n]Field[fieldName]`: Arbitrary field `fieldName` from dataset[n]
- `#DatasetsPid`: Array of PIDs, all datasets
- `#DatasetsFilesPath`: All file paths, all datasets
- `#DatasetsFilesTotalSize`: Total size of all datasets' files
- `#DatasetsSourceFolder`: Source folders for all datasets
- `#DatasetsSelectedFilesPath`: All selected file paths (all datasets)
- `#DatasetsSelectedFilesCount`: Total number selected files
- `#DatasetsSelectedFilesTotalSize`: Total selected files size
- `#DatasetsField[fieldName]`: Array; `fieldName` in all datasets

**Other runtime keywords:**
- `#token`, `#tokenBearer`, `#jwt`, `#uuid`: Various tokens and a random UUID.
- `@<variable>`: Variable defined in `variables` mapping.

---

## Expression and Templating

- Expressions in `enabled`, `disabled`, `hidden`, `authorization` are JavaScript-like.
- Variables referenced as `@name` and selectors as `#SelectorName`.
- Templates in `url`, `payload`, `filename` use `{{  ... }}` to interpolate values (e.g. `{{ @pid }}`).

---

## Example Configuration

```json
{
  "id": "eed8efec-4354-11ef-a3b5-d75573a5d37f",
  "description": "Lets users download all files",
  "order": 1,
  "label": "Download All",
  "files": "all",
  "mat_icon": "download",
  "type": "form",
  "url": "https://zip.scicatproject.org/download/all",
  "target": "_blank",
  "variables": {
    "pid": "#Dataset0Pid",
    "files": "#Dataset0FilesPath",
    "totalSize": "#Dataset0FilesTotalSize",
    "folder": "#Dataset0SourceFolder"
  },
  "enabled": "#MaxDownloadableSize(@totalSize)",
  "inputs": {
    "dataset[]": "@pid",
    "directory[]": "@folder",
    "files[]": "@files"
  },
  "authorization": ["#datasetAccess", "#datasetPublic"]
}