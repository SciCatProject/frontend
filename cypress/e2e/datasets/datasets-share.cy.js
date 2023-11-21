/// <reference types="Cypress" />

describe("Datasets", () => {
  beforeEach(() => {
    cy.login(Cypress.config("username"), Cypress.config("password"));
  });

  after(() => {
    cy.removeDatasets();
  });

  describe("Add item to cart and publish", () => {
    it("should add dataset to cart, share it with another user and remove the share", () => {
      cy.createDataset("raw");

      cy.visit("/datasets");

      cy.get(".dataset-table mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get('[data-cy="text-search"] input[type="search"]')
        .clear()
        .type("Cypress");

      cy.isLoading();

      cy.get("[data-cy=checkboxInput]").first().click();

      cy.get("#addToBatchButton").click();

      cy.get("#cartOnHeaderButton").click();

      cy.get("a.button").click();

      cy.get("#shareButton").click();

      cy.get("#userEmailField").type(Cypress.config("guestUserEmail"));

      cy.get("#addUserButton").click();

      cy.get("mat-dialog-content mat-chip-listbox mat-chip-option")
        .first()
        .should("contain.text", Cypress.config("guestUserEmail"));

      cy.get("#shareListButton").should("not.be.disabled");
      cy.get("#shareListButton").click();

      cy.get(".snackbar-success").should("exist");

      cy.get("#shareButton").click();

      cy.get("mat-dialog-content mat-chip-listbox mat-chip-option")
        .first()
        .should("contain.text", Cypress.config("guestUserEmail"));

      cy.get("#removeAllButton").should("not.be.disabled");
      cy.get("#removeAllButton").click();

      cy.get(".snackbar-success").should("exist");
    });
  });
});
