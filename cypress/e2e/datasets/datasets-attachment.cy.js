var path = require("path");

describe("Dataset attachments", () => {
  beforeEach(() => {
    cy.login(Cypress.env("username"), Cypress.env("password"));

    cy.intercept("POST", "/api/v3/datasets/**/*").as("upload");
  });

  after(() => {
    cy.removeDatasets();
  });

  describe("Attachment tests", () => {
    it("should go to dataset details and add an attachment using the dropzone", () => {
      cy.createDataset("raw");
      cy.visit("/datasets");

      cy.get(".dataset-table mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get('[data-cy="text-search"] input[type="search"]')
        .clear()
        .type("Cypress");

      cy.isLoading();

      cy.get("mat-row").contains("Cypress Dataset").first().click();

      cy.isLoading();

      cy.get(".mat-mdc-tab-link").contains("Attachments").click();

      cy.get(".dropzone").selectFile("cypress/fixtures/scicat-logo.png", {
        action: "drag-drop",
        force: true,
      });

      cy.wait("@upload").then(({ request, response }) => {
        expect(request.method).to.eq("POST");
        expect(response.statusCode).to.eq(201);

        cy.get(".snackbar-success").should("exist");
      });

      cy.get(".attachment-card #caption").should(
        "have.value",
        "scicat-logo.png",
      );
    });

    it("should open a new tab when clicking the attachment thumbnail", () => {
      cy.visit("/datasets");

      cy.get(".dataset-table mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get('[data-cy="text-search"] input[type="search"]')
        .clear()
        .type("Cypress");

      cy.isLoading();

      cy.get("mat-row").contains("Cypress Dataset").first().click();

      cy.isLoading();

      cy.get(".mat-mdc-tab-link").contains("Attachments").click();

      cy.window().then((win) => {
        cy.stub(win, "open").as("open");
      });

      cy.get('[data-cy="attachment-thumbnail"]').click();

      cy.get("@open").should("be.calledWith", Cypress.sinon.match(/blob:.*/));

      cy.get(".mat-mdc-tab-link").contains("Details").click();

      cy.get('[data-cy="attachment-thumbnail"]').first().click();

      cy.get("@open").should("be.calledWith", Cypress.sinon.match(/blob:.*/));
    });

    it("should be able to download dataset attachment", () => {
      cy.visit("/datasets");

      cy.get(".dataset-table mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get('[data-cy="text-search"] input[type="search"]')
        .clear()
        .type("Cypress");

      cy.isLoading();

      cy.get("mat-row").contains("Cypress Dataset").first().click();

      cy.isLoading();

      cy.get(".mat-mdc-tab-link").contains("Attachments").click();

      cy.get(".download-button").click();

      const downloadsFolder = Cypress.config("downloadsFolder");
      cy.readFile(path.join(downloadsFolder, "scicat-logo.png")).should(
        "exist",
      );
    });

    it("should be able to delete dataset attachment", () => {
      cy.visit("/datasets");

      cy.get(".dataset-table mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get('[data-cy="text-search"] input[type="search"]')
        .clear()
        .type("Cypress");

      cy.isLoading();

      cy.get("mat-row").contains("Cypress Dataset").first().click();

      cy.isLoading();

      cy.get(".mat-mdc-tab-link").contains("Attachments").click();

      cy.get(".delete-button").click();

      cy.get(".attachment-card #caption").should("not.exist");

      cy.get(".snackbar-success").should("exist");
    });
  });
});
