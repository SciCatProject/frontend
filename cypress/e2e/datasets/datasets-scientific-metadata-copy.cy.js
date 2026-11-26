const datasetName = "Cypress Scientific Metadata Copy Dataset";
const scientificMetadata = {
  key_1: {
    human_name: "Key 1",
    value: "Value 1",
    unit: "",
  },
  key_2: {
    human_name: "Key 2",
    value: 1,
    unit: "mm",
  },
};

const copyActions = [
  "Copy name",
  "Copy machine name",
  "Copy value",
  "Copy full value",
  "Copy full entry",
];

const openDatasetDetails = (name = datasetName) => {
  cy.get(".dataset-table mat-table mat-header-row").should("exist");
  cy.finishedLoading();
  cy.get('[data-cy="text-search"]').clear().type(name);
  cy.get('[data-cy="search-button"]').click();
  cy.isLoading();
  cy.get("mat-row").contains(name).click();
  cy.isLoading();
  cy.finishedLoading();
};

const openMetadataRowMenu = (rowName) => {
  cy.get("#scientific-metadata-table")
    .find("dynamic-mat-table mat-row")
    .contains(rowName)
    .closest("mat-row")
    .find(".table-menu button")
    .click();
};

const copyFromMetadataRow = (rowName, action) => {
  openMetadataRowMenu(rowName);
  cy.get("body").contains("button.button-menu", action).click();
};

const expectClipboard = (expected) => {
  cy.window().then((win) =>
    win.navigator.clipboard.readText().then((clipboardText) => {
      expect(clipboardText).to.equal(expected);
    }),
  );
};

describe("Datasets Scientific Metadata Copy Actions", () => {
  beforeEach(() => {
    cy.login(Cypress.env("username"), Cypress.env("password"));
    cy.createDataset({ type: "raw", datasetName, scientificMetadata });
    cy.visit("/datasets");
  });

  after(() => {
    cy.removeDatasets();
  });

  it("should expose all copy actions for a scientific metadata row", () => {
    openDatasetDetails();

    cy.get("#scientific-metadata-table").should(
      "have.class",
      "scientific-metadata-table",
    );
    cy.get("#scientific-metadata-table")
      .find("dynamic-mat-table mat-row")
      .contains("Key 2")
      .should("exist");

    openMetadataRowMenu("Key 2");
    cy.get("body .metadata-entry-context-menu").should("be.visible");
    cy.get("body .metadata-entry-context-menu mat-icon").should("not.exist");
    cy.wrap(copyActions).each((action) => {
      cy.get("body")
        .contains("button.button-menu", action)
        .should("be.visible");
    });
  });

  it("should copy the expected name, machine name, value, full value, and entry", () => {
    openDatasetDetails();

    const copyCases = [
      { row: "Key 2", action: "Copy name", expected: "Key 2" },
      { row: "Key 2", action: "Copy machine name", expected: "key_2" },
      { row: "Key 2", action: "Copy value", expected: "1" },
      {
        row: "Key 2",
        action: "Copy full value",
        expected: JSON.stringify({ value: 1, unit: "mm" }),
      },
      {
        row: "Key 2",
        action: "Copy full entry",
        expected: JSON.stringify(scientificMetadata.key_2),
      },
      { row: "Key 1", action: "Copy full value", expected: "Value 1" },
    ];

    cy.wrap(copyCases).each(({ row, action, expected }) => {
      copyFromMetadataRow(row, action);
      expectClipboard(expected);
    });
  });
});

const configuredDatasetName =
  "Cypress Configured Scientific Metadata Menu Dataset";
const configuredScientificMetadata = {
  configured_key: {
    human_name: "Configured Key",
    value: 2,
    unit: "mm",
  },
};

describe("Datasets Scientific Metadata Context Menu Configuration", () => {
  beforeEach(() => {
    cy.login(Cypress.env("username"), Cypress.env("password"));
    cy.intercept("GET", "**/admin/config", {
      scientificMetadataContextMenu: {
        enabled: true,
        copyName: false,
        copyMachineName: false,
        copyValue: true,
        copyFullValue: true,
        copyFullEntry: false,
        addAsColumn: true,
      },
    }).as("getScientificMetadataMenuConfig");
    cy.createDataset({
      type: "raw",
      datasetName: configuredDatasetName,
      scientificMetadata: configuredScientificMetadata,
    });
    cy.visit("/datasets");
  });

  after(() => {
    cy.removeDatasets();
  });

  it("should show and apply configured scientific metadata menu actions", () => {
    openDatasetDetails(configuredDatasetName);

    openMetadataRowMenu("Configured Key");
    cy.get("body .metadata-entry-context-menu")
      .should("be.visible")
      .within(() => {
        cy.contains("button.button-menu", "Add as column").should("be.visible");
        cy.contains("button.button-menu", "Copy value").should("be.visible");
        cy.contains("button.button-menu", "Copy full value").should(
          "be.visible",
        );
        cy.contains("button.button-menu", "Copy name").should("not.exist");
        cy.contains("button.button-menu", "Copy machine name").should(
          "not.exist",
        );
        cy.contains("button.button-menu", "Copy full entry").should(
          "not.exist",
        );
      });

    cy.get("body")
      .contains("button.button-menu", "Copy full value")
      .click();
    expectClipboard(JSON.stringify({ value: 2, unit: "mm" }));
  });
});
