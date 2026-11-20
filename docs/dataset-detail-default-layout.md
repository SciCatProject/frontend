# Dataset details layout

The dataset details page is rendered by the configurable dataset details component. The former static dataset details component is no longer selected by the application.

## Default layout

The frontend configuration contains a `datasetDetailComponent` default layout in `src/assets/config.json`. It includes the status banner, general information, creator information, file information, related documents, derived data, attachments, scientific metadata, and the dataset JSON view. This layout is equivalent to the former dataset details page and can be overridden by a facility configuration.

```json
{
  "datasetDetailComponent": {
    "customization": [
      {
        "type": "regular",
        "label": "General Information",
        "order": 0,
        "row": 1,
        "col": 10,
        "fields": [
          { "element": "text", "source": "datasetName", "order": 0 },
          { "element": "linky", "source": "description", "order": 1 },
          { "element": "copy", "source": "pid", "order": 2 }
        ]
      }
    ]
  }
}
```

The complete default is intentionally kept in the frontend configuration. This configuration is mandatory: if `datasetDetailComponent` or its non-empty `customization` array is missing or invalid, application startup fails with a configuration error.

> `datasetDetailComponent` is mandatory. The `dataset-details` component is always used, and its configured layout must be supplied through `customization`.

## Migration

1. Remove the obsolete `enableCustomizedComponent` setting from existing configurations.
2. Start from the `datasetDetailComponent` block in `src/assets/config.json` (or `CI/e2e/frontend.config.e2e.json` for the end-to-end configuration).
3. Customize the `customization` sections as required.
4. Do not add a separate static dataset details component; all new layout changes belong in the configuration.

The `datasetDetailComponent` configuration is mandatory. Missing or invalid configuration causes the application to fail during startup.
