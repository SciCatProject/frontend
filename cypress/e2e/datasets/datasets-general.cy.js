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
    beforeEach(() => {
      cy.createDataset(
        "raw",
        testData.rawDataset.datasetName,
        undefined,
        "small",
        {
          scientificMetadata: {
            extra_entry_end_time: { type: "number", value: 2, unit: "" },
          },
          isPublished: true,
        },
      );
    });

    it("should not be able to add duplicated conditions ", () => {
      cy.visit("/datasets");

      cy.get(".user-button").click();

      cy.get("[data-cy=logout-button]").click();

      cy.finishedLoading();

      cy.visit("/datasets");

      cy.get('[data-cy="scientific-condition-filter-list"]').within(() => {
        cy.get('[data-cy="add-condition-button"]').click();
      });

      cy.get('input[name="lhs"]').type("extra_entry_end_time");

      cy.get("mat-dialog-container").find('button[type="submit"]').click();

      cy.get(".condition-panel").first().click();

      cy.get(".condition-panel")
        .first()
        .within(() => {
          cy.get("mat-select").click();
        });

      cy.get('mat-option[ng-reflect-value="GREATER_THAN"]', { timeout: 10000 }).click();

      cy.get(".condition-panel")
        .first()
        .within(() => {
          cy.get("input[matInput]").eq(0).clear().type("1");
        });

      cy.get('[data-cy="scientific-condition-filter-list"]').within(() => {
        cy.get('[data-cy="add-condition-button"]').click();
      });

      cy.get('input[name="lhs"]').type("extra_entry_end_time");

      cy.get("mat-dialog-container").find('button[type="submit"]').click();

      cy.get(".snackbar-warning")
        .should("contain", "Field already used")
        .contains("Close")
        .click();
    });

    it("should be able to manage conditions using expansion panels", () => {
      cy.visit("/datasets");

      cy.get(".user-button").click();

      cy.get("[data-cy=logout-button]").click();

      cy.finishedLoading();

      cy.visit("/datasets");

      cy.get('[data-cy="scientific-condition-filter-list"]').within(() => {
        cy.get('[data-cy="add-condition-button"]').click();
      });

      cy.get('input[name="lhs"]').type("extra_entry_end_time");

      cy.get("mat-dialog-container").find('button[type="submit"]').click();

      // expand the condition
      cy.get(".condition-panel").first().click();
      // change operator
      cy.get(".condition-panel")
        .first()
        .within(() => {
          cy.get("mat-select").click();
        });

      cy.get('mat-option[ng-reflect-value="LESS_THAN"]', { timeout: 10000 }).click();
      // change value
      cy.get(".condition-panel")
        .first()
        .within(() => {
          cy.get("input[matInput]").eq(0).clear().type("3");
        });

      // disable the condition
      cy.get("mat-slide-toggle").click();
      cy.get(".condition-panel").should("have.class", "disabled");

      // enable it again
      cy.get("mat-slide-toggle").click();

      // remove the condition
      cy.get("button").contains("Remove").click();

      cy.get('[data-cy="scientific-condition-filter-list"]')
        .find(".condition-panel")
        .should("have.length", 0);
    });
  });

  describe("Pre-configured filters test", () => {
    beforeEach(() => {
      cy.clearCookies();
      cy.clearLocalStorage();
      cy.readFile("CI/e2e/frontend.config.e2e.json").then((baseConfig) => {
        const testConfig = {
          ...baseConfig,
          defaultDatasetsListSettings: {
            ...baseConfig.defaultDatasetsListSettings,
            filters: [{ TypeFilter: true }, { TextFilter: true }],
          },
        };

        cy.intercept("GET", "**/admin/config", testConfig).as("getConfig");
        cy.visit("/datasets");
        cy.wait("@getConfig", { timeout: 10000 });
        cy.finishedLoading();
      });
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
      cy.login(Cypress.env("username"), Cypress.env("password"));
      cy.createDataset(
        "raw",
        testData.rawDataset.datasetName,
        undefined,
        "small",
        {
          scientificMetadata: {
            extra_entry_end_time: { type: "number", value: 2, unit: "" },
          },
          isPublished: true,
        },
      ).then(() => {
        cy.visit("/datasets");
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.readFile("CI/e2e/frontend.config.e2e.json").then((baseConfig) => {
          const relationsToTest = [
            { relation: "GREATER_THAN", rhs: 1 },
            { relation: "LESS_THAN", rhs: 3 },
            { relation: "EQUAL_TO_NUMERIC", rhs: 2 },
            { relation: "GREATER_THAN_OR_EQUAL", rhs: 2 },
            { relation: "LESS_THAN_OR_EQUAL", rhs: 2 },
            { relation: "RANGE", rhs: [1, 3] },
          ];
          const testConfig = {
            ...baseConfig,
            defaultDatasetsListSettings: {
              ...baseConfig.defaultDatasetsListSettings,
              conditions: relationsToTest.map(({ relation, rhs }) => ({
                condition: {
                  lhs: "extra_entry_end_time",
                  relation,
                  rhs,
                  unit: "",
                },
                enabled: true,
              })),
            },
          };

          cy.intercept("GET", "**/admin/config", testConfig).as("getConfig");
          cy.visit("/datasets");
          cy.wait("@getConfig", { timeout: 10000 });
          cy.finishedLoading();
        });
      });
    });

    it("should check if pre-configured conditions are applied", () => {
      cy.get('[data-cy="scientific-condition-filter-list"] .condition-panel')
        .should("contain.text", "extra_entry_end_time")
        .and("contain.text", ">")
        .and("contain.text", "1");

      cy.get(".dataset-table mat-table").should("exist");
      cy.get(".dataset-table mat-row").first().click();
      cy.get(".metadataTable", { timeout: 10000 }).scrollIntoView();

      cy.get(".metadataTable mat-row").within(() => {
        cy.get(".mat-column-human_name label")
          .invoke("text")
          .then((fieldName) => {
            if (fieldName && fieldName.trim() === "Extra Entry End Time") {
              cy.get(".mat-column-value label")
                .invoke("text")
                .then((valueText) => {
                  const value = parseFloat(valueText.trim());
                  expect(value).to.be.greaterThan(1);
                });
            }
          });
      });
    });
  });
});
