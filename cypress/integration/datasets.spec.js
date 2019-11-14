/// <reference types="Cypress" />

describe("Datasets", () => {
  beforeEach(() => {
    cy.login(Cypress.config("username"), Cypress.config("password"));

    cy.server();
    cy.route("/api/v3/Datasets/*").as("request");
  });

  after(() => {
    cy.removeDatasets();
  });

  describe("Add keyword to dataset", () => {
    it("should go to dataset details and add a keyword", () => {
      cy.createDataset("raw");

      cy.visit("/datasets");

      cy.get(".mat-row")
        .contains("Cypress Dataset")
        .click();

      cy.get(".add-keyword-chip").click();
      cy.get("#keywordInput").type("cypresskey{enter}");
      cy.wait("@request");
      cy.get(".done-edit-button").click();

      cy.get(".mat-chip-list")
        .children()
        .should("contain.text", "cypresskey");
    });
  });

  describe("Remove keyword from dataset", () => {
    it("should go to dataset details and remove the added keyword", () => {
      cy.visit("/datasets");

      cy.get(".mat-row")
        .contains("Cypress Dataset")
        .click();

      cy.contains("cypresskey")
        .children(".mat-chip-remove")
        .click();

      cy.wait("@request");

      cy.get(".mat-chip-list")
        .children()
        .should("not.contain", "cypresskey");
    });
  });
});
