describe("Datasets", () => {
  const metadataName = "some name";
  const metadataValue = "some value";
  const metadataValidJson = {
    value: 1128,
    unit: "meters",
    valueSI: 1128,
    unitSI: "m",
  };
  const metadataInvalidUnitValue = "invalidUnit";

  beforeEach(() => {
    cy.login(Cypress.env("username"), Cypress.env("password"));

    cy.intercept("PATCH", "/api/v3/datasets/**/*").as("metadata");
    cy.intercept("GET", "*").as("fetch");
  });

  after(() => {
    cy.removeDatasets();
  });

  describe("Add metadata item", () => {
    it("should go to dataset details and add a metadata entry", () => {
      cy.createDataset({ type: "raw" });

      cy.visit("/datasets");

      cy.get(".dataset-table mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get('[data-cy="text-search"]').clear().type("Cypress");
      cy.get('[data-cy="search-button"]').click();

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
        .focus()
        .type(`${metadataName}{enter}`);
      cy.get("[data-cy=metadata-value-input]")
        .last()
        .focus()
        .type(`${metadataValue}{enter}`);

      cy.get("button[data-cy=save-changes-button]").click();

      cy.finishedLoading();

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
      cy.createDataset({ type: "raw" });

      cy.visit("/datasets");

      cy.get(".dataset-table mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get('[data-cy="text-search"]').clear().type("Cypress");
      cy.get('[data-cy="search-button"]').click();

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
        .focus()
        .type(`${metadataName}{enter}`);

      cy.get("[data-cy=metadata-value-input]")
        .last()
        .focus()
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
        .focus()
        .type(`${metadataName}{enter}`);

      cy.get("[data-cy=metadata-value-input]")
        .last()
        .focus()
        .type(`${metadataValue}{enter}`);

      cy.get("mat-error").contains("Name already exists");
      cy.get("button[data-cy=save-changes-button]").should("be.disabled");
    });

    it("should not be able to edit the existing metadata with a duplicate name", () => {
      cy.createDataset({ type: "raw" });

      cy.visit("/datasets");

      cy.get(".dataset-table mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get('[data-cy="text-search"]').clear().type("Cypress");
      cy.get('[data-cy="search-button"]').click();

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
        .focus()
        .type(`name1{enter}`);

      cy.get("[data-cy=metadata-value-input]")
        .last()
        .focus()
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
        .focus()
        .type(`name2{enter}`);

      cy.get("[data-cy=metadata-value-input]")
        .last()
        .focus()
        .type(`${metadataValue}{enter}`);

      cy.get("button[data-cy=save-changes-button]").click();

      // Now try to change the name from name2 to name1, it should throw duplication error
      cy.get("[data-cy=metadata-name-input]").last().clear();

      cy.get("[data-cy=metadata-name-input]").last().type("name1");

      cy.get("[data-cy=metadata-name-input]").last().parent().click();

      cy.get("mat-error").contains("Name already exists");
      cy.get("button[data-cy=save-changes-button]").should("be.disabled");
    });

    it("should show warning icon in the edit and view table if the metadata unit is invalid or cannot be converted", () => {
      cy.createDataset({ type: "raw" });

      cy.visit("/datasets");

      cy.get(".dataset-table mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get('[data-cy="text-search"]').clear().type("Cypress");
      cy.get('[data-cy="search-button"]').click();

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
        .focus()
        .type(`${metadataName}{enter}`);

      cy.get("[data-cy=metadata-value-input]")
        .last()
        .focus()
        .type(`${metadataValidJson.value}{enter}`);

      cy.get("[data-cy=metadata-unit-input]")
        .last()
        .focus()
        .type(`${metadataValidJson.unit}{enter}`);

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
        .focus()
        .type(`${metadataName}-2{enter}`);

      cy.get("[data-cy=metadata-value-input]")
        .last()
        .focus()
        .type(`${metadataValidJson.value}{enter}`);

      cy.get("[data-cy=metadata-unit-input]")
        .last()
        .focus()
        .type(`${metadataInvalidUnitValue}{enter}`);

      cy.wait(1000);

      cy.get('[aria-label="warning invalid unit"]').should("exist");

      cy.get('[role="tab"]').contains("View").click();

      cy.get(".unit-input")
        .contains(`${metadataValidJson.unitSI}`)
        .parent()
        .within(() => {
          cy.get(".general-warning").should("not.exist");
        });

      cy.get(".unit-input")
        .contains(`${metadataInvalidUnitValue}`)
        .parent()
        .within(() => {
          cy.get(".general-warning").should("exist");
        });
    });

    it("added metadata entry should be visible from the Scientific Metadata(JSON) table", () => {
      cy.createDataset({ type: "raw" });

      cy.visit("/datasets");

      cy.get(".dataset-table mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get('[data-cy="text-search"]').clear().type("Cypress");
      cy.get('[data-cy="search-button"]').click();

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
        .contains("quantity")
        .then((option) => {
          option[0].click();
        });

      cy.get("[data-cy=metadata-name-input]")
        .last()
        .focus()
        .type(`${metadataName}{enter}`);

      cy.get("[data-cy=metadata-value-input]")
        .last()
        .focus()
        .type(`${metadataValidJson.value}{enter}`);

      cy.get("[data-cy=metadata-unit-input]")
        .last()
        .focus()
        .type(`${metadataValidJson.unit}{enter}`);

      cy.get("button[data-cy=save-changes-button]").click();

      cy.get("[mat-tab-nav-bar]")
        .contains("Scientific Metadata (JSON)")
        .click();

      cy.contains(metadataName).click();

      cy.get('[data-cy="metadata-json-view"]').within(() => {
        cy.contains(`value: ${metadataValidJson.value}`).should("exist");
        cy.contains(`unit: "${metadataValidJson.unit}"`).should("exist");
        cy.contains(`valueSI: ${metadataValidJson.valueSI}`).should("exist");
        cy.contains(`unitSI: "${metadataValidJson.unitSI}"`).should("exist");
      });
    });
  });

  describe("Different metadata types", () => {
    it("should be able to add a metadata entry with type 'date'", () => {
      const newMetadataName = "Cypress dataset date metadata";
      const metaDataInvalidValue = "20ab";
      const metadata = {
        value: "2025-03-05 10:48",
        name: "date_metadata",
        human_name: "Date test",
        type: "date",
      };
      cy.createDataset({
        type: "raw",
        dataFileSize: "small",
        datasetName: newMetadataName,
      });

      cy.visit("/datasets");

      cy.get(".dataset-table mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get('[data-cy="text-search"]').clear().type(newMetadataName);
      cy.get('[data-cy="search-button"]').click();

      cy.isLoading();

      cy.get("mat-row").contains(newMetadataName).first().click();

      cy.wait("@fetch");

      cy.finishedLoading();

      cy.scrollTo("bottom");

      cy.get('[role="tab"]').contains("Edit").click();

      cy.get('[data-cy="add-new-row"]').click();

      cy.get("mat-select[data-cy=field-type-input]").last().click();
      cy.get("mat-option")
        .contains(metadata.type)
        .then((option) => {
          option[0].click();
        });

      cy.get("[data-cy=metadata-name-input]")
        .last()
        .focus()
        .type(`${metadata.name}{enter}`);

      cy.get("[data-cy=metadata-human-name-input]")
        .last()
        .focus()
        .type(`${metadata.human_name}{enter}`);

      cy.get("[data-cy=metadata-value-input]")
        .last()
        .focus()
        .type(`${metaDataInvalidValue}{enter}`);

      cy.get("[data-cy=metadata-value-input]")
        .closest("mat-form-field")
        .find("mat-error")
        .contains("Invalid date");

      cy.get("button[data-cy=save-changes-button]").should("be.disabled");

      cy.get("[data-cy=metadata-value-input]")
        .last()
        .clear()
        .type(`${metadata.value}{enter}`);

      cy.get("button[data-cy=save-changes-button]").click();

      cy.finishedLoading();

      cy.contains("[role='tab']", "View").click();

      cy.contains("dynamic-mat-table mat-row", metadata.human_name);
      cy.contains("dynamic-mat-table mat-row", metadata.value);
    });

    it("should be able to add a metadata entry with type 'link'", () => {
      const newMetadataName = "Cypress dataset link metadata";
      const metaDataInvalidValue = "https://";
      const metadata = {
        value: "https://scicat.dev-sims.ess.eu",
        name: "link_metadata",
        human_name: "Link test",
        type: "link",
      };
      cy.createDataset({
        type: "raw",
        dataFileSize: "small",
        datasetName: newMetadataName,
      });

      cy.visit("/datasets");

      cy.get(".dataset-table mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get('[data-cy="text-search"]').clear().type(newMetadataName);
      cy.get('[data-cy="search-button"]').click();

      cy.isLoading();

      cy.get("mat-row").contains(newMetadataName).first().click();

      cy.wait("@fetch");

      cy.finishedLoading();

      cy.scrollTo("bottom");

      cy.get('[role="tab"]').contains("Edit").click();

      cy.get('[data-cy="add-new-row"]').click();

      cy.get("mat-select[data-cy=field-type-input]").last().click();
      cy.get("mat-option")
        .contains(metadata.type)
        .then((option) => {
          option[0].click();
        });

      cy.get("[data-cy=metadata-name-input]")
        .last()
        .focus()
        .type(`${metadata.name}{enter}`);

      cy.get("[data-cy=metadata-human-name-input]")
        .last()
        .focus()
        .type(`${metadata.human_name}{enter}`);

      cy.get("[data-cy=metadata-value-input]")
        .last()
        .focus()
        .type(`${metaDataInvalidValue}{enter}`);

      cy.get("[data-cy=metadata-value-input]")
        .closest("mat-form-field")
        .find("mat-error")
        .contains("Invalid link");

      cy.get("button[data-cy=save-changes-button]").should("be.disabled");

      cy.get("[data-cy=metadata-value-input]")
        .last()
        .clear()
        .type(`${metadata.value}{enter}`);

      cy.get("button[data-cy=save-changes-button]").click();

      cy.finishedLoading();

      cy.contains("[role='tab']", "View").click();

      cy.contains("dynamic-mat-table mat-row", metadata.human_name);
      cy.contains("dynamic-mat-table mat-row mat-cell a", metadata.value);
    });

    it("should be able to add a metadata entry with type 'number_range'", () => {
      const newMetadataName = "Cypress dataset number_range metadata";
      const metaDataInvalidValue = "1,";
      const metadata = {
        value: "1,2",
        name: "number_range_metadata",
        human_name: "Number range test",
        type: "number_range",
      };
      cy.createDataset({
        type: "raw",
        dataFileSize: "small",
        datasetName: newMetadataName,
      });

      cy.visit("/datasets");

      cy.get(".dataset-table mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get('[data-cy="text-search"]').clear().type(newMetadataName);
      cy.get('[data-cy="search-button"]').click();

      cy.isLoading();

      cy.get("mat-row").contains(newMetadataName).first().click();

      cy.wait("@fetch");

      cy.finishedLoading();

      cy.scrollTo("bottom");

      cy.get('[role="tab"]').contains("Edit").click();

      cy.get('[data-cy="add-new-row"]').click();

      cy.get("mat-select[data-cy=field-type-input]").last().click();
      cy.get("mat-option")
        .contains(metadata.type)
        .then((option) => {
          option[0].click();
        });

      cy.get("[data-cy=metadata-name-input]")
        .last()
        .focus()
        .type(`${metadata.name}{enter}`);

      cy.get("[data-cy=metadata-human-name-input]")
        .last()
        .focus()
        .type(`${metadata.human_name}{enter}`);

      cy.get("[data-cy=metadata-value-input]")
        .last()
        .focus()
        .type(`${metaDataInvalidValue}{enter}`);

      cy.get("[data-cy=metadata-value-input]")
        .closest("mat-form-field")
        .find("mat-error")
        .contains("Invalid range");

      cy.get("button[data-cy=save-changes-button]").should("be.disabled");

      cy.get("[data-cy=metadata-value-input]")
        .last()
        .clear()
        .type(`${metadata.value}{enter}`);

      cy.get("button[data-cy=save-changes-button]").click();

      cy.finishedLoading();

      cy.contains("[role='tab']", "View").click();

      cy.contains("dynamic-mat-table mat-row", metadata.human_name);
      cy.contains("dynamic-mat-table mat-row", metadata.value);
    });

    it("should be able to add a metadata entry with type 'quantity_range'", () => {
      const newMetadataName = "Cypress dataset quantity_range metadata";
      const metaDataInvalidValue = "1,";
      const metadata = {
        value: "1,2",
        name: "quantity_range_metadata",
        human_name: "Quantity range test",
        type: "quantity_range",
        unit: "cm",
        valueSI: "0.01,0.02",
        unitSI: "m",
      };
      cy.createDataset({
        type: "raw",
        dataFileSize: "small",
        datasetName: newMetadataName,
      });

      cy.visit("/datasets");

      cy.get(".dataset-table mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get('[data-cy="text-search"]').clear().type(newMetadataName);
      cy.get('[data-cy="search-button"]').click();

      cy.isLoading();

      cy.get("mat-row").contains(newMetadataName).first().click();

      cy.wait("@fetch");

      cy.finishedLoading();

      cy.scrollTo("bottom");

      cy.get('[role="tab"]').contains("Edit").click();

      cy.get('[data-cy="add-new-row"]').click();

      cy.get("mat-select[data-cy=field-type-input]").last().click();
      cy.get("mat-option")
        .contains(metadata.type)
        .then((option) => {
          option[0].click();
        });

      cy.get("[data-cy=metadata-name-input]")
        .last()
        .focus()
        .type(`${metadata.name}{enter}`);

      cy.get("[data-cy=metadata-human-name-input]")
        .last()
        .focus()
        .type(`${metadata.human_name}{enter}`);

      cy.get("[data-cy=metadata-value-input]")
        .last()
        .focus()
        .type(`${metaDataInvalidValue}{enter}`);

      cy.get("[data-cy=metadata-value-input]")
        .closest("mat-form-field")
        .find("mat-error")
        .contains("Invalid range");

      cy.get("button[data-cy=save-changes-button]").should("be.disabled");

      cy.get("[data-cy=metadata-value-input]")
        .last()
        .clear()
        .type(`${metadata.value}{enter}`);

      cy.get("[data-cy=metadata-unit-input]")
        .last()
        .focus()
        .type(`${metadata.unit}{enter}`);

      cy.get("button[data-cy=save-changes-button]").click();

      cy.finishedLoading();

      cy.contains("[role='tab']", "View").click();

      cy.contains("dynamic-mat-table mat-row", metadata.human_name);
      cy.contains("dynamic-mat-table mat-row", metadata.value);
      cy.contains("dynamic-mat-table mat-row", metadata.unit);

      cy.get("dynamic-mat-table table-menu button").click();

      cy.get('[role="menu"] button')
        .contains("Column setting")
        .click({ force: true });
      cy.get('[role="menu"]')
        .contains("Raw property name")
        .click({ force: true });
      cy.get('[role="menu"]').contains("Type").click({ force: true });

      cy.get('[role="menu"] .column-config-apply .done-setting')
        .contains("done")
        .click({ force: true });

      cy.contains(
        "dynamic-mat-table mat-header-row.header",
        "Raw property name",
      );
      cy.contains("dynamic-mat-table mat-header-row.header", "Type");
      cy.contains("dynamic-mat-table mat-row", metadata.name);
      cy.contains("dynamic-mat-table mat-row", metadata.type);

      cy.get("[mat-tab-nav-bar]")
        .contains("Scientific Metadata (JSON)")
        .click();

      cy.contains(metadata.name).click();

      cy.get('[data-cy="metadata-json-view"]').within(() => {
        cy.contains(`value: Array[2] [${metadata.value}]`).should("exist");
        cy.contains(`unit: "${metadata.unit}"`).should("exist");
        cy.contains(`valueSI: Array[2] [${metadata.valueSI}]`).should("exist");
        cy.contains(`unitSI: "${metadata.unitSI}"`).should("exist");
      });
    });
  });

  describe("Remove metadata item", () => {
    it("should go to dataset details and remove a metadata entry", () => {
      cy.visit("/datasets");

      cy.get(".dataset-table mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get('[data-cy="text-search"]').clear().type("Cypress");
      cy.get('[data-cy="search-button"]').click();

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
