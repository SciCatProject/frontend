/// <reference types="Cypress" />

describe("Datasets", () => {
  const metadataName = "some name";
  const metadataValue = "some value";
  const metadataQuantityValue = 1128;
  const metadataValidUnitValue = "m";
  const metadataInvalidUnitValue = "invalidUnit";

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

    it("should not be able to create a metadata with duplicate name", () => {
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

      cy.get("mat-error").contains("Name already exists");
      cy.get("button[data-cy=save-changes-button]").should("be.disabled");
    });

    it("should not be able to edit the existing metadata with a duplicate name", () => {
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

      // // Add first row with name as name1
      cy.get('[data-cy="add-new-row"]').click();

      cy.get("mat-select[data-cy=field-type-input]").last().click();

      cy.get("mat-option")
        .contains("string")
        .then((option) => {
          option[0].click();
        });

      cy.get("[data-cy=metadata-name-input]")
        .last()
        .type(`name1{enter}`);

      cy.get("[data-cy=metadata-value-input]")
        .last()
        .type(`${metadataValue}{enter}`);

      // // Add second row with name as name2. 
      cy.get('[data-cy="add-new-row"]').click();

      cy.get("mat-select[data-cy=field-type-input]").last().click();

      cy.get("mat-option")
        .contains("string")
        .then((option) => {
          option[0].click();
        });

      cy.get("[data-cy=metadata-name-input]")
        .last()
        .type(`name2{enter}`);

      cy.get("[data-cy=metadata-value-input]")
        .last()
        .type(`${metadataValue}{enter}`);

      cy.get("button[data-cy=save-changes-button]").click();

      // Now try to change the name from name2 to name1, it should throw duplication error
      cy.get("[data-cy=metadata-name-input]")
        .last()
        .clear()

      cy.get("[data-cy=metadata-name-input]")
        .last()
        .type("name1")

      cy.get("[data-cy=metadata-name-input]")
        .last()
        .parent()
        .click()

      cy.get("mat-error").contains("Name already exists");
      cy.get("button[data-cy=save-changes-button]").should("be.disabled");
    });

    it("should show warning icon in the edit and view table if the metadata unit is invalid or cannot be converted", () => {
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

      cy.get("mat-select[data-cy=field-type-input]").last().click();
      cy.get("mat-option")
        .contains("quantity")
        .then((option) => {
          option[0].click();
        });

      cy.get("[data-cy=metadata-name-input]")
        .last()
        .type(`${metadataName}{enter}`);

      cy.get("[data-cy=metadata-value-input]")
        .last()
        .type(`${metadataQuantityValue}{enter}`);

      cy.get("[data-cy=metadata-unit-input]")
        .last()
        .type(`${metadataValidUnitValue}{enter}`);

      cy.get('[aria-label="warning invalid unit"]').should("not.exist");

      cy.get('[data-cy="add-new-row"]').click();

      cy.get("mat-select[data-cy=field-type-input]").last().click();
      cy.get("mat-option")
        .contains("quantity")
        .then((option) => {
          option[0].click();
        });

      cy.get("[data-cy=metadata-name-input]")
        .last()
        .type(`${metadataName}-2{enter}`);

      cy.get("[data-cy=metadata-value-input]")
        .last()
        .type(`${metadataQuantityValue}{enter}`);

      cy.get("[data-cy=metadata-unit-input]")
        .last()
        .type(`${metadataInvalidUnitValue}{enter}`);

      cy.wait(1000);

      cy.get('[aria-label="warning invalid unit"]').should("exist");

      cy.get('[role="tab"]').contains("View").click();

      cy.get(".unit-input")
        .contains(`${metadataValidUnitValue}`)
        .within(() => {
          cy.get(".unit-input--warning").should("not.exist");
        });

      cy.get(".unit-input")
        .contains(`${metadataInvalidUnitValue}`)
        .within(() => {
          cy.get(".unit-input--warning").should("exist");
        });
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
