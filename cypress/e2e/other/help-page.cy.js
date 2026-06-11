describe("Help configuration", () => {
  const testHelpContent = "<p class=\"scicat_e2e_test\">SciCat E2E Test Help Content</p>";

  beforeEach(() => {
    cy.login(Cypress.env("username"), Cypress.env("password"));
  });

  afterEach(() => {
    cy.get(".user-button").click();
    cy.get("[data-cy=logout-button]").click();
    cy.finishedLoading();
  });

  describe("Help Icon disabled", () => {
    beforeEach(() => {
      cy.updateFrontendConfig({
        helpEnabled: false,
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
      cy.updateFrontendConfig({
        helpEnabled: true,
        helpHtmlContent: testHelpContent,
      });
    });

    afterEach(() => {
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
      cy.updateFrontendConfig({
        helpEnabled: true,
        helpHtmlContent: "",
      });
    });

    afterEach(() => {
      // cy.get(".user-button").click();
      // cy.get("[data-cy=logout-button]").click();
      // cy.finishedLoading();
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

      cy.get("div.help").should("contain", "No help content available");
    });
  });
});
