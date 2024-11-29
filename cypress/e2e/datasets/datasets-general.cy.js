import { testData } from "../../fixtures/testData";

describe("Datasets general", () => {
  beforeEach(() => {
    cy.login(Cypress.env("username"), Cypress.env("password"));
  });

  after(() => {
    cy.removeDatasets();
  });

  describe("Show dataset table after logout and login", () => {
    it("should be able to see datasets after visiting details page logout and login again", () => {
      const username = Cypress.env("username");
      const password = Cypress.env("password");

      cy.createDataset("raw");

      cy.visit("/datasets");

      cy.get(".dataset-table mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get('[data-cy="text-search"] input[type="search"]')
        .clear()
        .type("Cypress");

      cy.isLoading();

      cy.get("mat-row").contains("Cypress Dataset").click();

      cy.get('[data-cy="edit-general-information"]').should("exist");

      cy.get(".user-button").should("contain.text", username).click();

      cy.get("[data-cy=logout-button]").click();

      cy.finishedLoading();

      cy.url().should("include", "/login");

      cy.get('mat-tab-group [role="tab"]').contains("Local").click();

      cy.get("#usernameInput").type(username).should("have.value", username);
      cy.get("#passwordInput").type(password).should("have.value", password);

      cy.get("button[type=submit]").click();

      cy.url().should("include", "/datasets");

      cy.get(".dataset-table mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get("mat-row").contains("Cypress Dataset").click();
    });
  });

  describe("Proposal connection and link from dataset details", () => {
    it("should be able to see and click proposal connection link from dataset details page", () => {
      const proposalId = Math.floor(100000 + Math.random() * 900000).toString();
      cy.createProposal({ ...testData.proposal, proposalId });
      cy.createDataset("raw", proposalId);

      cy.visit("/datasets");

      cy.get(".dataset-table mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get('[data-cy="text-search"] input[type="search"]')
        .clear()
        .type("Cypress");

      cy.isLoading();

      cy.get("mat-row").contains("Cypress Dataset").click();

      cy.get('[data-cy="edit-general-information"]').should("exist");

      cy.contains(testData.proposal.title).click();

      cy.url().should("include", "/proposals");

      cy.contains(testData.proposal.title);

      cy.login(
        Cypress.env("secondaryUsername"),
        Cypress.env("secondaryPassword"),
      );

      cy.deleteProposal(proposalId);
    });
  });

  describe.only("Dataset page filter and scientific condition UI test", () => {
    it("should not be able to add duplicated conditions ", () => {
      cy.visit("/datasets");

      cy.get(".user-button").click();

      cy.get("[data-cy=logout-button]").click();

      cy.finishedLoading();

      cy.visit("/datasets");

      cy.get('[data-cy="more-filters-button"]').click();

      cy.get('[data-cy="add-scientific-condition-button"]').click();

      cy.get('input[name="lhs"]').type("test");
      cy.get('input[name="rhs"]').type("1");

      cy.get('button[type="submit"]').click();

      cy.get('[data-cy="add-scientific-condition-button"]').click();

      cy.get('input[name="lhs"]').type("test");
      cy.get('input[name="rhs"]').type("1");

      cy.get('button[type="submit"]').click();

      cy.get(".snackbar-warning")
        .should("contain", "Condition already exists")
        .contains("Close")
        .click();

      cy.get('[data-cy="scientific-condition-filter-list"').should(
        "have.length",
        1,
      );

      cy.get('[data-cy="add-scientific-condition-button"]').click();

      cy.get('input[name="lhs"]').type("test");
      cy.get('input[name="rhs"]').type("2");

      cy.get('button[type="submit"]').click();

      cy.get('[data-cy="scientific-condition-filter-list"]')
        .find("input")
        .should("have.length", 2);
    });
  });
});
