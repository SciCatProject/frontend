import { testData } from "../../fixtures/testData";

describe("Samples general", () => {
  beforeEach(() => {
    cy.login(Cypress.env("username"), Cypress.env("password"));
  });

  afterEach(() => {
    cy.removeSamples();
  });

  describe("Conditions", () => {
    it("should not show duplicated conditions in the same fullquery request when applying", () => {
      const sampleId = Math.floor(100000 + Math.random() * 900000).toString();
      cy.createSample({ ...testData.sample, sampleId });

      cy.visit("/samples");
      cy.finishedLoading();

      cy.get('[data-cy="add-condition-button"]').click();
      cy.get('input[name="lhs"]').type("test_characteristic");
      cy.get("mat-dialog-container").find('button[type="submit"]').click();

      cy.get(".condition-panel").first().click();
      cy.get(".condition-panel")
        .first()
        .within(() => {
          cy.get("mat-select").click();
        });

      cy.get("mat-option").contains("=").click();

      cy.get(".condition-panel")
        .first()
        .within(() => {
          cy.get("input[matInput]").eq(0).clear().type("10");
        });

      cy.intercept("GET", "**/samples/fullquery*").as("fullquery1");
      cy.get('[data-cy="samples-filters-search-button"]').click();
      cy.wait("@fullquery1").then((interception) => {
        const url = interception.request.url;
        const fields = new URL(url).searchParams.get("fields");
        cy.log("First apply - Fields:", fields);
      });

      cy.reload();
      cy.finishedLoading();

      cy.intercept("GET", "**/samples/fullquery*").as("fullquery2");
      cy.get('[data-cy="samples-filters-search-button"]').click();
      cy.wait("@fullquery2").then((interception) => {
        const url = interception.request.url;
        const fields = new URL(url).searchParams.get("fields");
        cy.log("Second apply - Fields:", fields);
      });

      cy.intercept("GET", "**/samples/fullquery*").as("fullquery3");
      cy.get('[data-cy="samples-filters-search-button"]').click();
      cy.wait("@fullquery3").then((interception) => {
        const url = interception.request.url;
        const fields = new URL(url).searchParams.get("fields");
        cy.log("Third apply - Fields:", fields);
      });

      cy.get(".condition-panel").first().click();

      cy.get('[data-cy="remove-condition-button"]').click();
    });
  });

  describe("Metadata Table", () => {
    it("should update sample metadata view right after adding a metadata key", () => {
      const sampleId = Math.floor(100000 + Math.random() * 900000).toString();
      const metadataName = "some name";
      const metadataValue = "some value";

      cy.createSample({ ...testData.sample, sampleId });

      cy.visit(`/samples/${sampleId}`);
      cy.finishedLoading();

      cy.scrollTo("bottom");

      cy.get('[role="tab"]').contains("Edit").click();

      cy.get('[data-cy="add-new-row"]').click();

      cy.get("mat-select[data-cy=field-type-input]").last().click();

      cy.get("mat-option")
        .contains("string")
        .then((option) => {
          option[0].click();
        });

      cy.get("[data-cy=metadata-name-input]")
        .last()
        .focus()
        .type(`${metadataName}{enter}`);
      cy.get("[data-cy=metadata-value-input]")
        .last()
        .focus()
        .type(`${metadataValue}{enter}`);

      cy.get("button[data-cy=save-changes-button]").click();

      cy.finishedLoading();

      cy.get('[role="tab"]').contains("View").click();
      cy.contains("dynamic-mat-table mat-row", metadataName).should("exist");
      cy.contains("dynamic-mat-table mat-row", metadataValue).should("exist");
    });
  });
});
