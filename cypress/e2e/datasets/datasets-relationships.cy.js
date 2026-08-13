import { mergeConfig } from "../../support/utils";

describe("Datasets relationships tab", () => {
  const relationships = {
    relationships: [
      {
        identifier:
          "https://scilog.development.psi.ch/logbooks/6895bea625f055bca783dfdd",
        identifierType: "URL",
        entityType: "Logbook",
        externalId: "6895bea625f055bca783dfdd",
      },
      {
        identifier: "10.1016/j.epsl.2011.11.037",
        identifierType: "DOI",
        entityType: "JournalArticle",
      },
    ],
  };

  beforeEach(() => {
    cy.login(Cypress.env("username"), Cypress.env("password"));
    cy.createDataset(relationships);
  });

  after(() => {
    cy.removeDatasets();
  });

  it("displays relationships table with correct values", () => {
    cy.visit("/datasets");
    cy.get(".dataset-table mat-row").contains("Cypress Dataset").click();
    cy.get("[data-cy=dataset-dashboard-tabs]")
      .contains("Relationships")
      .click();
    relationships.relationships.forEach((r, i) => {
      const vals = [
        r.identifierType == "URL" && r.externalId ? r.externalId : r.identifier,
        r.entityType,
        r.identifierType,
      ];
      Object.values(vals).forEach((v) => cy.get("mat-row").eq(i).contains(v));
    });
  });

  it("does not display relationships tab when disabled by config", () => {
    cy.readFile("CI/e2e/frontend.config.e2e.json").then((baseConfig) => {
      const mergedConfig = mergeConfig(baseConfig, {
        datasetRelationshipsEnabled: false,
      });
      cy.intercept("GET", "**/admin/config", mergedConfig).as(
        "getFrontendConfig",
      );
    });

    cy.visit("/datasets");
    cy.wait("@getFrontendConfig");
    cy.get(".dataset-table mat-row").contains("Cypress Dataset").click();
    cy.get("[data-cy=dataset-dashboard-tabs]").should(
      "not.contain",
      "Relationships",
    );
  });
});
