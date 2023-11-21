/// <reference types="Cypress" />

describe("Datasets", () => {
  const metadataName = "some name";
  const metadataValue = "some value";

  beforeEach(() => {
    cy.login(Cypress.config("username"), Cypress.config("password"));

    cy.intercept("PATCH", "/api/v3/Datasets/**/*").as("metadata");
    cy.intercept("GET", "*").as("fetch");
  });

  after(() => {
    cy.removeDatasets();
  });

  describe("Add metadata item", () => {
    it("should go to dataset details and add a metadata entry", () => {
      cy.createDataset("raw");

      cy.visit("/datasets");

      cy.get(".dataset-table mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get('[data-cy="text-search"] input[type="search"]')
        .clear()
        .type("Cypress");

      cy.isLoading();

      cy.get("mat-row").contains("Cypress Dataset").first().click();

      cy.wait("@fetch");

      cy.finishedLoading();

      cy.scrollTo("bottom");

      cy.get('[role="tab"]').contains("Edit").click();

      cy.get('[data-cy="add-new-row"]').click();

      // simulate click event on the drop down
      cy.get("mat-select[data-cy=field-type-input]").last().click(); // opens the drop down

      // simulate click event on the drop down item (mat-option)
      cy.get("mat-option")
        .contains("string")
        .then((option) => {
          option[0].click();
        });

      cy.get("[data-cy=metadata-name-input]")
        .last()
        .type(`${metadataName}{enter}`);
      cy.get("[data-cy=metadata-value-input]")
        .last()
        .type(`${metadataValue}{enter}`);

      cy.get("button[data-cy=save-changes-button]").click();

      cy.wait("@metadata").then(({ request, response }) => {
        expect(request.method).to.eq("PATCH");
        expect(response.statusCode).to.eq(200);

        cy.finishedLoading();

        cy.get("mat-select[data-cy=field-type-input]")
          .first()
          .should("contain.text", "string");
        cy.get(
          "[data-cy=metadata-edit-form] [data-cy=metadata-name-input]",
        ).should("have.value", metadataName);
        cy.get(
          "[data-cy=metadata-edit-form] [data-cy=metadata-value-input]",
        ).should("have.value", metadataValue);
      });
    });

    it("should not be able to create a dataset with duplicate name", () => {
      cy.createDataset("raw");

      cy.visit("/datasets");

      cy.get(".dataset-table mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get('[data-cy="text-search"] input[type="search"]')
        .clear()
        .type("Cypress");

      cy.isLoading();

      cy.get("mat-row").contains("Cypress Dataset").first().click();

      cy.wait("@fetch");

      cy.finishedLoading();

      cy.scrollTo("bottom");

      cy.get('[role="tab"]').contains("Edit").click();

      // Add first row
      cy.get('[data-cy="add-new-row"]').click();

      cy.get("mat-select[data-cy=field-type-input]").last().click();

      cy.get("mat-option")
        .contains("string")
        .then((option) => {
          option[0].click();
        });

      cy.get("[data-cy=metadata-name-input]")
        .last()
        .type(`${metadataName}{enter}`);

      cy.get("[data-cy=metadata-value-input]")
        .last()
        .type(`${metadataValue}{enter}`);

      // Add second row with same name. This should throw validation error
      cy.get('[data-cy="add-new-row"]').click();

      cy.get("mat-select[data-cy=field-type-input]").last().click();

      cy.get("mat-option")
        .contains("string")
        .then((option) => {
          option[0].click();
        });

      cy.get("[data-cy=metadata-name-input]")
        .last()
        .type(`${metadataName}{enter}`);

      cy.get("[data-cy=metadata-value-input]")
        .last()
        .type(`${metadataValue}{enter}`);

      cy.get("mat-error").contains("Name is already taken");
      cy.get("button[data-cy=save-changes-button]").should("be.disabled");
    });
  });

  describe("Remove metadata item", () => {
    it("should go to dataset details and remove a metadata entry", () => {
      cy.visit("/datasets");

      cy.get(".dataset-table mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get('[data-cy="text-search"] input[type="search"]')
        .clear()
        .type("Cypress");

      cy.isLoading();

      cy.get("mat-row").contains("Cypress Dataset").click();

      cy.finishedLoading();
      cy.get('[role="tab"]').contains("Edit").click();

      cy.get("button.deleteButton").last().click();

      cy.get("button[data-cy=save-changes-button]").click();
      cy.wait("@metadata").then(({ request, response }) => {
        expect(request.method).to.eq("PATCH");
        expect(response.statusCode).to.eq(200);

        cy.finishedLoading();

        cy.get("[data-cy=metadata-edit-form]").should(
          "not.contain",
          metadataName,
        );
      });
    });
  });
});
