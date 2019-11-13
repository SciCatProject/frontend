/// <reference types="Cypress" />

describe("Datasets", () => {
  beforeEach(() => {
    cy.login(Cypress.config("username"), Cypress.config("password"));

    cy.server();
    cy.route("/api/v3/Datasets/*").as("keyword");
  });

  describe("Add keyword to dataset", () => {
    it("should go to dataset details and add a keyword", () => {
      cy.url().should("include", "/datasets");

      cy.get(".mat-row")
        .first()
        .click();

      cy.get(".add-keyword-chip").click();
      cy.get("#keywordInput").type("cypresskey{enter}");
      cy.wait("@keyword");
      cy.get(".done-edit-button").click();

      cy.get(".mat-chip-list")
        .children()
        .should("contain.text", "cypresskey");
    });
  });

  describe("Remove keyword from dataset", () => {
    it("should go to dataset details and remove the added keyword", () => {
      cy.url().should("include", "/datasets");

      cy.get(".mat-row")
        .first()
        .click();

      cy.contains("cypresskey")
        .children(".mat-chip-remove")
        .click();

      cy.wait("@keyword");

      cy.get(".mat-chip-list")
        .children()
        .should("not.contain", "cypresskey");
    });
  });
});
