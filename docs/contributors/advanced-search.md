# Configuring the advanced search

## Overview

The global frontend configuration property `advancedSearchEnabled` picks the filter of the list pages: the advanced search (`true`) or the side panel with the old condition filter (`false`). Only one of them is rendered.

```json
{
  "advancedSearchEnabled": true
}
```

The property is declared in `AppConfigInterface` as:

```ts
advancedSearchEnabled?: boolean;
```

It is optional. A missing value counts as `true`, only an explicit `false` turns the old filter on.

## Frontend implementation

| Where                             | `true` (default)                                      | `false`                                      |
| --------------------------------- | ----------------------------------------------------- | -------------------------------------------- |
| `dashboard.component.html`        | no `<datasets-filter>`, table at full width           | `<datasets-filter>` in the side column       |
| `dataset-table.component.html`    | `<advanced-search-button>`, `<advanced-search-chips>` | neither                                      |
| `datasets-filter.component.html`  | not created                                           | `<shared-condition>` for scientific metadata |
| `sample-dashboard.component.html` | `<advanced-search-button>`, `<advanced-search-chips>` | `<shared-condition>`                         |

Both filters work on the same state. The applied conditions are `filters.scientific` (datasets) and `sampleFilters.characteristics` (samples), set with `setScientificConditionsAction` and `setCharacteristicsFilterAction`. The saved ones are the user settings `fe_dataset_table_conditions` and `fe_sample_table_conditions`. The old condition filter adds and removes single conditions through callbacks of its host (`addCondition`, `removeCondition`), which set the whole list. The queries are built by `advanced-search.utils.ts` in both cases.

The predefined conditions of the configuration (`defaultDatasetsListSettings.conditions`, `defaultSamplesListSettings.conditions`) are only read when the advanced search is off, see `fetchUserSettings$` and `loadDefaultSettings$` in `user.effects.ts`.

The side column of the datasets dashboard stays with the advanced filter when the Create Dataset card or the shopping cart card (`shoppingCartOnHeader: false`) is shown to a logged-in user.

Relevant files:

- `src/app/app-config.service.ts`
- `src/app/datasets/dashboard/dashboard.component.html`
- `src/app/datasets/dataset-table/dataset-table.component.html`
- `src/app/datasets/datasets-filter/`
- `src/app/samples/sample-dashboard/`
- `src/app/shared/modules/shared-condition/` and `src/app/shared/modules/search-parameters-dialog/` (old filter)
- `src/app/shared/modules/advanced-search/` (new filter)
- `src/app/admin/schema/frontend.config.jsonforms.json`

## Testing

- `dashboard.component.spec.ts`, "side filter": the panel when the advanced filter is off, no panel otherwise.
- `dataset-table.component.spec.ts`, "advanced search": shown when it is on, gone when it is off.
- `datasets-filter.component.spec.ts` and `sample-dashboard.component.spec.ts`, "old condition filter": adding and removing a condition.

The configuration is read once when the application starts. Changing it afterwards does not update an application that is already loaded.
