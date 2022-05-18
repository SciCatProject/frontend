/// <reference types="Cypress" />

describe("Users Login", () => {
  const username = Cypress.config("username");
  const password = Cypress.config("password");
  const loginEndpoint = Cypress.config("lbLoginEndpoint");

  beforeEach(() => {
    cy.intercept("POST", "**/auth/msad").as("adLogin");
    cy.intercept("POST", "/api/v3" + loginEndpoint).as("funcLogin");
  });

  it("visits login page and tries to log in with the wrong password", () => {
    cy.wait(5000);

    cy.visit("/");

    cy.url().should("include", "/datasets");

    cy.wait(5000);

    cy.get("[data-cy=login-button]").click();

    cy.wait(5000);

    cy.url().should("include", "/login");

    cy.get("#usernameInput")
      .type(username)
      .should("have.value", username);

    cy.get("#passwordInput")
      .type("invalid")
      .should("have.value", "invalid");

    cy.get("button[type=submit]").click();

    cy.wait("@adLogin").then(({ request, response }) => {
      expect(request.method).to.eq("POST");
      if (response.statusCode === 500) {
        cy.contains("Unable to connect to the authentication service. Please try again later or contact website maintainer.");
      } else {
        cy.wait("@funcLogin").then(({ request, response }) => {
          expect(request.method).to.eq("POST");
          expect(response.statusCode).to.eq(401);

          cy.contains("Could not log in. Check your username and password.");
        });

      }
    });
  });

  it("visits login page and logs in with a functional account", () => {
    cy.wait(5000);

    cy.visit("/");

    cy.url().should("include", "/datasets");

    cy.wait(5000);

    cy.get("[data-cy=login-button]").click();

    cy.wait(5000);

    cy.url().should("include", "/login");

    cy.get("#usernameInput")
      .type(username)
      .should("have.value", username);

    cy.get("#passwordInput")
      .type(password)
      .should("have.value", password);

    cy.contains("Remember me").click();

    cy.get("button[type=submit]").click();

    cy.url().should("include", "/datasets");

    cy.get(".user-button").should("contain.text", username);
  });
});
