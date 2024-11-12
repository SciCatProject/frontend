import { testData } from "../../fixtures/testData";

describe("Proposals general", () => {
  let proposal;
  beforeEach(() => {
    cy.login(Cypress.env("username"), Cypress.env("password"));
  });

  after(() => {
    cy.removeProposals();
  });

  describe("Proposals table and details", () => {
    it("should be able to see proposal in a table and visit the proposal details page", () => {
      proposal = {
        ...testData.proposal,
        title: "Cypress test parent proposal",
        proposalId: Math.floor(100000 + Math.random() * 900000).toString(),
      };
      cy.createProposal(proposal);

      cy.visit("/proposals");

      cy.get("mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get("mat-table mat-row").should("contain", proposal.proposalId);

      cy.get("mat-row")
        .contains(proposal.proposalId)
        .parent()
        .contains(proposal.title)
        .click();

      cy.url().should("include", `/proposals/${proposal.proposalId}`);

      cy.contains(proposal.title);
    });

    it("should be able to see proposal and its parent proposal if it exists", () => {
      const newProposal = {
        ...testData.proposal,
        proposalId: Math.floor(100000 + Math.random() * 900000).toString(),
        parentProposalId: proposal.proposalId,
      };
      cy.createProposal(newProposal);

      cy.visit("/proposals");

      cy.get("mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get("mat-table mat-row").should("contain", newProposal.proposalId);
      cy.get("mat-table mat-row").should("contain", proposal.proposalId);

      cy.get("mat-row")
        .contains(newProposal.proposalId)
        .parent()
        .contains(newProposal.title)
        .click();

      cy.url().should("include", `/proposals/${newProposal.proposalId}`);

      cy.contains(newProposal.title);
      cy.contains(proposal.title).click();

      cy.finishedLoading();

      cy.url().should("include", `/proposals/${proposal.proposalId}`);

      cy.contains(proposal.title);

      cy.get("mat-card").should("not.contain", newProposal.title);
    });
  });
});
