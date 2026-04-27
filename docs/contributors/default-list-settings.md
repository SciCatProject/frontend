# Default List Settings (Frontend)

This page explains where to configure default list and table behavior in the
frontend.

The datasets and proposals defaults are configured in the Admin Settings UI. The
dynamic datafiles table also supports configurable default columns through the
frontend configuration.

## Where To Find It

Open the user menu and go to **Admin Settings**.

![Admin Settings](admin_settings_menu.png)
_Figure 1: Open Admin Settings from the user menu._

Then open **List settings**

![List settings overview](admin_list_settings_overview.png)
_Figure 2: List settings overview._

## List Settings Structure

The Admin Settings UI currently contains two list settings sections:

- **Default Datasets List Settings**
- **Default Proposals List Settings**

The dynamic datafiles table is configured with `defaultDatafilesColumnsList` in
the frontend configuration, for example `src/assets/config.json` in local
development or the deployed frontend config for an environment. It is not
currently exposed as a separate **List settings** section in the Admin Settings
UI.

## Default Sorting

Default sorting is configured at column level with the `sort` property.

Accepted values:

- `asc`
- `desc`

Rules:

- Define `sort` on only one column per list section.
- If `sort` is not defined, the table falls back to `createdAt` in descending order.

![Sort field in columns list](sort_field_columns_list.png)
_Figure 3: Sort field in Default Datasets List Settings._

## Dynamic Datafiles Table

The dynamic datafiles table is the table shown in the dataset details
**Datafiles** tab when `dynamicDatafilesViewEnabled` is enabled.

Configuration keys:

- `dynamicDatafilesViewEnabled`: switches the dataset **Datafiles** tab from the
  static datafiles component to the dynamic table component.
- `defaultDatafilesColumnsList`: defines the default columns shown in the
  dynamic datafiles table.
- `datafilesActions`: defines the configurable action buttons shown above the
  table.

The dynamic datafiles table uses the shared `dynamic-mat-table` component with
server-side pagination. By default it requests 25 rows per page and offers page
sizes of 10, 25, 50, 100, and 200.

The component also applies the same default row divider style as the datasets
table through the table settings `rowStyle`.

### Datafiles Columns

`defaultDatafilesColumnsList` is an array of column definitions. Each column
usually points to a property on the file origdatablock row. Datafile fields are
available under `dataFileList`.

Example:

```json
"defaultDatafilesColumnsList": [
  {
    "name": "dataFileList.path",
    "type": "standard",
    "icon": "text_snippet",
    "header": "Filename",
    "enabled": true
  },
  {
    "name": "dataFileList.size",
    "type": "standard",
    "icon": "save",
    "header": "Size",
    "pipe": "filesize"
  },
  {
    "name": "dataFileList.metadata.measurement_type",
    "type": "standard",
    "icon": "science",
    "header": "Measurement type"
  },
  {
    "name": "dataFileList.time",
    "type": "date",
    "icon": "access_time",
    "header": "Created at",
    "format": "yyyy-MM-dd HH:mm"
  }
]
```

Common column properties:

- `name`: field path used by the table. For datafiles this is usually
  `dataFileList.<field>`.
- `header`: visible column label.
- `type`: table cell type, usually `standard` or `date`.
- `icon`: Material icon shown in the column settings menu.
- `enabled`: whether the column is enabled by default.
- `format`: date formatting string for date columns.
- `pipe`: display pipe. The datafiles table supports `date`, `filesize`, and
  `timeDuration` through the dynamic table pipe mapping. Pipe names are matched
  case-insensitively.
- `width`: optional column width.
- `sort`: optional default sort direction. Use `asc` or `desc`.

### Saved User Settings

The admin defaults are only the starting point. When a user saves table settings
from the dynamic datafiles table menu, the selected columns are stored in the
user setting `fe_datafiles_table_columns`.

At runtime, the table merges saved user columns with the current
`defaultDatafilesColumnsList`:

- saved columns keep the user's order, visibility, and width;
- new default columns are appended when they are not already saved;
- saved custom columns with `userAdded: true` are preserved.

To return to the site defaults, use the table settings menu and choose the
default settings option.
