/// <reference types="Cypress" />

describe("Proposals general", () => {
  beforeEach(() => {
    cy.login(Cypress.config("username"), Cypress.config("password"));
  });

  describe("Proposals Page Component", () => {
    let logbookLogs = [];
    const logBookAction =
      "Logbook reducer Action came in! [Logbook] Fetch Logbook Complete";

    beforeEach(() => {
      // Clear logs before each test
      logbookLogs = [];
      // Capture console logs matching logBookAction
      Cypress.on("window:before:load", (win) => {
        win.console.log = (...args) => {
          if (args[0] == logBookAction) {
            logbookLogs.push(args[0]);
          }
        };
      });
    });

    it("should trigger 'Fetch Logbook Complete' action only once after navigation", () => {
      const proposalId = Math.floor(100000 + Math.random() * 900000).toString();
      cy.createProposal(proposalId);
      cy.visit("/proposals");

      cy.contains("A minimal test proposal").click();
      cy.finishedLoading();
      cy.visit("/datasets");

      cy.wrap(null).should(() => {
        expect(logbookLogs).to.have.length(1);
      });

      cy.login(
        Cypress.config("secondaryUsername"),
        Cypress.config("secondaryPassword"),
      );
      cy.deleteProposal(proposalId);
    });
  });
});
