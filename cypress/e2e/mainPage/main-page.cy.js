import { testData } from "../../fixtures/testData";

describe("Main Page", () => {
  beforeEach(() => {
    cy.login(Cypress.env("username"), Cypress.env("password"));
    cy.createDataset(
      "raw",
      "Main Page Dataset Public",
      "20150729",
      "small",
      true,
    );
    cy.createDataset(
      "raw",
      "Main Page Dataset Non Public",
      "20150729",
      "small",
      false,
    );
  });

  after(() => {
    cy.removeDatasets();
  });

  describe("Main page configuration as non authenticated user", () => {
    it("should visit main page correctly configured", () => {
      cy.visit("http://localhost:3000");

      cy.finishedLoading();

      cy.get("breadcrumb div span a").should('contain', "Datasets");

      cy.get("div.header mat-toolbar.mat-toolbar.mat-elevation-z1.mat-primary.mat-toolbar-single-row a").eq(0).should('have.attr','href','/datasets');
      cy.get("div.header mat-toolbar.mat-toolbar.mat-elevation-z1.mat-primary.mat-toolbar-single-row a").eq(1).should('have.attr','href','https://my.facility.eu');
        
      cy.get('#mat-mdc-menu-panel-0 mat-mdc-menu-content div mat-mdc-menu-item-text span').eq(0).should('contain','Datasets')
      cy.get('#mat-mdc-menu-panel-0 mat-mdc-menu-content div mat-mdc-menu-item-text span').eq(1).should('contain','Instruments')
      cy.get('#mat-mdc-menu-panel-0 mat-mdc-menu-content div mat-mdc-menu-item-text span').eq(0).should('contain','Proposals')
      cy.get('#mat-mdc-menu-panel-0 mat-mdc-menu-content div mat-mdc-menu-item-text span').eq(0).should('contain','Published Data')

      cy.get('[data-cy="login-button"]').should('exists');

      //cy.get("mat-row").contains("Main Page Dataset Public").click();
    });
  });

  describe("Main page configuration as authenticated user", () => {
    it("should visit main page correctly configured", () => {
      const username = Cypress.env("username");
      const password = Cypress.env("password");

      cy.visit("/login");

      cy.finishedLoading();

      cy.url().should("include", "/login");

      cy.get('mat-tab-group [role="tab"]').contains("Local").click();

      cy.get("#usernameInput").type(username).should("have.value", username);
      cy.get("#passwordInput").type(password).should("have.value", password);

      cy.get("button[type=submit]").click();

      cy.url().should("include", "/proposals");

      cy.finishedLoading();

      cy.get("breadcrumb div span a").should('contain', "Proposals");

      cy.get("div.header mat-toolbar.mat-toolbar.mat-elevation-z1.mat-primary.mat-toolbar-single-row a").eq(0).should('have.attr','href','/proposals');
      cy.get("div.header mat-toolbar.mat-toolbar.mat-elevation-z1.mat-primary.mat-toolbar-single-row a").eq(1).should('have.attr','href','my.facility.eu');
        
      cy.get('#mat-mdc-menu-panel-0 mat-mdc-menu-content div mat-mdc-menu-item-text span').eq(1).should('contain','Files')

      cy.get('[data-cy="login-button"]').should('not exists');
      cy.get('user-button').should('exists');

      //cy.get("mat-row").contains("Main Page Dataset Non Public").click();
    });
  });

});
