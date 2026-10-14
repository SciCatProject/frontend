# Dataset view modes

For logged-in users, the dataset filter panel shows a dropdown below the My
data / Public data toggle. Each entry is a named query preset that filters the
list. Configure it with the `datasetViews` block: `modes` are the entries and
`label` is the dropdown label ("Archive status" by default):

```json
"datasetViews": {
  "label": "Archive status",
  "modes": [
    { "id": "all", "label": "All", "where": {} },
    {
      "id": "archivable",
      "label": "Ready to archive",
      "tooltip": "Datasets that can be sent to tape",
      "where": {
        "datasetlifecycle.archivable": true,
        "datasetlifecycle.retrievable": false
      }
    },
    {
      "id": "retrievable",
      "label": "On tape",
      "where": {
        "datasetlifecycle.retrievable": true,
        "datasetlifecycle.archivable": false
      }
    }
  ]
}
```

| Field      | Required | Description                                                                                                             |
| ---------- | -------- | ----------------------------------------------------------------------------------------------------------------------- |
| `id`       | yes      | Stable identifier. Batch actions see it as `#currentArchViewMode`, so changing it can break their `hidden` expressions. |
| `label`    | yes      | Text shown in the dropdown.                                                                                             |
| `where`    | yes      | Mongo query merged into the `where` of the v4 dataset filter. Use `{}` for an unfiltered view.                          |
| `tooltip`  | no       | Tooltip shown on hover.                                                                                                 |
| `checkbox` | no       | Checkbox under the dropdown that narrows this view, see below.                                                          |

The list starts in the `all` view with no filter applied, and the Clear
button returns to it. If no entry has `"id": "all"`, an "All" option with an
empty `where` is added at the top of the dropdown automatically.

## Narrowing a view: the `checkbox`

A view can have an optional checkbox, shown under the dropdown while that view
is selected, that narrows it, typically to the datasets the user can act on:

```json
{
  "id": "archivable",
  "label": "Archivable",
  "where": {
    "datasetlifecycle.archivable": true,
    "datasetlifecycle.retrievable": false
  },
  "checkbox": {
    "label": "Only datasets owned by my groups",
    "default": true,
    "where": { "ownerGroup": { "$in": "#user.accessGroups" } },
    "exemptGroups": ["admin", "archivemanager"]
  }
}
```

| Field          | Required | Description                                                                |
| -------------- | -------- | -------------------------------------------------------------------------- |
| `label`        | yes      | Text next to the checkbox.                                                 |
| `where`        | yes      | Mongo query combined with the view's `where` when ticked.                  |
| `default`      | no       | Whether the checkbox is ticked when the view is selected (default `true`). |
| `exemptGroups` | no       | Users in any of these groups don't get the checkbox, see below.            |

When ticked, the view's `where` and the checkbox `where` are combined as
`{ "$and": [viewWhere, checkboxWhere] }`, so neither can overwrite the other's
conditions. Changing the view or the checkbox clears the dataset selection.

### Exceptions: `exemptGroups`

For users in any of the `exemptGroups`, typically admins, the checkbox is
hidden and its `where` is not applied: they see the whole view.
List the same groups your backend treats as admins (`ADMIN_GROUPS`), so the
list matches what they are allowed to do.

### Placeholders

Both the view's `where` and the checkbox `where` can refer to the logged-in user.
A string value that is exactly one of these placeholders is replaced; keys and
parts of strings are never replaced:

| Placeholder          | Replaced with                                                               |
| -------------------- | --------------------------------------------------------------------------- |
| `#user.email`        | the user's email                                                            |
| `#user.username`     | the user's username                                                         |
| `#user.accessGroups` | the user's groups, e.g. `{ "ownerGroup": { "$in": "#user.accessGroups" } }` |

`#user.<path>` reads any field of the user's profile, with the same syntax as
configurable action selectors (e.g. `#user.email`). A missing field becomes
`null` and logs a console warning, which usually points to a typo in the
config.

### Limits

- The queries go to the v4 dataset list, which only accepts these operators:
  `$in`, `$nin`, `$or`, `$and`, `$nor`, `$not`, `$eq`, `$ne`, `$gt`, `$gte`,
  `$lt`, `$lte`, `$exists`, `$regex`, `$text`. In particular `$expr` and
  `$elemMatch` are rejected.
- Only dataset fields can be filtered by `where`. Conditions on related
  documents, such as the PI email of a dataset's proposals, need backend
  support for filtering on related documents.
- The checkbox only narrows what is shown. The backend still decides what the
  user may do with the selected datasets.

## Defaults

If `datasetViews.modes` is not set and `archiveWorkflowEnabled` is `true`, the
built-in archive workflow views are used: All, Archivable, Retrievable, Work
In Progress, System Error and User Error (see
`src/app/datasets/dataset-view-modes.defaults.ts`). The default Archive and
Retrieve batch actions only show up in the `archivable` and `retrievable`
views. If you rename those ids, update the `hidden` expressions of your
`batchActions` to match.

To hide the dropdown while keeping `archiveWorkflowEnabled`, set
`"datasetViews": { "modes": [] }`.
