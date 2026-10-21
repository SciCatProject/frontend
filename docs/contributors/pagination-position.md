# Configuring the dynamic table pagination position

## Overview

The shared `dynamic-mat-table` component displays a Material paginator above and below the table. The global frontend configuration property `paginationPosition` controls which paginator locations are rendered.

```json
{
  "paginationPosition": "both"
}
```

Supported values are:

| Value | Behavior |
|---|---|
| `top` | Shows only the paginator above the table. |
| `bottom` | Shows only the paginator below the table. |
| `both` | Shows both paginator controls. |

## Configuration loading and defaults

`AppConfigService.loadAppConfig()` normalizes the value after loading configuration from the backend or the local frontend configuration fallback:

- `top`, `bottom`, and `both` are preserved.
- A missing value is changed to `both`.
- An unsupported value is changed to `both`.

This preserves the historical behavior for deployments that do not define the option.

The property is declared in `AppConfigInterface` as:

```ts
paginationPosition?: "top" | "bottom" | "both";
```

It remains optional in the raw interface for backward compatibility, but the loaded configuration is normalized before it is exposed by `getConfig()`.

## Frontend implementation

The setting is consumed directly by `DynamicMatTableComponent` through its global configuration:

```html
*ngIf="pagination && appConfig.paginationPosition !== 'bottom'"
```

for the top paginator, and:

```html
*ngIf="pagination && appConfig.paginationPosition !== 'top'"
```

for the bottom paginator.

Relevant files:

- `src/app/app-config.service.ts`
- `src/app/shared/modules/dynamic-material-table/table/dynamic-mat-table.component.html`
- `src/assets/config.json`

No component input is provided. Per-table overrides are intentionally unsupported.

## Scope

The option affects tables that use `dynamic-mat-table`, including common datasets, proposals, samples, instruments, jobs, files, and published-data list pages.

It does not affect standalone `mat-paginator` instances used by components that do not use the shared dynamic table.

The option changes only paginator visibility. It does not change:

- Page size or page-size options
- Client-side or server-side pagination
- Page-change events
- Data-source behavior
- Table sorting or filtering

## Testing

Unit tests cover configuration normalization and dynamic table visibility:

- `src/app/app-config.service.spec.ts`
- `src/app/shared/modules/dynamic-material-table/table/dynamic-mat-table.paginator.spec.ts`

The Cypress coverage is in:

- `cypress/e2e/pagination/pagination-position.cy.js`

The Cypress tests verify `top`, `bottom`, and `both`, and confirm that navigating to the next page still updates the paginator range.

Run the focused unit tests with:

```bash
npm test -- --include='src/app/app-config.service.spec.ts'
npm test -- --include='src/app/shared/modules/dynamic-material-table/table/dynamic-mat-table.paginator.spec.ts'
```

Run the Cypress spec against a running E2E environment with:

```bash
npx cypress run --spec cypress/e2e/pagination/pagination-position.cy.js
```

The application must receive the desired configuration before bootstrap. Changing the configuration after the application has already loaded does not update the initialized `AppConfigService` automatically.
