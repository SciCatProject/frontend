describe("Help and About icon configuration", () => {
  const testHelpContent = "<p>Test Help Content</p>";
  const testAboutContent = "<p>Test About Content</p>";

  beforeEach(() => {
    cy.login(Cypress.env("username"), Cypress.env("password"));
  });

  afterEach(() => {
    cy.get(".user-button").click();
    cy.get("[data-cy=logout-button]").click();
    cy.finishedLoading();
  });

  describe("Icons disabled", () => {
    beforeEach(() => {
      cy.login(Cypress.env("adminUsername"), Cypress.env("adminPassword"));
      cy.updateFrontendConfig({
        helpEnabled: false,
        infoEnabled: false,
      });
      cy.get(".user-button").click();
      cy.get("[data-cy=logout-button]").click();
      cy.finishedLoading();
      cy.login(Cypress.env("username"), Cypress.env("password"));
    });

    it("should not show help and about icons in header when disabled", () => {
      cy.visit("/");
      cy.finishedLoading();

      cy.get("button[routerLink='/help']").should("not.exist");
      cy.get("button[routerLink='/about']").should("not.exist");

      cy.get("mat-icon").contains("help").should("not.exist");
      cy.get("mat-icon").contains("info").should("not.exist");
    });
  });

  describe("Icons enabled with custom content", () => {
    beforeEach(() => {
      cy.login(Cypress.env("adminUsername"), Cypress.env("adminPassword"));
      cy.updateFrontendConfig({
        helpEnabled: true,
        infoEnabled: true,
        helpHtmlContent: testHelpContent,
        infoHtmlContent: testAboutContent,
      });
      cy.get(".user-button").click();
      cy.get("[data-cy=logout-button]").click();
      cy.finishedLoading();
      cy.login(Cypress.env("username"), Cypress.env("password"));
    });

    afterEach(() => {
      cy.login(Cypress.env("adminUsername"), Cypress.env("adminPassword"));
      cy.updateFrontendConfig({
        helpEnabled: true,
        infoEnabled: true,
        helpHtmlContent: "",
        infoHtmlContent: "",
      });
      cy.get(".user-button").click();
      cy.get("[data-cy=logout-button]").click();
      cy.finishedLoading();
    });

    it("should show help and about icons in header when enabled", () => {
      cy.visit("/");
      cy.finishedLoading();

      cy.get("button[routerLink='/help']").should("exist");
      cy.get("button[routerLink='/about']").should("exist");
    });

    it("should navigate to help page and display custom content", () => {
      cy.visit("/");
      cy.finishedLoading();

      cy.get("button[routerLink='/help']").click();
      cy.finishedLoading();
      cy.url().should("include", "/help");

      cy.get("div").should("contain", "Test Help Content");
    });

    it("should navigate to about page and display custom content", () => {
      cy.visit("/");
      cy.finishedLoading();

      cy.get("button[routerLink='/about']").click();
      cy.finishedLoading();
      cy.url().should("include", "/about");

      cy.get("div").should("contain", "Test About Content");
    });
  });

  describe("Icons enabled with default content", () => {
    beforeEach(() => {
      cy.login(Cypress.env("adminUsername"), Cypress.env("adminPassword"));
      cy.updateFrontendConfig({
        helpEnabled: true,
        infoEnabled: true,
        helpHtmlContent: "",
        infoHtmlContent: "",
      });
      cy.get(".user-button").click();
      cy.get("[data-cy=logout-button]").click();
      cy.finishedLoading();
      cy.login(Cypress.env("username"), Cypress.env("password"));
    });

    afterEach(() => {
      cy.login(Cypress.env("adminUsername"), Cypress.env("adminPassword"));
      cy.updateFrontendConfig({
        helpEnabled: true,
        infoEnabled: true,
        helpHtmlContent: "",
        infoHtmlContent: "",
      });
      cy.get(".user-button").click();
      cy.get("[data-cy=logout-button]").click();
      cy.finishedLoading();
    });

    it("should show icons with default page content", () => {
      cy.visit("/");
      cy.finishedLoading();

      cy.get("button[routerLink='/help']").should("exist");
      cy.get("button[routerLink='/about']").should("exist");

      cy.get("button[routerLink='/help']").click();
      cy.finishedLoading();
      cy.get("mat-card").should("exist");

      cy.visit("/");
      cy.finishedLoading();
      cy.get("button[routerLink='/about']").click();
      cy.finishedLoading();
      cy.get("mat-card").should("have.length.at.least", 3);
    });
  });
});
