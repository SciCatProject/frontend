/// <reference types="Cypress" />

describe("Datasets", () => {
  beforeEach(() => {
    cy.login(Cypress.config("username"), Cypress.config("password"));

    cy.intercept("PATCH", "/api/v3/Datasets/**/*").as("keyword");
    cy.intercept("GET", "*").as("fetch");
  });

  after(() => {
    cy.removeDatasets();
  });

  describe("Edit datasets", () => {
    it("should be able to edit dataset details", () => {
      const newName = "Test changing dataset name";
      const newDescription = "Test changing dataset description";
      cy.createDataset("raw");

      cy.visit("/datasets");

      cy.get(".dataset-table mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get('[data-cy="text-search"] input[type="search"]')
        .clear()
        .type("Cypress");

      cy.isLoading();

      cy.get("mat-row").contains("Cypress Dataset").click();

      cy.wait("@fetch");

      cy.get('[data-cy="edit-general-information"]').click();

      cy.get("input[formcontrolname='datasetName']").clear().type(newName);
      cy.get("textarea[formcontrolname='description']")
        .clear()
        .type(newDescription);

      cy.get('[data-cy="save-general-information"]').click();

      cy.wait("@keyword").then(({ request, response }) => {
        expect(request.method).to.eq("PATCH");
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

      cy.get(".dataset-table mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get('[data-cy="text-search"] input[type="search"]')
        .clear()
        .type("Cypress");

      cy.isLoading();

      cy.get("mat-row").contains("Cypress Dataset").click();

      cy.wait("@fetch");

      cy.get('[data-cy="edit-general-information"]').click();

      cy.get("input.mat-mdc-chip-input").type("cypresskey{enter}");

      cy.get('[data-cy="save-general-information"]').click();

      cy.wait("@keyword").then(({ request, response }) => {
        expect(request.method).to.eq("PATCH");
        expect(response.statusCode).to.eq(200);
      });

      cy.get("mat-chip-set").children().should("contain.text", "cypresskey");
    });

    it("should go to dataset details and remove the added keyword", () => {
      cy.visit("/datasets");

      cy.get(".dataset-table mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get('[data-cy="text-search"] input[type="search"]')
        .clear()
        .type("Cypress");

      cy.isLoading();

      cy.get("mat-row").contains("Cypress Dataset").click();

      cy.get('[data-cy="edit-general-information"]').click();

      cy.contains("cypresskey")
        .parents("mat-chip-row")
        .find(".mat-mdc-chip-remove")
        .first()
        .click();

      cy.get('[data-cy="save-general-information"]').click();

      cy.wait("@keyword").then(({ request, response }) => {
        expect(request.method).to.eq("PATCH");
        expect(response.statusCode).to.eq(200);
      });

      cy.get("mat-chip-set").children().should("not.contain", "cypresskey");
    });
  });
});
