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
import './commands'

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

// Never let the browser cache the frontend config response.
// When the frontend is served without the backend reverse proxy (as in CI),
// nginx answers /api/v3/admin/config with index.html (Last-Modified, no
// Cache-Control). Chrome may cache that heuristically, and Cypress keeps the
// cache between tests, so a later cy.visit() can load the config from cache
// without a network request. cy.intercept() stubs then never see it and tests
// fail with "No request ever occurred" (e.g. cy.wait("@getConfig")).
// Only this response is affected; the rest of the app stays cacheable.
// Tests that stub admin/config themselves reply before this handler runs.
beforeEach(() => {
  cy.intercept("GET", "**/api/v3/admin/config", (req) => {
    req.on("response", (res) => {
      res.headers["cache-control"] = "no-store";
    });
  });
});
