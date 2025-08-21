import { testData } from "../../fixtures/testData";

describe("Main Page", () => {
  beforeEach(() => {
    cy.login(Cypress.env("username"), Cypress.env("password"));
    cy.createDataset(
      "raw",
      "small", {
        datasetName: "Main Page Dataset Public",
        proposalId: "20150729",
        isPublished: true
      }
    );
    cy.createDataset(
      "raw",
      "small", {
        datasetName: "Main Page Dataset Non Public",
        proposalId: "20150729",
        isPublished: true
      }
    );
  });

  after(() => {
    cy.removeDatasets();
  });

  describe("Main page configuration as non authenticated user", () => {
    it("should visit main page correctly configured", () => {
      const username = Cypress.env("username");
      
      cy.visit("/");
      cy.finishedLoading();

      cy.get(".user-button").should("contain.text", username).click();

      cy.get("[data-cy=logout-button]").click();

      cy.finishedLoading();
      cy.visit("/");

      cy.finishedLoading();

      cy.get("breadcrumb > div > span > a").should('contain', "Datasets");

      cy.get("div.header mat-toolbar.mat-toolbar.mat-elevation-z1.mat-primary.mat-toolbar-single-row a").eq(0).should('have.attr','href','/datasets');
      cy.get("div.header mat-toolbar.mat-toolbar.mat-elevation-z1.mat-primary.mat-toolbar-single-row a").eq(1).should('have.attr','href','https://my.facility.site');

      cy.get("div.main-menu").click()

      cy.get('button.mat-mdc-menu-item:nth-child(1) > span:nth-child(2) > span:nth-child(1)').should('contain','Datasets')
      cy.get('button.mat-mdc-menu-item:nth-child(4) > span:nth-child(2) > span:nth-child(1)').should('contain','Published Data')

      cy.get('[data-cy="login-button"]').should('exist');

    });
  });

  describe("Main page configuration as authenticated user", () => {
    it("should visit main page correctly configured", () => {
      const username = Cypress.env("username");
      const password = Cypress.env("password");

      cy.visit("/");
      cy.finishedLoading();

      cy.url().should("include", "/proposals");

      cy.get("breadcrumb > div > span > a").should('contain', "Proposals");

      cy.get("div.header mat-toolbar.mat-toolbar.mat-elevation-z1.mat-primary.mat-toolbar-single-row a").eq(0).should('have.attr','href','/proposals');
      cy.get("div.header mat-toolbar.mat-toolbar.mat-elevation-z1.mat-primary.mat-toolbar-single-row a").eq(1).should('have.attr','href','https://my.facility.site');

      cy.get("div.main-menu").click()

      cy.get('button.mat-mdc-menu-item:nth-child(2) > span:nth-child(2) > span:nth-child(1)').should('contain','Files')

      cy.get("div.main-menu").click()

      cy.get('[data-cy="login-button"]').should('not.exist');
      cy.get('.user-button').should('exist');

    });
  });

});
