---
title: Configurable Actions
audience: Technical
created_by: Max Novelli
created_on: 2024/07/29
---

# Configurable Actions: Technical Documentation

## Overview

**Configurable actions** are a flexible framework for defining and integrating user actions (like downloads, data transfers, or remote calls) into the SciCat FE. Actions are defined as JSON objects in the configuration file and rendered by the corresponding Angular components, allowing site administrators to tailor functionality without changing core FE application code.

Configurable actions can:
- Trigger file downloads (all or selected files from a dataset)
- Submit data to remote services (e.g., prepare and download a Jupyter notebook)
- Change the publication status of datasets
- Redirect users to custom links

## Concepts

### 1. Action Object

Each configurable action is represented by an object with a well-defined schema. Key properties include:
- `id`: Unique identifier
- `label`: The button or menu text
- `description`: Text explaining the action (for tooltips or help)
- `type`: Kind of action (`form`, `xhr`, `link`, `json-download`, etc.)
- `order`: Display order
- `url`: Destination or API endpoint
- `enabled`: Logic condition for availability
- `authorization`: Logic conditions controlling access (Not implemented yet)
- `variables`: Key-value pairs mapping action logic to dataset/user context
- `payload`/`inputs`/`headers`: Parameters required by the action

### 2. Action Types

- **form**: Submits data via HTTP form POST/GET to a given endpoint (`url`), optionally opening new tabs/windows.
- **xhr**: Sends AJAX (XHR) requests (e.g., PATCH/POST) for more complex workflows. This type of action can be used to configure a call to the BE.
- **link**: Simple redirect to a URL.
- **json-download**: Executes a call to a remote URL and expects a JSON payload that can be downloaded by the user through the browser. The action allows to define the name of the file to be downloaded.

### 3. Variable and Input Substitution

Variables (defined in the `variables` object) are user-defined values which use placeholders referencing runtime data, such as:
- Dataset attributes (e.g., `#Dataset0Pid`, `#Dataset0FilesPath`)
- File lists or counts
- System information, like user authentication token (`#jwt`, `#tokenBearer`) or auto generated uuid and more.

Inputs/payloads define what are the form fields (for form actions) or the payload send upon click (for xhr and json-download actions). Variables can be injected in the inputs and payload including the variable name enclosed in double curly braces `{{ ... }}` syntax.

### 4. Enable/Authorization Conditions

The `enabled` or `disabled` fields are the expression that evaluates whether the action should be enabled or disabled. Only one of them is needed, if both are present, `disabled` takes the precedence. This field supports logical operators and variable references (e.g., `#Length(@files) && #MaxDownloadableSize(@totalSize)`).

The `authorization` field restricts actions based on user or dataset properties (e.g., requiring the user to be the dataset owner).

## Example Configuration

```json
{
  "id": "example-action-id",
  "label": "Download All",
  "description": "Download all files using the zip service",
  "order": 1,
  "type": "form",
  "url": "https://zip.scicatproject.org/download/all",
  "target": "_blank",
  "mat_icon": "download",
  "variables": {
    "pid": "#Dataset0Pid",
    "files": "#Dataset0FilesPath",
    "totalSize": "#Dataset0FilesTotalSize",
    "folder": "#Dataset0SourceFolder"
  },
  "inputs": {
    "item[]": "@pid",
    "directory[]": "@folder",
    "files[]": "@files"
  },
  "enabled": "#MaxDownloadableSize(@totalSize)",
  "authorization": ["#datasetAccess", "#datasetPublic"]
}
```

This example action configures a button with label "Download All" and icon mat-icon `download`. The action is of type `form` which by default will submit a form with method POST. Internally, it defines 4 variables with name `pid`, `files`, `totalSize`, and `folder` with their values depending from the dataset fields. The variables are used to define the fields of the form.  
When the user clicks on the button, the FE will create a form with the listed fields and submitted to the specified URL as a POST. It also show the reply in a new tab in browser.

## Configuration Options Reference

| Field         | Description                                            | Example                                      |
|---------------|--------------------------------------------------------|----------------------------------------------|
| id            | Unique action identifier                               | `"eed8efec-4354-11ef-a3b5-d75573a5d37f"`     |
| label         | Button or menu label shown to users                    | `"Download All"`                             |
| description   | Tooltip/help text for the action                       | `"Download all files using the zip service"` |
| order         | Integer controlling sort order                         | `1`                                          |
| type          | Type of action (`form`, `xhr`, `link`, etc)            | `"form"`                                     |
| url           | Destination URL or API endpoint                        | `"https://.../download/all"`                 |
| target        | Browser target (`_blank`, etc)                         | `"_blank"`                                   |
| mat_icon      | (Optional) Material icon name                          | `"download"`                                 |
| icon          | (Optional) Path or URL to custom icon                  | `"/icons/jupyter_logo.png"`                  |
| variables     | Key-value pairs for variable substitution              | `{...}`                                      |
| inputs        | Key-value pairs for form submissions                   | `{...}`                                      |
| payload       | Data payload for XHR or json-download actions          | `"{...}"`                                    |
| filename      | Filename pattern for downloads                         | `"{{ #uuid }}.ipynb"`                        |
| method        | HTTP method for XHR actions                            | `"PATCH"`                                    |
| headers       | HTTP headers object for XHR                            | `{...}`                                      |
| enabled       | Condition expression to enable/disable action          | `"#Length(@files) > 0"`                      |
| authorization | List or string with conditions required to access action| `["#datasetOwner"]`                         |

## How to Configure

1. **Identify Use Case**: Determine what user action you want to implement (e.g., file download, notebook generation, external call or BE call).
2. **Describe Action**: Define the label, description, and type.
3. **Set Variables/Inputs**: List all the dynamic values referenced in `payload`, `inputs`, or `url`.
4. **Authorization/Enablement**: Write logical conditions so only the right users see or can use this action.
5. **Test**: Deploy the configuration and verify the new action appears and behaves as expected in the UI.

## Practical Guidance

- **Variables** should match keys provided by the front end for dataset, user, or file properties.
- **Always test** conditions for `enabled` and `authorization` to ensure correct visibility for intended users/roles.
- For complex enabled/authorization expressions, coordinate with the front-end development team for the latest available operators and syntax.
- Update action definitions via the appropriate system configuration (file, database, or admin interface per deployment).

