describe("Users Login", () => {
  const username = Cypress.env("username");
  const password = Cypress.env("password");

  const guestUsername = Cypress.env("guestUsername");
  const guestPassword = Cypress.env("guestPassword");

  const loginEndpoint = Cypress.env("loginEndpoint");

  beforeEach(() => {
    cy.intercept("POST", "**/auth/msad").as("adLogin");
    cy.intercept("POST", "/api/v3" + loginEndpoint + "*").as("funcLogin");
    cy.intercept("GET", "*").as("fetch");
  });

  it("visits login page and tries to log in with the wrong password", () => {
    cy.visit("/");

    cy.url().should("include", "/datasets");

    cy.wait("@fetch");

    cy.finishedLoading();

    cy.get("[data-cy=login-button]").click();

    cy.finishedLoading();

    cy.url().should("include", "/login");

    cy.get('mat-tab-group [role="tab"]').contains("Ldap").click();

    cy.get("#usernameInput-ldap").type(username).should("have.value", username);

    cy.get("#passwordInput-ldap")
      .type("invalid")
      .should("have.value", "invalid");

    cy.get("button[type=submit]").contains("Log in").click();

    cy.wait("@adLogin").then(({ request, response }) => {
      expect(request.method).to.eq("POST");
      if (response.statusCode === 500) {
        cy.contains(
          "Unable to connect to the authentication service. Please try again later or contact website maintainer.",
        );
      }
    });

    cy.get('mat-tab-group [role="tab"]').contains("Local").click();

    cy.get("#usernameInput").type(username).should("have.value", username);

    cy.get("#passwordInput").type("invalid").should("have.value", "invalid");

    cy.get(".mat-snack-bar-container").should("not.exist");

    cy.get("button[type=submit]").contains("Log in").click();

    cy.wait("@funcLogin").then(({ request, response }) => {
      expect(request.method).to.eq("POST");
      expect(response.statusCode).to.eq(401);

      cy.contains("Could not log in. Check your username and password.");
    });
  });

  it("visits login page and logs in with a functional account, then logout successfully", () => {
    cy.visit("/");

    cy.url().should("include", "/datasets");

    cy.wait("@fetch");

    cy.finishedLoading();

    cy.get("[data-cy=login-button]").click();

    cy.finishedLoading();

    cy.url().should("include", "/login");

    cy.get('mat-tab-group [role="tab"]').contains("Local").click();

    cy.get("#usernameInput").type(username).should("have.value", username);

    cy.get("#passwordInput").type(password).should("have.value", password);

    cy.contains("Remember me").click();

    cy.get("button[type=submit]").click();

    cy.url().should("include", "/datasets");

    cy.get(".user-button").should("contain.text", username).click();

    cy.get("[data-cy=logout-button]").click();

    cy.finishedLoading();

    cy.url().should("include", "/login");
  });

  it("logs in with admin account should be able to see all the content properly from user information", () => {
    cy.visit("/login");

    cy.get('mat-tab-group [role="tab"]').contains("Local").click();

    cy.get("#usernameInput").type(username).should("have.value", username);

    cy.get("#passwordInput").type(password).should("have.value", password);

    cy.get("button[type=submit]").contains("Log in").click();

    cy.get(".user-button").should("contain.text", username).click();

    cy.get("[data-cy=setting-button]").click();

    cy.get("[data-cy=user-name]").should("contain.text", username);

    cy.get("[data-cy=user-email]").invoke("text").should("not.be.empty");

    cy.get("[data-cy=user-id]").invoke("text").should("not.be.empty");

    cy.get("[data-cy=user-accessGroup]").invoke("text").should("not.be.empty");

    cy.get(".copy-button").click();

    cy.get("[data-cy=user-token]")
      .invoke("text")
      .then((token) => {
        cy.window().then((win) => {
          win.navigator.clipboard.readText().then((clipboardText) => {
            expect(clipboardText).to.equal(token);
          });
        });
      });

    cy.get("[data-cy=auth-strategy]").contains("local");
  });

  it("logs in with normal user account should be able to see all the content properly from user information", () => {
    cy.visit("/login");

    cy.get('mat-tab-group [role="tab"]').contains("Local").click();

    cy.get("#usernameInput")
      .type(guestUsername)
      .should("have.value", guestUsername);

    cy.get("#passwordInput")
      .type(guestPassword)
      .should("have.value", guestPassword);

    cy.get("button[type=submit]").contains("Log in").click();

    cy.get(".user-button").should("contain.text", guestUsername).click();

    cy.get("[data-cy=setting-button]").click();

    cy.get("[data-cy=user-name]").should("contain.text", guestUsername);

    cy.get("[data-cy=user-email]").invoke("text").should("not.be.empty");

    cy.get("[data-cy=user-id]").invoke("text").should("not.be.empty");

    cy.get("[data-cy=user-accessGroup]").invoke("text").should("not.be.empty");

    cy.get(".copy-button").click();

    cy.get("[data-cy=user-token]")
      .invoke("text")
      .then((token) => {
        cy.window().then((win) => {
          win.navigator.clipboard.readText().then((clipboardText) => {
            expect(clipboardText).to.equal(token);
          });
        });
      });

    cy.get("[data-cy=auth-strategy]").contains("local");
  });
});
