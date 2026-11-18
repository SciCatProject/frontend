# Changelog

## Upgrading

The migration is a script, separate from the frontend code, that updates the file in
place. `migrate:latest` runs the latest migration of the `migrations` folder:

```sh
npm run migrate:latest
```

Without a path it migrates `src/assets/config.json` and, when it exists,
`src/assets/config.override.json`. Pass the files to migrate after `--`:

```sh
npm run migrate:latest -- /path/to/config.json
npm run migrate:latest -- --dry-run   # only print the result
npm run migrate:latest -- --revert    # back to the flat structure
```

A value already in the new structure wins over its legacy key, and running it
twice changes nothing.

Keys that are new in the structure and missing from the file are added with an
empty value (`enabled: false`, `actions: []`, `customization: []`) for
`configurableActions.datafiles`, `configurableActions.datasetDetails`,
`configurableActions.batch` and `componentCustomization.dataset`, and are listed
in a warning so you can fill them in. The empty values do not change what the
frontend does. They would replace the value of an earlier source when files are
merged with `additionalConfigs`, so they are not added to
`src/assets/config.override.json`. For any other file that only holds part of
the configuration, such as a per-component file, pass `--no-new-keys`:

```sh
npm run migrate:latest -- src/assets/dataset.config.json --no-new-keys
```

`--revert` moves the keys back to the flat structure and gives the renamed keys
their previous names (`sitetitle`, `JupyterHubUrl` and `siteIcon`, which the
previous version ignored). The new keys that still have the empty value the migration gave them are
deleted, so they do not turn into new previous-structure keys. An explicit
`false` or `[]` is deleted too, since the previous version treats it as no key. Dropped keys are
not restored, and `localColumns` is not recreated: its columns go back to
`defaultDatasetsListSettings.columns`.

## 18-11-2026

### Changed

- **Breaking: configuration is grouped per component.** Related settings now
  live in one object instead of a flat list of keys, and the frontend no longer
  reads the previous keys. Migrate the configuration before deploying this
  version, see "Upgrading" above.

  | Previous key                                       | New key                                                    |
  | -------------------------------------------------- | ---------------------------------------------------------- |
  | `datafilesActionsEnabled`                          | `configurableActions.datafiles.enabled`                    |
  | `datafilesActions`                                 | `configurableActions.datafiles.actions`                    |
  | `datasetActions`                                   | `configurableActions.datasetDetails.actions`               |
  | `batchActionsEnabled`                              | `configurableActions.batch.enabled`                        |
  | `batchActions`                                     | `configurableActions.batch.actions`                        |
  | `defaultDatasetsListSettings`                      | `defaultSettings.datasets`                                 |
  | `defaultProposalsListSettings`                     | `defaultSettings.proposals`                                |
  | `datasetDetailComponent.enableCustomizedComponent` | `componentCustomization.dataset.enabled`                   |
  | `datasetDetailComponent.customization`             | `componentCustomization.dataset.customization`             |
  | `datasetDetailComponent.authorization`             | `componentCustomization.dataset.authorization`             |
  | `datasetDetailComponent.tileRestrictedIconVisible` | `componentCustomization.dataset.tileRestrictedIconVisible` |
  | `datasetDetailComponent.tileRestrictedIconGroups`  | `componentCustomization.dataset.tileRestrictedIconGroups`  |
  | `localColumns` (deprecated)                        | `defaultSettings.datasets.columns`                         |

  `configurableActions` has one group per component (`datasetDetails`,
  `datafiles`, `batch`), each with an `enabled` flag and an `actions` list.
  `componentCustomization` is keyed by component, so other components can be
  customized the same way later.

- The actions on the dataset details page now use
  `configurableActions.datasetDetails.enabled`. They used to be gated by
  `datafilesActionsEnabled`; the migration copies that value, so migrated
  deployments see no change.
- The admin configuration editor reads and writes the new structure, and can now
  edit `siteHeaderLogo`, `siteHeaderLogoUrl`, `siteLoginLogo`,
  `siteLoginBackground`, `thumbnailFetchLimitPerPage`, `maxFileUploadSizeInMb`,
  `fileserverBaseURL`, `additionalConfigs`,
  `metadataFloatFormat`, `metadataFloatFormatEnabled` and `labelMaps`.

### Fixed

- Misspelled keys in the sample configurations were silently ignored. The
  migration renames them:

  | Previous key    | Key read by the frontend |
  | --------------- | ------------------------ |
  | `sitetitle`     | `siteTitle`              |
  | `JupyterHubUrl` | `jupyterHubUrl`          |
  | `siteIcon`      | `siteHeaderLogo`         |

### Removed

- Obsolete configuration keys that no component reads. The migration drops
  them, and they can be removed from any configuration: `accessTokenPrefix`, `fileColorEnabled`,
  `metadataPreviewEnabled`, `editDatasetSampleEnabled`, `editPublishedData`,
  `gettingStarted`, `ingestManual`, `helpMessages`,
  `multipleDownloadUseAuthToken`, `pidSearchMethod`, `supportEmail`, `multipleDownloadAction`,
  `multipleDownloadEnabled`, `fileserverButtonLabel`, `searchPublicDataEnabled`,
  `datasetActionsEnabled`, `datasetDetailsActionsEnabled`,
  `datasetDetailsActions`, `datasetSelectionActionsEnabled`,
  `datasetSelectionActions`, `selectionActionsEnabled` and `selectionActions`.
