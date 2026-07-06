# Help Page Configuration

## 1. Overview

### What is the Help Page?

The Help page is a user assistance page in SciCat Frontend that displays customizable HTML content to provide guidance, documentation, and support information to users.

### Target Audience

- **Administrators**: Configure and customize the Help page content
- **Developers**: Integrate or extend the Help page functionality
- **End Users**: Access help and documentation through the Help page

### Purpose

The Help page serves as:
- User guide and documentation hub
- Getting started instructions
- Feature explanations
- Support information center
- FAQ and troubleshooting reference

### Key Features

- Enable/disable via configuration
- Custom HTML content support
- Header icon with tooltip
- Responsive design
- Default fallback content
- Optional "Help" text label on larger screens

### Prerequisites

- SciCat Frontend application deployed
- Access to configuration files or admin interface
- Basic HTML knowledge (for custom content)

### Dependencies

- Angular `DomSanitizer` for HTML rendering
- `AppConfigService` for configuration management
- Flex Layout (`fxFlex`) for responsive design

---

## 2. Configuration Options

### Configuration Keys

| Key | Type | Required | Default | Description |
|-----|------|----------|---------|-------------|
| `helpSettings.enabled` | boolean | No | `false` | Enables/disables the Help page feature |
| `helpSettings.htmlContent` | string | No | Default message | HTML content to display on the Help page |

### Configuration Locations

#### Reference Configuration File

The frontend ships with a reference configuration file `src/assets/config.json`, 
which is used only for testing and as a reference.
The help can be configured by modifying the `helpSettings` section.

**File**: `src/assets/config.json`

```json
{
  "helpSettings": {
    "enabled": true,
    "htmlContent": "<h1>Help Center</h1><p>Get assistance here</p>"
  }
}
```

#### Runtime Configuration

Most deployments rely on the backend to provide the frontend configuration.
The FE make a GET call to the backend to retrieve its configuration.
This configuration must be configured in the BE deployment

**Endpoint**: `GET /api/v3/runtime-config/frontendConfig`
**Legacy Endpoint**: `GET /api/v3/admin/config`


### Admin Interface

**Path**: Admin Settings > Frontend Config > Header section

The admin UI provides form controls:
- **Help Enabled**: Toggle switch for `helpSettings.enabled`
- **Help HTML Content**: Textarea (5 rows) for `helpSettings.htmlContent`

### TypeScript Interface

**File**: `src/app/app-config.service.ts`

```typescript
export interface HelpSettings {
  enabled?: boolean;
  htmlContent?: string;
}

export interface AppConfigInterface {
  helpSettings?: HelpSettings;
}
```

### Default Values

If help settings are not specified in configuration, the FE use the follow default values:

```typescript
  enabled: false,
  htmlContent: 'Here goes your SciCat Help page!!<br>For more information, please read the documentation available on the <a href="https://scicatproject.org">SciCat Website</a>',
```

---

## 3. Usage Examples

### Example 1: Enable with Default Content

**Configuration**:
```json
{
  "helpSettings": {
    "enabled": true
  }
}
```

**Result**:
- Help icon (?) appears in header
- On larger screens, "Help" text appears next to icon
- Page shows default SciCat message with link to scicatproject.org

---

### Example 2: Enable with Custom HTML

**Configuration**:
```json
{
  "helpSettings": {
    "enabled": true,
    "htmlContent": "<h1>User Guide</h1><p>Welcome to our data catalog.</p>"
  }
}
```

**Result**:
- Help icon appears in header
- Page displays custom HTML content

---

### Example 3: Comprehensive Help Center

**Configuration**:
```json
{
  "helpSettings": {
    "enabled": true,
    "htmlContent": "<div style='padding: 20px;'><h2>SciCat Help Center</h2><section style='margin-bottom: 30px;'><h3>Getting Started</h3><p>New to SciCat? Follow these steps to begin:</p><ol><li><strong>Login</strong> with your facility credentials</li><li><strong>Explore</strong> datasets using the search interface</li><li><strong>View</strong> dataset details by clicking on any result</li><li><strong>Download</strong> files individually or in bulk</li></ol></section><section style='margin-bottom: 30px;'><h3>Searching Datasets</h3><p>Use the search page to find datasets by:</p><ul><li>Dataset name or PID</li><li>Owner or group</li><li>Creation date range</li><li>Scientific metadata</li></ul></section><section><h3>Need More Help?</h3><p>Contact our support team:</p><p><strong>Email:</strong> <a href='mailto:support@facility.org'>support@facility.org</a></p><p><strong>Phone:</strong> +1 (555) 123-4567</p></section></div>"
  }
}
```

---

### Example 4: Help with Feature Tutorials

**Configuration**:
```json
{
  "helpSettings": {
    "enabled": true,
    "htmlContent": "<h2>Feature Tutorials</h2><div style='display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; margin-top: 20px;'><div style='border: 1px solid #ddd; padding: 15px; border-radius: 5px;'><h4>Datasets</h4><p>Browse and search for datasets. Use filters to narrow down results.</p></div><div style='border: 1px solid #ddd; padding: 15px; border-radius: 5px;'><h4>Selection</h4><p>Add files to your cart and download them in a single ZIP archive.</p></div><div style='border: 1px solid #ddd; padding: 15px; border-radius: 5px;'><h4>Metadata</h4><p>View and edit scientific metadata for your datasets.</p></div></div>"
  }
}
```

