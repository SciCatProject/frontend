# Side filter panel

## What this setting does

The datasets page has a **Filters** panel at the side of the table (My data, Public data and the filters such as Location, Pid, Group and Keyword). The facility-wide frontend configuration can turn this panel off.

When it is off, the panel is gone and the table uses the whole width of the page.

## How to set it

Set `sideFilterEnabled` in the frontend configuration:

```json
{
  "sideFilterEnabled": false
}
```

| Setting | Result                                                                    |
| ------- | ------------------------------------------------------------------------- |
| `true`  | The Filters panel is shown at the side of the table.                      |
| `false` | The Filters panel is hidden and the table is stretched to the full width. |

The option can also be edited in the admin configuration form.

## Default behavior

If `sideFilterEnabled` is not configured, the panel is shown, as it was before. Only `false` turns it off.

## What stays

The option only hides the Filters panel. Everything else on the datasets page works as before:

- The search box above the table and the Advanced search button next to it
- The filters in the table column headers
- Sorting, paging and the table settings

The **Create Dataset** card (`addDatasetEnabled`) and the shopping cart card (`shoppingCartEnabled` with `shoppingCartOnHeader` set to `false`) are shown in the same side column. For a logged-in user who can see one of them, the column stays and the table does not use the full width. Without these cards, for example with the default configuration, the table takes the whole width.

Filters that can only be set in the panel, such as My data and Public data, are not available while it is off. The panel's own filters in a shared link (`searchQuery` in the address) are not applied either.

## Scope

Currently `sideFilterEnabled` works for the datasets page only.

The plan is to apply it to every list page with a side filter panel, such as proposals, samples and instruments, so that the UI behaves the same everywhere. The one option will then switch the panel on all of these pages. When that happens, the pages that follow will be listed here.

Users do not need to change any personal settings. The option is configured globally by the facility and applies to all users.
