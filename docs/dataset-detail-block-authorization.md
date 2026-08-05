# Dataset Detail Block Authorization

## Table of Contents

1. [Overview](#1-overview)
   - [Restricted Tiles Indicator](#restricted-tiles-indicator)
2. [Configuration Options](#2-configuration-options)
3. [Admin Dashboard Settings](#3-admin-dashboard-settings)
4. [JSON Form Schema](#4-json-form-schema)
5. [Usage Examples](#5-usage-examples)
6. [Authorization Rules](#6-authorization-rules)
7. [Troubleshooting](#7-troubleshooting)
8. [FAQ](#8-faq)

---

## 1. Overview

### What is Dataset Detail Block Authorization?

The Dataset Detail Block Authorization feature allows administrators to control which user groups can view specific sections (blocks) within the dataset detail page. This enables fine-grained access control over dataset information, ensuring sensitive data is only visible to authorized users.

### Target Audience

- **Administrators**: Configure block-level authorization through the Admin Dashboard
- **Developers**: Understand the schema and integration points
- **End Users**: View only the blocks they have permission to see

### Purpose

Dataset Detail Block Authorization serves as:
- Access control mechanism for sensitive dataset metadata
- Customizable information visibility per user group
- Compliance with data governance policies
- Flexible configuration without code changes

### Key Features

- Block-level authorization for dataset detail components
- Group-based access control using user's `accessGroups`
- Special `#all` group for public access
- Configurable through Admin Dashboard or configuration files
- Fully backward compatible with existing configurations

### Component Architecture

The authorization system consists of:
1. **Frontend Configuration**: Defined in `frontend.config.jsonforms.json`
2. **Admin Dashboard**: Visual configuration interface at `/admin/config-edit`
3. **Runtime Configuration**: Loaded from backend endpoint `/api/v3/runtime-config/frontendConfig` or local `config.json`
4. **Dataset Detail Component**: Renders blocks based on user authorization

### Restricted Tiles Indicator

**How It Works:**

The dataset detail component can optionally display a visual indicator (lock icon) on tiles that have restricted access. This feature is controlled by the `tileRestrictedIconVisibility` configuration flag.

- When **enabled** (`true`), a lock icon (`lock_outline`) appears in the header of any tile that has restricted access
- When **disabled** (`false` or undefined), no lock icons are displayed
- A tile is considered "restricted" if it has an `authorization` array defined that does NOT include `"#all"`
- The lock icon includes a tooltip with the text "Restricted access"

**Configuration:**
```json
{
  "datasetDetailComponent": {
    "enableCustomizedComponent": true,
    "tileRestrictedIconVisibility": true,
    "customization": [...]
  }
}
```

**Behavior:**
- Tiles with no `authorization` keys is equivalend to set `authorization: ["#all"]` → No lock icon (visible to all)
- Tiles with `authorization: ["#all"]`, aka no restriction → No lock icon (visible to all)
- Tiles with `authorization: ["group1", "group2"]` → Lock icon displayed (restricted)
- Tiles with `authorization: []` → Lock icon displayed (hidden from all)

**Files Involved:**
- `src/app/state-management/models/index.ts` - Configuration interface
- `src/app/datasets/dataset-detail-dynamic/dataset-detail-dynamic.component.ts` - Logic
- `src/app/datasets/dataset-detail-dynamic/dataset-detail-dynamic.component.html` - Template
- `src/app/datasets/dataset-detail-dynamic/dataset-detail-dynamic.component.scss` - Styling
- `src/app/admin/schema/frontend.config.jsonforms.json` - Admin UI schema

---

## 2. Configuration Options

### Configuration Structure

The authorization can be configured at **two levels**:

#### Level 1: Global Dataset Detail Component Authorization (NEW)

Added to `datasetDetailComponent` object itself:

```json
{
  "datasetDetailComponent": {
    "enableCustomizedComponent": true,
    "authorization": ["admin", "scientists"],
    "customization": [...]
  }
}
```

When set at this level, **all blocks** within the dataset detail component require the specified authorization to be visible.

#### Level 2: Individual Block Authorization

Configured on each customization item within the `customization` array:

```json
{
  "datasetDetailComponent": {
    "enableCustomizedComponent": true,
    "customization": [
      {
        "type": "regular",
        "label": "General Information",
        "order": 1,
        "row": 1,
        "col": 10,
        "authorization": ["#all"],
        "fields": [...]
      },
      {
        "type": "scientificMetadata",
        "label": "Scientific Metadata",
        "order": 2,
        "row": 2,
        "col": 10,
        "authorization": ["scientists", "admin"],
        "source": "scientificMetadata"
      }
    ]
  }
}
```

### Configuration Keys

| Key | Type | Required | Default | Description |
|-----|------|----------|---------|-------------|
| `datasetDetailComponent.authorization` | string[] | No | `null` | Global authorization for all blocks in the component |
| `datasetDetailComponent.customization[].authorization` | string[] | No | `["#all"]` | Block-specific authorization |
| `datasetDetailComponent.tileRestrictedIconVisibility` | boolean | No | `false` | Show lock icon on tiles with restricted access |

### Configuration Locations

#### Backend Configuration (Recommended)

**Endpoint**: `GET /api/v3/runtime-config/frontendConfig`

The backend provides the frontend configuration. This is the primary configuration source in production deployments.

#### Local Configuration Files

**Primary File**: `src/assets/config.json`

```json
{
  "datasetDetailComponent": {
    "enableCustomizedComponent": true,
    "authorization": ["admin"],
    "customization": [...]
  }
}
```

**Override File**: `src/assets/config.override.json` (requires `allowConfigOverrides: true`)

Used for environment-specific overrides without modifying the main configuration.

### TypeScript Interface

**File**: `src/app/state-management/models/index.ts`

```typescript
export interface DatasetDetailComponentConfig {
  enableCustomizedComponent: boolean;
  customization: CustomizationItem[];
  authorization?: string[];  // Global authorization for all blocks
  tileRestrictedIconVisibility?: boolean;  // Show lock icon on restricted tiles
}

export interface CustomizationItem {
  type: CustomizationType;
  label: string;
  order: number;
  row: number;
  col: number;
  fields?: Field[];
  source?: string;
  options?: AttachmentOptions;
  viewMode?: viewModeOptions;
  authorization?: string[];  // Block-specific authorization
}
```

### Admin Interface Configuration

**Path**: Admin Dashboard > Frontend Config > Dataset Detail Component section

The admin UI provides form controls through JSONForms:
- **Enable Customized Component**: Toggle switch for `enableCustomizedComponent`
- **Show Restricted Tiles Indicator**: Toggle switch for `tileRestrictedIconVisibility`
- **Authorization**: Array of strings input for global block authorization
- **Customization**: List with detail view for configuring individual blocks

---

## 3. Admin Dashboard Settings

### Accessing the Configuration

1. Navigate to `/admin` in your SciCat Frontend application
2. Click on **Frontend Config** or **Configuration Edit**
3. Scroll to the **Dataset Detail Component** section

### Admin Dashboard Form Structure

The Admin Dashboard uses JSONForms with Angular Material renderers to provide a user-friendly interface for configuration.

#### Dataset Detail Component Section

![Admin Dashboard - Dataset Detail Component Section](images/admin-dashboard-dataset-detail-component.png)

**Form Fields:**

| Field | Type | Description |
|-------|------|-------------|
| Enable Customized Component | Toggle | Enables/disables custom block configuration |
| Authorization | Array Input | Global authorization groups for all blocks |
| Customization Configuration | List Editor | Configure individual blocks with their own authorization |

#### Adding Global Authorization

1. In the **Dataset Detail Component** section
2. Locate the **Authorization** field
3. Click **Add** or start typing to add group names
4. Press Enter or comma to add each group
5. Save the configuration

![Authorization Array Input](images/admin-authorization-array-input.png)

#### Configuring Block-Specific Authorization

1. In the **Customization Configuration** list
2. Expand or add a new block configuration
3. Locate the **Authorization** field for that block
4. Add the desired groups
5. Save the configuration

![Block Authorization Configuration](images/admin-block-authorization.png)

### Available Control Types

The Dataset Detail Component supports the following block types:

| Type | Description | Authorization Supported |
|------|-------------|----------------------|
| `regular` | Custom fields block | Yes |
| `scientificMetadata` | Scientific metadata viewer | Yes |
| `datasetJsonView` | JSON view of dataset | Yes |
| `attachments` | Attachments section | Yes |

### Admin Dashboard Features

- **Live Preview**: Changes are reflected in the form immediately
- **JSON Preview**: Click "Json Preview" button to see the raw JSON configuration
- **Export**: Download the current configuration as a JSON file
- **Save**: Persist changes to the backend

---

## 4. JSON Form Schema

### Schema Definition

The JSON Form Schema is defined in `src/app/admin/schema/frontend.config.jsonforms.json`

#### Schema Section (datasetDetailComponent)

```json
"datasetDetailComponent": {
  "type": "object",
  "properties": {
    "enableCustomizedComponent": { "type": "boolean" },
    "tileRestrictedIconVisibility": {
      "type": "boolean",
      "title": "Show Restricted Tiles Indicator",
      "description": "Display a lock icon on tiles with restricted access"
    },
    "authorization": {
      "type": "array",
      "items": { "type": "string" }
    },
    "customization": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "label": { "type": "string" },
          "type": {
            "type": "string",
            "enum": ["scientificMetadata", "attachments", "datasetJsonView", "regular"]
          },
          "order": { "type": "number" },
          "row": { "type": "number" },
          "col": { "type": "number" },
          "viewMode": {
            "type": "string",
            "enum": ["table", "json", "tree"]
          },
          "options": {
            "type": "object",
            "properties": {
              "limit": { "type": "number" },
              "size": {
                "type": "string",
                "enum": ["small", "medium", "large"]
              }
            }
          },
          "fields": {
            "type": "array",
            "default": [{ "element": "text", "source": "", "order": 0 }],
            "items": {
              "type": "object",
              "properties": {
                "element": {
                  "type": "string",
                  "enum": ["text", "copy", "tag", "linky", "date", "internalLink"]
                },
                "source": { "type": "string" },
                "order": { "type": "number" }
              },
              "required": ["element", "source", "order"]
            }
          },
          "authorization": {
            "type": "array",
            "items": { "type": "string" }
          }
        }
      }
    }
  }
}
```

#### UI Schema Section (Dataset Detail Component)

```json
{
  "type": "Group",
  "label": "Dataset Detail Component",
  "options": {
    "expandable": true
  },
  "elements": [
    {
      "type": "Control",
      "scope": "#/properties/datasetDetailComponent/properties/enableCustomizedComponent"
    },
    {
      "type": "Control",
      "scope": "#/properties/datasetDetailComponent/properties/authorization"
    },
    {
      "type": "ListWithDetail",
      "label": "Customization Configuration",
      "scope": "#/properties/datasetDetailComponent/properties/customization",
      "options": {
        "detail": {
          "type": "VerticalLayout",
          "elements": [
            {
              "type": "HorizontalLayout",
              "elements": [
                { "type": "Control", "scope": "#/properties/label" },
                { "type": "Control", "scope": "#/properties/type" },
                { "type": "Control", "scope": "#/properties/order" },
                { "type": "Control", "scope": "#/properties/row" },
                { "type": "Control", "scope": "#/properties/col" },
                {
                  "type": "Control",
                  "scope": "#/properties/viewMode",
                  "rule": {
                    "effect": "SHOW",
                    "condition": {
                      "scope": "#/properties/type",
                      "schema": {
                        "const": "scientificMetadata"
                      }
                    }
                  }
                }
              ]
            },
            {
              "type": "VerticalLayout",
              "label": "Attachments Options",
              "elements": [...],
              "rule": { ... }
            },
            {
              "type": "Control",
              "label": "Fields",
              "scope": "#/properties/fields",
              "rule": { ... },
              "options": { ... }
            }
          ]
        }
      }
    }
  ]
}
```

### Custom Renderers

The Admin Dashboard uses custom JSONForms renderers:

- `AccordionArrayLayoutRendererComponent`: For expandable array sections
- `ExpandGroupRendererComponent`: For expandable groups
- `ArrayLayoutRendererCustom`: For custom array layouts

These are registered in `src/app/admin/admin-config-edit/admin-config-edit.component.ts`

---

## 5. Usage Examples

### Example 1: Global Authorization for All Blocks

**Use Case**: Restrict entire dataset detail component to specific groups

**Configuration (Admin Dashboard)**:
1. Navigate to Dataset Detail Component section
2. Set **Authorization** to: `["admin", "data-managers"]`
3. Save configuration

**Configuration (JSON)**:
```json
{
  "datasetDetailComponent": {
    "enableCustomizedComponent": true,
    "authorization": ["admin", "data-managers"],
    "customization": [...]
  }
}
```

**Result**: All blocks in the dataset detail page are only visible to users in the "admin" or "data-managers" groups.

---

### Example 2: Block-Specific Authorization

**Use Case**: Show general info to everyone, but restrict scientific metadata to scientists

**Configuration (Admin Dashboard)**:
1. In Customization Configuration
2. Add two blocks:
   - Block 1: "General Information" with authorization `["#all"]`
   - Block 2: "Scientific Metadata" with authorization `["scientists", "admin"]`
3. Save configuration

**Configuration (JSON)**:
```json
{
  "datasetDetailComponent": {
    "enableCustomizedComponent": true,
    "customization": [
      {
        "type": "regular",
        "label": "General Information",
        "order": 1,
        "row": 1,
        "col": 10,
        "authorization": ["#all"],
        "fields": [...]
      },
      {
        "type": "scientificMetadata",
        "label": "Scientific Metadata",
        "order": 2,
        "row": 2,
        "col": 10,
        "authorization": ["scientists", "admin"],
        "source": "scientificMetadata",
        "viewMode": "table"
      }
    ]
  }
}
```

**Result**: 
- All users see "General Information" block
- Only users in "scientists" or "admin" groups see "Scientific Metadata" block

---

### Example 3: Combined Global and Block Authorization

**Use Case**: Global restriction with block-level overrides

**Configuration**:
```json
{
  "datasetDetailComponent": {
    "enableCustomizedComponent": true,
    "authorization": ["admin", "scientists"],
    "customization": [
      {
        "type": "regular",
        "label": "Public Summary",
        "order": 1,
        "authorization": ["#all"],
        "fields": [...]
      },
      {
        "type": "scientificMetadata",
        "label": "Detailed Metadata",
        "order": 2,
        "authorization": ["admin"],
        "source": "scientificMetadata"
      }
    ]
  }
}
```

**Result**:
- "Public Summary" block: Visible to all users (block-level override)
- "Detailed Metadata" block: Visible only to "admin" users (block-level restriction)
- Other blocks: Follow global authorization (admin and scientists)

---

### Example 4: Hidden Block

**Use Case**: Hide a block from all users

**Configuration**:
```json
{
  "type": "attachments",
  "label": "Internal Attachments",
  "order": 3,
  "authorization": [],
  "source": "attachments"
}
```

**Result**: The "Internal Attachments" block is hidden from all users, including administrators.

---

### Example 5: Multiple Group Requirements

**Use Case**: Block visible to users in any of multiple groups

**Configuration**:
```json
{
  "type": "regular",
  "label": "Sensitive Data",
  "authorization": ["group-a", "group-b", "group-c"],
  "fields": [...]
}
```

**Result**: Block is visible to users who are members of **any** of the specified groups (OR logic).

---

## 6. Authorization Rules

### Authorization Evaluation Logic

The authorization system follows this evaluation order:

1. **Block-level authorization** (if present) takes precedence
2. **Global datasetDetailComponent authorization** (if present)
3. **Default**: `["#all"]` (visible to all authenticated users)

### Authorization Matching

| User Groups | Block Authorization | Visible? |
|-------------|---------------------|----------|
| `["user"]` | `["#all"]` | Yes |
| `["user"]` | `["admin"]` | No |
| `["user", "scientist"]` | `["scientist", "admin"]` | Yes (OR logic) |
| `["user"]` | `[]` | No (explicit deny) |
| `["user"]` | `null`/`undefined` | Yes (defaults to `["#all"]`) |
| Not authenticated | Any | No (requires authentication) |

### Special Groups

| Group | Description |
|-------|-------------|
| `#all` | All authenticated users can view the block |

### Important Notes

- The authorization check uses the user's `accessGroups` from their profile
- If a user is not authenticated, they will not see any blocks
- The `#all` group is a special keyword and cannot be used as a regular group name
- Multiple groups can be specified; the user needs to be a member of **at least one** of them (OR logic)
- Empty array `[]` explicitly hides the block from all users
- This feature is fully backward compatible: existing configurations without `authorization` fields will continue to work, with all blocks visible to all users

---

## 7. Troubleshooting

### Issue: Blocks Not Visible to Expected Users

**Symptoms**:
- Authorized users cannot see blocks they should have access to
- All blocks are hidden

**Diagnosis**:

1. **Check user's accessGroups**:
   ```typescript
   // In browser console (after login)
   const user = JSON.parse(localStorage.getItem('currentUser'));
   console.log('User groups:', user?.accessGroups);
   ```

2. **Check active configuration**:
   ```typescript
   // Inject AppConfigService
   const config = this.appConfigService.getConfig();
   console.log('Dataset Detail Config:', config.datasetDetailComponent);
   ```

3. **Verify backend configuration**:
   - Use Swagger UI or API client to call `/api/v3/runtime-config/frontendConfig`
   - Verify the `datasetDetailComponent` section is correct

**Solutions**:

1. **Verify user group membership**:
   - Ensure the user is assigned to the correct groups in the backend
   - Check with your administrator

2. **Check configuration syntax**:
   - Validate JSON syntax using a JSON validator
   - Ensure `authorization` is an array of strings

3. **Verify configuration is loaded**:
   - Check browser console for configuration load errors
   - Verify the backend endpoint is accessible

4. **Check for typos**:
   - Ensure group names match exactly (case-sensitive)
   - Verify the `#all` keyword is spelled correctly

---

### Issue: "No applicable renderer found!" Error in Admin Dashboard

**Symptoms**:
- The authorization field shows "No applicable renderer found!" in the admin form
- Cannot edit the authorization array

**Cause**: The JSONForms renderer doesn't have a default control for array of strings.

**Solution**: Update the uiSchema to use `ListWithDetail` for the authorization field:

```json
{
  "type": "ListWithDetail",
  "scope": "#/properties/datasetDetailComponent/properties/authorization",
  "options": {
    "detail": {
      "type": "VerticalLayout",
      "elements": [
        {
          "type": "Control",
          "scope": "#/properties"
        }
      ]
    }
  }
}
```

This change should be made in `src/app/admin/schema/frontend.config.jsonforms.json`.

---

### Issue: Authorization Changes Not Applied

**Symptoms**:
- Configuration saved but changes not reflected
- Old authorization rules still in effect

**Diagnosis**:

1. Check if configuration was saved successfully
2. Verify the backend received the update
3. Check if frontend configuration cache needs clearing

**Solutions**:

1. **Force refresh**: Clear browser cache and reload
2. **Check backend logs**: Verify the configuration update was persisted
3. **Verify endpoint**: Ensure `/api/v3/runtime-config/frontendConfig` returns the updated configuration
4. **Restart application**: Some deployments may require application restart

---

### Issue: All Blocks Hidden After Adding Authorization

**Symptoms**:
- All blocks disappeared after adding authorization
- Only administrators can see blocks

**Cause**: Likely set global authorization without including `#all` or appropriate groups.

**Solution**:

1. Add `#all` to include all authenticated users:
   ```json
   "authorization": ["#all", "admin"]
   ```

2. Or add the appropriate user groups:
   ```json
   "authorization": ["users", "scientists", "admin"]
   ```

3. Or remove the authorization field to revert to default behavior

---

### Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| Using `#all` as a regular group name | Use only as a special keyword, not as an actual group |
| Case sensitivity in group names | Use exact case matching |
| Forgetting to save configuration | Click "Save" button in admin dashboard |
| Not including `#all` for public blocks | Add `["#all"]` or omit authorization field |
| Using `null` instead of `[]` for hidden blocks | Use empty array `[]` for explicit deny |
| Expecting AND logic between groups | Authorization uses OR logic (any group matches) |

---

## 8. FAQ

### Q: What happens if I don't configure authorization?

**A**: If you don't add any authorization configuration, all blocks are **visible to all authenticated users** by default. This maintains backward compatibility with existing deployments.

### Q: Can I use authorization without enabling customized components?

**A**: No. The `authorization` field is only applicable when `enableCustomizedComponent` is set to `true`. If customized components are disabled, the default dataset detail view is used, and block-level authorization does not apply.

### Q: Can I use both global and block-level authorization?

**A**: Yes. When both are configured:
- Block-level authorization takes precedence for that specific block
- Global authorization applies to blocks without their own authorization
- This allows for a mix of globally restricted and block-specific access controls

### Q: How do I make a block visible to everyone?

**A**: Use `["#all"]` for the block's authorization, or omit the authorization field entirely (which defaults to `["#all"]`).

### Q: How do I completely hide a block?

**A**: Set the authorization to an empty array: `"authorization": []`. This explicitly denies access to all users.

### Q: Can I use wildcards or patterns in group names?

**A**: No. Group names must match exactly. Wildcards, patterns, or regular expressions are not supported. The user must be a member of the exact group name specified.

### Q: How does authorization work with the backend permission system?

**A**: The dataset detail block authorization is a **frontend-only** feature that controls UI visibility. It does not affect backend API access. Users with appropriate backend permissions can still access data through the API. This feature only controls what is displayed in the frontend UI.

### Q: Can I customize the "No authorization" message?

**A**: Currently, blocks that a user is not authorized to see are simply hidden (not rendered). There is no visible message indicating that content is hidden. This is by design to avoid revealing the existence of sensitive content.

### Q: How do I show a lock icon on restricted tiles?

**A**: Enable the `tileRestrictedIconVisibility` configuration flag:
```json
{
  "datasetDetailComponent": {
    "enableCustomizedComponent": true,
    "tileRestrictedIconVisibility": true,
    "customization": [...]
  }
}
```
When enabled, tiles with restricted access (authorization defined and not including `"#all"`) will display a lock icon (`lock_outline`) in their header with a "Restricted access" tooltip.

### Q: How do I test my authorization configuration?

**A**: 
1. Log in as different users with various group memberships
2. Navigate to a dataset detail page
3. Verify which blocks are visible for each user
4. Check browser console for any authorization-related errors
5. Use the JSON Preview in the admin dashboard to verify your configuration

### Q: Can I use this feature with custom blocks?

**A**: Yes. Any custom block type (regular, scientificMetadata, datasetJsonView, attachments) supports the authorization field.

### Q: What's the maximum number of groups I can specify?

**A**: There is no hard limit on the number of groups. However, for performance and maintainability, it's recommended to keep the list reasonable (under 20 groups).

### Q: Can I use this feature with the default (non-customized) dataset detail view?

**A**: No. Authorization only works when `enableCustomizedComponent` is `true` and you have defined custom blocks in the `customization` array. The default dataset detail view does not support block-level authorization.

### Q: How do I migrate from an old configuration?

**A**: Existing configurations without authorization fields will continue to work unchanged. All blocks will be visible to all authenticated users. To add authorization:
1. Add the `authorization` field to `datasetDetailComponent` or individual blocks
2. Test with different user groups
3. Gradually restrict access as needed

### Q: Where can I find the user's group memberships?

**A**: User group memberships are managed in the backend user management system. In SciCat, users typically belong to groups defined in the backend configuration or database. Check with your system administrator for group management details.

---

## Appendix A: Related Documentation

- [About Page Configuration](about-page-configuration.md)
- [Help Page Configuration](help-page-configuration.md)
- [Frontend Configuration Testing](frontend-configuration-testing.md)

---

## Appendix B: File References

| File | Purpose |
|------|---------|
| `src/app/admin/schema/frontend.config.jsonforms.json` | JSONForms schema and UI schema definition |
| `src/app/admin/admin-config-edit/admin-config-edit.component.ts` | Admin dashboard component |
| `src/app/admin/admin-config-edit/admin-config-edit.component.html` | Admin dashboard template |
| `src/app/app-config.service.ts` | Configuration service and interfaces |
| `src/app/state-management/models/index.ts` | TypeScript model interfaces |
| `src/app/datasets/dataset-detail-dynamic/dataset-detail-dynamic.component.ts` | Dataset detail component logic |
| `src/app/datasets/dataset-detail-dynamic/dataset-detail-dynamic.component.html` | Dataset detail component template |
| `src/app/datasets/dataset-detail-dynamic/dataset-detail-dynamic.component.scss` | Dataset detail component styling |
| `src/assets/config.json` | Default frontend configuration |
| `src/assets/config.override.json` | Environment-specific configuration overrides |

---

*Last updated: July 25, 2026*
*Documentation for SciCat Frontend Dataset Detail Block Authorization Feature*

