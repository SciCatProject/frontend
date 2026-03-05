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
});
