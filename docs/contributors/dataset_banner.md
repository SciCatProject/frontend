---
title: Dataset Status Banner
created_by: Carlo Minotti
created_on: 2026/08/13
---

# Dataset Status Banner

This page describes the configurable status banner shown on the dataset detail page.

The dataset status banner is a small, colored notice rendered above the dataset details (e.g. "This dataset has been deleted.") that is shown or hidden based on rules matched against fields of the currently viewed dataset. It is fully opt-in: if `datasetStatusBanner` is not configured, or is configured with `enabled: false`, no banner is ever rendered and there is no change in behavior.

This feature is unrelated to the existing global **statusBannerMessage** setting, which renders a single, static banner in the application header regardless of which page or dataset is being viewed. The dataset status banner described here is per-dataset and conditional, driven by rules evaluated against the dataset actually loaded.

Both `datasetStatusBanner` and the `statusBanner` entry in `datasetDetailComponent.customization` (see [Placement](#placement-on-the-dataset-detail-page) below) are also editable through the Admin config editor, backed by `src/app/admin/schema/frontend.config.jsonforms.json`.

## Configuration

The banner is controlled by the **datasetStatusBanner** property in the frontend configuration (`src/assets/config.json`):

- **datasetStatusBanner**  
  _Type: DatasetStatusBannerConfig_  
  _Optional_  
  Configures the per-dataset status banner feature.
  - **enabled**  
    _Type: boolean_  
    _Optional_  
    Enables or disables the feature. If omitted or `false`, no banner is ever shown.
  - **rules**  
    _Type: array of DatasetStatusBannerRule_  
    _Optional_  
    The list of rules used to determine whether a banner is shown, and with which message/severity. Rules are evaluated in order and the **first matching rule wins**. If omitted, no rule can ever match, so no banner is shown.

Each element of `rules` is a **DatasetStatusBannerRule**:

- **field**  
  _Type: string_  
  Dot-path to the dataset field to check, resolved from the dataset root (e.g. `datasetlifecycle.archiveStatusMessage`). Any nested field on the dataset object can be referenced this way, not just fields under `datasetlifecycle`.
- **value**  
  _Type: string_  
  The value the field must equal (as a string, using strict equality) for this rule to match.
- **message**  
  _Type: string_  
  The message shown in the banner when this rule matches. It is rendered as plain text (not HTML), so no markup is interpreted and there is no risk of arbitrary HTML/script injection via configuration.
- **code**  
  _Type: "INFO" | "WARN"_  
  _Optional_  
  _Default: "WARN"_  
  Controls the banner's icon and color: `WARN` renders an amber banner with a warning icon, `INFO` renders a green banner with an info icon.

### Example

```json
"datasetStatusBanner": {
  "enabled": true,
  "rules": [
    {
      "field": "datasetlifecycle.archiveStatusMessage",
      "value": "deleted",
      "message": "This dataset has been deleted.",
      "code": "WARN"
    },
    {
      "field": "datasetlifecycle.archiveStatusMessage",
      "value": "markedForDeletion",
      "message": "This dataset is marked for deletion.",
      "code": "WARN"
    }
  ]
}
```

With this configuration, a dataset whose `datasetlifecycle.archiveStatusMessage` is `"deleted"` shows an amber banner reading "This dataset has been deleted."; a dataset with `"markedForDeletion"` shows a similar banner with a different message; any other value (or a missing `datasetlifecycle`) shows no banner at all.

## Placement on the dataset detail page

The banner is rendered as a section of the dataset detail page's customizable layout, alongside the other sections such as "General Information" or "Scientific Metadata". It is added by including an entry of type `statusBanner` in `datasetDetailComponent.customization`:

```json
"datasetDetailComponent": {
  "enableCustomizedComponent": false,
  "customization": [
    {
      "type": "statusBanner",
      "label": "Status Banner",
      "order": -1,
      "row": 1,
      "col": 10
    },
    ...
  ]
}
```

- **order** controls where the section falls relative to the other sections (lower values render first); a negative order places it above the default sections.
- **row** / **col** control how many grid rows/columns the section spans in the dataset detail layout.

If no `statusBanner` entry is present in `customization`, the banner component is never rendered, regardless of the `datasetStatusBanner` configuration.

Note that the banner is currently only wired into the **dynamic** (customizable) dataset detail layout (`dataset-detail-dynamic`), not the legacy static layout.

## Implementation

- `DatasetStatusBannerComponent` (`src/app/datasets/dataset-detail/dataset-status-banner/`) receives the current dataset as `@Input() datasetItem`. On `ngOnChanges`, it resolves the first matching rule into a `banner` field (or `undefined` if the feature is disabled, no dataset is available, or no rule matches), so the lookup runs once per dataset change rather than on every change-detection cycle.
- Field resolution uses lodash-es's `get` to walk the dot-path in `field` from the dataset root, returning `undefined` for any missing intermediate segment rather than throwing.
- `DatasetDetailDynamicComponent` renders `<dataset-status-banner>` for any `statusBanner` section found in the configured `datasetView`, passing it the currently loaded dataset.

### Tests

Unit tests for the component live in `dataset-status-banner.component.spec.ts` and cover: the feature being disabled, no rule matching, message/code selection for a matching rule, first-match-wins precedence when multiple rules could match, the default `code` of `WARN`, and support for arbitrary dot-path fields beyond `datasetlifecycle`.
