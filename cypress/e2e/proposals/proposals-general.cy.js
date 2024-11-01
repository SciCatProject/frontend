describe("Proposals general", () => {
  beforeEach(() => {
    cy.login(Cypress.env("username"), Cypress.env("password"));
  });

  describe("Proposals Page Component", () => {
    let logbookLogs = [];
    const logBookAction =
      "Logbook reducer Action came in! [Logbook] Fetch Logbook Complete";

    beforeEach(() => {
      // Clear logs before each test
      logbookLogs = [];
    });

    it("should trigger 'Fetch Logbook Complete' action only once after navigation", () => {
      // Capture console logs matching logBookAction
      Cypress.on("window:before:load", (win) => {
        const originalConsoleLog = win.console.log;
        win.console.log = (...args) => {
          if (args[0] === logBookAction) {
            logbookLogs.push(args[0]);
          }
          originalConsoleLog.apply(win.console, args); // Preserve default behavior
        };
      });

      const proposalId = Math.floor(100000 + Math.random() * 900000).toString();
      cy.createProposal(proposalId);
      cy.visit("/proposals");

      cy.contains("A minimal test proposal").click();
      cy.finishedLoading();
      cy.visit("/datasets");

      cy.wait(50000); // Test
      cy.wrap(null).should(() => {
        expect(logbookLogs).to.have.length(1);
      });

      cy.login(
        Cypress.env("secondaryUsername"),
        Cypress.env("secondaryPassword"),
      );
      cy.deleteProposal(proposalId);
    });
  });
});
