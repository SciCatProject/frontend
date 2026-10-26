# Scientific Metadata Context Menu Configuration

The scientific metadata context menu is available for each metadata entry in the dataset details view. It provides actions for copying metadata values and, when enabled, adding a metadata entry as a dataset table column.

## Admin configuration page

The settings are available at:

**Admin → Configuration → Scientific Metadata Context Menu**

The available settings are:

- **Enable Context Menu**
- **Enable "Copy Name"**
- **Enable "Copy Machine Name"**
- **Enable "Copy Value"**
- **Enable "Copy Value with Unit"**
- **Enable "Copy Full Entry"**
- **Enable "Add as Column"**

Save the configuration after changing the settings. The changes apply when the frontend configuration is loaded again.

## Configuration structure

The same settings can be supplied in the frontend configuration using the `scientificMetadataContextMenu` object:

```json
{
  "scientificMetadataContextMenu": {
    "enabled": true,
    "copyName": true,
    "copyMachineName": true,
    "copyValue": true,
    "copyFullValue": true,
    "copyFullEntry": true,
    "addAsColumn": true
  }
}
```

Depending on the deployment, frontend configuration can be provided through the local frontend configuration file or by the backend configuration endpoint. The local configuration file is:

```text
src/assets/config.json
```

## Defaults and disabling options

All context-menu settings are optional. If a setting is omitted, it defaults to disabled. Set a setting to `true` to enable it.

To hide the complete menu, set `enabled` to `false`:

```json
{
  "scientificMetadataContextMenu": {
    "enabled": false
  }
}
```

Individual actions can be disabled independently. For example, the following configuration leaves only value-copy actions available:

```json
{
  "scientificMetadataContextMenu": {
    "copyName": false,
    "copyMachineName": false,
    "copyFullEntry": false
  }
}
```

The context-menu trigger is hidden when the complete menu is disabled.

## Add as column

The **Add as column** action is controlled by two settings. Both must allow the action:

```json
{
  "addScientificMetadataKeysAsColumn": true,
  "scientificMetadataContextMenu": {
    "addAsColumn": true
  }
}
```

`addScientificMetadataKeysAsColumn` enables the application feature, while `scientificMetadataContextMenu.addAsColumn` controls whether the action is shown in the metadata context menu.

If either setting is `false`, the **Add as column** action is not available.

## Action behavior

| Setting | Clipboard value or behavior |
| --- | --- |
| `copyName` | Copies the human-readable metadata name, falling back to the machine name. |
| `copyMachineName` | Copies the metadata key. |
| `copyValue` | Copies the raw metadata value. |
| `copyFullValue` | Copies the value together with its unit when a unit is present. |
| `copyFullEntry` | Copies the complete original metadata entry. |
| `addAsColumn` | Adds the metadata entry as a column in the dataset table. |

Object values are copied as JSON. Scalar values are copied as text.

## Examples

### Disable the complete context menu

```json
{
  "scientificMetadataContextMenu": {
    "enabled": false
  }
}
```

### Show only basic value copying

```json
{
  "scientificMetadataContextMenu": {
    "copyName": false,
    "copyMachineName": false,
    "copyFullValue": false,
    "copyFullEntry": false,
    "addAsColumn": false
  }
}
```

### Enable all actions, including Add as column

```json
{
  "addScientificMetadataKeysAsColumn": true,
  "scientificMetadataContextMenu": {
    "enabled": true,
    "copyName": true,
    "copyMachineName": true,
    "copyValue": true,
    "copyFullValue": true,
    "copyFullEntry": true,
    "addAsColumn": true
  }
}
```

## Test coverage

The configuration and menu behavior are covered by the Cypress test:

```text
cypress/e2e/datasets/datasets-scientific-metadata-copy.cy.js
```

The test verifies that configured actions are shown or hidden, that the contextual menu is present, that **Add as column** is available when enabled, and that configured copy actions produce the expected clipboard value.
