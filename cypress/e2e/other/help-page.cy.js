import { testConfig } from "../../fixtures/testData";
import { mergeConfig } from "../../support/utils";

describe("Help configuration", () => {
  const helpSettings = testConfig.helpSettings;

  beforeEach(() => {
    cy.login(Cypress.env("username"), Cypress.env("password"));
  });

  describe("Help Icon disabled", () => {

    beforeEach(() => {
      cy.readFile("CI/e2e/frontend.config.e2e.json").then((baseConfig) => {
        const mergedConfig = mergeConfig(
          baseConfig,
          helpSettings.disabled,
        );
        cy.intercept("GET", "**/admin/config", mergedConfig).as(
          "getConfigHelpDisabled",
        );
      });
    });

    it("should not show help icon in header when disabled", () => {
      cy.reload();
      cy.visit("/");
      cy.finishedLoading();

      cy.get("button.header-help-button").should("not.exist");

      cy.get("mat-icon").contains("help").should("not.exist");
    });
  });

  describe("Help Icon enabled with custom content", () => {
    beforeEach(() => {
      cy.readFile("CI/e2e/frontend.config.e2e.json").then((baseConfig) => {
        const mergedConfig = mergeConfig(
          baseConfig,
          helpSettings.enabledWithCustomText,
        );
        cy.intercept("GET", "**/admin/config", mergedConfig).as(
          "getConfigHelpCustom",
        );
      });
    });

    it("should show help icons in header when enabled", () => {
      cy.reload();
      cy.visit("/");
      cy.finishedLoading();

      cy.get("button.header-help-button").should("exist");
    });

    it("should navigate to help page and display custom content", () => {
      cy.reload();
      cy.visit("/");
      cy.finishedLoading();

      cy.get("button.header-help-button").click();
      cy.finishedLoading();
      cy.url().should("include", "/help");

      cy.get("p.scicat_e2e_test").should("contain", helpSettings.enabledWithCustomText.helpInnerHtmlContent);
    });
  });

  describe("Help Icon enabled with default content", () => {
    beforeEach(() => {
      cy.readFile("CI/e2e/frontend.config.e2e.json").then((baseConfig) => {
        const mergedConfig = mergeConfig(
          baseConfig,
          helpSettings.enabledWithDefaultText,
        );
        cy.intercept("GET", "**/admin/config", mergedConfig).as(
          "getConfigHelpDefault",
        );
      });
    });

    it("should show help icon in header when enabled", () => {
      cy.reload();
      cy.visit("/");
      cy.finishedLoading();

      cy.get("button.header-help-button").should("exist");
    });

    it("should show help icon with default page content", () => {
      cy.reload();
      cy.visit("/");
      cy.finishedLoading();

      cy.get("button.header-help-button").click();
      cy.finishedLoading();

      cy.url().should("include", "/help");

      cy.get("div.help").should("exist");
    });
  });
});
