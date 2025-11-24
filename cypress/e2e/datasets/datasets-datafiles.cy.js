import { testData } from "../../fixtures/testData";

describe("0040: Dataset datafiles", () => {
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

  describe("0010: Datafiles action test", () => {
    const actionUrl = {
      downloadSelected: "http://localhost:4200/download/selected",
      downloadAll: "http://localhost:4200/download/all",
      notebookFormSelected: "http://localhost:4200/notebook/selected/form",
      notebookFormAll: "http://localhost:4200/notebook/all/form",
      notebookJsonSelected: "/notebook/selected/json",
      notebookJsonAll: "/notebook/all/json",
    };
    it("0010: Should be able to download or notebook (form) with selected or all files", () => {
      // Intercept the expected network request
      // cy.intercept('POST', 'https://zip.scicatproject.org/download/all').as('DownloadFormAll');
      // cy.intercept('POST', 'https://zip.scicatproject.org/download/selected').as('DownloadFormSelected');
      // cy.intercept('POST', 'https://zip.scicatproject.org/notebook/all').as('DownloadNotebookAll');
      // cy.intercept('POST', 'https://zip.scicatproject.org/notebook/selected').as('DownloadNotebookSelected');

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
      cy.get('button:contains("Notebook Selected (Form)")').click();
      cy.get("@formSubmit").should("have.been.called", 3);
      cy.get("form")
        .eq(2)
        .should("have.attr", "action", actionUrl.notebookFormSelected);

      // Test notebook all
      cy.get('button:contains("Notebook All (Form)")').click();
      cy.get("@formSubmit").should("have.been.called", 4);
      cy.get("form").eq(3).should("have.attr", "action", actionUrl.notebookFormAll);
    });

    it("0020: Should be able to download the notebook from sciwyrm with selected files", () => {
      cy.intercept('POST', actionUrl.notebookJsonSelected, {
        statusCode: 200,
        body: { name: "Notebook Json Select" }
      }).as('DownloadNotebookSelected');

      // cy.window().then((win) => {
      //   cy.stub(win.document, 'createElement').callsFake((tag) => {
      //     if (tag === 'a') {
      //       // Return a spy-able anchor element
      //       const a = document.createElement('a');
      //       cy.spy(a, 'click').as('aClick');
      //       return a;
      //     }
      //     return document.createElement(tag);
      //   });
      //   cy.stub(win.URL, 'createObjectURL').callsFake(() => 'blob:fake-url');
      // });

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


      //cy.intercept('POST', '/your/download/url').as('downloadRequest');

      // Test notebook selected
      //cy.get('button:contains("Notebook Selected (Download JSON)")').click();
      // Wait for the intercepted call and assert the response
      cy.wait('@DownloadNotebookSelected').then((interception) => {
        expect(interception.request.headers['Content-Type']).to.eq('application/json');
        expect(interception.request.body.template_id).to.eq("c975455e-ede3-11ef-94fb-138c9cd51fc0");
      });
      // Assert anchor was created and clicked
      //cy.get('@aClick').should('have.been.called');

    });

    it("0030: Should be able to download the notebook from sciwyrm with all files", () => {
      // Intercept the expected network request
      cy.intercept('POST', actionUrl.notebookJsonSelected, {
        statusCode: 200,
        body: { name: "Notebook Json Select" }
      }).as('DownloadNotebookSelected');

      // cy.window().then((win) => {
      //   cy.stub(win.document, 'createElement').callsFake((tag) => {
      //     if (tag === 'a') {
      //       // Return a spy-able anchor element
      //       const a = document.createElement('a');
      //       cy.spy(a, 'click').as('aClick');
      //       return a;
      //     }
      //     return document.createElement(tag);
      //   });
      //   cy.stub(win.URL, 'createObjectURL').callsFake(() => 'blob:fake-url');
      // });

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


      //cy.intercept('POST', '/your/download/url').as('downloadRequest');

      // Test notebook all
      //cy.get('button:contains("Notebook All (Download JSON)")').click();
      cy.wait('@DownloadNotebookAll').then((interception) => {
        expect(interception.request.headers['Content-Type']).to.eq('application/json');
        expect(interception.request.body.template_id).to.eq("c975455e-ede3-11ef-94fb-138c9cd51fc0");
      });
      // Assert anchor was created and clicked
      //cy.get('@aClick').should('have.been.called');
    });

    it("0040: Should not be able to download selected/all files that is exceeding size limit", () => {
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
      cy.get('button:contains("Notebook Selected (Form)")').should("not.be.disabled");
      cy.get('button:contains("Notebook All (Form)")').should("not.be.disabled");
      cy.get('button:contains("Notebook Selected (Download JSON)")').should("not.be.disabled");
      cy.get('button:contains("Notebook All (Download JSON)")').should("not.be.disabled");

      cy.get(".mdc-checkbox__native-control").eq(1).uncheck();
      cy.get(".mdc-checkbox__native-control").eq(2).check();

      cy.get('button:contains("Download Selected")').should("not.be.disabled");
      cy.get('button:contains("Download All")').should("be.disabled");
    });
  });
});
