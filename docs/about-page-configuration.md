# About Page Configuration

## 1. Overview

### What is the About Page?

The About page is an informational page in SciCat Frontend that displays customizable HTML content to users. It's typically used to provide information about your facility, organization, or the SciCat deployment itself.

### Target Audience

- **Administrators**: Configure and customize the About page content
- **Developers**: Integrate or extend the About page functionality
- **End Users**: View facility information through the About page

### Purpose

The About page serves as:
- Facility/organization information hub
- Documentation entry point
- Contact information center
- Custom informational content display

### Key Features

- Enable/disable via configuration
- Custom HTML content support
- Header icon with tooltip
- Responsive design
- Default fallback content

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
| `aboutSettings.enabled` | boolean | No | `false` | Enables/disables the About page feature |
| `aboutSettings.htmlContent` | string | No | Default message | HTML content to display on the About page |

### Configuration Locations

#### Configuration File

The frontend ships with a local configuration file, which is used for testing and reference

**File**: `src/assets/config.json`

```json
{
  "aboutEnabled": true,
  "aboutHtmlContent": "<h1>About Our Facility</h1><p>Custom content here</p>"
}
```

#### Backend Configuration

Most deployments rely on the backend to provide the frontend configuration.
This configuration takes priority.

**Endpoint**: `GET /api/v3/runtime-config/frontendConfig`

### Admin Interface

**Path**: Admin Settings > Frontend Config > Header section

The admin UI provides form controls:
- **About Enabled**: Toggle switch for `aboutEnabled`
- **About HTML Content**: Textarea (5 rows) for `aboutHtmlContent`

### TypeScript Interface

**File**: `src/app/app-config.service.ts`

```typescript
export interface AppConfigInterface {
  aboutEnabled?: boolean;
  aboutHtmlContent?: string;
}
```

### Default Values

If not specified in configuration:

```typescript
// Applied in AppConfigService.loadAppConfig()
if (config.aboutEnabled == null) {
  config.aboutEnabled = false;
}

if (!config.aboutHtmlContent) {
  config.aboutHtmlContent = 
    'Here goes your SciCat About page!!<br>For more information, please read the documentation available on the <a href="https://scicatproject.org">SciCat Website</a>';
}
```

---

## 3. Usage Examples

### Example 1: Enable with Default Content

**Configuration**:
```json
{
  "aboutEnabled": true
}
```

**Result**:
- About icon (info) appears in header
- Page shows default SciCat message with link to scicatproject.org

---

### Example 2: Enable with Custom HTML

**Configuration**:
```json
{
  "aboutEnabled": true,
  "aboutHtmlContent": "<h1>My Facility Data Catalog</h1><p>Welcome to our scientific data management platform.</p>"
}
```

**Result**:
- About icon appears in header
- Page displays custom HTML content

---

### Example 3: Rich HTML with Styling and Images

**Configuration**:
```json
{
  "aboutEnabled": true,
  "aboutHtmlContent": "<div style='text-align: center; padding: 20px;'><img src='/assets/images/facility-logo.png' alt='Logo' style='max-width: 200px; margin-bottom: 20px;'><h2>National Research Facility</h2><p style='font-size: 16px; line-height: 1.6;'>The National Research Facility provides cutting-edge scientific instruments and data management solutions for researchers worldwide.</p><p><strong>Contact:</strong> <a href='mailto:data@facility.org'>data@facility.org</a></p><p><em>Version 2.1.0</em></p></div>"
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
  "aboutEnabled": true,
  "aboutHtmlContent": "<h2>About This Deployment</h2><p>This SciCat instance is configured for the Physics Department.</p><h3>Key Features</h3><ul><li>Custom dataset metadata schema</li><li>Integrated with local authentication</li><li>Connected to department storage</li></ul><h3>Learn More</h3><p><a href='https://physics.university.edu/scicat' target='_blank' rel='noopener noreferrer'>Physics Department SciCat Guide</a></p>"
}
```

---

### Example 5: Minimal Configuration

**Configuration**:
```json
{
  "aboutEnabled": true,
  "aboutHtmlContent": "<p>About page content</p>"
}
```

---

### Example 6: Disabled (Default State)

**Configuration**:
```json
{
  "aboutEnabled": false
}
```

**Result**:
- About icon is hidden from header
- If user appends `/about` the main URL, the FE will show "Info page is disabled"

### Best Practices for Content

1. **Keep it concise**: Users expect quick information, not a novel
2. **Use semantic HTML**: Proper heading hierarchy (`<h1>`, `<h2>`, etc.)
3. **Make it scannable**: Use lists, short paragraphs, clear sections
4. **Include contact information**: Help users know who to reach out to
5. **Link to external resources**: Documentation, user guides, etc.
6. **Test responsiveness**: Content should work on mobile and desktop
7. **Avoid JavaScript**: Custom JS in HTML content may not execute properly

---

## 4. Troubleshooting Guide

### Issue: About Icon Not Visible in Header

**Symptoms**: 
- No info icon in the header toolbar
- Cannot navigate to About page via UI

**Diagnosis**:

```typescript
// Check if feature is enabled
const config = this.appConfigService.getConfig();
console.log(config.aboutEnabled); // Should be true
```

**Solutions**:

1. **Verify configuration**
   ```json
   // In config.json or config.override.json
   {
     "aboutEnabled": true
   }
   ```

