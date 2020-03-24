/// <reference types="Cypress" />

describe("Datasets", () => {
  beforeEach(() => {
    cy.wait(5000);

    cy.login(Cypress.config("username"), Cypress.config("password"));

    cy.server();
    //cy.route("PUT", "/api/v3/Datasets/**/*").as("metadata");
    //cy.route("GET", "*").as("fetch");
  });

  after(() => {
    cy.login(
      Cypress.config("secondaryUsername"),
      Cypress.config("secondaryPassword")
    );
    cy.removeDatasets();
  });

  describe("Add item to cart", () => {
    it("should add dataset to cart", () => {
      cy.createDataset("raw");

      cy.visit("/datasets");

      cy.wait(5000);

      cy.get("#checkboxInput")
        .first()
        .click();

      cy.get("#addToBatchButton").click();

      cy.get("#cartOnHeaderButton").click();

      cy.get("a.button").click();

      cy.get("#publishButton").click();

      cy.get("#titleInput").type("some title text");

      cy.get("#abstractInput").type("some abstract text");

      cy.get("#publishButton").click();

      cy.wait(1000);
    });
  });

  /* describe("navigate to cart", () => {
    it("should go to cart and click publish", () => {});
  });

  describe("Complete publish form", () => {
    it("should fill in publish form and click publish", () => {});
  });*/
});
