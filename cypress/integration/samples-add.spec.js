/// <reference types="Cypress" />

describe("Samples", function() {
  beforeEach(function() {
    cy.login(Cypress.config("username"), Cypress.config("password"));

    cy.server();
    cy.route("/api/v3/Samples/*").as("request");
  });

  after(function() {
    cy.removeSamples();
  });

  describe("Add sample", function() {
    it("should add a new sample", function() {
      cy.visit("/samples");

      cy.get("mat-card")
        .contains("Add Sample")
        .click();

      cy.get("mat-dialog-container").should("contain.text", "Sample Entry");

      cy.get("#descriptionInput").type("Cypress Sample");
      cy.get("#groupInput").type("ess");

      cy.get("button")
        .contains("Save")
        .click();

      cy.wait("@request");

      cy.get(".mat-table")
        .children()
        .should("contain.text", "Cypress Sample");
    });
  });
});
