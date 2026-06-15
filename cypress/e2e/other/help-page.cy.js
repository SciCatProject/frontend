import { testConfig } from "../../fixtures/testData";
import { mergeConfig } from "../../support/utils";

describe("Help configuration", () => {
  const helpSettings = testConfig.helpSettings;

  beforeEach(() => {
    cy.login(Cypress.env("username"), Cypress.env("password"));
  });

  afterEach(() => {
    // cy.get(".user-button").click();
    // cy.get("[data-cy=logout-button]").click();
    // cy.finishedLoading();
  });

  describe("Help Icon disabled", () => {
    beforeEach(() => {
      cy.readFile("CI/e2e/frontend.config.e2e.json").then((baseConfig) => {
        const mergedConfig = mergeConfig(
          baseConfig,
          helpSettings.disabled,
        );
        cy.intercept("GET", "**/admin/config", mergedConfig).as(
          "getFrontendConfig",
        );
      });
      // cy.updateFrontendConfig({
      //   helpEnabled: false,
      // });
    });

    it("help settings are correct (enabled should be set to false)", () => {

      // Fetch the runtime config from the BE endpoint
      cy.getFrontendConfig().then((response) => {
        // Access the response body, status, etc.
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("data");

        const config = response.body.data;
        expect(config).to.have.property("helpEnabled", false);
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
      // cy.updateFrontendConfig({
      //   helpEnabled: true,
      //   helpHtmlContent: testHelpContent,
      // });
      cy.readFile("CI/e2e/frontend.config.e2e.json").then((baseConfig) => {
        const mergedConfig = mergeConfig(
          baseConfig,
          helpSettings.enabledWithCustomText,
        );
        cy.intercept("GET", "**/admin/config", mergedConfig).as(
          "getFrontendConfig",
        );
      });

    });

    afterEach(() => {
    });

    it("help settings are correct (enabled should be set to true)", () => {

      // Fetch the runtime config from the BE endpoint
      cy.getFrontendConfig().then((response) => {
        // Access the response body, status, etc.
        console.log(response.body); // The JSON response
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("data");

        const config = response.body.data;
        expect(config).to.have.property("helpEnabled", true);
        expect(config).to.have.property("helpHtmlContent", testHelpContent);
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

      cy.get("p.scicat_e2e_test").should("contain", "SciCat E2E Test Help Content");
    });
  });

  describe("Help Icon enabled with default content", () => {
    beforeEach(() => {
      // cy.updateFrontendConfig({
      //   helpEnabled: true,
      //   helpHtmlContent: "",
      // });
      cy.readFile("CI/e2e/frontend.config.e2e.json").then((baseConfig) => {
        const mergedConfig = mergeConfig(
          baseConfig,
          helpSettings.enabledWithDefaultText,
        );
        cy.intercept("GET", "**/admin/config", mergedConfig).as(
          "getFrontendConfig",
        );
      });
    });

    afterEach(() => {
      // cy.get(".user-button").click();
      // cy.get("[data-cy=logout-button]").click();
      // cy.finishedLoading();
    });

    it("help settings are correct (enabled should be set to true)", () => {

      // Fetch the runtime config from the BE endpoint
      cy.getFrontendConfig().then((response) => {
        // Access the response body, status, etc.
        console.log(response.body); // The JSON response
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("data");

        const config = response.body.data;
        expect(config).to.have.property("helpEnabled", true);
        expect(config).to.have.property("helpHtmlContent");
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

      cy.get("button.header-help-button").should("exist");

      cy.get("button.header-help-button").click();
      cy.finishedLoading();

      cy.url().should("include", "/help");

      cy.get("div.help").should("exist");
    });
  });
});
