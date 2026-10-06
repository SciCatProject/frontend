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

| Field     | Required | Description                                                                                                             |
| --------- | -------- | ----------------------------------------------------------------------------------------------------------------------- |
| `id`      | yes      | Stable identifier. Batch actions see it as `#currentArchViewMode`, so changing it can break their `hidden` expressions. |
| `label`   | yes      | Text shown in the dropdown.                                                                                             |
| `where`   | yes      | Mongo query merged into the `where` of the v4 dataset filter. Use `{}` for an unfiltered view.                          |
| `tooltip` | no       | Tooltip shown on hover.                                                                                                 |

The list starts in the `all` view with no filter applied, and the Clear
button returns to it. If no entry has `"id": "all"`, an "All" option with an
empty `where` is added at the top of the dropdown automatically.

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
