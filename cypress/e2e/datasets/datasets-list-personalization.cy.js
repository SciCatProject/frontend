import { testData, defaultDatasetsColumnsList, personalizedDatasetsColumnsList } from "../../fixtures/testData";

describe("1000 - Datasets list personalization", () => {
  beforeEach(() => {
    cy.login(Cypress.env("username"), Cypress.env("password"));
  });

  afterEach(() => {
    cy.removeDatasets();
  });

  it("1010 - should be able to list datasets with default columns", () => {
    const username = Cypress.env("username");
    const password = Cypress.env("password");

    cy.createDataset({ type: "raw" });

    cy.visit("/datasets");

    cy.get(".dataset-table mat-table mat-header-row").should("exist");

    cy.finishedLoading();

    cy.get('mat-table')
      .find('mat-header-row.header')
      .find('mat-header-cell')
      .not('.cdk-column-row-checkbox')
      .not('.cdk-column-table-menu')
      .find('.mat-sort-header-content')
      .each(($el, index) => {
        cy.wrap($el)
          .invoke('text')
          .invoke('trim')
          .should('eq', defaultDatasetsColumnsList[index]);
      });
  });

  it("1020 - should be able to personalize the list datasets with selected columns", () => {
    //const username = Cypress.env("username");
    //const password = Cypress.env("password");

    cy.visit("/datasets");

    cy.get(".dataset-table mat-table mat-header-row").should("exist");

    cy.finishedLoading();

    cy.contains('mat-icon', 'more_vert')
      .closest('button')
      .click()

    cy.contains('button.mat-mdc-menu-item', 'Column setting')
      .click()

    // Open column settings menu (already done earlier)
    // Enable columns
    cy.contains('label', 'Start Time')
      .closest('mat-checkbox')
      .find('input')
      .check({ force: true })

    cy.contains('label', 'End Time')
      .closest('mat-checkbox')
      .find('input')
      .check({ force: true })

    // Disable Image column
    cy.contains('label', 'Image')
      .closest('mat-checkbox')
      .find('input')
      .uncheck({ force: true })

    // Apply
    cy.contains('mat-icon', 'done')
      .closest('button')
      .click()

    cy.get('mat-table')
      .find('mat-header-row.header')
      .find('mat-header-cell')
      .not('.cdk-column-row-checkbox')
      .not('.cdk-column-table-menu')
      .find('.mat-sort-header-content')
      .each(($el, index) => {
        cy.wrap($el)
          .invoke('text')
          .invoke('trim')
          .should('eq', personalizedDatasetsColumnsList[index]);
      });
  });

  it("1030 - should be able to save the personalized columns settings", () => {
    //const username = Cypress.env("username");
    //const password = Cypress.env("password");

    cy.visit("/datasets");

    cy.get(".dataset-table mat-table mat-header-row").should("exist");

    cy.finishedLoading();

    cy.contains('mat-icon', 'more_vert')
      .closest('button')
      .click()

    cy.contains('button.mat-mdc-menu-item', 'Column setting')
      .click()

    // Open column settings menu (already done earlier)
    // Enable columns
    cy.contains('label', 'Start Time')
      .closest('mat-checkbox')
      .find('input')
      .check({ force: true })

    cy.contains('label', 'End Time')
      .closest('mat-checkbox')
      .find('input')
      .check({ force: true })

    // Disable Image column
    cy.contains('label', 'Image')
      .closest('mat-checkbox')
      .find('input')
      .uncheck({ force: true })

    // Apply
    cy.contains('mat-icon', 'done')
      .closest('button')
      .click()

    cy.finishedLoading();

    cy.contains('mat-icon', 'more_vert')
      .closest('button')
      .click()

    cy.contains('button.mat-mdc-menu-item', 'Save table setting')
      .click()

    cy.visit("/datasets");

    cy.get('mat-table')
      .find('mat-header-row.header')
      .find('mat-header-cell')
      .not('.cdk-column-row-checkbox')
      .not('.cdk-column-table-menu')
      .find('.mat-sort-header-content')
      .each(($el, index) => {
        cy.wrap($el)
          .invoke('text')
          .invoke('trim')
          .should('eq', personalizedDatasetsColumnsList[index]);
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

    cy.finishedLoading();

    // visit the datasets list
    cy.visit("/datasets");

    cy.get(".dataset-table mat-table mat-header-row").should("exist");

    cy.finishedLoading();

    cy.get('mat-table')
      .find('mat-header-row.header')
      .find('mat-header-cell')
      .not('.cdk-column-row-checkbox')
      .not('.cdk-column-table-menu')
      .find('.mat-sort-header-content')
      .each(($el, index) => {
        cy.wrap($el)
          .invoke('text')
          .invoke('trim')
          .should('eq', personalizedDatasetsColumnsList[index]);
      });
  });

  it("1050 - should be able to restore default columns settings", () => {
    //const username = Cypress.env("username");
    //const password = Cypress.env("password");

    cy.visit("/datasets");

    cy.get(".dataset-table mat-table mat-header-row").should("exist");

    cy.finishedLoading();

    cy.contains('mat-icon', 'more_vert')
      .closest('button')
      .click()

    cy.contains('button.mat-mdc-menu-item', 'Default setting')
      .click()

    cy.finishedLoading();

    cy.get('mat-table')
      .find('mat-header-row.header')
      .find('mat-header-cell')
      .not('.cdk-column-row-checkbox')
      .not('.cdk-column-table-menu')
      .find('.mat-sort-header-content')
      .each(($el, index) => {
        cy.wrap($el)
          .invoke('text')
          .invoke('trim')
          .should('eq', defaultDatasetsColumnsList[index]);
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

    cy.finishedLoading();

    // visit the datasets list
    cy.visit("/datasets");

    cy.get(".dataset-table mat-table mat-header-row").should("exist");

    cy.finishedLoading();

    cy.contains('mat-icon', 'more_vert')
      .closest('button')
      .click()

    cy.contains('button.mat-mdc-menu-item', 'Save table setting')
      .click()

    cy.get('mat-table')
      .find('mat-header-row.header')
      .find('mat-header-cell')
      .not('.cdk-column-row-checkbox')
      .not('.cdk-column-table-menu')
      .find('.mat-sort-header-content')
      .each(($el, index) => {
        cy.wrap($el)
          .invoke('text')
          .invoke('trim')
          .should('eq', defaultDatasetsColumnsList[index]);
      });
  });

});
