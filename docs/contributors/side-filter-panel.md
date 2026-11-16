# Configuring the datasets side filter panel

## Overview

The global frontend configuration property `sideFilterEnabled` controls the `datasets-filter` panel in the side column of the datasets dashboard.

```json
{
  "sideFilterEnabled": true
}
```

The property is declared in `AppConfigInterface` as:

```ts
sideFilterEnabled?: boolean;
```

It is optional, so configurations without it keep working. Only an explicit `false` turns the panel off, a missing value counts as on.

## Frontend implementation

`dashboard.component.html` decides what the side column shows:

```html
@let filterShown = appConfig.sideFilterEnabled !== false; @let sideColumn =
filterShown || (loggedIn && (appConfig.addDatasetEnabled || cartCardShown));
```

- `filterShown` renders `<datasets-filter>`.
- `sideColumn` renders the column itself, both the one next to the table and the empty one above it that lines up with the table actions.
- The table column takes `fxFlex` 100 without the side column, and the usual 85 (80 below `xl`) with it.

The column stays when the filter is off but the Create Dataset card or the shopping cart card (`shoppingCartOnHeader: false`) is shown to a logged-in user, so those are not lost. Without them the table takes the whole width.

`DatasetsFilterComponent` is not created while the panel is off, so what it does on init does not happen either: it reads `searchQuery` from the URL into the store (`setFiltersAction`). The text search, the advanced search conditions and the table's own filters are handled outside of it and keep working. The dashboard still fetches the datasets and the facet counts.

## Scope and plan

Currently the option is consumed by the datasets dashboard only. The plan is to apply it to the other list pages, such as proposals, samples and instruments, so that all of them follow the same UI pattern. When adding a page:

- Read the same `sideFilterEnabled` property, do not add a per-page option.
- Treat a missing value as on, only `false` turns the panel off.
- Let the table take the full width without the panel, as the datasets dashboard does.
- Add the page to the user documentation and cover it with a "side filter" test like the dashboard's.

Relevant files:

- `src/app/app-config.service.ts`
- `src/app/datasets/dashboard/dashboard.component.html`
- `src/app/admin/schema/frontend.config.jsonforms.json`
- `src/assets/config.json`

## Testing

Unit tests are in `src/app/datasets/dashboard/dashboard.component.spec.ts` under "side filter". They check that the panel is shown when the option is not set, that the panel and its column are gone when it is `false`, and that the column stays for the Create Dataset card.

Run them with:

```bash
npm test -- --include='src/app/datasets/dashboard/dashboard.component.spec.ts'
```

The configuration is read once when the application starts. Changing it afterwards does not update an application that is already loaded.
