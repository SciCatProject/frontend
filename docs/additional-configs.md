# Additional Configs

## Overview

`additionalConfigs` is an optional array field in the local frontend configuration. When it is set, it says explicitly which config sources make up the final configuration, and in which order they are merged.

**Target Audience**: Administrators deploying SciCat Frontend, and developers working on `AppConfigService`.

**Key file**: [`src/app/app-config.service.ts`](../src/app/app-config.service.ts)

### Why it exists

By default the frontend tries to load its configuration from the backend at `/api/v3/admin/config` (a same-origin, relative request), falling back to the local `src/assets/config.json` (optionally merged with `src/assets/config.override.json` when `allowConfigOverrides` is set) if that fails. That works well when the frontend and backend share an origin, but it breaks down when they don't — a relative request to `/api/v3/admin/config` simply can't reach a backend hosted on another domain.

`additionalConfigs` solves this generically: it's a list of URLs (relative or absolute) that together define the configuration. Because the URLs can be absolute, this is enough to point a frontend at a backend on a completely different origin, without any code changes — just a deployment-time config value.

---

## How it works

Config loading happens in two stages.

### 1. Backend first (unchanged)

The frontend first requests `/api/v3/admin/config`. If that succeeds, the backend config is used as-is and **`additionalConfigs` is not resolved**: a list stored in the backend config is ignored. Everything below only applies when the frontend falls back to its local files.

### 2. Bootstrap from local files

`config.json` is loaded and, if it sets `allowConfigOverrides: true`, `config.override.json` is loaded and merged on top of it, exactly as before. The `additionalConfigs` list is read from this merged result. As with every other array, a list in `config.override.json` **replaces** the one in `config.json`.

If there is no list (missing or empty), the merged `config.json` + `config.override.json` is the final configuration. This is the behaviour without the feature, so existing deployments are unaffected.

### 3. Build the config from the listed sources

If there is a list, the final configuration is **only** the listed sources, merged in list order (later entries win):

- `config.json` and `config.override.json` contribute their content only if they are listed. A local file that isn't listed was only used to find the list. Listing a file that was already loaded doesn't fetch it again.
- `additionalConfigs` inside any listed source is ignored: only the bootstrap stage decides what is loaded, so a remote source can never make the frontend fetch further URLs.
- At most the first **3 entries** of the list are processed, including `config.json` and `config.override.json`; extras are ignored and a warning is logged.
- A source that fails to load (network error, 2s timeout, non-2xx) is treated as an empty config and logged to the console — it doesn't fail the rest of the load.

The merge uses lodash's `mergeWith`: plain objects are merged key by key, but when both the existing and incoming value for a key are arrays, the incoming array **replaces** the existing one wholesale — arrays are never concatenated or merged element-by-element.

```ts
export interface AppConfigInterface {
  // ...
  additionalConfigs?: string[];
}
```

### Where the list comes from

| `allowConfigOverrides` | List in `config.json` | List in `config.override.json` | List used | `config.override.json` content applied? |
|---|---|---|---|---|
| `false` | none | (not read) | none — no list | no |
| `false` | yes | (ignored) | `config.json`'s | only if listed |
| `true` | none | none | none — no list | yes |
| `true` | none | yes | `config.override.json`'s | only if listed |
| `true` | yes | yes | `config.override.json`'s | only if listed |
| `true` | yes | none | `config.json`'s | only if listed |

Notes:

- With `allowConfigOverrides: false`, `config.override.json` can still be listed. Its content is then merged like any other source, but its own `additionalConfigs` is ignored.
- With `allowConfigOverrides: true` and a list that doesn't include `config.override.json`, the override's values are silently dropped. If the override defines the list, it has to list itself for its other keys to apply.
- Because arrays are replaced, `config.override.json` can't add one entry to the list in `config.json`; it has to repeat the whole list.
- `"additionalConfigs": []` in `config.override.json` replaces the list from `config.json` with an empty one, which switches the feature off (back to plain `config.json` + `config.override.json`).

---

## Usage patterns

### Pattern A — Keeping an untracked source URL out of git

`config.override.json` is git-ignored, so it's the natural place for deployment-specific values, including the URL of an extra source. Put the full list in the override and have it list itself:

```jsonc
// config.json (tracked)
{
  "allowConfigOverrides": true,
  "facility": "My Facility"
}
```

```jsonc
// config.override.json (untracked)
{
  "additionalConfigs": [
    "/assets/config.json",
    "/assets/config.override.json",
    "https://ext.example.org/ext.json"
  ],
  "lbBaseURL": "http://127.0.0.1:3000"
}
```

The result is `config.json`, then `config.override.json`, then `ext.json`, so `ext.json` wins for any key it sets. Reorder the list to change precedence, or drop `/assets/config.json` to use the tracked defaults only for bootstrapping.

If the source URLs can be tracked, put the list in `config.json` instead and leave `config.override.json` for plain values:

```jsonc
// config.json (tracked)
{
  "allowConfigOverrides": true,
  "additionalConfigs": [
    "/assets/config.json",
    "/assets/config.override.json",
    "https://ext.example.org/ext.json"
  ]
}
```

**Trade-off**: the more sources you layer, the harder it is to answer "why is this field set to this value?". The list at least tells you every source and its order in one place; keep it short and the sources non-overlapping where possible.

### Pattern B — Single source of truth in the backend (recommended for cross-origin setups)

If the frontend and backend live on different domains and you just want the backend to be authoritative for the whole configuration, make the local `config.json` just a pointer:

```json
{
  "additionalConfigs": ["https://backend.example.org/api/v3/admin/config"]
}
```

The relative `/api/v3/admin/config` request fails (wrong origin), so the frontend falls back to this `config.json`. Since `config.json` isn't in its own list, it only provides the list, and the backend's response becomes the whole configuration.

This gives you:
- A single, backend-owned source of truth for config content.
- No admin UI login required to point the frontend at a different backend — the pointer lives in the frontend's own deployed `config.json` (image asset / ConfigMap / etc.), controlled by your deployment pipeline like any other infra setting.

Prefer this pattern unless you have a concrete reason to compose config from more than one source.

---

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| Additional config never seems to load | Check the fetched URL is reachable from the *browser* (CORS, absolute vs. relative path) — requests are made client-side. Also check that the same-origin `/api/v3/admin/config` request fails: if it succeeds, the backend config is used and the list is not resolved. |
| Values from `config.json` or `config.override.json` are missing | Once a list is set, a local file only contributes if it's listed — check that `config.json` / `config.override.json` appear in the list (within the first 3 entries). |
| A list in a fetched source has no effect | Only `config.json` and (with `allowConfigOverrides`) `config.override.json` can set the list. |
| A fragment's array field isn't appearing | Arrays are replaced, not merged — a later source setting the same array key overwrites earlier entries entirely. |
| A 4th (or later) entry never loads | Only the first 3 entries are processed, local files included; check the console for the "more than 3 entries" warning. |
| Values don't seem to update after a backend change | Config is (re-)fetched on page load; there's no live-reload of the listed sources. |
