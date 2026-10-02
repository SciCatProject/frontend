# Dataset Detail Section Appearance

## Overview

Each section (tile) of the customized dataset detail page renders a header with
an icon and a background color. Both can be configured per section through the
`icon` and `headerColor` properties of a `datasetDetailComponent.customization`
entry, either in the configuration file or through the Admin Dashboard at
`/admin/config-edit`.

Both properties are optional and fully backward compatible: sections without
them keep the default icon (`description`) and the default header color (`header-5`).

## Configuration Options

| Property      | Type   | Description                                                       |
| ------------- | ------ | ------------------------------------------------------------------|
| `icon`        | string | Material icon name displayed in the section header, e.g. `science`|
| `headerColor` | string | Section header background color: a theme palette name             |

The `statusBanner` section type has no header, so both properties are ignored
for it.

### Icons

`icon` accepts any [Material icon](https://fonts.google.com/icons) ligature
name. When it is not set, the icon is defaulted to `description`

### Header colors

`headerColor` accepts a theme palette name.

Palette names refer to the palettes of the active theme, so the header follows
the deployment theme and also gets a matching text color:

`primary`, `accent`, `warn`, `header-1`, `header-2`, `header-3`,
`header-4`, `header-5`

## Usage Examples

Section with a custom icon and a theme palette color:

```json
{
  "type": "regular",
  "label": "Contact Information",
  "order": 2,
  "col": 2,
  "row": 1,
  "icon": "contact_mail",
  "headerColor": "header-2",
  "fields": [
    { "element": "text", "source": "principalInvestigator", "order": 0 },
    { "element": "linky", "source": "contactEmail", "order": 1 }
  ]
}
```

## Related Documentation

- [Dataset Detail Tile Authorization](dataset-detail-tile-authorization.md)
