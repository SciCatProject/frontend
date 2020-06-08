/// <reference types="Cypress" />

describe("Datasets", () => {
  beforeEach(() => {
    cy.wait(5000);

    cy.login(Cypress.config("username"), Cypress.config("password"));

    cy.server();
    cy.route("PUT", "/api/v3/Policies/**/*").as("policy");
    cy.route("GET", "*").as("fetch");
  });

  after(() => {
    cy.login(
      Cypress.config("secondaryUsername"),
      Cypress.config("secondaryPassword")
    );
    cy.removePolicies();
  });

  describe("Add manager to policy", () => {
    it("should go to policy and add manager", () => {
      cy.createPolicy();

      cy.visit("/policies");

      cy.wait(5000);

      cy.contains("Editable").click();
      cy.wait(3000);

      cy.contains("Manager").click();

      cy.wait(1000);

      //get second instance
      cy.get(".mat-checkbox")
        .eq(1)
        .click();

      cy.get("[data-cy=editSelection]").click({ force: true });
      cy.get("[data-cy=managerInput]").click({ force: true });
      cy.get("[data-cy=managerInput]").type("cypress@manager.com{enter}");
      cy.wait(5000);
      cy.get("[data-cy=managerChipList]")
        .children()
        .invoke("text")
        .should("contain", "cypress@manager.com");
      cy.wait(1000);
      cy.get("[data-cy=saveButton]").click({ force: true });
    });
  });
});
