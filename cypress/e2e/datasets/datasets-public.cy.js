describe("Datasets", () => {
  beforeEach(() => {
    cy.login(Cypress.env("username"), Cypress.env("password"));

    cy.createDataset("raw");

    cy.intercept("PATCH", "/api/v3/datasets/**/*").as("change");
    cy.intercept("GET", "*").as("fetch");
  });

  after(() => {
    cy.removeDatasets();
  });

  describe("Make dataset public", () => {
    it("should go to dataset details and toggle public", () => {
      cy.visit("/datasets");

      cy.get(".dataset-table mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get('[data-cy="text-search"] input[type="search"]')
        .clear()
        .type("Cypress");

      cy.isLoading();

      cy.contains("mat-row", "Cypress Dataset").first().click();

      cy.wait("@fetch");

      cy.get("mat-slide-toggle").as("publicToggle");

      cy.get("@publicToggle").should(
        "not.have.class",
        "mat-mdc-slide-toggle-checked",
      );

      cy.get("@publicToggle").click();

      cy.wait("@change").then(({ request, response }) => {
        expect(request.method).to.eq("PATCH");
        expect(response.statusCode).to.eq(200);
      });

      cy.get("@publicToggle").should(
        "have.class",
        "mat-mdc-slide-toggle-checked",
      );
    });
  });
});
