describe("Datasets", () => {
  beforeEach(() => {
    cy.login(Cypress.env("username"), Cypress.env("password"));

    cy.intercept("PATCH", "/api/v3/datasets/**/*").as("metadata");
    cy.intercept("GET", "*").as("fetch");
  });

  after(() => {
    cy.removeDatasets();
  });

  describe("Reduce dataset", () => {
    it("should go to dataset details reduce tab and step through the workflow", () => {
      cy.createDataset({ type: "raw" });

      cy.visit("/datasets");

      cy.get(".dataset-table mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get('[data-cy="text-search"]').clear().type("Cypress");
      cy.get('[data-cy="search-button"]').click();

      cy.isLoading();

      cy.get("mat-row").contains("Cypress Dataset").click();

      cy.wait("@fetch");

      cy.contains("Reduce").click();
      cy.wait(1000);

      cy.contains("Analyze").click();
      cy.contains("Next").click();

      cy.get("mat-select[formControlName=scriptForm]").first().click();

      cy.get("mat-option")
        .contains("Plot")
        .then((option) => {
          option[0].click();
        });

      cy.get("#ScriptNext").click();
      cy.get("#runAction").click();
    });
  });
});
