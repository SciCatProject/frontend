# Dataset List View Configuration

## Overview

`datasetViews` is an optional array field in the frontend configuration that drives the lifecycle-view tabs (All / Archivable / Retrievable / Work In Progress / System Error / User Error) shown above the dataset table. Each entry describes one tab: a label, and either a Mongo-style filter fragment merged into the dataset list's search query, or (for the cases that genuinely need it) a URL to fetch the dataset list from directly.

**Target Audience**: Administrators deploying SciCat Frontend, and developers working on the dataset list page (and, for anything a filter fragment can't express, developers working on the backend's fullquery endpoint).

**Key files**:
- [`src/app/state-management/models/dataset-view.interfaces.ts`](../src/app/state-management/models/dataset-view.interfaces.ts) — the `DatasetViewConfig` shape and `url`/`variables` resolution.
- [`src/app/state-management/models/dataset-views.defaults.ts`](../src/app/state-management/models/dataset-views.defaults.ts) — the built-in views, used when none are configured (all `query`-based).
- [`src/app/app-config.service.ts`](../src/app/app-config.service.ts) — where `datasetViews` defaults are applied.
- [`src/app/state-management/selectors/datasets.selectors.ts`](../src/app/state-management/selectors/datasets.selectors.ts) (`selectFullqueryParams`) — where a view's `query` merges with every other active filter.
- [`src/app/state-management/effects/datasets.effects.ts`](../src/app/state-management/effects/datasets.effects.ts) — where a `url` view is resolved into an actual fetch.

### Why it exists

The lifecycle tabs used to be a fixed `ArchViewMode` enum with the filter for each tab hardcoded in a switch-case (duplicated, in fact, in two separate files). Any deployment that needed a different lifecycle grouping had no way to configure that — it required a code change.

`datasetViews` makes the tab list itself config-driven: which tabs exist, their order and labels, and the filter fragment each one contributes.

---

## How it works

1. If `archiveWorkflowEnabled` is `true`, the dataset list page (`dataset-table-actions`) renders one tab per entry in `datasetViews`, sorted by `order` and filtered by `enabled`.
2. Clicking a tab dispatches its `id`, `query`, `url`, `headers`, and `variables` into the store.
3. When fetching datasets:
   - If the active view has a **`query`** (`{}` for "no extra filtering", the default for every built-in tab), it's merged into the *same* fullquery filter that search text, facets, sorting, `isPublished`, and every other active filter merge into — a view is just one more filter predicate. This is why, for example, selecting "My data" and "Archivable" together already works with no extra configuration: both end up as sibling keys in one merged filter object, sent as a single request.
   - If the active view has a **`url`** instead, its `variables` are resolved and the `url`/`headers` templates are interpolated (see below), then that URL is called directly; its response becomes the dataset list, and the generic fullquery call is skipped entirely for that fetch. **Prefer `query` whenever possible** — see "Views that need more than a filter fragment" below for why, and for when `url` is actually the right call.
4. If `archiveWorkflowEnabled` is `true` but `datasetViews` isn't set, the frontend falls back to the 6 built-in views (`buildDefaultDatasetViews`), so existing deployments see no change until they opt in.

```ts
export interface DatasetViewConfig {
  id: string;
  label: string;
  order: number;
  enabled?: boolean;
  query?: Record<string, unknown>;
  url?: string;
  headers?: Record<string, string>;
  variables?: Record<string, string>;
}
```

### `variables` and URL interpolation

`url`/`headers`/`variables` follow the same convention as `ActionConfig` in the configurable-actions module (see `configurable-actions.defaults.ts`):

- `variables` maps a friendly name to a **selector**: a string starting with `#` is resolved from page context (the table below); anything not starting with `#` is a literal value, passed through unchanged.
- `url` and each value in `headers` are **templates**: `{{@name}}` is replaced with the resolved value of `variables.name`.

```json
{
  "id": "needs-review",
  "label": "Needs Review",
  "order": 7,
  "url": "{{@baseUrl}}/api/v3/datasets/needs-review?text={{@text}}&skip={{@skip}}",
  "variables": {
    "baseUrl": "#apiBaseUrl",
    "text": "#searchText",
    "skip": "#skip"
  }
}
```