---

### Example 5: Help with External Resources

**Configuration**:
```json
{
  "helpSettings": {
    "enabled": true,
    "htmlContent": "<h2>Help Resources</h2><p>Explore these resources to learn more about using SciCat:</p><ul style='list-style: none; padding: 0;'><li style='margin-bottom: 10px; padding: 10px; background: #f5f5f5; border-radius: 5px;'><strong><a href='https://docs.scicatproject.org/user-guide' target='_blank' rel='noopener noreferrer'>User Guide</a></strong><br><span style='color: #666;'>Complete user documentation</span></li><li style='margin-bottom: 10px; padding: 10px; background: #f5f5f5; border-radius: 5px;'><strong><a href='https://docs.scicatproject.org/api' target='_blank' rel='noopener noreferrer'>API Documentation</a></strong><br><span style='color: #666;'>REST API reference</span></li><li style='margin-bottom: 10px; padding: 10px; background: #f5f5f5; border-radius: 5px;'><strong><a href='https://forum.scicatproject.org' target='_blank' rel='noopener noreferrer'>Community Forum</a></strong><br><span style='color: #666;'>Ask questions and share knowledge</span></li><li style='margin-bottom: 10px; padding: 10px; background: #f5f5f5; border-radius: 5px;'><strong><a href='https://github.com/scicatproject/scicat' target='_blank' rel='noopener noreferrer'>GitHub Repository</a></strong><br><span style='color: #666;'>Source code and issue tracking</span></li></ul>"
  }
}
```

---

### Example 6: Disabled (Default State)

**Configuration**:
```json
{
  "helpSettings": {
    "enabled": false
  }
}
```

**Result**:
- Help icon is hidden from header
- Direct access to `/help` shows "Help page is disabled"

### Best Practices for Content

1. **Organize by sections**: Use clear headings to separate different help topics
2. **Start with basics**: Include a "Getting Started" or "Quick Start" section
3. **Use bullet points**: Make information scannable with lists
4. **Include screenshots**: Visual aids help users understand features
5. **Provide contact info**: Always include support contact information
6. **Link to external docs**: Reference comprehensive documentation
7. **Keep it updated**: Regularly review and update help content
8. **Test on mobile**: Ensure help content is readable on small screens

---

## 4. Troubleshooting Guide

### Issue: Help Icon Not Visible in Header

**Symptoms**: 
- No help (?) icon in the header toolbar
- Cannot navigate to Help page via UI

**Diagnosis**:

```typescript
// Check if feature is enabled
const config = this.appConfigService.getConfig();
console.log(config.helpSettings?.enabled); // Should be true
```

**Solutions**:

1. **Verify configuration**
   Configuration should contain the following:
   ```json
   {
     "helpSettings": {
       "enabled": true,
       "htmlContent": "Your help here"
     }
   }
   ```

2. **Check configuration**
   - Open browser console
   - Use backend swagger API to retrieve frontend configuration through the runtime-config/frontendConfig endpoint
   - Verify that option `helpSettings.enabled` is set to true

---

### Issue: Help Page Shows "Help page is disabled"

**Symptoms**:
- Icon is visible but page shows disabled message
- Or: Direct navigation to `/help` shows disabled message

**Cause**: `helpSettings.enabled` is `false` or `null`

**Solution**:
```json
{
  "helpSettings": {
    "enabled": true
  }
}
```

---

### Issue: Help Page Shows "No help content available"

**Symptoms**:
- Page loads but shows placeholder message
- Not showing custom HTML content

**Diagnosis**:
- Retrieve your FE config file
- Check the value for entry `helpSettings.htmlContent`

**Solutions**:

1. **Verify configuration**
   - Open browser console
   - Use backend swagger API to retrieve frontend configuration through the runtime-config/frontendConfig endpoint
   - Verify that option `helpSettings.htmlContent` is set to the correct HTML string

---

### Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| Forgetting to enable the feature | Set `helpSettings.enabled: true` |
| Using invalid JSON in config | Validate JSON syntax |
| Using JavaScript in HTML content | Use static HTML only |
| Assuming images are in the correct location | Use `/assets/images/` path |
| Not restarting app after config changes | Restart required |
| Typo in configuration keys | Check key names carefully |
| Expecting Angular directives to work in HTML content | Use standard HTML |
| Very long content causing layout issues | Keep content concise |

---

## 5. FAQ Section

### Q: What happens if I don't configure the Help page?

**A**: The Help page is **disabled by default**. If you don't add any configuration, the Help icon won't appear in the header, and users cannot access the page through the UI.

### Q: Why does the Help icon show "Help" text on some screens but not others?

**A**: The Help button includes a `large-screen-text` class. On larger screens, the "Help" text label appears next to the icon. On smaller screens (mobile), only the icon is shown to save space.

