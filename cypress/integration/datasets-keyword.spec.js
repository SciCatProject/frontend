/// <reference types="Cypress" />

describe("Datasets", () => {
  beforeEach(() => {
    cy.wait(5000);

    cy.login(Cypress.config("username"), Cypress.config("password"));

    cy.server();
    cy.route("PUT", "/api/v3/Datasets/**/*").as("keyword");
    cy.route("GET", "*").as("fetch");
  });

  after(() => {
    cy.removeDatasets();
  });

  describe("Add keyword", () => {
    it("should go to dataset details and add a keyword", () => {
      cy.createDataset("raw");

      cy.visit("/datasets");

      cy.wait("@fetch");

      cy.get(".mat-row")
        .contains("Cypress Dataset")
        .click();

      cy.wait("@fetch");

      cy.get(".add-keyword-chip").click();

      cy.get("#keywordInput").type("cypresskey{enter}");

      cy.wait("@keyword").then(response => {
        expect(response.method).to.eq("PUT");
        expect(response.status).to.eq(200);
      });

      cy.get(".done-edit-button").click();

      cy.get(".mat-chip-list")
        .children()
        .should("contain.text", "cypresskey");
    });
  });

  describe("Remove keyword", () => {
    it("should go to dataset details and remove the added keyword", () => {
      cy.visit("/datasets");

      cy.wait("@fetch");

      cy.get(".mat-row")
        .contains("Cypress Dataset")
        .click();

      cy.wait("@fetch");

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
