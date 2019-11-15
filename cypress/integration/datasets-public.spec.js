/// <reference types="Cypress" />

describe("Datasets", () => {
  beforeEach(() => {
    cy.login(Cypress.config("username"), Cypress.config("password"));
  });

  after(() => {
    cy.removeDatasets();
  });

  describe("Make dataset public", () => {
    it("should go to dataset details and toggle public", () => {
      cy.createDataset("raw");

      cy.server();
      cy.route("PUT", "/api/v3/Datasets/**/*").as("change");

      cy.visit("/datasets");

      cy.get(".mat-row")
        .contains("Cypress Dataset")
        .click();

      cy.get(".mat-slide-toggle-label")
        .contains("Public")
        .as("publicToggle");

      cy.get("mat-slide-toggle").should("not.have.class", "mat-checked");

      cy.get("@publicToggle").click();

      cy.wait("@change").then(response => {
        expect(response.method).to.eq("PUT");
        expect(response.status).to.eq(200);
      });

      cy.get("mat-slide-toggle").should("have.class", "mat-checked");
    });
  });
});
