import { testData } from "../../fixtures/testData";

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

  it("should persist deselected column across navigation and reload", () => {
    cy.visit("/datasets");

    // ensure table menu exists
    cy.get("dynamic-mat-table table-menu button").click();
    cy.get('[role="menu"] button').contains("Column setting").click();

    // capture the label of the first enabled column before deselecting it
    cy.get("mat-checkbox.column-config input[type=checkbox]:not(:disabled)")
      .first()
      .closest("mat-checkbox")
      .invoke("text")
      .then((text) => {
        cy.wrap(text.trim()).as("removedColumn");
      });

    // uncheck the first enabled column (skip pinned/prevent-hidden columns)
    cy.get("mat-checkbox.column-config input[type=checkbox]:not(:disabled)")
      .first()
      .uncheck({ force: true });

    // Apply persists the column setting automatically
    cy.contains(".column-config-apply button.done-setting", "done").click();

    // Navigate into a dataset and back
    cy.get("dynamic-mat-table mat-row").first().click();
    cy.url().should("include", "/datasets/");

    cy.go("back");

    // reload and assert column not present
    cy.reload();

    // After reload, assert that the removed column is no longer shown in the header
    cy.get("@removedColumn").then((text) => {
      cy.get("dynamic-mat-table mat-header-row.header").should(
        "not.contain",
        text,
      );
    });
  });
});
