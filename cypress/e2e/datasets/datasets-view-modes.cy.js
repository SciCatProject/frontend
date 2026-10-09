import { testData } from "../../fixtures/testData";

const archivableName = "Cypress view archivable";
const onTapeName = "Cypress view on tape";

const toTape = {
  id: "to-tape",
  label: "Ready for tape",
  tooltip: "Datasets that can be sent to tape",
  where: {
    "datasetlifecycle.archivable": true,
    "datasetlifecycle.retrievable": false,
  },
};
const onTape = {
  id: "on-tape",
  label: "On tape",
  where: { "datasetlifecycle.retrievable": true },
};

function visitWithConfig(overrides) {
  cy.readFile("CI/e2e/frontend.config.e2e.json").then((baseConfig) => {
    cy.intercept("GET", "**/admin/config", { ...baseConfig, ...overrides }).as(
      "getConfig",
    );
  });

  cy.visit("/datasets");
  cy.wait("@getConfig", { timeout: 20000 });
  cy.finishedLoading();
}

// selects a view and yields the where sent with the list request it triggers
function selectView(label) {
  // registered right before the click, so earlier list requests don't count
  cy.intercept({ method: "GET", pathname: "/api/v4/datasets" }).as(
    "viewRequest",
  );
  cy.contains("mat-button-toggle", label).click();
  return cy.wait("@viewRequest").then((interception) => {
    const url = new URL(interception.request.url);
    return JSON.parse(url.searchParams.get("filter")).where;
  });
}

describe("Datasets view modes", () => {
  beforeEach(() => {
    cy.login(Cypress.env("username"), Cypress.env("password"));

    cy.createDataset({
      type: "raw",
      datasetName: archivableName,
      datasetlifecycle: {
        ...testData.rawDataset.datasetlifecycle,
        archivable: true,
        retrievable: false,
      },
    });
    cy.createDataset({
      type: "raw",
      datasetName: onTapeName,
      datasetlifecycle: {
        ...testData.rawDataset.datasetlifecycle,
        archivable: false,
        retrievable: true,
      },
    });
  });

  afterEach(() => {
    cy.removeDatasets();
  });

  describe("configured views", () => {
    beforeEach(() => {
      visitWithConfig({
        datasetViews: {
          modes: [{ id: "all", label: "All", where: {} }, toTape, onTape],
        },
      });
    });

    it("should show a toggle per configured view, with its label and tooltip", () => {
      cy.get("mat-button-toggle").should("have.length", 3);
      cy.get("mat-button-toggle").eq(0).should("contain.text", "All");
      cy.get("mat-button-toggle").eq(1).should("contain.text", toTape.label);
      cy.get("mat-button-toggle").eq(2).should("contain.text", onTape.label);

      cy.contains("mat-button-toggle", toTape.label).trigger("mouseenter");
      cy.get(".mat-mdc-tooltip").should("contain.text", toTape.tooltip);
    });

    it("should filter the list by the selected view's where", () => {
      selectView(toTape.label).then((where) => {
        expect(where).to.deep.include(toTape.where);
      });
      cy.finishedLoading();
      cy.get("mat-row").should("contain.text", archivableName);
      cy.get("mat-row").should("not.contain.text", onTapeName);

      selectView(onTape.label).then((where) => {
        expect(where).to.deep.include(onTape.where);
      });
      cy.finishedLoading();
      cy.get("mat-row").should("contain.text", onTapeName);
      cy.get("mat-row").should("not.contain.text", archivableName);

      selectView("All").then((where) => {
        expect(where).not.to.have.any.keys(
          "datasetlifecycle.archivable",
          "datasetlifecycle.retrievable",
        );
      });
      cy.finishedLoading();
      cy.get("mat-row").should("contain.text", archivableName);
      cy.get("mat-row").should("contain.text", onTapeName);
    });
  });

  it("should hide the view toggles when no views are configured", () => {
    visitWithConfig({
      archiveWorkflowEnabled: true,
      datasetViews: { modes: [] },
    });

    cy.get(".dataset-table mat-header-row").should("exist");
    cy.get("mat-button-toggle-group").should("not.exist");
  });

  it("should use the built-in archive views when none are configured", () => {
    visitWithConfig({ archiveWorkflowEnabled: true, datasetViews: undefined });

    [
      "All",
      "Archivable",
      "Retrievable",
      "Work In Progress",
      "System Error",
      "User Error",
    ].forEach((label, i) => {
      cy.get("mat-button-toggle").eq(i).should("contain.text", label);
    });
  });
});
