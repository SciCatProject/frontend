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

  it("adds selected datasets to the existing selection and clears table selection", () => {
    cy.createDataset({ type: "raw" });
    cy.createDataset({ type: "raw" });
    visitDatasetsList();

    cy.get(".dataset-table mat-row").should("have.length.at.least", 2);
    cy.get(".dataset-table mat-row input[type='checkbox']").eq(0).click();
    cy.get(".dataset-table mat-row input[type='checkbox']").eq(1).click();

    cy.get('[data-action-id="add-to-selection"]')
      .should("not.be.disabled")
      .click();

    cy.get('[data-action-id="add-to-selection"]').should("be.disabled");
    cy.get("#cartOnHeaderButton").click();
    cy.get('[data-cy="batch-table"] mat-row').should("have.length", 2);
  });
});
