import { testData } from "../../fixtures/testData";
import { testConfig } from "../../fixtures/testData";
import { mergeConfig } from "../../support/utils";

describe("Proposals general", () => {
  let proposal;
  const proposalLabelsConfig = testConfig.proposalViewCustomLabels;
  beforeEach(() => {
    cy.readFile("CI/e2e/frontend.config.e2e.json").then((baseConfig) => {
      const mergedConfig = mergeConfig(baseConfig, proposalLabelsConfig);
      cy.intercept("GET", "**/admin/config", mergedConfig).as(
        "getFrontendConfig",
      );
    });
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

    it.only("proposal should have type", () => {
      const defaultProposalType = "Default Proposal";
      const newProposal = {
        ...testData.proposal,
        proposalId: Math.floor(100000 + Math.random() * 900000).toString(),
      };
      cy.createProposal(newProposal);

      cy.visit(`/proposals/${newProposal.proposalId}`);

      cy.finishedLoading();

      cy.contains(newProposal.title);

      cy.finishedLoading();

      cy.get('[data-cy="proposal-type"]').contains(defaultProposalType);

      const newProposalType = "Beamtime";

      cy.updateProposal(newProposal.proposalId, {
        type: newProposalType,
      });

      cy.reload();

      cy.finishedLoading();

      cy.contains(newProposal.title);

      cy.get('[data-cy="proposal-type"]').contains(newProposalType);
    });

    it("proposal should have metadata and if not it should be able to add", () => {
      const metadataName = "Proposal Metadata Name";
      const metadataValue = "proposal metadata value";
      const newProposal = {
        ...testData.proposal,
        proposalId: Math.floor(100000 + Math.random() * 900000).toString(),
      };
      cy.createProposal(newProposal);

      cy.visit(`/proposals/${newProposal.proposalId}`);

      cy.finishedLoading();

      cy.contains(newProposal.title);

      cy.finishedLoading();

      cy.get('[data-cy="proposal-metadata-card"]').should("exist");

      cy.get('[data-cy="proposal-metadata-card"] [role="tab"]')
        .contains("Edit")
        .click();

      cy.get('[data-cy="add-new-row"]').click();

      // simulate click event on the drop down
      cy.get("mat-select[data-cy=field-type-input]").last().click(); // opens the drop down

      // simulate click event on the drop down item (mat-option)
      cy.get("mat-option")
        .contains("string")
        .then((option) => {
          option[0].click();
        });

      cy.get("[data-cy=metadata-name-input]")
        .last()
        .type(`${metadataName}{enter}`);
      cy.get("[data-cy=metadata-value-input]")
        .last()
        .type(`${metadataValue}{enter}`);

      cy.get("button[data-cy=save-changes-button]").click();

      cy.finishedLoading();

      cy.reload();

      cy.finishedLoading();

      cy.contains(newProposal.title);

      cy.get('[data-cy="proposal-metadata-card"]').contains(metadataName, {
        matchCase: true,
      });
      cy.get('[data-cy="proposal-metadata-card"]').contains(metadataValue, {
        matchCase: true,
      });
    });

    it("should be able to see and click related proposals on a proposal", () => {
      const newProposal = {
        ...testData.proposal,
        proposalId: Math.floor(100000 + Math.random() * 900000).toString(),
        parentProposalId: proposal.proposalId,
      };
      const newProposal2 = {
        ...testData.proposal,
        proposalId: Math.floor(100000 + Math.random() * 900000).toString(),
        parentProposalId: newProposal.proposalId,
      };
      cy.createProposal(newProposal);
      cy.createProposal(newProposal2);

      cy.visit("/proposals");

      cy.get("mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get("mat-table mat-row").should("contain", newProposal.proposalId);
      cy.get("mat-table mat-row").should("contain", newProposal2.proposalId);

      cy.get("mat-row")
        .contains(newProposal.proposalId)
        .parent()
        .contains(newProposal.title)
        .click();

      cy.url().should("include", `/proposals/${newProposal.proposalId}`);

      cy.get('[data-cy="related-proposals"]').click();

      cy.get('[data-cy="related-proposals-table"] mat-row')
        .contains(newProposal2.title)
        .parent()
        .contains("child");
      cy.get('[data-cy="related-proposals-table"] mat-row')
        .contains(proposal.title)
        .click();
    });
  });

  describe("Proposal view details labelization", () => {
    it("should load proposal with fallback labels when no custom labels are available", () => {
      const fallbackLabelsToCheck = ["Main proposer", "Proposal Type"];
      const customizedLabelsToCheck = [
        "Test Proposal Title",
        "Test Abstract",
        "Test Proposal Id",
      ];

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

      cy.wrap([...fallbackLabelsToCheck, ...customizedLabelsToCheck]).each(
        (value) => {
          cy.get("mat-card").should(($matCards) => {
            const matchFound = [...$matCards].some((card) =>
              card.innerText.includes(value),
            );
            expect(matchFound).to.be.true;
          });
        },
      );
    });
  });
});
