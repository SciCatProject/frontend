import {
  defaultDatasetsColumnsList,
  personalizedDatasetsColumnsList,
} from "../../fixtures/testData";

// Column settings are persisted per user on the server and shared between the
// datasets list and the proposal-datasets table. Restore the official defaults
// so assertions are not affected by personalization from a previous test/run.
const resetDatasetColumns = () => {
  cy.visit("/datasets");
  cy.get("mat-table mat-header-row").should("exist");
  cy.finishedLoading();
  cy.contains("mat-icon", "more_vert").closest("button").click();
  cy.contains("button.mat-mdc-menu-item", "Default setting").click();
  cy.finishedLoading();
};

describe("1000 - Datasets list personalization", () => {
  before(() => {
    // The proposal uses a fixed proposalId and is reused across tests (and may
    // be created by a parallel spec), so clean up any leftover.
    cy.removeProposals();
    cy.login(Cypress.env("username"), Cypress.env("password"));
    resetDatasetColumns();
  });

  beforeEach(() => {
    cy.login(Cypress.env("username"), Cypress.env("password"));
  });

  afterEach(() => {
    cy.removeDatasets();
  });

  it("1010 - should be able to visit main datasets list with default columns", () => {
    cy.createDataset({ type: "raw" });
    cy.createProposal({}, { failOnStatusCode: false });

    cy.visit("/datasets");

    cy.get(".dataset-table mat-table mat-header-row").should("exist");

    cy.finishedLoading();

    cy.get(".dataset-table mat-table")
      .find("mat-header-row.header")
      .find("mat-header-cell")
      .not(".cdk-column-row-checkbox")
      .not(".cdk-column-table-menu")
      .find(".mat-sort-header-content")
      .each(($el, index) => {
        cy.wrap($el)
          .invoke("text")
          .invoke("trim")
          .should("eq", defaultDatasetsColumnsList[index]);
      });
  });

  it("1015 - should be able to visit proposals datasets list with default columns", () => {
    // Ensure the shared dataset column setting is at defaults before asserting
    // the proposal-datasets table (which mirrors it).
    resetDatasetColumns();

    cy.visit("/proposals/20170266");

    cy.finishedLoading();
    cy.get("proposal-detail .general-header").should("exist");

    cy.get(".mat-mdc-tab").contains("Datasets").click();

    cy.finishedLoading();
    cy.get(".proposal-dataset-table mat-table mat-header-row").should("exist");

    cy.get(".proposal-dataset-table mat-table")
      .find("mat-header-row.header")
      .find("mat-header-cell")
      .not(".cdk-column-row-checkbox")
      .not(".cdk-column-table-menu")
      .find(".mat-sort-header-content")
      .each(($el, index) => {
        cy.wrap($el)
          .invoke("text")
          .invoke("trim")
          .should("eq", defaultDatasetsColumnsList[index]);
      });
  });

  it("1020 - should be able to personalize the list datasets with selected columns", () => {
    cy.visit("/datasets");

    cy.get(".dataset-table mat-table mat-header-row").should("exist");

    cy.finishedLoading();

    cy.contains("mat-icon", "more_vert").closest("button").click();

    cy.contains("button.mat-mdc-menu-item", "Column setting").click();

    // Open column settings menu (already done earlier)
    // Enable columns
    cy.contains("label", "Start Time")
      .closest("mat-checkbox")
      .find("input")
      .check({ force: true });

    cy.contains("label", "End Time")
      .closest("mat-checkbox")
      .find("input")
      .check({ force: true });

    // Disable Image column
    cy.contains("label", "Image")
      .closest("mat-checkbox")
      .find("input")
      .uncheck({ force: true });

    // Auto-save: the change is persisted after a debounce, no explicit apply
    // button. Close the menu so the table is fully visible again.
    cy.get("body").type("{esc}");

    cy.get("mat-table")
      .find("mat-header-row.header")
      .find("mat-header-cell")
      .not(".cdk-column-row-checkbox")
      .not(".cdk-column-table-menu")
      .find(".mat-sort-header-content")
      .each(($el, index) => {
        cy.wrap($el)
          .invoke("text")
          .invoke("trim")
          .should("eq", personalizedDatasetsColumnsList[index]);
      });
  });

  it("1030 - should be able to save the personalized columns settings", () => {
    cy.visit("/datasets");

    cy.get(".dataset-table mat-table mat-header-row").should("exist");

    cy.finishedLoading();

    cy.contains("mat-icon", "more_vert").closest("button").click();

    cy.contains("button.mat-mdc-menu-item", "Column setting").click();

    // Open column settings menu (already done earlier)
    // Enable columns
    cy.contains("label", "Start Time")
      .closest("mat-checkbox")
      .find("input")
      .check({ force: true });

    cy.contains("label", "End Time")
      .closest("mat-checkbox")
      .find("input")
      .check({ force: true });

    // Disable Image column
    cy.contains("label", "Image")
      .closest("mat-checkbox")
      .find("input")
      .uncheck({ force: true });

    // Auto-save persists the change after a debounce (no apply/save buttons).
    cy.get("body").type("{esc}");

    cy.finishedLoading();

    // Reload/revisit and verify the personalized columns were persisted
    cy.visit("/datasets");

    cy.get(".dataset-table mat-table mat-header-row").should("exist");

    cy.finishedLoading();

    cy.get("mat-table")
      .find("mat-header-row.header")
      .find("mat-header-cell")
      .not(".cdk-column-row-checkbox")
      .not(".cdk-column-table-menu")
      .find(".mat-sort-header-content")
      .each(($el, index) => {
        cy.wrap($el)
          .invoke("text")
          .invoke("trim")
          .should("eq", personalizedDatasetsColumnsList[index]);
      });
  });

  it("1040 - should have the personalized columns settings after a logout/login", () => {
    const username = Cypress.env("username");
    const password = Cypress.env("password");

    cy.visit("/datasets");

    cy.finishedLoading();

    // log user out

    cy.get(".user-button").should("contain.text", username).click();

    cy.get("[data-cy=logout-button]").click();

    cy.finishedLoading();

    cy.get("login-form").should("exist");

    cy.reload();
    // Without reloading, the user will land on last visited page before logout
    // i.e. the dataset detail page, because the login page "remembers" the previousRoute.

    cy.url().should("include", "/login");

    cy.get('mat-tab-group [role="tab"]').contains("Local").click();

    cy.get("#usernameInput").type(username).should("have.value", username);
    cy.get("#passwordInput").type(password).should("have.value", password);

    cy.get("button[type=submit]").click();

    cy.url().should("include", "/datasets");

    // visit the datasets list
    cy.visit("/datasets");

    cy.get(".dataset-table mat-table mat-header-row").should("exist");

    cy.finishedLoading();

    cy.get("mat-table")
      .find("mat-header-row.header")
      .find("mat-header-cell")
      .not(".cdk-column-row-checkbox")
      .not(".cdk-column-table-menu")
      .find(".mat-sort-header-content")
      .each(($el, index) => {
        cy.wrap($el)
          .invoke("text")
          .invoke("trim")
          .should("eq", personalizedDatasetsColumnsList[index]);
      });
  });

  it("1045 - should be able to visit proposals datasets list with personalized columns", () => {
    cy.visit("/proposals/20170266");

    cy.finishedLoading();
    cy.get("proposal-detail .general-header").should("exist");

    cy.get(".mat-mdc-tab").contains("Datasets").click();

    cy.finishedLoading();
    cy.get(".proposal-dataset-table mat-table mat-header-row").should("exist");

    cy.get(".proposal-dataset-table mat-table")
      .find("mat-header-row.header")
      .find("mat-header-cell")
      .not(".cdk-column-row-checkbox")
      .not(".cdk-column-table-menu")
      .find(".mat-sort-header-content")
      .each(($el, index) => {
        cy.wrap($el)
          .invoke("text")
          .invoke("trim")
          .should("eq", personalizedDatasetsColumnsList[index]);
      });
  });

  it("1050 - should be able to restore default columns settings", () => {
    //const username = Cypress.env("username");
    //const password = Cypress.env("password");

    cy.visit("/datasets");

    cy.get(".dataset-table mat-table mat-header-row").should("exist");

    cy.finishedLoading();

    cy.contains("mat-icon", "more_vert").closest("button").click();

    cy.contains("button.mat-mdc-menu-item", "Default setting").click();

    cy.finishedLoading();

    cy.get("mat-table")
      .find("mat-header-row.header")
      .find("mat-header-cell")
      .not(".cdk-column-row-checkbox")
      .not(".cdk-column-table-menu")
      .find(".mat-sort-header-content")
      .each(($el, index) => {
        cy.wrap($el)
          .invoke("text")
          .invoke("trim")
          .should("eq", defaultDatasetsColumnsList[index]);
      });
  });

  it("1060 - should have the default columns settings after a logout/login", () => {
    const username = Cypress.env("username");
    const password = Cypress.env("password");

    cy.visit("/datasets");
    cy.finishedLoading();

    // log user out
    cy.get(".user-button").should("contain.text", username).click();

    cy.get("[data-cy=logout-button]").click();

    cy.finishedLoading();

    cy.get("login-form").should("exist");

    cy.reload();
    // Without reloading, the user will land on last visited page before logout
    // i.e. the dataset detail page, because the login page "remembers" the previousRoute.

    cy.url().should("include", "/login");

    cy.get('mat-tab-group [role="tab"]').contains("Local").click();

    cy.get("#usernameInput").type(username).should("have.value", username);
    cy.get("#passwordInput").type(password).should("have.value", password);

    cy.get("button[type=submit]").click();

    cy.url().should("include", "/datasets");

    // visit the datasets list
    cy.visit("/datasets");

    cy.get(".dataset-table mat-table mat-header-row").should("exist");

    cy.finishedLoading();

    cy.get("mat-table")
      .find("mat-header-row.header")
      .find("mat-header-cell")
      .not(".cdk-column-row-checkbox")
      .not(".cdk-column-table-menu")
      .find(".mat-sort-header-content")
      .each(($el, index) => {
        cy.wrap($el)
          .invoke("text")
          .invoke("trim")
          .should("eq", defaultDatasetsColumnsList[index]);
      });
  });

  it("1065 - should be able to visit proposals datasets list with default columns", () => {
    cy.visit("/proposals/20170266");

    cy.finishedLoading();
    cy.get("proposal-detail .general-header").should("exist");

    cy.get(".mat-mdc-tab").contains("Datasets").click();

    cy.finishedLoading();
    cy.get(".proposal-dataset-table mat-table mat-header-row").should("exist");

    cy.get(".proposal-dataset-table mat-table")
      .find("mat-header-row.header")
      .find("mat-header-cell")
      .not(".cdk-column-row-checkbox")
      .not(".cdk-column-table-menu")
      .find(".mat-sort-header-content")
      .each(($el, index) => {
        cy.wrap($el)
          .invoke("text")
          .invoke("trim")
          .should("eq", defaultDatasetsColumnsList[index]);
      });
  });
});
