describe("Datasets columns persistence", () => {
  before(() => {
    cy.login(Cypress.env("username"), Cypress.env("password"));
    cy.createDataset({
      type: "raw",
      dataFileSize: "small",
      datasetName: "Columns Persistence Dataset",
    });
  });

  after(() => {
    cy.removeDatasets();
  });

  it("should auto-save a deselected column and keep it hidden after reload", () => {
    cy.visit("/datasets");

    cy.get(".dataset-table mat-table mat-header-row").should("exist");
    cy.finishedLoading();

    const removedHeader = "Image";
    const retainedHeader = "PID";
    const headerCell = 'mat-header-row.header mat-header-cell';

    cy.get(headerCell).should("contain.text", removedHeader);

    // Open the table menu -> Column setting
    cy.get("dynamic-mat-table table-menu button").first().click();
    cy.contains("button.mat-mdc-menu-item", "Column setting").click();

    // Auto-save: unchecking triggers a debounced save, no explicit apply button
    cy.contains("label", removedHeader)
      .closest("mat-checkbox")
      .find("input")
      .uncheck({ force: true });

    // The header disappears immediately after the toggle
    cy.get(headerCell).should("not.contain.text", removedHeader);

    // Reload and verify the change persisted (auto-save), without any
    // "done" / "Save table setting" controls being used.
    cy.reload();

    cy.get(".dataset-table mat-table mat-header-row").should("exist");
    cy.finishedLoading();

    // The deselected column stays absent, while the table still renders the
    // retained columns (proving it is not just a failed/empty table render).
    cy.get(headerCell).should("not.contain.text", removedHeader);
    cy.get(headerCell).should("contain.text", retainedHeader);
  });
});
