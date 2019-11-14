// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add("login", (username, password) => {
  cy.request(
    "POST",
    Cypress.config("lbBaseUrl") + "/Users/login?include=user",
    {
      username,
      password,
      rememberMe: true
    }
  )
    .its("body")
    .as("user");

  cy.get("@user").then(user => {
    cy.setCookie("$LoopBackSDK$created", user.created);
    cy.setCookie("$LoopBackSDK$id", user.id);
    cy.setCookie("$LoopBackSDK$ttl", user.ttl.toString());
    cy.setCookie(
      "$LoopBackSDK$user",
      encodeURIComponent(JSON.stringify(user.user))
    );
    cy.setCookie("$LoopBackSDK$userId", user.userId);
  });
});
