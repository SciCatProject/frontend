import { testConfig } from "../../fixtures/testData";
import { mergeConfig } from "../../support/utils";

describe("About configuration", () => {
  const aboutSettings = testConfig.aboutSettings;

  beforeEach(() => {
      cy.login(Cypress.env("username"), Cypress.env("password"));
  });

  describe("About Icon disabled", () => {

    beforeEach(() => {
      cy.readFile("CI/e2e/frontend.config.e2e.json").then((baseConfig) => {
        const mergedConfig = mergeConfig(
          baseConfig,
          aboutSettings.disabled,
        );
        cy.intercept("GET", "**/admin/config", mergedConfig).as(
          "getConfigAboutDisabled",
        );
      });
    });

    it("should not show about icons in header when disabled", () => {
      cy.reload();
      cy.visit("/");
      cy.finishedLoading();

      cy.get("button[routerLink='/about']").should("not.exist");

      cy.get("mat-icon").contains("info").should("not.exist");
    });
  });

  describe("About Icon enabled with custom content", () => {
    beforeEach(() => {
      cy.readFile("CI/e2e/frontend.config.e2e.json").then((baseConfig) => {
        const mergedConfig = mergeConfig(
          baseConfig,
          aboutSettings.enabledWithCustomText,
        );
        cy.intercept("GET", "**/admin/config", mergedConfig).as(
          "getConfigHelpCustom",
        );
      });
    });

    it("should show about icon in header when enabled", () => {
      cy.reload();
      cy.visit("/");
      cy.finishedLoading();

      cy.get("button.header-about-button").should("exist");
    });

    it("should navigate to about page and display custom content", () => {
      cy.reload();
      cy.visit("/");
      cy.finishedLoading();

      cy.get("button.header-about-button").click();
      cy.finishedLoading();
      cy.url().should("include", "/about");

      cy.get("p.scicat_e2e_test").should("contain", aboutSettings.enabledWithCustomText.aboutInnerHtmlContent);
    });
  });

  describe("About Icon enabled with default content", () => {
    beforeEach(() => {
      cy.readFile("CI/e2e/frontend.config.e2e.json").then((baseConfig) => {
        const mergedConfig = mergeConfig(
          baseConfig,
          aboutSettings.enabledWithCustomText,
        );
        cy.intercept("GET", "**/admin/config", mergedConfig).as(
          "getConfigHelpDefault",
        );
      });
    });

    it("should show about icon in header when enabled", () => {
      cy.reload();
      cy.visit("/");
      cy.finishedLoading();

      cy.get("button.header-about-button").should("exist");
    });

    it("should show about icon with default page content", () => {
      cy.reload();
      cy.visit("/");
      cy.finishedLoading();

      cy.get("button.header-about-button").click();
      cy.finishedLoading();

      cy.url().should("include", "/about");

      cy.get("div.about").should("exist");
    });
  });
});
