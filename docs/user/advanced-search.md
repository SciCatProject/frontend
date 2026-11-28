# Advanced search

## What this setting does

The list pages can filter in two ways. The facility-wide frontend configuration picks one of them, they are not shown together.

| `advancedSearchEnabled` | Datasets page                                                                                                                            | Samples page                                 |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| `true`                  | The **Advanced search** next to the search box, with the applied filters above the table. No side panel, the table uses the whole width. | The Advanced search and its applied filters. |
| `false`                 | The **Filters** panel at the side of the table, with the condition filter for scientific metadata in it. No Advanced search.             | The condition filter of the search card.     |

## How to set it

Set `advancedSearchEnabled` in the frontend configuration:

```json
{
  "advancedSearchEnabled": false
}
```

The option can also be edited in the admin configuration form.

## Default behavior

If `advancedSearchEnabled` is not configured, the advanced filter is used. Only `false` brings the side panel and the old condition filter back.

## What to know when switching

- The **Create Dataset** card (`addDatasetEnabled`) and the shopping cart card (`shoppingCartEnabled` with `shoppingCartOnHeader` set to `false`) are shown in the side column. With the advanced filter the column stays for a logged-in user who can see one of them, otherwise the table takes the whole width.
- Filters that only the side panel has, such as My data and Public data, are not available with the advanced filter.
- The predefined conditions of the configuration (`conditions` in `defaultDatasetsListSettings` and `defaultSamplesListSettings`) are for the old condition filter only. The Advanced search does not use them, it has its own fields and start values, see below.
- Both filters save the user's conditions in the same place. Filters on dataset fields and filters with Exclude are made by the Advanced search only, the old condition filter does not understand them.

Users do not need to change any personal settings. The option is configured globally by the facility and applies to all users.

## Choosing the fields

Which fields the Advanced search offers, the rows its dialog opens with and the filters applied when the page loads are set with `advancedSearchFields`. See [Advanced search fields](advanced-search-fields.md).
