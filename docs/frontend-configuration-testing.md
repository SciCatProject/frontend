# Frontend Configuration Testing with Cypress Intercept

## Overview

When writing end-to-end tests that depend on frontend configuration, use `cy.intercept()` to mock the `GET /admin/config` endpoint. This allows you to test different configuration states without modifying the actual backend or configuration files.

**Target Audience**: Code contributors writing Cypress e2e tests

**Key Pattern**: Read base config → Merge with test-specific overrides → Intercept config endpoint

---

## Best Practices

### 1. Always Start from Base Configuration

Use the shared `frontend.config.e2e.json` as your base to ensure consistency across tests:

```javascript
cy.readFile("CI/e2e/frontend.config.e2e.json").then((baseConfig) => {
  // Merge and intercept
});
```

### 2. Use `mergeConfig` for Overrides

Import the utility from `cypress/support/utils.js` to safely merge configurations:

```javascript
import { mergeConfig } from "../../support/utils";

const mergedConfig = mergeConfig(baseConfig, overrideConfig);
```

### 3. Intercept the Config Endpoint

Mock the `GET /admin/config` endpoint with your merged configuration:

```javascript
cy.intercept("GET", "**/admin/config", mergedConfig).as("getConfig");
```

### 4. Use Aliases for Waiting (Optional)

Add an alias when you need to wait for the intercept to be called:

```javascript
cy.intercept("GET", "**/admin/config", mergedConfig).as("getConfigHelpCustom");
// Later in test:
cy.wait("@getConfigHelpCustom");
```

### 5. Place Intercepts in `beforeEach`

Set up configuration intercepts in the `beforeEach` hook so they apply to all tests in the describe block:

```javascript
describe("Feature with custom config", () => {
  beforeEach(() => {
    cy.readFile("CI/e2e/frontend.config.e2e.json").then((baseConfig) => {
      const mergedConfig = mergeConfig(baseConfig, featureConfig);
      cy.intercept("GET", "**/admin/config", mergedConfig);
    });
  });

  it("should work with custom config", () => {
    cy.visit("/");
    // Test assertions
  });
});
```

### 6. Reload After Intercept

If the app has already loaded, trigger a reload to pick up the new configuration:

```javascript
beforeEach(() => {
  // Setup intercept
  cy.intercept("GET", "**/admin/config", mergedConfig);
  
  // Reload to apply new config
  cy.reload();
  cy.visit("/");
});
```

---

## Complete Example Pattern

```javascript
import { testConfig } from "../../fixtures/testData";
import { mergeConfig } from "../../support/utils";

describe("Feature Configuration Tests", () => {
  describe("Feature Disabled", () => {
    beforeEach(() => {
      cy.readFile("CI/e2e/frontend.config.e2e.json").then((baseConfig) => {
        const mergedConfig = mergeConfig(
          baseConfig,
          testConfig.featureSettings.disabled,
        );
        cy.intercept("GET", "**/admin/config", mergedConfig).as("getConfigDisabled");
      });
      
      cy.reload();
      cy.visit("/");
      cy.finishedLoading();
    });

    it("should not show feature when disabled", () => {
      cy.get(".feature-element").should("not.exist");
    });
  });

  describe("Feature Enabled with Custom Settings", () => {
    beforeEach(() => {
      cy.readFile("CI/e2e/frontend.config.e2e.json").then((baseConfig) => {
        const mergedConfig = mergeConfig(
          baseConfig,
          testConfig.featureSettings.enabledWithCustom,
        );
        cy.intercept("GET", "**/admin/config", mergedConfig).as("getConfigCustom");
      });
      
      cy.reload();
      cy.visit("/");
      cy.finishedLoading();
    });

    it("should show feature with custom content", () => {
      cy.get(".feature-element").should("exist");
      cy.get(".feature-element").should("contain", testConfig.featureSettings.enabledWithCustom.customText);
    });
  });
});
```

---

## Configuration Structure

### Base Configuration File
- Location: `CI/e2e/frontend.config.e2e.json`
- Contains default configuration for CI e2e tests
- Shared across all test files

### Test-Specific Configuration
- Define in `cypress/fixtures/testData.js`
- Group related settings together (e.g., `helpSettings`, `aboutSettings`)
- Export as named exports for easy importing

### Example Test Configuration

```javascript
// In cypress/fixtures/testData.js
export const testConfig = {
  helpSettings: {
    disabled: {
      helpSettings: {
        enabled: false,
      }
    },
    enabledWithCustomText: {
      helpSettings: {
        enabled: true,
        htmlContent: "<p>Custom help content</p>",
      }
    },
  },
};
```

---

## Common Pitfalls

| Issue | Solution |
|-------|----------|
| Config not applied | Call `cy.reload()` after setting intercept |
| Intercept not triggered | Ensure `cy.visit()` or `cy.reload()` is called |
| Merge not working | Use `mergeConfig` utility, not direct object spread |
| Tests interfering | Scope intercepts to specific `describe` blocks |
| Missing config keys | Always start from base config, don't create from scratch |

---

## Useful Tips

- **Debug merged config**: Use `console.log(mergedConfig)` to verify your configuration
- **Multiple intercepts**: You can have multiple intercepts active; the most recent one matching the URL wins
- **Partial overrides**: `mergeConfig` does deep merging, so you only need to specify the keys you want to change
- **Type safety**: The base config and overrides should have the same structure as the actual frontend configuration

---

## See Also

- [Cypress Intercept Documentation](https://docs.cypress.io/api/commands/intercept)
- [Help Page Configuration](help-page-configuration.md)
- [About Page Configuration](about-page-configuration.md)
