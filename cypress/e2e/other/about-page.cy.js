import { testData } from "../../fixtures/testData";

describe("About Page", () => {
  beforeEach(() => {
    // Log in if the About page requires authentication
    cy.login(Cypress.env("username"), Cypress.env("password"));
  });

  after(() => {
    // Clean up if needed (e.g., remove test data)
    cy.removeDatasets();
  });

  describe("About page navigation and content", () => {
    it("should navigate to the About page from the main page and display correct content", () => {
      // Visit the main page
      cy.visit("/");
      cy.finishedLoading();

      // Open the main menu and navigate to About
      cy.get("button.main-menu").click();
      cy.get("button.mat-mdc-menu-item")
        .contains(/Info|About/i)
        .click();

      // Wait for the About page to load
      cy.finishedLoading();
      cy.url().should("include", "/about");

      // Verify the About page header
      cy.get("mat-card-header mat-card-title")
        .should("exist")
        .and("contain", "About SciCat");

      // Verify the About page content sections
      cy.get("mat-card").should("have.length.at.least", 3); // At least 3 cards (About, Access, Terms)

      // Check for the "About SciCat" card
      cy.get("mat-card")
        .eq(0)
        .within(() => {
          cy.get("mat-card-header mat-card-title").should("contain", "About SciCat");
          cy.get("mat-card-content").should("exist").and("not.be.empty");
        });

      // Check for the "Access Conditions" card
      cy.get("mat-card")
        .eq(1)
        .within(() => {
          cy.get("mat-card-header mat-card-title").should("contain", "Access Conditions");
          cy.get("mat-card-content").should("exist").and("not.be.empty");
        });

      // Check for the "Terms of Use" card
      cy.get("mat-card")
        .eq(2)
        .within(() => {
          cy.get("mat-card-header mat-card-title").should("contain", "Terms of Use");
          cy.get("mat-card-content").should("exist").and("not.be.empty");
        });

      // Verify links in the About page
      cy.get("a[href*='github.com/SciCatProject']").should("exist");
      cy.get("a[href*='scicatproject.github.io']").should("exist");

      // --- NEW: Check for the email scicat@ess.eu in the HTML ---
      cy.get("mat-card-content")
        .should("contain", "scicat@ess.eu")
        .and("contain", "mailto:scicat@ess.eu"); // Check for both plain text and mailto link
    });
  });

  describe("About page as non-authenticated user", () => {
    it("should allow access to the About page without login", () => {
      // Log out first
      cy.get(".user-button").click();
      cy.get("[data-cy=logout-button]").click();
      cy.finishedLoading();

      // Visit the main page
      cy.visit("/");
      cy.finishedLoading();

      // Open the main menu and navigate to About
      cy.get("button.main-menu").click();
      cy.get("button.mat-mdc-menu-item")
        .contains(/Info|About/i)
        .click();

      // Verify the About page loads
      cy.finishedLoading();
      cy.url().should("include", "/about");
      cy.get("mat-card-header mat-card-title").should("contain", "About SciCat");

      // --- NEW: Check for the email scicat@ess.eu in the HTML ---
      cy.get("mat-card-content")
        .should("contain", "scicat@ess.eu")
        .and("contain", "mailto:scicat@ess.eu");
    });
  });
});