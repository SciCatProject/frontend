/// <reference types="Cypress" />

describe("Datasets", () => {
  beforeEach(() => {
    cy.login(Cypress.config("username"), Cypress.config("password"));
  });

  after(() => {
    cy.removeDatasets();
  });

  describe("Add attachment", () => {
    it.skip("should go to dataset details and add an attachment", () => {
      cy.createDataset("raw");

      cy.visit("/datasets");

      cy.get(".mat-row")
        .contains("Cypress Dataset")
        .click();

      cy.get(".mat-tab-label")
        .contains("Attachments")
        .click();

      cy.get("button")
        .contains("Browse")
        .click();
    });
  });
});
