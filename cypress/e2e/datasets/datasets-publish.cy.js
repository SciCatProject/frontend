describe("Datasets", () => {
  beforeEach(() => {
    cy.login(Cypress.env("username"), Cypress.env("password"));
  });

  after(() => {
    cy.removeDatasets();
  });

  describe("Add item to cart and publish", () => {
    it("should add dataset to cart", () => {
      cy.createDataset({ type: "raw" });

      cy.visit("/datasets");

      cy.get(".dataset-table mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get('[data-cy="text-search"]').clear().type("Cypress");
      cy.get('[data-cy="search-button"]').click();

      cy.isLoading();

      cy.get(".dataset-table input[type='checkbox']").first().click();

      cy.get("#addToBatchButton").click();

      cy.get("#cartOnHeaderButton").click();

      cy.get("a.button").click();

      cy.get("#publishButton").click();

      cy.get("#titleInput").type("some title text");

      cy.get("#abstractInput").type("some abstract text");

      cy.get("#saveAndContinueButton").click();

      cy.get("#doiRow").should("exist");
    });
  });
});