### Q: Can I use the Help page without the header icon?

**A**: Yes, but users would need to know the direct URL (`/help`). The header icon is the primary way users discover and access the page. Consider keeping it visible for discoverability.

### Q: How do I completely remove the Help page feature?

**A**: Set `helpSettings.enabled: false` or simply don't include the configuration keys. The feature is disabled by default.

### Q: Can I use Angular components or directives in the HTML content?

**A**: No. The HTML content is rendered using `[innerHTML]`, which only processes raw HTML. Angular directives like `*ngIf`, `*ngFor`, `routerLink`, etc. will not work. Use standard HTML elements and attributes.

### Q: Is the HTML content sanitized for security?

**A**: The component uses Angular's `DomSanitizer.bypassSecurityTrustHtml()`, which means **the HTML is trusted and rendered as-is**. This is a security consideration:

- Only administrators should be able to modify the configuration
- Ensure HTML content comes from trusted sources
- Avoid including user-generated content in the configuration
- Be cautious with scripts and event handlers

### Q: Can I use external CSS or JavaScript files?

**A**: External CSS via `<link>` tags may work, but external JavaScript via `<script>` tags **will not execute** due to Angular's security model and CSP (Content Security Policy) restrictions. Use inline styles instead.

### Q: How do I add a link to the Help page from other parts of my app?

**A**: Use the Angular router:

```typescript
// In a component
this.router.navigate(['/help']);
```

```html
<!-- In a template -->
<a routerLink="/help">Help</a>
<button [routerLink]="['/help']">Get Help</button>
```

### Q: Can I customize the Help icon in the header?

**A**: The icon is currently hardcoded as `mat-icon color="primary"> help </mat-icon>`. To customize, you would need to modify the header component template in `src/app/_layout/app-header/app-header.component.html`.

### Q: How do I access the Help page configuration programmatically?

**A**: Inject `AppConfigService` and access the configuration:

```typescript
import { AppConfigService } from 'app-config.service';

constructor(private appConfigService: AppConfigService) {}

ngOnInit() {
  const config = this.appConfigService.getConfig();
  const isEnabled = config.helpSettings?.enabled;
  const content = config.helpSettings?.htmlContent;
}
```

### Q: What's the difference between `helpSettings.htmlContent` being empty string vs. undefined?

**A**: 
- `undefined` or `null`: Falls back to default content
- Empty string `""`: Shows "No help content available" message
- Non-empty string: Shows the provided HTML content

### Q: Can I use the configuration override file without affecting other settings?

**A**: Yes. The override file (`config.override.json`) only needs to contain the keys you want to override. Other settings remain as configured in the primary config file.

### Q: How do I test my Help page configuration?

**A**: 
1. Make changes to config file
2. Restart the application
3. Navigate to `/help` or click the help icon
4. Verify content displays correctly
5. Check browser console for errors
6. Test on different screen sizes

### Q: Can I use HTML entities in the content?

**A**: Yes, HTML entities work fine:

```json
{
  "helpSettings": {
    "enabled": true,
    "htmlContent": "<p>Contact: support@example.com &copy; 2024 | &reg; My Facility</p>"
  }
}
```

### Q: What's the maximum size for the HTML content?

**A**: The upper limit is around 15Mb, but it is suggested that you limit the About Html Content to few KB.

### Q: Can I use iframes in the Help page content?

**A**: Technically yes, but:
- Security restrictions (CSP) may block iframes
- Consider the user experience (iframes may not work on mobile)
- Consider the security implications of embedded content
- Prefer linking to external content instead

### Q: How do I add the Help page to my custom menu?

**A**: The Help page is automatically available at `/help` route. If you have a custom menu, add:

```html
<button mat-menu-item routerLink="/help">
  <mat-icon>help</mat-icon>
  <span>Help</span>
</button>
```

### Q: Can I translate the Help page content?

**A**: Yes, provide translated HTML content in your configuration. You could also use a dynamic approach by loading different content based on language, but this would require custom development beyond the standard configuration.

### Q: How do I include screenshots in the Help page?

**A**: 
1. Place screenshot images in `src/assets/images/`
2. Reference them with absolute paths:

```json
{
  "helpSettings": {
    "enabled": true,
    "htmlContent": "<img src='/assets/images/screenshot1.png' alt='Search interface' style='max-width: 100%; margin: 20px 0; border: 1px solid #ddd; border-radius: 4px;'>"
  }
}
```

3. Consider adding captions:

```json
{
  "helpSettings": {
    "enabled": true,
    "htmlContent": "<figure style='text-align: center; margin: 20px 0;'><img src='/assets/images/screenshot1.png' alt='Search interface' style='max-width: 100%; border: 1px solid #ddd; border-radius: 4px;'><figcaption style='margin-top: 10px; font-style: italic; color: #666;'>Figure 1: Dataset search interface</figcaption></figure>"
  }
}
```

### Q: Can I use Bootstrap or other CSS frameworks in the Help content?

**A**: Only if the framework is already loaded in your application. The Help page doesn't automatically include any CSS frameworks. Use inline styles or your application's existing styles.
