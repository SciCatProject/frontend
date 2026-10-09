# About | Help Page Configuration

## 1. Overview

The About page is an informational page in SciCat Frontend that displays customizable HTML content to users. It's typically used to provide information about your facility, organization, or the SciCat deployment itself.

The Help page is a user assistance page in SciCat Frontend that displays customizable HTML content to provide guidance, documentation, and support information to users.

### Target Audience

- **Administrators**: Configure and customize the About page content
- **Developers**: Integrate or extend the About|Help page functionality
- **End Users**: View facility information / help documentation through the About/Help page

### Purpose

The About page serves as:
- Facility/organization information hub, and Data Policy Information.

The Help page serves as:
- User guide and documentation hub

### Key Features

- Enable/disable via configuration
- Custom HTML content support
- Header icon with tooltip
- Default fallback content

### Prerequisites

- SciCat Frontend application deployed
- Access to configuration files or admin interface

### Dependencies

- Angular `DomSanitizer` for HTML rendering
- `AppConfigService` for configuration management
- Flex Layout (`fxFlex`) for responsive design

---

## 2. Configuration Options

### Configuration Keys

| Key | Type | Required | Default | Description |
|-----|------|----------|---------|-------------|
| `aboutSettings.enabled` | boolean | No | `false` | Enables/disables the About page feature |
| `aboutSettings.htmlContent` | string | No | Default message | HTML content to display on the About page |
| `helpSettings.enabled` | boolean | No | `false` | Enables/disables the Help page feature |
| `helpSettings.htmlContent` | string | No | Default message | HTML content to display on the Help page |

### Configuration Locations

#### Configuration File

The frontend ships with a local configuration file, which is used for testing and reference

**File**: `src/assets/config.json`

```json
{
  "aboutSettings":{
    "enabled": true,
    "htmlContent": "<h1>About Our Facility</h1><p>Custom content here</p>"
  },
  "helpSettings": {
    "enabled": true,
    "htmlContent": "<h1>Help Center</h1><p>Get assistance here</p>"
  }
}
```

#### Backend Configuration

Most deployments rely on the backend to provide the frontend configuration.
This configuration takes priority.

**Endpoint**: `GET /api/v3/admin/config`

### Admin Interface

**Path**: Admin Settings > Frontend Config > Header section

The admin UI provides form controls:
- **About Enabled**: Toggle switch for `aboutSettings.enabled`
- **About HTML Content**: Textarea (5 rows) for `aboutSettings.htmlContent`
- **Help Enabled**: Toggle switch for `helpSettings.enabled`
- **Help HTML Content**: Textarea (5 rows) for `helpSettings.htmlContent`

### TypeScript Interface

**File**: `src/app/app-config.service.ts`

```typescript
export interface AppConfigInterface {
  aboutSettings?: AboutSettings;
  helpSettings?: HelpSettings;
}

export interface AboutSettings {
  enabled?: boolean;
  htmlContent?: string;
}

export interface HelpSettings {
  enabled?: boolean;
  htmlContent?: string;
}
```

### Default Behaviour

#### About Page

- About icon is hidden from header
- If user appends `/about` the main URL, the FE will still redirect to about Page.
- If not specified in configuration and is enabled, `htmlContent` defaults to `"No about content available."`
- If not specified in configuration and is not enabled, `htmlContent` defaults to `"About page is disabled"`

#### Help Page

- Help icon is hidden from header
- If user appends `/help` the main URL, the FE will still redirect to about Page.
- If not specified in configuration and is enabled, `htmlContent` defaults to `"No help content available."`
- If not specified in configuration and is not enabled, `htmlContent` defaults to `"Help page is disabled"`


## 3. Usage Examples

### Example 0: Disabled (Default State)

**Configuration**:
```json
{
  "enabled": false
}
```

**Result**:
- Icon is hidden from header
- If user appends `/about` or `/help` the main URL, the FE will show "<About|Help> page is disabled" respectively
---

### Example 1: Enable with Default Content

**Configuration**:
```json
{
  "enabled": true
}
```

**Result**:
- Icon (info/help) appears in header
- Page shows default content: "No about/help content available."

---

