# Advanced search fields

This page explains how a facility chooses the fields of the **Advanced search** on the datasets page, and how to give them start values.

The setting is `advancedSearchFields` in the frontend configuration. It is used by the Advanced search only, so the Advanced search has to be on (`advancedSearchEnabled`). The side panel and its old condition filter do not read it.

## Quick example

```json
"advancedSearchFields": {
  "datasets": [
    { "key": "pid", "relation": "IN" },
    { "key": "keywords", "relation": "IN", "value": "neutron" },
    { "key": "creationLocation", "relation": "CONTAINS" },
    { "key": "creationTime", "relation": "RANGE", "value": "2026-01-01" },
    { "key": "scientificMetadata.detector.distance", "relation": "GREATER_THAN", "value": 5, "unit": "mm" }
  ]
}
```

With this configuration, a user who has no saved filters of their own:

- sees two filters applied when the page loads, shown as chips: `keywords` is `neutron`, and `creationTime` is from 2026-01-01 on. The detector distance has a value as well, so it is a third chip: greater than 5 mm.
- gets a dialog that opens with a row for each of the five fields, in this order. The rows with a value are filled in, the others are empty and ready to be filled.
- can pick `pid`, `keywords`, `creationLocation` or `creationTime` in the field list of a new row, and **Scientific metadata** for any other metadata key.

## Where to set it

Either in the frontend configuration file (`frontend.config.json` of the backend) or in the frontend through **Admin Settings**, in the **General Settings** section of the frontend configuration form.

Only `datasets` is read. The keys `samples`, `proposals` and `instruments` are accepted, but nothing uses them yet.

## A field

Each entry of the list is one field:

| Property   | Required                | What it is                                                                                                    |
| ---------- | ----------------------- | ------------------------------------------------------------------------------------------------------------- |
| `key`      | yes                     | The dataset field, for example `keywords`, or a scientific metadata key written as `scientificMetadata.<key>` |
| `relation` | yes for a dataset field | How the field is matched, see below                                                                           |
| `value`    | no                      | The value the field starts with. A field with a value is a filter as soon as the page loads                   |
| `unit`     | no                      | Scientific metadata only: the unit of the value                                                               |

The order of the list is the order of the rows in the dialog and of the entries in the field list. It is not sorted.

### Dataset fields

`key` is the name of a field of the dataset, exactly as it is stored, for example `pid`, `datasetName`, `keywords`, `ownerGroup`, `creationLocation`, `type`, `proposalIds`, `sampleIds`, `instrumentIds`, `creationTime`, `startTime`, `endTime`, `runNumber`.

`relation` decides what the user types and how it is matched:

| `relation` | The user gets                               | It finds                                                           | Use it for                                                                          | `value`                                                      |
| ---------- | ------------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `CONTAINS` | one text box                                | datasets where the field contains the text, in upper or lower case | text fields: `datasetName`, `description`, `owner`, `creationLocation`, `runNumber` | a text: `"V20"`                                              |
| `IN`       | one text box for values separated by commas | datasets where the field is exactly one of the values              | identifiers and lists: `pid`, `keywords`, `type`, `ownerGroup`, `proposalIds`       | `"neutron, beam"` or `["neutron", "beam"]`                   |
| `RANGE`    | two date pickers, from and to               | datasets with a date between the two, both days included           | dates: `creationTime`, `startTime`, `endTime`                                       | `"2026-01-01, 2026-02-01"` or `["2026-01-01", "2026-02-01"]` |

Choose the relation that fits the data:

- `RANGE` only works on dates. On a text field the user gets date pickers that never find anything.
- `IN` needs the whole value: `bea` does not find `beam`. Use `CONTAINS` when a part of the text should be enough.
- Numbers of a dataset, such as `size`, are not supported as fields.
- Dates are written as `yyyy-mm-dd`. Either bound of a range can be left out: `"2026-01-01"` means from that day on, `", 2026-02-01"` means up to that day.

A `key` that is not a field of the dataset makes the backend reject the query, and the dataset list does not load. Check the spelling against a dataset in the API.

### Scientific metadata

A metadata key is written with the prefix `scientificMetadata.` and the key after it. A dot goes one level down, so a nested key is written with dots:

| Stored in the dataset                                      | `key` in the configuration             |
| ---------------------------------------------------------- | -------------------------------------- |
| `"temperature": { "value": 20, "unit": "celsius" }`        | `scientificMetadata.temperature`       |
| `"detector": { "distance": { "value": 5, "unit": "mm" } }` | `scientificMetadata.detector.distance` |

For scientific metadata, `relation` is the operator the row starts with. The user can still change it in the dialog, but the key stays fixed:

| `relation`              | Operator in the dialog                                     |
| ----------------------- | ---------------------------------------------------------- |
| `EQUAL_TO`              | Equals (also when `relation` is left out)                  |
| `GREATER_THAN`          | Greater than                                               |
| `LESS_THAN`             | Less than                                                  |
| `GREATER_THAN_OR_EQUAL` | Greater than or equal to                                   |
| `LESS_THAN_OR_EQUAL`    | Less than or equal to                                      |
| `RANGE`                 | Between, with `value` as two numbers: `"1, 3"` or `[1, 3]` |

`unit` is optional. With a unit, the value is converted to the base unit and compared with the base value that is stored with the metadata, so `5 mm` also finds `0.5 cm`. A unit that cannot be converted is compared as it is written, so it only finds metadata stored with exactly that unit.

Metadata fields are rows of the dialog only. They are not listed in the field list: a user who wants another metadata key picks **Scientific metadata** and chooses the key there.

## Values that are applied when the page loads

A field with a `value` is applied when the datasets page loads, and shows as a chip above the table, as if the user had applied it. This happens for a user who has no saved filters of their own:

- a visitor who is not logged in, on every visit
- a logged-in user, until they apply or clear filters themselves. From then on their own filters are used, also when they cleared them all.

Fields without a value are not filters. They are empty rows in the dialog, they don't show as chips, and they are kept when the user applies the dialog.

When no field has a value, nothing is applied and the dialog simply opens with an empty row for each field.

## Labels

The name of a dataset field comes from `labelsLocalization.dataset`, the same labels the table uses. It is shown in the field list, on the rows of the dialog and on the chips:

```json
"labelsLocalization": {
  "dataset": {
    "pid": "Dataset Id",
    "creationTime": "Created"
  }
}
```

Without a label, the built-in name of the field is used, or its key.

A scientific metadata field always shows its key, for example `detector.distance`, on its row and on its chip.

## Without the setting

When `advancedSearchFields` is missing, or none of its entries is valid, the Advanced search uses its built-in fields:

- **field list:** PID, Group, Keywords, Proposal IDs, Sample IDs, Instrument IDs, Type, Creation time, Start time, End time, Location, Dataset name, Owner, Description
- **rows of the dialog:** the fields the side panel has, all empty: Location, PID, Group, Type, Keywords and Creation time

An entry without `key`, or a dataset field with a `relation` other than `CONTAINS`, `IN` or `RANGE`, is left out. If every entry is left out, the built-in fields are used.

## Not used by the Advanced search

The `conditions` of `defaultDatasetsListSettings` and `defaultSamplesListSettings` are the start filters of the old condition filter. The Advanced search does not read them; use `value` here instead.
