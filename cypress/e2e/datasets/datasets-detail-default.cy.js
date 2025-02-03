import { testConfig } from "../../fixtures/testData";
import { mergeConfig } from "../../support/utils";

describe("Datasets Detail View Default", () => {
  const defaultComponentConfig = testConfig.defaultDetailViewComponent;

  beforeEach(() => {
    cy.readFile("CI/e2e/frontend.config.e2e.json").then((baseConfig) => {
      const mergedConfig = mergeConfig(baseConfig, defaultComponentConfig);
      cy.intercept("GET", "**/admin/config", mergedConfig).as(
        "getFrontendConfig",
      );
    });

    cy.login(Cypress.env("username"), Cypress.env("password"));
    cy.createDataset("raw");
    cy.visit("/datasets");
    cy.wait("@getFrontendConfig");
  });

  after(() => {
    cy.removeDatasets();
  });

  it("should load datasets with fallback labels when no custom labels are available", () => {
    const fallbackLabelsToCheck = ["Creator Information", "Orcid"];
    const customizedLabelsToCheck = [
      "Test Dataset name",
      "Test General Information",
      "Test Description",
    ];

    cy.get(".dataset-table mat-table mat-header-row").should("exist");

    cy.finishedLoading();

    cy.get('[data-cy="text-search"] input[type="search"]')
      .clear()
      .type("Cypress");

    cy.isLoading();

    cy.get("mat-row").contains("Cypress Dataset").click();

    cy.isLoading();

    cy.wrap([...fallbackLabelsToCheck, ...customizedLabelsToCheck]).each(
      (value) => {
        cy.get("mat-card").should(($matCards) => {
          const matchFound = [...$matCards].some((card) =>
            card.innerText.includes(value),
          );
          expect(matchFound).to.be.true;
        });
      },
    );
  });
});
