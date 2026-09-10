# Additional Configs

## Overview

`additionalConfigs` is an optional array field in the frontend configuration that lets the frontend fetch and merge in more configuration from other URLs at runtime, after its normal config resolution.

**Target Audience**: Administrators deploying SciCat Frontend, and developers working on `AppConfigService`.

**Key file**: [`src/app/app-config.service.ts`](../src/app/app-config.service.ts)

### Why it exists

By default the frontend tries to load its configuration from the backend at `/api/v3/admin/config` (a same-origin, relative request), falling back to the local `src/assets/config.json` (optionally merged with `src/assets/config.override.json` when `allowConfigOverrides` is set) if that fails. That works well when the frontend and backend share an origin, but it breaks down when they don't — a relative request to `/api/v3/admin/config` simply can't reach a backend hosted on another domain.

`additionalConfigs` solves this generically: it's a list of URLs (relative or absolute) whose contents get fetched and merged into the current configuration. Because the URLs can be absolute, this is enough to point a frontend at a backend on a completely different origin, without any code changes — just a deployment-time config value.

---

## How it works

1. The frontend resolves its initial configuration as it always has (backend `/api/v3/admin/config`, or local `config.json`/`config.override.json` on failure).
2. If that resolved configuration has an `additionalConfigs` array, each URL in it is fetched (2s timeout) and merged on top of the current configuration, in list order.
3. At most **3 entries** are processed; extras are ignored and logged as an error. This bounds the number of requests a single load can trigger.
4. A URL that fails to load (network error, timeout, non-2xx) is treated as an empty config and logged to the console — it doesn't fail the rest of the load.

The merge uses the same array-replace semantics as the rest of config loading (via lodash's `mergeWith`): plain objects are merged key by key, but when both the existing and incoming value for a key are arrays, the incoming array **replaces** the existing one wholesale — arrays are never concatenated or merged element-by-element.

```ts
export interface AppConfigInterface {
  // ...
  additionalConfigs?: string[];
}
```

This is purely additive: `allowConfigOverrides` / `config.override.json` still work exactly as before and are unaffected by this feature.

---

## Usage patterns

### Pattern A — Composing config from multiple partial sources

Use `additionalConfigs` to layer several partial config fragments on top of each other, similarly to how `config.override.json` has always worked, but generalized to any number of URLs (local or remote):

```json
{
  "lbBaseURL": "http://127.0.0.1:3000",
  "facility": "My Facility",
  "additionalConfigs": [
    "/assets/config.override.json",
    "https://backend.example.org/api/v3/admin/config"
  ]
}
```

Here the base `config.json` sets its own defaults, then each URL is fetched and merged in order, so later entries win for any key they set. This is useful when you want a shared baseline plus environment- or facility-specific fragments layered on top.

**Trade-off**: the more sources you layer, the harder it is to answer "why is this field set to this value?" — you have to trace it through however many fragments were merged, in order. Keep the list short and the fragments non-overlapping where possible.

### Pattern B — Single source of truth in the backend (recommended for cross-origin setups)

If the frontend and backend live on different domains and you just want the backend to be authoritative for the whole configuration, keep the local `config.json` down to essentially just a pointer:

```json
{
  "additionalConfigs": ["https://backend.example.org/api/v3/admin/config"]
}
```

Walking through the load: the relative `/api/v3/admin/config` fetch fails (wrong origin), so the frontend falls back to this local `config.json`, which contributes almost nothing on its own. `loadAdditionalConfigs` then fetches the absolute backend URL and merges it in once — since the local side is nearly empty, there's nothing to actually conflict with, so in practice the backend's response *becomes* the configuration rather than being merged with anything meaningful.

This gives you:
- A single, backend-owned source of truth for config content (no ambiguity about merge order).
- No admin UI login required to point the frontend at a different backend — the pointer lives in the frontend's own deployed `config.json` (image asset / ConfigMap / etc.), controlled by your deployment pipeline like any other infra setting.

Prefer this pattern unless you have a concrete reason to compose config from more than one source.

---

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| Additional config never seems to load | Check the fetched URL is reachable from the *browser* (CORS, absolute vs. relative path) — `additionalConfigs` requests are made client-side, not server-side. |
| A fragment's array field isn't appearing | Arrays are replaced, not merged — a later source setting the same array key overwrites earlier entries entirely. |
| A 4th (or later) entry in `additionalConfigs` never loads | Only the first 3 entries are processed; check the console for the "more than 3 entries" error. |
| Values don't seem to update after a backend change | Config is (re-)fetched on page load; there's no live-reload of `additionalConfigs` sources. |
