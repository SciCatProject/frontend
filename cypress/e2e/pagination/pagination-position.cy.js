const positions = ["top", "bottom", "both"];

positions.forEach((position) => {
  describe(`Pagination position: ${position}`, () => {
    beforeEach(() => {
      cy.readFile("CI/e2e/frontend.config.e2e.json").then((config) => {
        cy.intercept("GET", "/api/v3/admin/config", {
          ...config,
          paginationPosition: position,
        }).as("frontendConfig");
      });

      cy.login(Cypress.env("username"), Cypress.env("password"));
      for (let index = 0; index < 6; index++) {
        cy.createDataset({
          type: "raw",
          dataFileSize: "small",
          datasetName: `Pagination ${position} ${index}`,
          isPublished: true,
        });
      }
    });

    afterEach(() => {
      cy.removeDatasets();
    });

    it("shows paginators in the configured position and preserves paging", () => {
      cy.visit("/datasets");
      cy.wait("@frontendConfig");

      const visiblePaginator =
        position === "top"
          ? ".datasets-header-paginator"
          : ".datasets-footer-paginator";
      const hiddenPaginator =
        position === "top"
          ? ".datasets-footer-paginator"
          : ".datasets-header-paginator";

      cy.get(visiblePaginator).should("be.visible");
      if (position === "both") {
        cy.get(".datasets-header-paginator").should("be.visible");
        cy.get(".datasets-footer-paginator").should("be.visible");
      } else {
        cy.get(hiddenPaginator).should("not.exist");
      }

      cy.get(visiblePaginator)
        .find("[aria-label='Next page']")
        .click({ force: true });
      cy.get(visiblePaginator)
        .find(".mat-mdc-paginator-range-label")
        .should("contain", "6");
    });
  });
});
