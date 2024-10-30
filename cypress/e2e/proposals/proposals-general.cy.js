describe("Proposals general", () => {
  beforeEach(() => {
    cy.login(Cypress.config("username"), Cypress.config("password"));

    cy.intercept("GET", "/api/v3/Logbooks/**").as("logbooksCall");
  });

  describe("Proposals Page API Calls", () => {
    it("should make fetch logbook API call only once", () => {
      const proposalId = Math.floor(100000 + Math.random() * 900000).toString();
      cy.createProposal(proposalId);

      cy.visit("/proposals");

      cy.contains("A minimal test proposal").click();

      cy.wait("@logbooksCall", { timeout: 3000 });

      cy.visit("/datasets");

      // The logbook API call consists of two calls, one for the fullquery and one for the fullfacet
      // which is why we check for less than 2 calls
      cy.get("@logbooksCall.all").should("have.length.lte", 2);

      cy.login(
        Cypress.config("secondaryUsername"),
        Cypress.config("secondaryPassword"),
      );

      cy.deleteProposal(proposalId);
    });
  });
});