`#` selectors available to `variables`:

| Selector | Value |
|---|---|
| `#searchText` | Current search box text |
| `#isPublished` | Current My data / Public data toggle (`true`, `false`, or `""`) |
| `#skip` | Current pagination offset |
| `#limit` | Current page size |
| `#order` | Current sort, e.g. `createdAt:desc` |
| `#user.<path>` | A field on the current user, e.g. `#user.username`, `#user.email` |
| `#apiBaseUrl` | The API base URL (`lbBaseURL`) |
| `#token` | The raw auth token |
| `#tokenBearer` | `Bearer <token>` |
| `#uuid` | A generated UUID |

A dataset view has a smaller "page context" than an action does — it has no notion of a "selected dataset" the way a batch action does (there's no `#DatasetsPid` equivalent here), because a view builds the list itself rather than acting on a selection. Unlike `ActionConfig`, that context also isn't owned by the component that renders the tab: search text, sort, and pagination are each set by different components on the dataset list page (the search box, the column headers, the paginator), not just `dataset-table-actions`. So it's resolved centrally in `DatasetEffects`, from the same store state the generic fullquery path already reads.

The frontend does **not** append search/sort/pagination on its own — a `url` view only stays in sync with the search box, sorting, and pagination if `variables`/`url` reference the corresponding selectors and the target endpoint honors them.

`headers` always gets an `Authorization: Bearer <token>` entry automatically; add your own `headers` entries only for anything beyond that (a `headers` key you set yourself overrides the automatic one).

---

## Usage patterns

### Reproducing the built-in views explicitly

Setting `datasetViews` explicitly is only needed if you want to change something (order, labels, add/remove a tab). This is the default set, written out, for reference or as a starting point:

```json
{
  "archiveWorkflowEnabled": true,
  "datasetViews": [
    {
      "id": "all",
      "label": "All",
      "order": 1,
      "query": {}
    },
    {
      "id": "archivable",
      "label": "Archivable",
      "order": 2,
      "query": {
        "datasetlifecycle.archivable": true,
        "datasetlifecycle.retrievable": false
      }
    },
    {
      "id": "retrievable",
      "label": "Retrievable",
      "order": 3,
      "query": {
        "datasetlifecycle.retrievable": true,
        "datasetlifecycle.archivable": false
      }
    },
    {
      "id": "work in progress",
      "label": "Work In Progress",
      "order": 4,
      "query": {
        "$or": [
          {
            "datasetlifecycle.retrievable": false,
            "datasetlifecycle.archivable": false,
            "datasetlifecycle.archiveStatusMessage": { "$ne": "scheduleArchiveJobFailed" },
            "datasetlifecycle.retrieveStatusMessage": { "$ne": "scheduleRetrieveJobFailed" }
          }
        ]
      }
    },
    {
      "id": "system error",
      "label": "System Error",
      "order": 5,
      "query": {
        "$or": [
          { "datasetlifecycle.retrievable": true, "datasetlifecycle.archivable": true },
          { "datasetlifecycle.archiveStatusMessage": "scheduleArchiveJobFailed" },
          { "datasetlifecycle.retrieveStatusMessage": "scheduleRetrieveJobFailed" }
        ]
      }
    },
    {
      "id": "user error",
      "label": "User Error",
      "order": 6,
      "query": {
        "$or": [
          { "datasetlifecycle.archiveStatusMessage": "missingFilesError" }
        ]
      }
    }
  ]
}
```

`id` doubles as the CSS class on each tab (e.g. `.archivable`) and as the value round-tripped through the URL's `searchQuery` for back-navigation, so keep the built-in ids unchanged if you're only reordering or relabeling.

### Disabling a built-in tab

Set `enabled: false` rather than omitting the entry — this keeps the `id` reserved (so old bookmarked URLs referencing it degrade to an empty query instead of matching nothing):

```json
{ "id": "user error", "label": "User Error", "order": 6, "enabled": false, "query": { "$or": [{ "datasetlifecycle.archiveStatusMessage": "missingFilesError" }] } }
```

### Adding a custom tab

Any predicate expressible as a Mongo filter on the `Dataset` collection works the same way as the built-ins — just add an entry:

```json
{
  "id": "raw-only",
  "label": "Raw",
  "order": 7,
  "query": { "type": "raw" }
}
```

---

## Views that need more than a filter fragment

Some tabs can't be expressed as a filter on the `Dataset` collection alone — e.g. "datasets the current user is authorized to delete," which requires joining against a separate `Policy` collection keyed by group or user. A client-composed Mongo filter can't reference a second collection, so this needs a backend change regardless of which frontend mechanism you reach for.

**Prefer extending the backend's fullquery endpoint with a new recognized filter key** over reaching for `url`, resolved server-side and merged in with everything else exactly like `mode`/`isPublished`/`text` already are — e.g. `{"authorizedFor": "delete"}`, where the backend derives the *current user* from the request's auth token (never from a client-supplied parameter — that's an authorization decision, not something to trust the client with) and resolves it against `Policy`. Once that filter key exists, the view config is just another `query` fragment, composing with search/sort/pagination/other filters for free, the same as every built-in tab:

```json
{
  "id": "deletable",
  "label": "Deletable",
  "order": 8,
  "query": { "authorizedFor": "delete" }
}
```

**Reach for `url` only when the view's result genuinely isn't a filtered slice of the `Dataset` collection** — a different underlying resource, a different pagination/response shape, something a shared `where`-clause can't represent no matter what key you add to it. In that case:

```json
{
  "id": "deletable",
  "label": "Deletable",
  "order": 8,
  "url": "{{@baseUrl}}/api/v3/datasets/deletable?text={{@text}}&skip={{@skip}}&limit={{@limit}}",
  "variables": {
    "baseUrl": "#apiBaseUrl",
    "text": "#searchText",
    "skip": "#skip",
    "limit": "#limit"
  }
}
```

Unlike the `query` version, this one only stays in sync with search/sort/pagination because the template explicitly forwards `text`/`skip`/`limit` and the `/deletable` endpoint is expected to apply them itself — that composition isn't automatic for `url` views the way it is for `query` views, so it's easy to silently lose it by forgetting a token.

Either way, the actual delete action's own endpoint should still independently re-check authorization when the delete request comes in — this tab is a UX filter, not the enforcement point.

---

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| No lifecycle tabs shown at all | `archiveWorkflowEnabled` is `false` (or unset) — `datasetViews` is only rendered when it's `true`. |
| A new tab's `query` doesn't seem to filter anything | The key(s) in `query` don't match a real field/operator the backend's fullquery filter understands — check the field path (e.g. `datasetlifecycle.archivable`, not `archivable`). |
| Reordering/relabeling a built-in tab breaks the "back" breadcrumb behavior | Keep the built-in `id` values (`all`, `archivable`, `retrievable`, `work in progress`, `system error`, `user error`) unchanged — only `label` and `order` are safe to customize freely. |
| A tab needs data from outside the `Dataset` collection | See "Views that need more than a filter fragment" above — prefer a new fullquery filter key; reach for `url` only if the result genuinely isn't a filtered slice of `Dataset`. |
| A custom `url` tab ignores the search box / sort / pagination | `variables` doesn't map a name to `#searchText` / `#order` / `#skip` / `#limit`, or `url` doesn't reference that name via `{{@name}}` — add both, and confirm the endpoint actually applies them. |
| A `{{@name}}` in `url`/`headers` renders as an empty string | `variables` has no entry named `name`, or its selector doesn't match one of the `#` tokens in the table above (selectors are case-sensitive and unrecognized ones fall through as a literal string, not an error). |
| `url` request comes back `401` | Check the endpoint accepts a standard `Authorization: Bearer <token>` header the same way the rest of the API does — or, if you've overridden `headers.Authorization` yourself, that its `variables` selector resolves correctly. |
| Facet counts look inconsistent with a `url` tab's results | Facet counts are always computed from the view's `query` (defaulting to `{}` if only `url` is set) — they aren't derived from a `url` view's response. Set `query` alongside `url` if you need the facet counts to reflect the same filtering. |
