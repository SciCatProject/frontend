/// <reference types="Cypress" />

describe("Datasets general", () => {
  beforeEach(() => {
    cy.login(Cypress.config("username"), Cypress.config("password"));
  });

  after(() => {
    cy.removeDatasets();
  });

  describe("Show dataset table after logout and login", () => {
    it("should be able to see datasets after visiting details page logout and login again", () => {
      const username = Cypress.config("username");
      const password = Cypress.config("password");

      cy.createDataset("raw");

      cy.visit("/datasets");

      cy.get(".dataset-table mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get('[data-cy="text-search"] input[type="search"]')
        .clear()
        .type("Cypress");

      cy.isLoading();

      cy.get("mat-row").contains("Cypress Dataset").click();

      cy.get('[data-cy="edit-general-information"]').should("exist");

      cy.get(".user-button").should("contain.text", username).click();

      cy.get("[data-cy=logout-button]").click();

      cy.finishedLoading();

      cy.url().should("include", "/login");

      cy.get('mat-tab-group [role="tab"]').contains("Local").click();

      cy.get("#usernameInput").type(username).should("have.value", username);
      cy.get("#passwordInput").type(password).should("have.value", password);

      cy.get("button[type=submit]").click();

      cy.url().should("include", "/datasets");

      cy.get(".dataset-table mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get("mat-row").contains("Cypress Dataset").click();
    });
  });

  describe("Proposal connection and link from dataset details", () => {
    it("should be able to see and click proposal connection link from dataset details page", () => {
      const proposalId = Math.floor(100000 + Math.random() * 900000).toString();
      cy.createProposal(proposalId);
      cy.createDataset("raw", proposalId);

      cy.visit("/datasets");

      cy.get(".dataset-table mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get('[data-cy="text-search"] input[type="search"]')
        .clear()
        .type("Cypress");

      cy.isLoading();

      cy.get("mat-row").contains("Cypress Dataset").click();

      cy.get('[data-cy="edit-general-information"]').should("exist");

      cy.contains("A minimal test proposal").click();

      cy.url().should("include", "/proposals");

      cy.contains("A minimal test proposal");

      cy.login(
        Cypress.config("secondaryUsername"),
        Cypress.config("secondaryPassword"),
      );

      cy.deleteProposal(proposalId);
    });
  });
});
