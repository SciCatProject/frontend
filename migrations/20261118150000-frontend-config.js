#!/usr/bin/env node
/**
 * Migrates the frontend configuration file from the flat structure to the
 * structure grouped per component, fixes misspelled keys and drops keys the
 * frontend does not read anymore. See CHANGELOG.md for the full list.
 *
 * A value already present in the new structure wins over its legacy key, and
 * running it twice changes nothing.
 *
 * Run it with `npm run migrate:latest`, which runs the latest migration of this
 * folder and updates the files in place:
 *   npm run migrate:latest
 *   npm run migrate:latest -- path/to/config.json
 *   npm run migrate:latest -- --dry-run   print only
 *   npm run migrate:latest -- --revert    flat structure
 *   npm run migrate:latest -- --no-new-keys   do not add the empty new keys
 *
 * Without a path, src/assets/config.json and src/assets/config.override.json
 * are migrated (the override file only when it exists).
 *
 * Keys that are new in the structure and missing from the file are added with
 * an empty value, and reported with a warning. The empty value never changes
 * the behaviour of the frontend. It would replace the value of an earlier
 * source when files are merged with additionalConfigs, so it is not added to
 * the override file by default; use --no-new-keys for any other file that only
 * holds part of the configuration (for example a per-component file).
 */

// [legacy path, new path].
// revert, maps back.
const MOVED_KEYS = [
  ["datafilesActionsEnabled", "configurableActions.datafiles.enabled"],
  ["datafilesActions", "configurableActions.datafiles.actions"],
  ["datafilesActionsEnabled", "configurableActions.datasetDetails.enabled"],
  ["datasetActions", "configurableActions.datasetDetails.actions"],
  ["batchActionsEnabled", "configurableActions.batch.enabled"],
  ["batchActions", "configurableActions.batch.actions"],
  ["defaultDatasetsListSettings.columns", "defaultSettings.datasets.columns"],
  ["defaultDatasetsListSettings.filters", "defaultSettings.datasets.filters"],
  ["defaultDatasetsListSettings.conditions", "defaultSettings.datasets.conditions"],
  ["defaultProposalsListSettings.columns", "defaultSettings.proposals.columns"],
  ["defaultProposalsListSettings.filters", "defaultSettings.proposals.filters"],
  ["defaultProposalsListSettings.conditions","defaultSettings.proposals.conditions"],
  ["datasetDetailComponent.enableCustomizedComponent","componentCustomization.dataset.enabled"],
  ["datasetDetailComponent.customization","componentCustomization.dataset.customization"],
  ["datasetDetailComponent.authorization","componentCustomization.dataset.authorization"],
  ["datasetDetailComponent.tileRestrictedIconVisible","componentCustomization.dataset.tileRestrictedIconVisible"],
  ["datasetDetailComponent.tileRestrictedIconGroups","componentCustomization.dataset.tileRestrictedIconGroups"],
];

// Misspelled or renamed keys. --revert restores the previous names
const RENAMED_KEYS = [
  ["sitetitle", "siteTitle"],
  ["JupyterHubUrl", "jupyterHubUrl"],
  ["siteIcon", "siteHeaderLogo"],
  ["localColumns", "defaultSettings.datasets.columns"],
];

// Keys no component reads anymore. They are not restored by --revert.
const OBSOLETE_KEYS = [
  "accessTokenPrefix",
  "fileColorEnabled",
  "metadataPreviewEnabled",
  "editDatasetSampleEnabled",
  "editPublishedData",
  "gettingStarted",
  "ingestManual",
  "helpMessages",
  "multipleDownloadUseAuthToken",
  "pidSearchMethod",
  "supportEmail",
  "multipleDownloadAction",
  "multipleDownloadEnabled",
  "fileserverButtonLabel",
  "searchPublicDataEnabled",
  "datasetActionsEnabled",
  "datasetDetailsActionsEnabled",
  "datasetDetailsActions",
  "datasetSelectionActionsEnabled",
  "datasetSelectionActions",
  "selectionActionsEnabled",
  "selectionActions",
];

// Keys that are new in the structure, with the empty value added when they are
// missing. Each one is neutral: it is what the frontend does without the key.
const NEW_KEYS = [
  ["configurableActions.datafiles.enabled", false],
  ["configurableActions.datafiles.actions", []],
  ["configurableActions.datasetDetails.enabled", false],
  ["configurableActions.datasetDetails.actions", []],
  ["configurableActions.batch.enabled", false],
  ["configurableActions.batch.actions", []],
  ["componentCustomization.dataset.enabled", false],
  ["componentCustomization.dataset.customization", []],
];

// The override file only holds part of the configuration, so an empty new key
// would replace the value of config.json when they are merged.
const DEFAULT_FILES = [
  { file: "src/assets/config.json", addNewKeys: true },
  { file: "src/assets/config.override.json", addNewKeys: false },
];

const fs = require("fs");

const isObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const get = (object, path) =>
  path
    .split(".")
    .reduce((node, key) => (isObject(node) ? node[key] : undefined), object);

function set(object, path, value) {
  const keys = path.split(".");
  const last = keys.pop();
  const parent = keys.reduce(
    (node, key) => (isObject(node[key]) ? node[key] : (node[key] = {})),
    object,
  );
  parent[last] = value;
}