2. **Check configuration**
   - Open browser console
   - Use backend swagger API to retrieve frontend configuration through the runtime-config/frontendConfig endpoint
   - Verify that option `aboutEnabled`  is set to true

---

### Issue: About Page Shows "Info page is disabled"

**Symptoms**:
- Icon is visible but page shows disabled message
- Or: Direct navigation to `/about` shows disabled message

**Cause**: `aboutEnabled` is `false` or `null`

**Solution**:
```json
{
  "aboutEnabled": true
}
```

---

### Issue: About Page Shows "No about content available"

**Symptoms**:
- Page loads but shows placeholder message
- Not showing custom HTML content

**Diagnosis**:

```typescript
const config = this.appConfigService.getConfig();
console.log(config.aboutHtmlContent); // Should contain your HTML
```

**Solutions**:

1. **Verify configuration**
   ```json
   {
     "aboutEnabled": true,
     "aboutHtmlContent": "<p>Your content here</p>"
   }
   ```

2. **Check configuration**
   - Open browser console
   - Use backend swagger API to retrieve frontend configuration through the runtime-config/frontendConfig endpoint
   - Verify that option `aboutHtmlContent`  is set to the correct HMTL string

---

### Common Pitfalls

| Pitfall | Solution |
| ------- | -------- |
| Forgetting to enable the feature | Set `aboutEnabled: true` |
| Using invalid JSON in config | Validate JSON syntax |
| Using JavaScript in HTML content | Use static HTML only |
| Assuming images are in the right location | Use `/assets/images/` path |
| Not restarting app after config changes | Restart required |
| Typo in configuration keys | Check key names carefully |
| Expecting Angular directives to work in HTML content | Use standard HTML |

---

## 5. FAQ Section

### Q: What happens if I don't configure the About page?

**A**: The About page is **disabled by default**. If you don't add any configuration, the About icon won't appear in the header, and users cannot access the page through the UI.

### Q: Can I use the About page without the header icon?

**A**: Yes, but users would need to know the direct URL (`/about`). The header icon is the primary way users discover and access the page. Consider keeping it visible for discoverability.

### Q: How do I completely remove the About page feature?

**A**: Set `aboutEnabled: false` or simply don't include the configuration keys. The feature is disabled by default.

### Q: Can I use Angular components or directives in the HTML content?

**A**: No. The HTML content is rendered using `[innerHTML]`, which only processes raw HTML. Angular directives like `*ngIf`, `*ngFor`, `routerLink`, etc. will not work. Use standard HTML elements and attributes.

### Q: Is the HTML content sanitized for security?

**A**: The component uses Angular's `DomSanitizer.bypassSecurityTrustHtml()`, which means **the HTML is trusted and rendered as-is**. This is a security consideration:

- Only administrators should be able to modify the configuration
- Ensure HTML content comes from trusted sources
- Avoid including user-generated content in the configuration

### Q: Can I use external CSS or JavaScript files?

**A**: External CSS via `<link>` tags may work, but external JavaScript via `<script>` tags **will not execute** due to Angular's security model. Use inline styles instead.

### Q: How do I add a link to the About page from other parts of my app?

**A**: Use the Angular router:

```typescript
// In a component
this.router.navigate(['/about']);
```

```html
<!-- In a template -->
<a routerLink="/about">About</a>
<button [routerLink]="['/about']">Learn More</button>
```

### Q: Can I customize the About icon in the header?

**A**: The icon is currently hardcoded as `mat-icon color="primary"> info </mat-icon>`. To customize, you would need to modify the header component template in `src/app/_layout/app-header/app-header.component.html`.

### Q: How do I access the About page configuration programmatically?

**A**: Inject `AppConfigService` and access the configuration:

```typescript
import { AppConfigService } from 'app-config.service';

constructor(private appConfigService: AppConfigService) {}

ngOnInit() {
  const config = this.appConfigService.getConfig();
  const isEnabled = config.aboutEnabled;
  const content = config.aboutHtmlContent;
}
```

### Q: What's the difference between `aboutHtmlContent` being empty string vs. undefined?

**A**: 
- `undefined` or `null`: Falls back to default content
- Empty string `""`: Shows "No about content available" message
- Non-empty string: Shows the provided HTML content


### Q: How do I test my About page configuration?

**A**: 
1. Make changes to config file
2. Restart the application
3. Navigate to `/about` or click the info icon
4. Verify content displays correctly
5. Check browser console for errors

### Q: Can I use HTML entities in the content?

**A**: Yes, HTML entities work fine:

```json
{
  "aboutHtmlContent": "<p>Contact: support@example.com &copy; 2024</p>"
}
```

### Q: What's the maximum size for the HTML content?

**A**: The upper limit is around 15Mb, but it is suggested that you limit the About Html Content to few KB.

### Q: Can I use iframes in the About page content?

**A**: Technically yes, but:
- Security restrictions may apply
- Consider the user experience (iframes may not work on mobile)
- Prefer linking to external content instead

### Q: How do I add the About page to my custom menu?

**A**: The About page is automatically available at `/about` route. If you have a custom menu, add:

```html
<button mat-menu-item routerLink="/about">
  <mat-icon>info</mat-icon>
  <span>About</span>
</button>
```

### Q: Can I translate the About page content?

**A**: Yes, provide translated HTML content in your configuration. You could also use a dynamic approach by loading different content based on language, but this would require custom development beyond the standard configuration.
