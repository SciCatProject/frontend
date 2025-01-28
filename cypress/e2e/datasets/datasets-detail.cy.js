import { testConfig } from "../../fixtures/testData";

describe("Datasets detail view", () => {
  beforeEach(() => cy.reload(true));
  after(() => {
    cy.removeDatasets();
  });

  describe("Show dataset detail view with default component and fallback labels", () => {
    beforeEach(() => cy.reload(true));
    it("should load datasets with fallback labels", () => {
      const fallbackLabels = [
        "File Information",
        "Creator Information",
        "Dataset Name",
        "Description",
        "Orcid",
      ];

      cy.setupDatasetDetailView("fallbackDetailViewComponent");

      cy.wrap(fallbackLabels).each((value) => {
        cy.get("mat-card").should(($matCards) => {
          const matchFound = [...$matCards].some((card) =>
            card.innerText.includes(value),
          );
          expect(matchFound).to.be.true;
        });
      });
    });
  });

  describe("Show dataset detail view with default component and customized labels", () => {
    const defaultDetailViewComponent = testConfig.defaultDetailViewComponent;
    const customizedLabelSets =
      defaultDetailViewComponent.datasetDetailViewLabelOption.labelSets.test;

    it("should load datasets with customized labels", () => {
      cy.setupDatasetDetailView("defaultDetailViewComponent");

      cy.wrap(Object.values(customizedLabelSets)).each((value) => {
        cy.get("mat-card").should(($matCards) => {
          const matchFound = [...$matCards].some((card) =>
            card.innerText.includes(value),
          );
          expect(matchFound).to.be.true;
        });
      });
    });
  });

  describe("Show dataset detail view with customized component and labels", () => {
    const dynamicComponentConfig = testConfig.dynamicDetialViewComponent;
    const customizedLabelSets =
      dynamicComponentConfig.datasetDetailViewLabelOption.labelSets.test;
    const customizedComponents =
      dynamicComponentConfig.datasetDetailComponent.customization;
    beforeEach(() => cy.reload(true));
    it("should load datasets with customized labels", () => {
      cy.setupDatasetDetailView("dynamicDetialViewComponent");
      cy.wrap(Object.values(customizedLabelSets)).each((value) => {
        cy.get("body")
          .find('[data-cy="section-label"], [data-cy="field-label"]')
          .should("contain", value);
      });
    });

    it("should order sections based on customized settings", () => {
      cy.setupDatasetDetailView("dynamicDetialViewComponent");
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
      cy.setupDatasetDetailView("dynamicDetialViewComponent");

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
      cy.setupDatasetDetailView("dynamicDetialViewComponent");

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
          cy.wrap($img)
            .should("have.attr", "class")
            .and("contain", expectedSize);
        });
    });
  });
});
