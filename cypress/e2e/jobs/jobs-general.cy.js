import { testData } from "../../fixtures/testData";

describe("Jobs general", () => {
  beforeEach(() => {
    cy.login(Cypress.env("username"), Cypress.env("password"));
    cy.createDataset({
      type: "raw",
      dataFileSize: "small",
      datasetName: "Jobs Dataset",
      pid: "20.500.12269/6ED35C17-EDD4-4CD4-B917-4E49698F7532",
      isPublished: true,
    });
  });

  afterEach(() => {
    cy.removeJobs();
    cy.removeDatasets();
  });

  describe("Jobs dynamic material table", () => {
    it("should be able to search for job in the global search", () => {
      cy.createJob();

      cy.visit("/user/jobs");

      cy.get('[data-cy="text-search"]').type("all_access");
      cy.get('[data-cy="search-button"]').click();

      cy.get("mat-table mat-row").first().should("contain", "all_access");
    });

    it("should be able to change page and page size in the job table", () => {
      cy.createJob({ emailJobInitiator: "test1@example.com" });
      cy.createJob({ emailJobInitiator: "test2@example.com" });
      cy.createJob({ emailJobInitiator: "test3@example.com" });
      cy.createJob({ emailJobInitiator: "test4@example.com" });
      cy.createJob({ emailJobInitiator: "test5@example.com" });
      cy.createJob({ emailJobInitiator: "test6@example.com" });

      cy.visit("/user/jobs");

      cy.get("mat-paginator").first().find("mat-select").click({ force: true });
      cy.get("mat-option").contains("5").click({ force: true });

      cy.get("mat-paginator .mat-mdc-paginator-range-actions").contains(
        "1 – 5",
      );

      cy.get("mat-paginator").first().find("[aria-label='Next page']").click();

      cy.get("mat-paginator .mat-mdc-paginator-range-actions").contains(
        "6 – 6",
      );
    });

    it("should be able to change visible columns settings in the table", () => {
      cy.createJob();

      cy.visit("/user/jobs");

      cy.get("dynamic-mat-table mat-header-row.header").should("exist");

      cy.get("dynamic-mat-table table-menu button").click();
      cy.get('[role="menu"] button').contains("Default setting").click();
      cy.get("body").type("{esc}");

      cy.get("dynamic-mat-table")
        .scrollTo("right", { ensureScrollable: false })
        .get("mat-header-row")
        .should("contain", "Initiator");

      cy.get("dynamic-mat-table table-menu button").click();
      cy.get('[role="menu"] button').contains("Column setting").click();

      cy.get('[role="menu"]')
        .contains("Initiator")
        .parent()
        .find("input[type=checkbox]")
        .uncheck();

      cy.contains(".column-config-apply button.done-setting", "done").click();

      cy.get("dynamic-mat-table table-menu button").click();
      cy.get('[role="menu"] button').contains("Save table setting").click();

      cy.reload();

      cy.get("dynamic-mat-table")
        .scrollTo("right", { ensureScrollable: false })
        .get("mat-header-row")
        .should("not.contain", "Initiator");
    });
  });
});
