/// <reference types="Cypress" />

describe("Datasets", () => {
  beforeEach(() => {
    cy.login(Cypress.config("username"), Cypress.config("password"));

    cy.intercept("PUT", "/api/v3/Datasets/**/*").as("keyword");
    cy.intercept("GET", "*").as("fetch");
  });

  after(() => {
    cy.login(
      Cypress.config("secondaryUsername"),
      Cypress.config("secondaryPassword")
    );
    cy.removeDatasets();
  });

  describe("Edit datasets", () => {
    it("should be able to edit dataset details", () => {
      const newName = "Test changing dataset name";
      const newDescription = "Test changing dataset description";
      cy.createDataset("raw");

      cy.visit("/datasets");

      cy.get(".mat-row").contains("Cypress Dataset").click();

      cy.wait("@fetch");

      cy.get('[data-cy="edit-general-information"]').click();

      cy.get("input[formcontrolname='datasetName']").clear().type(newName);
      cy.get("textarea[formcontrolname='description']")
        .clear()
        .type(newDescription);

      cy.get('[data-cy="save-general-information"]').click();

      cy.wait("@keyword").then(({ request, response }) => {
        expect(request.method).to.eq("PUT");
        expect(response.statusCode).to.eq(200);
      });

      cy.get("[data-cy='general-info']")
        .children()
        .should("contain.text", newName);
      cy.get("[data-cy='general-info']")
        .children()
        .should("contain.text", newDescription);
    });
    it("should go to dataset details and add a keyword", () => {
      cy.createDataset("raw");

      cy.visit("/datasets");

      cy.wait(1000);

      cy.get(".mat-row").contains("Cypress Dataset").click();

      cy.wait("@fetch");

      cy.get('[data-cy="edit-general-information"]').click();

      cy.get("input.mat-chip-input").type("cypresskey{enter}");

      cy.get('[data-cy="save-general-information"]').click();

      cy.wait("@keyword").then(({ request, response }) => {
        expect(request.method).to.eq("PUT");
        expect(response.statusCode).to.eq(200);
      });

      cy.get(".mat-chip-list").children().should("contain.text", "cypresskey");
    });

    it("should go to dataset details and remove the added keyword", () => {
      cy.visit("/datasets");

      cy.get(".mat-row").contains("Cypress Dataset").click();

      cy.get('[data-cy="edit-general-information"]').click();

      cy.contains("cypresskey").children(".mat-chip-remove").click();

      cy.get('[data-cy="save-general-information"]').click();

      cy.wait("@keyword").then(({ request, response }) => {
        expect(request.method).to.eq("PUT");
        expect(response.statusCode).to.eq(200);
      });

      cy.get(".mat-chip-list").children().should("not.contain", "cypresskey");
    });
  });
});
