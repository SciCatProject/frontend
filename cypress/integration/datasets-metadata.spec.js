/// <reference types="Cypress" />

describe("Datasets", () => {
  beforeEach(() => {
    cy.wait(5000);

    cy.login(Cypress.config("username"), Cypress.config("password"));

    cy.server();
    cy.route("PUT", "/api/v3/Datasets/**/*").as("metadata");
    cy.route("GET", "*").as("fetch");
  });

  after(() => {
    cy.login(
      Cypress.config("secondaryUsername"),
      Cypress.config("secondaryPassword")
    );
    cy.removeDatasets();
  });

  describe("Add metadata item", () => {
    it("should go to dataset details and add a metadata entry", () => {
      cy.createDataset("raw");

      cy.visit("/datasets");

      cy.wait(5000);

      cy.get(".mat-row")
        .contains("Cypress Dataset")
        .click();

      cy.wait("@fetch");

      cy.contains("Edit").click();
      cy.wait(1000);

      cy.contains("Add row").click();
      cy.wait(1000);

      // simulate click event on the drop down
      cy.get("mat-select[formControlName=fieldType]")
        .first()
        .click(); // opens the drop down

      // simulate click event on the drop down item (mat-option)
      cy.get(".mat-option-text")
        .contains("string")
        .then(option => {
          option[0].click();
        });

      cy.get("#nameInput0").type("some name{enter}");
      cy.get("#valueInput0").type("some value{enter}");

      cy.contains("Save changes").click();

      cy.wait("@metadata").then(response => {
        expect(response.method).to.eq("PUT");
        expect(response.status).to.eq(200);
      });

      cy.wait(5000);

      cy.get("mat-select[formControlName=fieldType]")
        .first()
        .should("contain.text", "string");
    });
  });

  describe("Remove metadata item", () => {
    it("should go to dataset details and remove a metadata entry", () => {
      cy.visit("/datasets");

      cy.wait(5000);

      cy.get(".mat-row")
        .contains("Cypress Dataset")
        .click();

      cy.wait(5000);
      cy.contains("Edit").click();

      cy.get("button.deleteButton")
        .first()
        .click();

      cy.contains("Save changes").click();

      cy.wait("@metadata").then(response => {
        expect(response.method).to.eq("PUT");
        expect(response.status).to.eq(200);
      });

      cy.contains("View").click();
      cy.wait(1000);
      //cy.get("metadata-view").debug();
      /*cy.get("metadata-view.ng-star-inserted")
        .first()
        .should("not.contain", "string");*/
    });
  });
});
