const path = require("path");

import { testData } from "../../fixtures/testData";
import { testConfig } from "../../fixtures/testData";
import { getFormattedFileNamingDate, mergeConfig } from "../../support/utils";

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

      cy.get("mat-cell")
        .contains(proposal.proposalId)
        .closest("mat-row")
        .contains(proposal.title)
        .click();

      cy.url().should("include", `/proposals/${proposal.proposalId}`);

      cy.contains(proposal.title);
    });

    it("if user has no access on a proposal should see not found screen", () => {
      const newProposal = {
        ...testData.proposal,
        proposalId: Math.floor(100000 + Math.random() * 900000).toString(),
      };
      cy.createProposal(newProposal);

      cy.login(
        Cypress.env("secondaryUsername"),
        Cypress.env("secondaryPassword"),
      );
      cy.visit(`/proposals/${newProposal.proposalId}`);

      cy.get("[data-cy=spinner]").should("not.exist");

      cy.get("[data-cy='proposal-not-found']").should("exist");
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

      cy.get("mat-cell")
        .contains(newProposal.proposalId)
        .closest("mat-row")
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

    it("proposal should have type", () => {
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
        .focus()
        .type(`${metadataName}{enter}`);
      cy.get("[data-cy=metadata-value-input]")
        .last()
        .focus()
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

      cy.get("mat-cell.mat-column-proposalId")
        .contains(newProposal.proposalId)
        .closest("mat-row")
        .contains(newProposal.title)
        .click();

      cy.url().should("include", `/proposals/${newProposal.proposalId}`);

      cy.get('[data-cy="related-proposals"]').click();

      cy.get("app-related-proposals mat-row")
        .contains(newProposal2.title)
        .closest("mat-row")
        .contains("child");
      cy.get("app-related-proposals mat-row").contains(proposal.title).click();
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

      cy.get("mat-cell.mat-column-proposalId")
        .contains(proposal.proposalId)
        .closest("mat-row")
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

  describe("Proposals dynamic material table", () => {
    it("should be able to search for proposal in the global search", () => {
      const newProposal = {
        ...testData.proposal,
        proposalId: Math.floor(100000 + Math.random() * 900000).toString(),
      };

      cy.createProposal(newProposal);

      cy.visit("/proposals");

      cy.get('.table-global-search input[type="text"]').type(
        newProposal.proposalId,
      );

      cy.get("mat-table mat-row")
        .first()
        .should("contain", newProposal.proposalId);

      cy.reload();

      cy.get("mat-table mat-row")
        .first()
        .should("contain", newProposal.proposalId);
    });

    it("should be able to sort for proposal in the column sort", () => {
      const newProposal = {
        ...testData.proposal,
        proposalId: "000000",
      };

      const newProposal2 = {
        ...testData.proposal,
        proposalId: "000001",
      };

      cy.createProposal(newProposal2);
      cy.createProposal(newProposal);

      cy.visit("/proposals");

      cy.get("mat-table mat-row")
        .first()
        .should("not.contain", newProposal.proposalId);

      cy.get(".mat-sort-header-container").contains("Proposal ID").click();

      cy.get("mat-table mat-row")
        .first()
        .should("contain", newProposal.proposalId);

      cy.reload();

      cy.get("mat-table mat-row")
        .first()
        .should("contain", newProposal.proposalId);
    });

    it("should be able to change page and page size in the proposal table", () => {
      const newProposal = {
        ...testData.proposal,
        proposalId: Math.floor(100000 + Math.random() * 900000).toString(),
      };
      const defaultPageSize = "10";
      const newPageSize = "5";

      cy.createProposal(newProposal);

      cy.visit("/proposals");

      cy.get("mat-paginator mat-select .mat-mdc-select-value-text").contains(
        defaultPageSize,
      );

      cy.get("mat-paginator mat-select").click({ force: true });
      cy.get("mat-option").contains(newPageSize).click({ force: true });

      cy.reload();

      cy.get("mat-paginator mat-select .mat-mdc-select-value-text").contains(
        newPageSize,
      );

      cy.get("mat-paginator .mat-mdc-paginator-range-actions").contains(
        `1 – ${newPageSize}`,
      );

      cy.get("mat-paginator [aria-label='Next page']").click();

      cy.get("mat-paginator .mat-mdc-paginator-range-actions").should(
        "not.contain",
        `1 – ${newPageSize}`,
      );

      cy.url("should.contain", `pageIndex=1`);

      cy.reload();

      cy.get("mat-paginator .mat-mdc-paginator-range-actions").should(
        "not.contain",
        `1 – ${newPageSize}`,
      );

      cy.url("should.contain", `pageIndex=1`);
    });

    it("should be able to change visible columns settings in the table", () => {
      const newProposal = {
        ...testData.proposal,
        proposalId: Math.floor(100000 + Math.random() * 900000).toString(),
      };

      cy.createProposal(newProposal);

      cy.visit("/proposals");

      cy.get("dynamic-mat-table mat-header-row.header").should("exist");

      cy.get("dynamic-mat-table table-menu button").click();
      cy.get('[role="menu"] button').contains("Default setting").click();
      cy.get("body").type("{esc}");

      cy.contains(
        "dynamic-mat-table mat-header-row.header mat-header-cell",
        "First Name",
      );
      cy.contains(
        "dynamic-mat-table mat-header-row.header mat-header-cell",
        "Last Name",
      );

      cy.get("dynamic-mat-table table-menu button").click();

      cy.get('[role="menu"] button').contains("Column setting").click();
      cy.get('[role="menu"]')
        .contains("First Name")
        .parent()
        .find("input[type=checkbox]")
        .uncheck();
      cy.get('[role="menu"]')
        .contains("Last Name")
        .parent()
        .find("input[type=checkbox]")
        .uncheck();
      cy.get('[role="menu"]')
        .contains("PI First Name")
        .parent()
        .find("input[type=checkbox]")
        .uncheck();
      cy.get('[role="menu"]')
        .contains("PI Last Name")
        .parent()
        .find("input[type=checkbox]")
        .uncheck();

      cy.get('[role="menu"] .column-config-apply .done-setting')
        .contains("done")
        .click();

      cy.get("dynamic-mat-table table-menu button").click();
      cy.get('[role="menu"] button').contains("Save table setting").click();

      cy.reload();

      cy.get("dynamic-mat-table mat-header-row.header").should("exist");

      cy.get("dynamic-mat-table mat-header-row.header").should(
        "not.contain",
        "First Name",
      );
      cy.get("dynamic-mat-table mat-header-row.header").should(
        "not.contain",
        "Last Name",
      );

      cy.get("dynamic-mat-table table-menu button").click();
      cy.get('[role="menu"] button').contains("Default setting").click();

      cy.get("dynamic-mat-table table-menu button").click();
      cy.get('[role="menu"] button').contains("Save table setting").click();

      cy.get("body").type("{esc}");

      cy.reload();

      cy.get("dynamic-mat-table mat-header-row.header").should("exist");

      cy.contains(
        "dynamic-mat-table mat-header-row.header mat-header-cell",
        "First Name",
      );
      cy.contains(
        "dynamic-mat-table mat-header-row.header mat-header-cell",
        "Last Name",
      );
    });

    it("should be able to download table data as a json", () => {
      const newProposal = {
        ...testData.proposal,
        proposalId: Math.floor(100000 + Math.random() * 900000).toString(),
      };

      cy.createProposal(newProposal);

      cy.visit("/proposals");

      cy.get("mat-paginator mat-select").click({ force: true });
      cy.get("mat-option").contains("25").click({ force: true });

      cy.get("dynamic-mat-table table-menu button").click();

      cy.get('[role="menu"] button').contains("Save data").click();

      cy.get('[role="menu"] button').contains("Json file").click();

      const downloadsFolder = Cypress.config("downloadsFolder");
      const tableName = "proposalsTable";

      cy.readFile(
        path.join(
          downloadsFolder,
          `${tableName}${getFormattedFileNamingDate()}.json`,
        ),
      ).then((actualExport) => {
        const foundProposal = actualExport.find(
          (proposal) => proposal.proposalId === newProposal.proposalId,
        );

        expect(foundProposal).to.exist;
      });
    });

    it("should be able to download table data as a csv", () => {
      const newProposal = {
        ...testData.proposal,
        proposalId: Math.floor(100000 + Math.random() * 900000).toString(),
      };

      cy.createProposal(newProposal);

      cy.visit("/proposals");

      cy.get("mat-paginator mat-select").click({ force: true });
      cy.get("mat-option").contains("25").click({ force: true });

      cy.get("dynamic-mat-table table-menu button").click();

      cy.get('[role="menu"] button').contains("Save data").click();

      cy.get('[role="menu"] button').contains("CSV file").click();

      const downloadsFolder = Cypress.config("downloadsFolder");
      const tableName = "proposalsTable";

      cy.readFile(
        path.join(
          downloadsFolder,
          `${tableName}${getFormattedFileNamingDate()}.csv`,
        ),
      ).then((actualExport) => {
        expect(actualExport).to.contain(newProposal.proposalId);
      });
    });
  });
});
