# Dataset view modes

The dataset list can show a row of view toggles. Each toggle is a named query
preset that filters the list. Configure them as `modes` in the
`datasetViews` block:

```json
"datasetViews": {
  "modes": [
    { "id": "all", "label": "All", "query": {} },
    {
      "id": "archivable",
      "label": "Ready to archive",
      "tooltip": "Datasets that can be sent to tape",
      "query": {
        "datasetlifecycle.archivable": true,
        "datasetlifecycle.retrievable": false
      }
    },
    {
      "id": "retrievable",
      "label": "On tape",
      "query": {
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
| `label`   | yes      | Text shown on the toggle.                                                                                               |
| `query`   | yes      | Mongo query merged into the v4 dataset query. Use `{}` for an unfiltered view.                                          |
| `tooltip` | no       | Tooltip shown on hover.                                                                                                 |

The list starts in the `all` view with no filter applied. Include a view with
`"id": "all"` and `"query": {}` so users can get back to the unfiltered list.

## Defaults

If `datasetViews.modes` is not set and `archiveWorkflowEnabled` is `true`, the
built-in archive workflow views are used: All, Archivable, Retrievable, Work
In Progress, System Error and User Error (see
`src/app/datasets/dataset-view-modes.defaults.ts`). The default Archive and
Retrieve batch actions only show up in the `archivable` and `retrievable`
views. If you rename those ids, update the `hidden` expressions of your
`batchActions` to match.

To hide the toggles while keeping `archiveWorkflowEnabled`, set
`"datasetViews": { "modes": [] }`.
