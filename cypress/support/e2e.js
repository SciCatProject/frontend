// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Benign browser warning (e.g. from Angular Material overlays) that Cypress
// would otherwise treat as an uncaught application error.
Cypress.on("uncaught:exception", (err) => {
  if (
    err.message.includes(
      "ResizeObserver loop completed with undelivered notifications",
    )
  ) {
    return false;
  }
});

// The app asks for /api/v3/admin/config on its own address, where nginx answers with index.html and
// no Cache-Control. Chrome keeps that answer for a while and a later page load does not make the
// request, so cy.intercept("**/admin/config") would never see it. Without the cache, every load does.
beforeEach(() => {
  if (Cypress.isBrowser({ family: "chromium" })) {
    cy.wrap(
      Cypress.automation("remote:debugger:protocol", {
        command: "Network.setCacheDisabled",
        params: { cacheDisabled: true },
      }),
      { log: false },
    );
  }
});
