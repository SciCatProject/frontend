describe("Datasets list configurable actions", () => {
  beforeEach(() => {
    cy.login(Cypress.env("username"), Cypress.env("password"));
  });

  afterEach(() => {
    cy.removeDatasets();
  });

  function visitDatasetsList() {
    cy.visit("/datasets");
    cy.get(".dataset-table mat-table mat-header-row").should("exist");
    cy.finishedLoading();
  }

  it("renders Add to Selection above the table and disables it without selected rows", () => {
    cy.createDataset({ type: "raw" });
    visitDatasetsList();

    cy.get('[data-cy="dataset-list-actions"]')
      .should("exist")
      .within(() => {
        cy.get('[data-action-id="add-to-selection"]')
          .should("contain.text", "Add to Selection")
          .should("be.disabled");
      });
    cy.get("#addToBatchButton").should("not.exist");
  });

  it("preserves existing selection and adds exactly the selected datasets", () => {
    cy.createDataset({ type: "raw" });
    cy.createDataset({ type: "raw" });
    cy.createDataset({ type: "raw" });
    cy.createDataset({ type: "raw" });
    visitDatasetsList();

    cy.get(".dataset-table mat-row").should("have.length.at.least", 4);

    // Seed the existing selection with the first dataset.
    cy.get(".dataset-table mat-row").eq(0).invoke("text").as("existingDataset");
    cy.get(".dataset-table mat-row input[type='checkbox']").eq(0).click();
    cy.get('[data-action-id="add-to-selection"]').click();

    // Select the second and third datasets, leaving the fourth unselected.
    cy.get(".dataset-table mat-row")
      .eq(1)
      .invoke("text")
      .as("selectedDatasetOne");
    cy.get(".dataset-table mat-row")
      .eq(2)
      .invoke("text")
      .as("selectedDatasetTwo");
    cy.get(".dataset-table mat-row input[type='checkbox']").eq(1).click();
    cy.get(".dataset-table mat-row input[type='checkbox']").eq(2).click();
    cy.get(".dataset-table mat-row")
      .eq(3)
      .invoke("text")
      .as("unselectedDataset");

    cy.get('[data-action-id="add-to-selection"]')
      .should("not.be.disabled")
      .click();
    cy.get('[data-action-id="add-to-selection"]').should("be.disabled");

    cy.get("#cartOnHeaderButton").click();
    cy.get('[data-cy="batch-table"] mat-row')
      .should("have.length", 3)
      .then(($rows) => {
        const cartText = $rows.text();
        cy.get("@existingDataset").then((dataset) =>
          expect(cartText).to.contain(dataset.trim()),
        );
        cy.get("@selectedDatasetOne").then((dataset) =>
          expect(cartText).to.contain(dataset.trim()),
        );
        cy.get("@selectedDatasetTwo").then((dataset) =>
          expect(cartText).to.contain(dataset.trim()),
        );
        cy.get("@unselectedDataset").then((dataset) =>
          expect(cartText).not.to.contain(dataset.trim()),
        );
      });
  });
});