// Removes the value and the parent objects left empty by it.
function unsetAndPrune(object, path) {
  const keys = path.split(".");
  const chain = [object];
  for (const key of keys.slice(0, -1)) {
    const next = chain[chain.length - 1][key];
    if (!isObject(next)) return;
    chain.push(next);
  }
  for (let i = keys.length - 1; i >= 0; i--) {
    delete chain[i][keys[i]];
    if (Object.keys(chain[i]).length) break;
  }
}

// Copies the value of `from` to `to` unless `to` is set. Returns if it existed.
function copy(config, from, to, report) {
  const value = get(config, from);
  if (value === undefined) return false;
  if (get(config, to) === undefined) set(config, to, value);
  report.push(`${from} -> ${to}`);
  return true;
}

/**
 * @param {Record<string, unknown>} data frontend configuration, any structure
 * @returns the configuration in the new structure and what was changed.
 */
function migrateConfig(data, { addNewKeys = true } = {}) {
  const config = structuredClone(data);
  const moved = [];
  const renamed = [];
  const added = [];

  MOVED_KEYS.forEach(([from, to]) => copy(config, from, to, moved));
  RENAMED_KEYS.forEach(([from, to]) => copy(config, from, to, renamed));
  if (addNewKeys) {
    for (const [path, empty] of NEW_KEYS) {
      if (get(config, path) !== undefined) continue;
      set(config, path, structuredClone(empty));
      added.push(path);
    }
  }

  const obsolete = OBSOLETE_KEYS.filter((key) => key in config);
  for (const [from] of [...MOVED_KEYS, ...RENAMED_KEYS]) {
    delete config[from.split(".")[0]];
  }
  obsolete.forEach((key) => delete config[key]);

  const changed = [moved, renamed, obsolete, added].some((list) => list.length);
  return { config, moved, renamed, obsolete, added, changed };
}

/**
 * Reverts the moved and renamed keys to the previous structure and names, and
 * deletes the new keys that still have the empty value the migration gave them.
 * Obsolete keys are not restored.
 */
function revertConfig(data) {
  const config = structuredClone(data);
  const reverted = [];
  const removed = [];

  for (const [path, empty] of NEW_KEYS) {
    if (JSON.stringify(get(config, path)) === JSON.stringify(empty)) {
      unsetAndPrune(config, path);
      removed.push(path);
    }
  }
  for (const [legacy, current] of MOVED_KEYS) {
    copy(config, current, legacy, reverted);
  }
  MOVED_KEYS.forEach(([, current]) => unsetAndPrune(config, current));

  const movedPaths = new Set(MOVED_KEYS.map(([, current]) => current));
  for (const [legacy, current] of RENAMED_KEYS) {
    if (!movedPaths.has(current) && copy(config, current, legacy, reverted)) {
      unsetAndPrune(config, current);
    }
  }

  const changed = Boolean(reverted.length || removed.length);
  return { config, reverted, removed, changed };
}

function run(args) {
  const dryRun = args.includes("--dry-run");
  const revert = args.includes("--revert");
  const noNewKeys = args.includes("--no-new-keys");
  const explicitFiles = args.filter((arg) => !arg.startsWith("--"));
  const targets = explicitFiles.length
    ? explicitFiles.map((file) => ({ file, addNewKeys: !noNewKeys }))
    : DEFAULT_FILES.map((target) => ({
        ...target,
        addNewKeys: target.addNewKeys && !noNewKeys,
      }));

  let failed = false;
  for (const { file, addNewKeys } of targets) {
    if (!fs.existsSync(file)) {
      if (explicitFiles.length) {
        console.error(`${file}: file not found`);
        failed = true;
      }
      continue;
    }

    let raw;
    let data;
    try {
      raw = fs.readFileSync(file, "utf8");
      data = JSON.parse(raw);
    } catch (error) {
      console.error(`${file}: not a valid JSON file (${error.message})`);
      failed = true;
      continue;
    }

    const result = revert
      ? revertConfig(data)
      : migrateConfig(data, { addNewKeys });
    const labels = revert
      ? { reverted: "reverted", removed: "removed the empty new keys" }
      : {
          moved: "moved",
          renamed: "WARNING renamed",
          obsolete: "WARNING dropped",
          added: "WARNING added with an empty value, to fill in",
        };
    if (!result.changed) {
      console.log(`${file}: nothing to ${revert ? "revert" : "migrate"}`);
      continue;
    }

    // keep the line endings of the file, to not turn every line into a diff
    const eol = raw.includes("\r\n") ? "\r\n" : "\n";
    const json = (JSON.stringify(result.config, null, 2) + "\n").replace(
      /\n/g,
      eol,
    );
    if (dryRun) process.stdout.write(json);
    else fs.writeFileSync(file, json);
    console.log(`${file}: ${dryRun ? "would be updated" : "updated"}`);
    for (const [key, label] of Object.entries(labels)) {
      const entries = result[key];
      if (entries.length) {
        const log = label.startsWith("WARNING") ? console.warn : console.log;
        log(`  ${label}: ${entries.join(", ")}`);
      }
    }
  }

  return failed ? 1 : 0;
}

if (require.main === module) {
  process.exit(run(process.argv.slice(2)));
}

module.exports = { run, migrateConfig, revertConfig };
