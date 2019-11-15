/// <reference types="Cypress" />

describe("Samples", function() {
  beforeEach(function() {
    cy.login(Cypress.config("username"), Cypress.config("password"));

    cy.server();
    cy.route("POST", "/api/v3/Samples").as("add");
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

      cy.wait("@add").then(response => {
        expect(response.method).to.eq("POST");
        expect(response.status).to.eq(200);
      });

      cy.get(".mat-table")
        .children()
        .should("contain.text", "Cypress Sample");
    });
  });
});
