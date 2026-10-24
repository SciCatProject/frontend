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
  "Copy entry",
];

const openDatasetDetails = () => {
  cy.get(".dataset-table mat-table mat-header-row").should("exist");
  cy.finishedLoading();
  cy.get('[data-cy="text-search"]').clear().type(datasetName);
  cy.get('[data-cy="search-button"]').click();
  cy.isLoading();
  cy.get("mat-row").contains(datasetName).click();
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
        action: "Copy entry",
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
