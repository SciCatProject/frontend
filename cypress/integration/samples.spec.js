/// <reference types="Cypress" />
const lbBaseUrl = Cypress.config("lbBaseUrl");

describe("Samples", function() {
  beforeEach(function() {
    cy.login(Cypress.config("username"), Cypress.config("password"));

    cy.server();
    cy.route("/api/v3/Samples/*").as("sampleRequest");
  });

  describe("Add sample", function() {
    it("should add a new sample", function() {
      cy.visit("/samples");

      cy.get("mat-card")
        .contains("Add Sample")
        .click();

      cy.get("mat-dialog-container").should("contain.text", "Sample Entry");

      cy.get("#descriptionInput").type("Cypress Sample");
      cy.get("#groupInput").type("ess");

      cy.get("button")
        .contains("Save")
        .click();

      cy.wait("@sampleRequest");

      cy.get(".mat-table")
        .children()
        .should("contain.text", "Cypress Sample");
    });
  });

  after(function() {
    cy.getCookie("$LoopBackSDK$id").then(cookie => {
      const token = cookie.value;

      cy.request(
        "GET",
        lbBaseUrl +
          "/Samples?filter=%7B%22where%22%3A%20%7B%22description%22%3A%20%22Cypress%20Sample%22%7D%7D&access_token=" +
          token
      )
        .its("body")
        .as("samples");

      cy.get("@samples").then(samples => {
        for (let i = 0; i < samples.length; i++) {
          cy.log(samples[i].sampleId);
          cy.request(
            "DELETE",
            lbBaseUrl +
              "/Samples/" +
              samples[i].sampleId +
              "?access_token=" +
              token
          );
        }
      });
    });
  });
});
