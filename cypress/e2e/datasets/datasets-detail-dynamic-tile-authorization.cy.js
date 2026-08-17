import { testConfig } from "../../fixtures/testData";
import { mergeConfig } from "../../support/utils";

describe("1010: Dataset Detail Dynamic Tile Authorization", () => {
  const baseCustomization = [
    {
      type: "regular",
      label: "Admin Only Section",
      order: 1,
      row: 1,
      col: 10,
      visibile: true,
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
      visible: true,
      authorization: ["archivemanager"],
      fields: [
        { element: "text", source: "type", order: 0 },
        { element: "date", source: "creationTime", order: 1 },
      ],
    },
    {
      type: "regular",
      label: "Invisible Section",
      order: 4,
      row: 1,
      col: 10,
      visible: false,
      authorization: [],
      fields: [
        { element: "text", source: "type", order: 0 },
        { element: "date", source: "creationTime", order: 1 },
      ],
    },
  ];

  const authTestConfigNoIndicator = {
    datasetDetailComponent: {
      enableCustomizedComponent: true,
      tileRestrictedIconVisible: false,
      tileRestrictedIconGroups: [],
      customization: baseCustomization,
    },
  };

  const authTestConfigWithIndicator = {
    datasetDetailComponent: {
      enableCustomizedComponent: true,
      tileRestrictedIconVisible: true,
      tileRestrictedIconGroups: ["admin"],
      customization: baseCustomization,
    },
  };

  const adminUsername = Cypress.env("username");
  const adminPassword = Cypress.env("password");
  const archiveManagerUsername = Cypress.env("secondaryUsername");
  const archiveManagerPassword = Cypress.env("secondaryPassword");
  const guestUsername = Cypress.env("guestUsername");
  const guestPassword = Cypress.env("guestPassword");


  describe("1010:0010: No restricted access indicator", () => {

    beforeEach(() => {
      cy.readFile("CI/e2e/frontend.config.e2e.json").then((baseConfig) => {
        const mergedConfig = mergeConfig(baseConfig, authTestConfigNoIndicator);
        cy.intercept("GET", "**/admin/config", mergedConfig).as(
          "getFrontendConfigNoIndicator",
        );
      });

      cy.login(adminUsername, adminPassword);
      cy.createDataset({ type: "raw" });
      cy.visit("/datasets");
      cy.wait("@getFrontendConfigNoIndicator");
    });

    after(() => {
      cy.removeDatasets();
    });

    it("1010:0010:0010: should show all tiles to admin user", () => {
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
      // Invisible Section should not be visible to admin
      cy.get('[data-cy="section-label"]:contains("Invisible Section")').should(
        "not.exist",
      );

      // Admin only section should NOT have lock icon
      cy.get('[data-cy="section-label"]:contains("Admin Only Section")')
        .parent()
        .within(() => {
          cy.get(".restricted-indicator").should("not.exist");
        });
      // Public section should NOT have lock icon
      cy.get('[data-cy="section-label"]:contains("Public Section")')
        .parent()
        .within(() => {
          cy.get(".restricted-indicator").should("not.exist");
        });

    });

    it("1010:0010:0020: should hide admin-only tile from archiveManager user", () => {
      cy.login(archiveManagerUsername, archiveManagerPassword);
      cy.visit("/datasets");
      cy.wait("@getFrontendConfigNoIndicator");

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
      // Invisible Section should not be visible to archiveManager
      cy.get('[data-cy="section-label"]:contains("Invisible Section")').should(
        "not.exist",
      );

      // Archive Manager only section should NOT have lock icon
      cy.get('[data-cy="section-label"]:contains("Archive Manager Section")')
        .parent()
        .within(() => {
          cy.get(".restricted-indicator").should("not.exist");
        });
      // Public section should NOT have lock icon
      cy.get('[data-cy="section-label"]:contains("Public Section")')
        .parent()
        .within(() => {
          cy.get(".restricted-indicator").should("not.exist");
        });

    });

    it("1010:0010:0030: should only show public tile to guest user", () => {
      cy.login(guestUsername, guestPassword);
      cy.visit("/datasets");
      cy.wait("@getFrontendConfigNoIndicator");

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
      // Invisible Section should not be visible to guest
      cy.get('[data-cy="section-label"]:contains("Invisible Section")').should(
        "not.exist",
      );

      // Public section should NOT have lock icon
      cy.get('[data-cy="section-label"]:contains("Public Section")')
        .parent()
        .within(() => {
          cy.get(".restricted-indicator").should("not.exist");
        });
    });

    it("1010:0010:0040: should only show public tile to non authenticated user", () => {

      cy.createDataset({type: "raw", "isPublished": true});

      cy.visit("/datasets");
      cy.wait("@getFrontendConfigNoIndicator");

      cy.get(".user-button").should("contain.text", adminUsername).click();
      cy.get("[data-cy=logout-button]").click();
      cy.finishedLoading();

      cy.visit("/datasets");
      cy.wait("@getFrontendConfigNoIndicator");
      cy.finishedLoading();

      cy.get('[data-cy="text-search"]').clear().type("Cypress");
      cy.get('[data-cy="search-button"]').click();

      cy.isLoading();

      cy.get("mat-row").contains("Cypress Dataset").click();

      cy.isLoading();

      // Non authenticated user should only see public section
      cy.get('[data-cy="section-label"]').should("contain", "Public Section");
      // Should NOT see admin-only or archiveManager sections
      cy.get('[data-cy="section-label"]:contains("Admin Only Section")').should(
        "not.exist",
      );
      cy.get('[data-cy="section-label"]:contains("Archive Manager Section")').should(
        "not.exist",
      );
      // Invisible Section should not be visible to non authenticated user
      cy.get('[data-cy="section-label"]:contains("Invisible Section")').should(
        "not.exist",
      );
      // Public section should NOT have lock icon
      cy.get('[data-cy="section-label"]:contains("Public Section")')
        .parent()
        .within(() => {
          cy.get(".restricted-indicator").should("not.exist");
        });
    });
  })

  describe("1010:0020: Show restricted access indicator", () => {

    beforeEach(() => {
      cy.readFile("CI/e2e/frontend.config.e2e.json").then((baseConfig) => {
        const mergedConfig = mergeConfig(baseConfig, authTestConfigWithIndicator);
        cy.intercept("GET", "**/admin/config", mergedConfig).as(
          "getFrontendConfigWithIndicator",
        );
      });

      cy.login(adminUsername, adminPassword);
      cy.createDataset({ type: "raw" });
      cy.visit("/datasets");
      cy.wait("@getFrontendConfigWithIndicator");
    });

    after(() => {
      cy.removeDatasets();
    });

    it("1010:0020:0010: should show all tiles to admin user", () => {
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
      // Invisible Section should not be visible to non authenticated user
      cy.get('[data-cy="section-label"]:contains("Invisible Section")').should(
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

      // Admin user should see Admin Only Section with tooltip showing "admin"
      cy.get('[data-cy="section-label"]:contains("Admin Only Section")')
        .parent()
        .within(() => {
          cy.get('mat-icon.mat-mdc-tooltip-trigger')
            .should("exist")
            .and('have.attr', 'ng-reflect-message');
        });

    });

    it("1010:0020:0020: should hide admin-only tile from archiveManager user", () => {
      cy.login(archiveManagerUsername, archiveManagerPassword);
      cy.visit("/datasets");
      cy.wait("@getFrontendConfigWithIndicator");

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
      // Invisible Section should not be visible to non authenticated user
      cy.get('[data-cy="section-label"]:contains("Invisible Section")').should(
        "not.exist",
      );

      // Archive Manager Section should not have lock icon as it is not in the groups with access to this info
      cy.get('[data-cy="section-label"]:contains("Archive Manager Section")')
        .parent()
        .within(() => {
          cy.get(".restricted-indicator").should("not.exist");
        });
      // Public section should NOT have lock icon
      cy.get('[data-cy="section-label"]:contains("Public Section")')
        .parent()
        .within(() => {
          cy.get(".restricted-indicator").should("not.exist");
        });
    });

    it("1010:0020:0030: should only show public tile to guest user", () => {
      cy.login(guestUsername, guestPassword);
      cy.visit("/datasets");
      cy.wait("@getFrontendConfigWithIndicator");

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
      // Invisible Section should not be visible to non authenticated user
      cy.get('[data-cy="section-label"]:contains("Invisible Section")').should(
        "not.exist",
      );

      // Public section should NOT have lock icon (has no authorization = public)
      cy.get('[data-cy="section-label"]:contains("Public Section")')
        .parent()
        .within(() => {
          cy.get(".restricted-indicator").should("not.exist");
        });
    });

    it("1010:0020:0040: should only show public tile to non authenticated user", () => {
      cy.createDataset({type: "raw", "isPublished": true});

      cy.visit("/datasets");
      cy.wait("@getFrontendConfigWithIndicator");

      cy.get(".user-button").should("contain.text", adminUsername).click();
      cy.get("[data-cy=logout-button]").click();
      cy.finishedLoading();

      cy.visit("/datasets");
      cy.wait("@getFrontendConfigWithIndicator");

      cy.finishedLoading();

      cy.get('[data-cy="text-search"]').clear().type("Cypress");
      cy.get('[data-cy="search-button"]').click();

      cy.isLoading();

      cy.get("mat-row").contains("Cypress Dataset").click();

      cy.isLoading();

      // Non authenticated user should only see public section
      cy.get('[data-cy="section-label"]').should("contain", "Public Section");
      // Should NOT see admin-only or archiveManager sections
      cy.get('[data-cy="section-label"]:contains("Admin Only Section")').should(
        "not.exist",
      );
      cy.get('[data-cy="section-label"]:contains("Archive Manager Section")').should(
        "not.exist",
      );
      // Invisible Section should not be visible to non authenticated user
      cy.get('[data-cy="section-label"]:contains("Invisible Section")').should(
        "not.exist",
      );
      // Public section should NOT have lock icon (has no authorization = public)
      cy.get('[data-cy="section-label"]:contains("Public Section")')
        .parent()
        .within(() => {
          cy.get(".restricted-indicator").should("not.exist");
        });
    });

  })
});