### Example 2: Enable with Custom HTML

**Configuration**:
```json
{
  "enabled": true,
  "htmlContent": "<h1>My Facility Data Catalog</h1><p>Welcome to our scientific data management platform.</p>"
}
```

**Result**:
- Icon appears in header
- Page displays custom HTML content

---

### Example 3: Rich HTML with Styling and Images

**Configuration**:
```json
{
  "enabled": true,
  "htmlContent": "<div style='text-align: center; padding: 20px;'><img src='/assets/images/facility-logo.png' alt='Logo' style='max-width: 200px; margin-bottom: 20px;'><h2>National Research Facility</h2><p style='font-size: 16px; line-height: 1.6;'>The National Research Facility provides cutting-edge scientific instruments and data management solutions for researchers worldwide.</p><p><strong>Contact:</strong> <a href='mailto:data@facility.org'>data@facility.org</a></p><p><em>Version 2.1.0</em></p></div>"
}
```

**Result**:
- Centered layout with logo
- Facility description
- Contact email link
- Version information

---

### Example 4: HTML with Links and Lists

**Configuration**:
```json
{
  "enabled": true,
  "htmlContent": "<h2>About This Deployment</h2><p>This SciCat instance is configured for the Physics Department.</p><h3>Key Features</h3><ul><li>Custom dataset metadata schema</li><li>Integrated with local authentication</li><li>Connected to department storage</li></ul><h3>Learn More</h3><p><a href='https://physics.university.edu/scicat' target='_blank' rel='noopener noreferrer'>Physics Department SciCat Guide</a></p>"
}
```

---


### Best Practices for Content

1. **Keep it concise**: Users expect quick information, not a novel
2. **Use semantic HTML**: Proper heading hierarchy (`<h1>`, `<h2>`, etc.)
3. **Make it scannable**: Use lists, short paragraphs, clear sections
4. **Include contact information**: Help users know who to reach out to
5. **Link to external resources**: Documentation, user guides, etc.
6. **Test responsiveness**: Content should work on mobile and desktop
7. **Avoid JavaScript**: Custom JS in HTML content may not execute properly

---


## 5. FAQ Section

### Q: What happens if I don't configure the About/Help page?

**A**: The About page is **disabled by default**. If you don't add any configuration, the About/Help icon won't appear in the header, and users cannot access the page through the UI.

### Q: Can I use the About/Help page without the header icon?

**A**: Yes, but users would need to know the direct URL (`/about` or `/help`). The header icon is the primary way users discover and access the page. Consider keeping it visible for discoverability.

### Q: How do I completely remove the About/Help page feature?

**A**: Set `enabled: false` or simply don't include the configuration keys `("aboutsettings", "helpSettings")`. The feature is disabled by default.

### Q: Can I use Angular components or directives in the HTML content?

**A**: No. The HTML content is rendered using `[innerHTML]`, which only processes raw HTML. Angular directives like `*ngIf`, `*ngFor`, `routerLink`, etc. will not work. Use standard HTML elements and attributes.

### Q: Is the HTML content sanitized for security?

**A**: The component uses Angular's `DomSanitizer.bypassSecurityTrustHtml()`, which means **the HTML is trusted and rendered as-is**. This is a security consideration:

- Only administrators should be able to modify the configuration
- Ensure HTML content comes from trusted sources
- Avoid including user-generated content in the configuration

### Q: Can I use external CSS or JavaScript files?

**A**: External CSS via `<link>` tags may work, but external JavaScript via `<script>` tags **will not execute** due to Angular's security model. Use inline styles instead.

### Q: Can I customize the About/Help icon in the header?

**A**: The icon is currently hardcoded as `mat-icon color="primary"> info </mat-icon>`. To customize, you would need to modify the header component template in `src/app/_layout/app-header/app-header.component.html`.

### Q: What's the maximum size for the HTML content?

**A**: The upper limit is around 15Mb, but it is suggested that you limit the About Html Content to few KB.

### Q: Can I use iframes in the About page content?

**A**: Technically yes, but:
- Security restrictions may apply
- Consider the user experience (iframes may not work on mobile)
- Prefer linking to external content instead
