import { testConfig } from "../../fixtures/testData";
import { mergeConfig } from "../../support/utils";

describe("Datasets Detail View Dynamic", () => {
  const dynamicComponentConfig = testConfig.dynamicDetialViewComponent;
  const customizedLabelSets =
    dynamicComponentConfig.labelsLocalization.datasetCustom;
  const customizedComponents =
    dynamicComponentConfig.datasetDetailComponent.customization;

  beforeEach(() => {
    cy.readFile("CI/e2e/frontend.config.e2e.json").then((baseConfig) => {
      const mergedConfig = mergeConfig(baseConfig, dynamicComponentConfig);
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

  it("should load datasets with customized labels", () => {
    cy.get(".dataset-table mat-table mat-header-row").should("exist");

    cy.finishedLoading();

    cy.get('[data-cy="text-search"] input[type="search"]')
      .clear()
      .type("Cypress");

    cy.isLoading();

    cy.get("mat-row").contains("Cypress Dataset").click();

    cy.isLoading();
    cy.wrap(Object.values(customizedLabelSets)).each((value) => {
      cy.get("body")
        .find('[data-cy="section-label"], [data-cy="field-label"]')
        .should("contain", value);
    });
  });

  it("should order sections based on customized settings", () => {
    cy.get(".dataset-table mat-table mat-header-row").should("exist");

    cy.finishedLoading();

    cy.get('[data-cy="text-search"] input[type="search"]')
      .clear()
      .type("Cypress");

    cy.isLoading();

    cy.get("mat-row").contains("Cypress Dataset").click();

    cy.isLoading();
    const sortedLabels = customizedComponents
      .sort((a, b) => a.order - b.order)
      .map((section) => section.label);

    cy.wrap(sortedLabels).each((label, index) => {
      cy.get('[data-cy="section-label"]')
        .eq(index)
        .should("contain", customizedLabelSets[label]);
    });
  });

  it("should order fields based on customized settings", () => {
    cy.get(".dataset-table mat-table mat-header-row").should("exist");

    cy.finishedLoading();

    cy.get('[data-cy="text-search"] input[type="search"]')
      .clear()
      .type("Cypress");

    cy.isLoading();

    cy.get("mat-row").contains("Cypress Dataset").click();

    cy.isLoading();
    const componentLabel = "Section Label Regular";
    const sectionToTest = customizedComponents.find(
      (section) => section.label === componentLabel,
    );
    cy.wrap(sectionToTest).should("not.be.undefined");

    cy.wrap(sectionToTest.fields)
      .then((fields) => fields.sort((a, b) => a.order - b.order))
      .each((field, index) => {
        cy.get('[data-cy="field-label"]')
          .eq(index)
          .should("contain", customizedLabelSets[field.source]);
      });
  });

  it("should render attachments section with customized settings", () => {
    cy.get(".dataset-table mat-table mat-header-row").should("exist");

    cy.finishedLoading();

    cy.get('[data-cy="text-search"] input[type="search"]')
      .clear()
      .type("Cypress");

    cy.isLoading();

    cy.get("mat-row").contains("Cypress Dataset").click();

    cy.isLoading();
    const componentLabel = "Section Label Attachments";
    const sectionToTest = customizedComponents.find(
      (section) => section.label === componentLabel,
    );
    const actualImageCount = 5;
    const expectedImageCount = sectionToTest.options.limit;
    const expectedSize = sectionToTest.options.size;

    cy.get(".mat-mdc-tab-link").contains("Attachments").click();

    cy.uploadDatasetAttachments(actualImageCount);

    cy.isLoading();

    cy.get(".mat-mdc-tab-link").contains("Details").click();

    cy.get('[data-cy="section-label"]')
      .contains(customizedLabelSets["Section Label Attachments"])
      .parent()
      .find("img")
      .should("have.length", expectedImageCount)
      .each(($img) => {
        cy.wrap($img).should("have.attr", "class").and("contain", expectedSize);
      });
  });
});
