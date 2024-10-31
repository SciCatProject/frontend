/// <reference types="Cypress" />

describe("Proposals general", () => {
  beforeEach(() => {
    cy.login(Cypress.config("username"), Cypress.config("password"));
  });

  describe("Proposals Page API Calls", () => {
    it("should make fetch logbook API call only once", () => {
      cy.intercept("GET", "/api/v3/Logbooks/**").as("logbooksCall");

      const proposalId = Math.floor(100000 + Math.random() * 900000).toString();
      cy.createProposal(proposalId);

      cy.visit("/proposals");

      cy.contains("A minimal test proposal").click();

      cy.wait("@logbooksCall");

      cy.visit("/datasets");

      // The logbook API call consists of two calls, one for the fullquery and the other for the fullfacet
      // which is why lte 2 is used
      cy.login(
        Cypress.config("secondaryUsername"),
        Cypress.config("secondaryPassword"),
      );

      cy.deleteProposal(proposalId);
    });
  });
});
