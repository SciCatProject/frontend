import { testConfig } from "../../fixtures/testData";
import { mergeConfig } from "../../support/utils";

describe("Dataset Detail Dynamic Tile Authorization", () => {
  const baseCustomization = [
    {
      type: "regular",
      label: "Admin Only Section",
      order: 1,
      row: 1,
      col: 10,
      authorization: ["admin"],
      fields: [
        { element: "text", source: "datasetName", order: 0 },
        { element: "copy", source: "description", order: 1 },
      ],
    },
    {
      type: "regular",
      label: "Public Section",
      order: 2,
      row: 1,
      col: 10,
      authorization: ["#all"],
      fields: [
        { element: "text", source: "ownerEmail", order: 0 },
        { element: "tag", source: "keywords", order: 1 },
      ],
    },
    {
      type: "regular",
      label: "Archive Manager Section",
      order: 3,
      row: 1,
      col: 10,
      authorization: ["archivemanager"],
      fields: [
        { element: "text", source: "type", order: 0 },
        { element: "date", source: "creationTime", order: 1 },
      ],
    },
  ];

  const authTestConfigNoIndicator = {
    datasetDetailComponent: {
      enableCustomizedComponent: true,
      showRestrictedTilesIndicator: false,
      customization: baseCustomization,
    },
  };

  const authTestConfigWithIndicator = {
    datasetDetailComponent: {
      enableCustomizedComponent: true,
      showRestrictedTilesIndicator: true,
      customization: baseCustomization,
    },
  };

  const adminUsername = Cypress.env("username");
  const adminPassword = Cypress.env("password");
  const archiveManagerUsername = Cypress.env("secondaryUsername");
  const archiveManagerPassword = Cypress.env("secondaryPassword");
  const guestUsername = Cypress.env("guestUsername");
  const guestPassword = Cypress.env("guestPassword");


  describe("No restricted access indicator", () => {

    beforeEach(() => {
      cy.readFile("CI/e2e/frontend.config.e2e.json").then((baseConfig) => {
        const mergedConfig = mergeConfig(baseConfig, authTestConfigNoIndicator);
        cy.intercept("GET", "**/admin/config", mergedConfig).as(
          "getFrontendConfig",
        );
      });

      cy.login(adminUsername, adminPassword);
      cy.createDataset({ type: "raw" });
      cy.visit("/datasets");
      cy.wait("@getFrontendConfig");
    });

    after(() => {
      cy.removeDatasets();
    });

    it("should show all tiles to admin user", () => {
      cy.finishedLoading();

      cy.get('[data-cy="text-search"]').clear().type("Cypress");
      cy.get('[data-cy="search-button"]').click();

      cy.isLoading();

      cy.get("mat-row").contains("Cypress Dataset").click();

      cy.isLoading();

      // Admin user should see all sections
      cy.get('[data-cy="section-label"]').should("contain", "Admin Only Section");
      cy.get('[data-cy="section-label"]').should("contain", "Public Section");
      // But NOT archiv3e manager only section
      cy.get('[data-cy="section-label"]:contains("Archive Manager Section")').should(
        "not.exist",
      );

    });

    it("should hide admin-only tile from archiveManager user", () => {
      cy.login(archiveManagerUsername, archiveManagerPassword);
      cy.visit("/datasets");
      cy.wait("@getFrontendConfig");

      cy.finishedLoading();

      cy.get('[data-cy="text-search"]').clear().type("Cypress");
      cy.get('[data-cy="search-button"]').click();

      cy.isLoading();

      cy.get("mat-row").contains("Cypress Dataset").click();

      cy.isLoading();

      // Archive Manager should see public and archiveManager sections
      cy.get('[data-cy="section-label"]').should("contain", "Public Section");
      cy.get('[data-cy="section-label"]').should("contain", "Archive Manager Section");
      // But NOT admin-only section
      cy.get('[data-cy="section-label"]:contains("Admin Only Section")').should(
        "not.exist",
      );
    });

    it("should only show public tile to guest user", () => {
      cy.login(guestUsername, guestPassword);
      cy.visit("/datasets");
      cy.wait("@getFrontendConfig");

      cy.finishedLoading();

      cy.get('[data-cy="text-search"]').clear().type("Cypress");
      cy.get('[data-cy="search-button"]').click();

      cy.isLoading();

      cy.get("mat-row").contains("Cypress Dataset").click();

      cy.isLoading();

      // Guest user (user1) should only see public section
      cy.get('[data-cy="section-label"]').should("contain", "Public Section");
      // Should NOT see admin-only or archiveManager sections
      cy.get('[data-cy="section-label"]:contains("Admin Only Section")').should(
        "not.exist",
      );
      cy.get('[data-cy="section-label"]:contains("Archive Manager Section")').should(
        "not.exist",
      );
      // Lock icons should not appear anywhere when feature is disabled
      cy.get(".restricted-indicator").should("not.exist");
    });
  })

  describe("Show restricted access indicator", () => {

    beforeEach(() => {
      cy.readFile("CI/e2e/frontend.config.e2e.json").then((baseConfig) => {
        const mergedConfig = mergeConfig(baseConfig, authTestConfigWithIndicator);
        cy.intercept("GET", "**/admin/config", mergedConfig).as(
          "getFrontendConfig",
        );
      });

      cy.login(adminUsername, adminPassword);
      cy.createDataset({ type: "raw" });
      cy.visit("/datasets");
      cy.wait("@getFrontendConfig");
    });

    after(() => {
      cy.removeDatasets();
    });

    it("should show all tiles to admin user", () => {
      cy.finishedLoading();

      cy.get('[data-cy="text-search"]').clear().type("Cypress");
      cy.get('[data-cy="search-button"]').click();

      cy.isLoading();

      cy.get("mat-row").contains("Cypress Dataset").click();

      cy.isLoading();

      // Admin user should see all sections
      cy.get('[data-cy="section-label"]').should("contain", "Admin Only Section");
      cy.get('[data-cy="section-label"]').should("contain", "Public Section");
      // But NOT archive manager only section
      cy.get('[data-cy="section-label"]:contains("Archive Manager Section")').should(
        "not.exist",
      );

      // Lock icons should appear on restricted tiles
      cy.get('[data-cy="section-label"]:contains("Admin Only Section")')
        .parent()
        .within(() => {
          cy.get(".restricted-indicator mat-icon").should("exist").and("contain", "lock_outline");
        });
      // Public section with ["#all"] should NOT have lock icon
      cy.get('[data-cy="section-label"]:contains("Public Section")')
        .parent()
        .within(() => {
          cy.get(".restricted-indicator").should("not.exist");
        });

    });

    it("should hide admin-only tile from archiveManager user", () => {
      cy.login(archiveManagerUsername, archiveManagerPassword);
      cy.visit("/datasets");
      cy.wait("@getFrontendConfig");

      cy.finishedLoading();

      cy.get('[data-cy="text-search"]').clear().type("Cypress");
      cy.get('[data-cy="search-button"]').click();

      cy.isLoading();

      cy.get("mat-row").contains("Cypress Dataset").click();

      cy.isLoading();

      // Archive Manager should see public and archiveManager sections
      cy.get('[data-cy="section-label"]').should("contain", "Public Section");
      cy.get('[data-cy="section-label"]').should("contain", "Archive Manager Section");
      // But NOT admin-only section
      cy.get('[data-cy="section-label"]:contains("Admin Only Section")').should(
        "not.exist",
      );
      // Archive Manager Section should have lock icon (restricted)
      cy.get('[data-cy="section-label"]:contains("Archive Manager Section")')
        .parent()
        .within(() => {
          cy.get(".restricted-indicator mat-icon").should("exist").and("contain", "lock_outline");
        });
      // Public section should NOT have lock icon
      cy.get('[data-cy="section-label"]:contains("Public Section")')
        .parent()
        .within(() => {
          cy.get(".restricted-indicator").should("not.exist");
        });
    });

    it("should only show public tile to guest user", () => {
      cy.login(guestUsername, guestPassword);
      cy.visit("/datasets");
      cy.wait("@getFrontendConfig");

      cy.finishedLoading();

      cy.get('[data-cy="text-search"]').clear().type("Cypress");
      cy.get('[data-cy="search-button"]').click();

      cy.isLoading();

      cy.get("mat-row").contains("Cypress Dataset").click();

      cy.isLoading();

      // Guest user (user1) should only see public section
      cy.get('[data-cy="section-label"]').should("contain", "Public Section");
      // Should NOT see admin-only or archiveManager sections
      cy.get('[data-cy="section-label"]:contains("Admin Only Section")').should(
        "not.exist",
      );
      cy.get('[data-cy="section-label"]:contains("Archive Manager Section")').should(
        "not.exist",
      );
      // Public section should NOT have lock icon (has ["#all"] authorization)
      cy.get('[data-cy="section-label"]:contains("Public Section")')
        .parent()
        .within(() => {
          cy.get(".restricted-indicator").should("not.exist");
        });
    });
  })
});
