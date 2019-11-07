describe("Login Page", () => {
  const username = Cypress.config("username");
  const password = Cypress.config("password");

  it("visits login page and tries to log in with the wrong password", () => {
    cy.visit("/");

    cy.url().should("include", "/login");

    cy.get("#emailInput")
      .type(username)
      .should("have.value", username);

    cy.get("#pwdInput")
      .type("invalid")
      .should("have.value", "invalid");

    cy.get("button[type=submit]").click();

    cy.contains("Could not log in. Check your username and password.");
  });

  it("visits login page and logs in with a functional account", () => {
    cy.visit("/");

    cy.url().should("include", "/login");

    cy.get("#emailInput")
      .type(username)
      .should("have.value", username);

    cy.get("#pwdInput")
      .type(password)
      .should("have.value", password);

    cy.contains("Remember me").click();

    cy.get("button[type=submit]").click();

    cy.url().should("include", "/datasets");

    cy.get(".user-button").should("contain.text", username);
  });
});
