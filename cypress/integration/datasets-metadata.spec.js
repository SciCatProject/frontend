/// <reference types="Cypress" />

describe("Datasets", () => {
  const metadataName = "some name";
  const metadataValue = "some value";

  beforeEach(() => {
    cy.login(Cypress.config("username"), Cypress.config("password"));

    cy.intercept("PUT", "/api/v3/Datasets/**/*").as("metadata");
    cy.intercept("GET", "*").as("fetch");
  });

  after(() => {
    cy.login(
      Cypress.config("secondaryUsername"),
      Cypress.config("secondaryPassword")
    );
    cy.removeDatasets();
  });

  describe("Add metadata item", () => {
    it("should go to dataset details and add a metadata entry", () => {
      cy.createDataset("raw");

      cy.visit("/datasets");

      cy.wait("@fetch");

      cy.finishedLoading();

      cy.get(".mat-row").contains("Cypress Dataset").click();

      cy.wait("@fetch");

      cy.finishedLoading();

      cy.scrollTo("bottom");

      cy.contains("Edit").click();

      cy.get('[data-cy="add-new-row-or-object"]').click();

      cy.contains("Add new row").click();

      // simulate click event on the drop down
      cy.get("mat-select[formcontrolname=type]").first().click(); // opens the drop down

      // simulate click event on the drop down item (mat-option)
      cy.get(".mat-option-text")
        .contains("string")
        .then((option) => {
          option[0].click();
        });

      cy.get("[data-cy=metadata-name]").type(`${metadataName}{enter}`);
      cy.get("[data-cy=metadata-value]").type(`${metadataValue}{enter}`);

      cy.get("button[data-cy=save-metadata]").click();
      cy.get("button[data-cy=save-changes-to-database]").click();

      cy.wait("@metadata").then(({ request, response }) => {
        expect(request.method).to.eq("PUT");
        expect(response.statusCode).to.eq(200);

        cy.finishedLoading();

        cy.get("[data-cy=metadata-edit-tree]").contains(metadataName).click();
        cy.get("mat-select[formcontrolname=type]")
          .first()
          .should("contain.text", "string");
      });
    });
  });

  describe("Remove metadata item", () => {
    it("should go to dataset details and remove a metadata entry", () => {
      cy.visit("/datasets");

      cy.finishedLoading();

      cy.get(".mat-row").contains("Cypress Dataset").click();

      cy.finishedLoading();
      cy.contains("Edit").click();

      cy.get("button.deleteButton").first().click();

      cy.get("button[data-cy=save-changes-to-database]").click();

      cy.wait("@metadata").then(({ request, response }) => {
        expect(request.method).to.eq("PUT");
        expect(response.statusCode).to.eq(200);

        cy.get("[data-cy=metadata-edit-tree]").should(
          "not.contain",
          metadataName
        );
      });
    });
  });
});
