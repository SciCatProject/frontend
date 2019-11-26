/// <reference types="Cypress" />

describe("Datasets", () => {
  beforeEach(() => {
    cy.wait(5000);

    cy.login(Cypress.config("username"), Cypress.config("password"));

    cy.server();
    cy.route("PUT", "/api/v3/Datasets/**/*").as("keyword");
  });

  after(() => {
    cy.removeDatasets();
  });

  describe("Add keyword", () => {
    it("should go to dataset details and add a keyword", () => {
      cy.createDataset("raw");

      cy.visit("/datasets");

      cy.wait(5000);

      cy.get(".mat-row")
        .contains("Cypress Dataset")
        .click();

      cy.get(".add-keyword-chip").click();

      cy.get("#keywordInput").type("cypresskey{enter}");

      cy.get(".done-edit-button").click();

      cy.wait("@keyword").then(response => {
        expect(response.method).to.eq("PUT");
        expect(response.status).to.eq(200);
      });

      cy.get(".mat-chip-list")
        .children()
        .should("contain.text", "cypresskey");
    });
  });

  describe("Remove keyword", () => {
    it("should go to dataset details and remove the added keyword", () => {
      cy.visit("/datasets");

      cy.wait(5000);

      cy.get(".mat-row")
        .contains("Cypress Dataset")
        .click();

      cy.contains("cypresskey")
        .children(".mat-chip-remove")
        .click();

      cy.wait("@keyword").then(response => {
        expect(response.method).to.eq("PUT");
        expect(response.status).to.eq(200);
      });

      cy.get(".mat-chip-list")
        .children()
        .should("not.contain", "cypresskey");
    });
  });
});
