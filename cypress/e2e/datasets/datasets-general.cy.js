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

      cy.get(".dataset-table mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get("mat-row").contains("Cypress Dataset").click();
    });
  });

  describe("Proposal connection and link from dataset details", () => {
    it("should be able to see and click proposal connection link from dataset details page", () => {
      const proposalId = Math.floor(100000 + Math.random() * 900000).toString();
      cy.createProposal({ ...testData.proposal, proposalId });
      cy.createDataset("raw", undefined, proposalId);

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

  describe("Dataset page filter and scientific condition UI test", () => {
    it("should not be able to add duplicated conditions ", () => {
      cy.visit("/datasets");

      cy.get(".user-button").click();

      cy.get("[data-cy=logout-button]").click();

      cy.finishedLoading();

      cy.visit("/datasets");

      cy.get('[data-cy="scientific-condition-filter-list"]').within(() => {
        cy.get('button').contains('Add Conditions').click();
      });

      cy.get('input[name="lhs"]').type("test");
      cy.get('input[name="rhs"]').type("1");

      cy.get('button[type="submit"]').click();

      cy.get('[data-cy="scientific-condition-filter-list"]').within(() => {
        cy.get('button').contains('Add Conditions').click();
      });

      cy.get('input[name="lhs"]').type("test");
      cy.get('input[name="rhs"]').type("1");

      cy.get('button[type="submit"]').click();

      cy.get(".snackbar-warning")
        .should("contain", "Condition already exists")
        .contains("Close")
        .click();

      cy.get('[data-cy="scientific-condition-filter-list"]')
        .find('.condition-panel')
        .should("have.length", 1);

      cy.get('[data-cy="scientific-condition-filter-list"]').within(() => {
        cy.get('button').contains('Add Conditions').click();
      });

      cy.get('input[name="lhs"]').type("test");
      cy.get('input[name="rhs"]').type("2");

      cy.get('button[type="submit"]').click();

      cy.get('[data-cy="scientific-condition-filter-list"]')
        .find('.condition-panel')
        .should("have.length", 2);
    });

    it("should be able to manage conditions using expansion panels", () => {
      cy.visit("/datasets");

      cy.get(".user-button").click();

      cy.get("[data-cy=logout-button]").click();

      cy.finishedLoading();

      cy.visit("/datasets");

      cy.get('[data-cy="scientific-condition-filter-list"]').within(() => {
        cy.get('button').contains('Add Conditions').click();
      });

      cy.get('input[name="lhs"]').type("test 3");
      cy.get('input[name="rhs"]').type("3");

      cy.get('button[type="submit"]').click();

      cy.get('.condition-panel').first().click();

      cy.get('.condition-details').should('be.visible');

      cy.get('.condition-details').within(() => {
        cy.get('mat-select').should('exist');
        cy.get('input[matInput]').should('exist');
        cy.get('mat-slide-toggle').should('exist');
        cy.get('button').contains('Remove').should('exist');
      });

      cy.get('.condition-details').within(() => {
        cy.get('mat-slide-toggle').click();
      });

      cy.get('.condition-panel').should('have.class', 'disabled');

      cy.get('.condition-details').within(() => {
        cy.get('button').contains('Remove').click();
      });

      cy.get('[data-cy="scientific-condition-filter-list"]')
        .find('.condition-panel')
        .should("have.length", 0);
    });

  });

  describe("Pre-configured filters test", () => {
    beforeEach(() => {
      cy.readFile("CI/e2e/frontend.config.e2e.json").then((baseConfig) => {
        const testConfig = {
          ...baseConfig,
          defaultDatasetsListSettings: {
            ...baseConfig.defaultDatasetsListSettings,
            filters: [
              { "TypeFilter": true },
              { "TextFilter": true }
            ]
          }
        };

        cy.intercept("GET", "**/admin/config", testConfig).as("getConfig");
      });

      cy.login(Cypress.env("username"), Cypress.env("password"));
      cy.visit("/datasets");
      cy.wait("@getConfig");
      cy.finishedLoading();
    });

    it("should automatically apply pre-configured filters from config", () => {
      cy.contains("Type").should("exist");

      cy.get('[data-cy="text-search"]').should("exist");

      cy.contains("Location").should("not.exist");
      cy.contains("Keyword").should("not.exist");
    });
  });


  describe("Pre-configured conditions test", () => {
    beforeEach(() => {
      cy.clearCookies();
      cy.clearLocalStorage();
      cy.readFile("CI/e2e/frontend.config.e2e.json").then((baseConfig) => {
        const testConfig = {
          ...baseConfig,
          defaultDatasetsListSettings: {
            ...baseConfig.defaultDatasetsListSettings,
            conditions: [
              {
                "condition": {
                  "lhs": "extra_entry_end_time",
                  "relation": "GREATER_THAN",
                  "rhs": 1,
                  "unit": ""
                },
                "enabled": true
              }
            ]
          }
        };

        cy.intercept("GET", "**/admin/config", testConfig).as("getConfig");
      });

      cy.visit("/datasets");
      cy.wait("@getConfig");
      cy.finishedLoading();
    });

    it("should check if pre-configured conditions are applied", () => {
      cy.get('[data-cy="scientific-condition-filter-list"] .condition-panel')
        .should('contain.text', 'extra_entry_end_time')
        .and('contain.text', '>')
        .and('contain.text', '1');

      cy.get('.condition-panel').first().click();

      cy.get('mat-row').then($rowsWithCondition => {
        const countWithCondition = $rowsWithCondition.length;

        cy.get('.condition-details').first().within(() => {
          cy.get('mat-slide-toggle').click();
        });

        cy.get('button').contains('Apply').click();

        cy.get('mat-row').should($rowsWithoutCondition => {
          expect($rowsWithoutCondition.length).to.be.greaterThan(countWithCondition);
        });
      });

    });
  });

});
