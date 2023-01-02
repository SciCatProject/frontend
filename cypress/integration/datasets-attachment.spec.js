/// <reference types="Cypress" />

describe("Datasets", () => {
  beforeEach(() => {
    cy.login(Cypress.config("username"), Cypress.config("password"));

    cy.createDataset("raw");

    cy.intercept("POST", "/api/v3/Datasets/**/*").as("upload");
  });

  afterEach(() => {
    cy.login(
      Cypress.config("secondaryUsername"),
      Cypress.config("secondaryPassword")
    );
    cy.removeDatasets();
  });

  describe("Add Attachment", () => {
    it("should go to dataset details and add an attachment using the dropzone", () => {
      cy.visit("/datasets");

      cy.get(".dataset-table mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get('input[type="search"][data-placeholder="Text Search"]')
        .clear()
        .type("Cypress");

      cy.isLoading();

      cy.finishedLoading();

      cy.get(".mat-row").contains("Cypress Dataset").first().click();

      cy.isLoading();

      cy.finishedLoading();

      cy.get(".mat-tab-link").contains("Attachments").click();

      cy.fixture("attachment-image").then((file) => {
        cy.get(".dropzone").attachFile(
          {
            fileContent: file.content,
            fileName: file.name,
            mimeType: file.mimeType,
          },
          { subjectType: "drag-n-drop", force: true }
        );
      });

      cy.wait("@upload").then(({ request, response }) => {
        expect(request.method).to.eq("POST");
        expect(response.statusCode).to.eq(200);
      });

      cy.get(".attachment-card #caption").should(
        "have.value",
        "SciCatLogo.png"
      );
    });
  });
});
