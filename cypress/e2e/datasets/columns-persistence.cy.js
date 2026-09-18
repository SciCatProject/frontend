import { testData } from "../../fixtures/testData";
import { getHeader } from "../../support/utils";

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
    // The before() login does not survive Cypress retries (cookies are cleared
    // between attempts), so authenticate here to make every attempt deterministic.
    cy.login(Cypress.env("username"), Cypress.env("password"));
    cy.visit("/datasets");

    // finishedLoading() is a no-op during the initial app boot, so wait for the
    // actual table to exist before driving the column-settings menu.
    cy.get("dynamic-mat-table mat-table", { timeout: 20000 }).should("exist");

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
    cy.finishedLoading();

    // Applying the setting reloads the table data. In CI this is the first spec
    // to hit a freshly started backend, so give the table a generous window to
    // render its first rows (cold backend + first fullquery).
    cy.get("dynamic-mat-table mat-row", { timeout: 60000 }).should(
      "have.length.greaterThan",
      0,
    );

    // The settings panel stays open after "done". Dismiss it; force-click
    // the row to bypass any lingering overlay backdrop.
    cy.get("body").type("{esc}");
    cy.get(".column-config-apply button.done-setting").should("not.exist", {
      timeout: 5000,
    });

    // Assert the deselected column is gone from the header right after applying.
    cy.get("@removedColumn").then((text) => {
      cy.get("dynamic-mat-table mat-header-row.header").should(
        "not.contain",
        text,
      );
    });

    // Navigate into a dataset and back to verify persistence across navigation.
    cy.get("dynamic-mat-table mat-row").first().click({ force: true });
    cy.url().should("include", "/datasets/");

    cy.go("back");

    // reload and assert column not present after persistence
    cy.reload();
    cy.finishedLoading();
    cy.get("dynamic-mat-table mat-table", { timeout: 20000 }).should("exist");

    // After reload, assert that the removed column is no longer shown in the header
    cy.get("@removedColumn").then((text) => {
      cy.get("dynamic-mat-table mat-header-row.header").should(
        "not.contain",
        text,
      );
    });

    // Spec files share the same backend user settings in CI, so the column we
    // just deselected would leak into later specs and break their default-columns
    // assertions. Reset the settings server-side (same approach and body as the
    // personalization spec's before()) so the next spec starts with defaults.
    cy.getCookie("userId").then((userId) => {
      cy.getToken().then((token) => {
        cy.request({
          method: "PATCH",
          url: `${Cypress.env("baseUrl")}/users/${userId.value}/settings/external`,
          headers: getHeader(token),
          body: { fe_dataset_table_columns: [] },
          failOnStatusCode: false,
        });
      });
    });
  });
});
