# Pagination position

## What this setting does

SciCat list pages can show a page navigation control above the table, below the table, or in both places. The facility-wide frontend configuration controls this behavior for all list pages that use the shared SciCat table.

## Available options

Set `paginationPosition` in the frontend configuration to one of these values:

```json
"paginationPosition": "top"
```

| Setting | Result |
|---|---|
| `top` | The page navigation control appears above the table only. |
| `bottom` | The page navigation control appears below the table only. |
| `both` | Page navigation controls appear above and below the table. |

Example configuration showing the current default behavior:

```json
{
  "paginationPosition": "both"
}
```

## Where it applies

The setting applies consistently to SciCat list pages that use the shared table, such as:

- Datasets
- Proposals
- Samples
- Instruments
- Jobs
- Files
- Published data

It does not change separate screens that use their own table or pagination control.

## What does not change

Changing the position does not change how pagination works. The following remain the same:

- Available page sizes
- Page-size options
- Number of records loaded per page
- Server-side or client-side paging
- Sorting and filtering
- Page navigation behavior

## Default behavior

If `paginationPosition` is not configured, SciCat displays both controls, as it did previously. Unsupported values also fall back to showing both controls.

Users do not need to change any personal settings. The option is configured globally by the facility and applies to all users.
