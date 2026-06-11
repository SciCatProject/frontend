describe("About configuration", () => {
  const testAboutContent = "<p class=\"scicat_e2e_test\">SciCat E2E Test About Content</p>";

  beforeEach(() => {
      cy.login(Cypress.env("username"), Cypress.env("password"));
  });

  afterEach(() => {
    cy.get(".user-button").click();
    cy.get("[data-cy=logout-button]").click();
    cy.finishedLoading();
  });

  describe("About Icon disabled", () => {
    beforeEach(() => {
      cy.updateFrontendConfig({
        aboutEnabled: false,
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
      cy.updateFrontendConfig({
        aboutEnabled: true,
        aboutHtmlContent: testAboutContent,
      });
    });

    afterEach(() => {
      // cy.get(".user-button").click();
      // cy.get("[data-cy=logout-button]").click();
      // cy.finishedLoading();
    });

    it("should show about icon in header when enabled", () => {
      cy.reload();
      cy.visit("/");
      cy.finishedLoading();

      cy.get("button[routerLink='/about']").should("exist");
    });

    it("should navigate to about page and display custom content", () => {
      cy.reload();
      cy.visit("/");
      cy.finishedLoading();

      cy.get("button[routerLink='/about']").click();
      cy.finishedLoading();
      cy.url().should("include", "/about");

      cy.get("p.scicat_e2e_test").should("contain", "SciCat E2E Test About Content");
    });
  });

  describe("About Icon enabled with default content", () => {
    beforeEach(() => {
      cy.login(Cypress.env("username"), Cypress.env("password"));
      cy.updateFrontendConfig({
        aboutEnabled: true,
        aboutHtmlContent: "",
      });
    });

    afterEach(() => {
      // cy.get(".user-button").click();
      // cy.get("[data-cy=logout-button]").click();
      // cy.finishedLoading();
    });

    it("should show about icon in header when enabled", () => {
      cy.reload();
      cy.visit("/");
      cy.finishedLoading();

      cy.get("button[routerLink='/about']").should("exist");
    });

    it("should show about icon with default page content", () => {
      cy.reload();
      cy.visit("/");
      cy.finishedLoading();

      cy.get("button[routerLink='/about']").should("exist");

      cy.visit("/");
      cy.finishedLoading();
      cy.get("button[routerLink='/about']").click();
      cy.finishedLoading();

      cy.url().should("include", "/about");

      cy.get("div.about").should("contain", "No about content available");
    });
  });
});
