import { testConfig } from "../../fixtures/testData";

describe("Datasets Detail View Default", () => {
  beforeEach(() => {
    cy.intercept("GET", `**/admin/config`, (req) => {
      req.reply((res) => {
        res.send({
          ...res.body,
          ...testConfig.defaultDetailViewComponent,
        });
      });
    }).as("getFrontendConfig");
  });

  after(() => {
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
    cy.removeDatasets();
    cy.clearLocalStorage();
    cy.clearCookies();
  });
  const fallbackLabels = ["Creator Information", "Orcid"];

  const customizedLabels = [
    "Test Dataset name",
    "Test General Information",
    "Test Description",
  ];

  it("should load datasets with fallback labels", () => {
    cy.login(Cypress.env("username"), Cypress.env("password"));

    cy.createDataset("raw");
    cy.visit("/datasets");

    cy.wait("@getFrontendConfig");
    cy.get(".dataset-table mat-table mat-header-row").should("exist");

    cy.finishedLoading();

    cy.get('[data-cy="text-search"] input[type="search"]')
      .clear()
      .type("Cypress");

    cy.isLoading();

    cy.get("mat-row").contains("Cypress Dataset").click();

    cy.isLoading();

    cy.wrap([...fallbackLabels, ...customizedLabels]).each((value) => {
      cy.get("mat-card").should(($matCards) => {
        const matchFound = [...$matCards].some((card) =>
          card.innerText.includes(value),
        );
        expect(matchFound).to.be.true;
      });
    });
  });
});
