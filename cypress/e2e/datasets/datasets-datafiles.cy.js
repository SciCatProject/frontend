import { testData } from "../../fixtures/testData";

describe("Dataset datafiles", () => {
  beforeEach(() => {
    cy.readFile("CI/e2e/frontend.config.e2e.json").then((baseConfig) => {
      cy.intercept("GET", "**/admin/config", baseConfig).as(
        "getFrontendConfig",
      );
    });
    cy.login(Cypress.env("username"), Cypress.env("password"));
    cy.intercept("PATCH", "/api/v3/datasets/**/*").as("change");
    cy.intercept("GET", "*").as("fetch");
    cy.visit("/");
  });

  after(() => {
    cy.removeDatasets();
  });

  describe("Datafiles action test", () => {
    const actionUrl = {
      downloadSelected: "http://localhost:4200/download/selected",
      downloadAll: "http://localhost:4200/download/all",
      notebookSelected: "http://localhost:4200/notebook/selected",
      notebookAll: "http://localhost:4200/notebook/all",
    };
    it("Should be able to download/notebook with selected/all", () => {
      cy.createDataset({ type: "raw", dataFileSize: "small" });

      cy.visit("/datasets");

      cy.get(".dataset-table mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get('[data-cy="text-search"]').clear().type("Cypress");
      cy.get('[data-cy="search-button"]').click();

      cy.isLoading();

      cy.get("mat-row").contains("Cypress Dataset").first().click();

      cy.wait("@fetch");

      cy.get(".mat-mdc-tab-link").contains("Datafiles").click();

      cy.get(".mdc-checkbox__native-control").eq(1).check();

      cy.window().then((win) => {
        cy.spy(win.HTMLFormElement.prototype, "submit").as("formSubmit");
      });

      // Test download selected
      cy.get('button:contains("Download Selected")').click();
      cy.get("@formSubmit").should("have.been.called", 1);
      cy.get("form")
        .eq(0)
        .should("have.attr", "action", actionUrl.downloadSelected);

      // Test download all
      cy.get('button:contains("Download All")').click();
      cy.get("@formSubmit").should("have.been.called", 2);
      cy.get("form").eq(1).should("have.attr", "action", actionUrl.downloadAll);

      // Test notebook selected
      cy.get('button:contains("Notebook Selected")').click();
      cy.get("@formSubmit").should("have.been.called", 3);
      cy.get("form")
        .eq(2)
        .should("have.attr", "action", actionUrl.notebookSelected);

      // Test notebook all
      cy.get('button:contains("Notebook All")').click();
      cy.get("@formSubmit").should("have.been.called", 4);
      cy.get("form").eq(3).should("have.attr", "action", actionUrl.notebookAll);
    });

    it("Should not be able to download selected/all file that is exceeding size limit", () => {
      cy.createDataset({ type: "raw", dataFileSize: "large" });

      cy.visit("/datasets");

      cy.get(".dataset-table mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get('[data-cy="text-search"]').clear().type("Cypress");
      cy.get('[data-cy="search-button"]').click();

      cy.isLoading();

      cy.get("mat-row").contains("Cypress Dataset").first().click();

      cy.wait("@fetch");

      cy.get(".mat-mdc-tab-link").contains("Datafiles").click();

      cy.get(".mdc-checkbox__native-control").eq(1).check();

      cy.window().then((win) => {
        cy.spy(win.HTMLFormElement.prototype, "submit").as("formSubmit");
      });

      cy.get('button:contains("Download Selected")').should("be.disabled");
      cy.get('button:contains("Download All")').should("be.disabled");
      cy.get('button:contains("Notebook Selected")').should("not.be.disabled");
      cy.get('button:contains("Notebook Selected")').should("not.be.disabled");

      cy.get(".mdc-checkbox__native-control").eq(1).uncheck();
      cy.get(".mdc-checkbox__native-control").eq(2).check();

      cy.get('button:contains("Download Selected")').should("not.be.disabled");
      cy.get('button:contains("Download All")').should("be.disabled");
    });
  });
});
