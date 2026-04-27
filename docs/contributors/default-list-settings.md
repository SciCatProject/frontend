# Default List Settings (Frontend)

This page explains where to configure default list behavior in the frontend Admin Settings UI. 

Currently it only covers default sorting.

## Where To Find It
Open the user menu and go to **Admin Settings**.

![Admin Settings](admin_settings_menu.png)
_Figure 1: Open Admin Settings from the user menu._

Then open **List settings**

![List settings overview](admin_list_settings_overview.png)
_Figure 2: List settings overview._
## List Settings Structure

There are two sections:

- **Default Datasets List Settings**
- **Default Proposals List Settings**

## Default Sorting

Default sorting is configured at column level with the `sort` property.

Accepted values:
- `asc`
- `desc`

Rules:
- Define `sort` on only one column per list section.
- If `sort` is not defined, the table falls back to `createdAt` in descending order.

![Sort field in columns list](sort_field_columns_list.png)
_Figure 3: Sort field in Default Datasets List Settings._
