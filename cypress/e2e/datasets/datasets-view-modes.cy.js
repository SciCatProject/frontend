import { testData } from "../../fixtures/testData";

const archivableName = "Cypress view archivable";
const onTapeName = "Cypress view on tape";
const mineName = "Cypress view mine";

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
const toTapeMine = {
  ...toTape,
  checkbox: { label: "Only mine", where: { owner: "#user.username" } },
};
const mineWhere = {
  $and: [toTape.where, { owner: Cypress.env("username") }],
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

function openViews() {
  cy.get('[data-cy="dataset-view-modes"] mat-select').click();
}

// runs an action and checks the where of the list request it triggers
function expectListRequest(action, check) {
  cy.intercept({ method: "GET", pathname: "/api/v4/datasets" }).as(
    "listRequest",
  );
  action();
  cy.get("@listRequest.all").should((requests) => {
    expect(requests, "list requests").not.to.be.empty;
    const url = new URL(requests[requests.length - 1].request.url);
    check(JSON.parse(url.searchParams.get("filter")).where);
  });
  cy.finishedLoading();
}

function selectView(label, check) {
  expectListRequest(() => {
    openViews();
    cy.contains("mat-option", label).click();
  }, check);
}

function checkbox() {
  return cy.get('[data-cy="dataset-view-mode-checkbox"]');
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

    it("should show an option per configured view, with its label and tooltip", () => {
      openViews();
      cy.get("mat-option").should("have.length", 3);
      cy.get("mat-option").eq(0).should("contain.text", "All");
      cy.get("mat-option").eq(1).should("contain.text", toTape.label);
      cy.get("mat-option").eq(2).should("contain.text", onTape.label);

      cy.contains("mat-option", toTape.label).trigger("mouseenter");
      cy.get(".mat-mdc-tooltip").should("contain.text", toTape.tooltip);
    });

    it("should filter the list by the selected view's where", () => {
      selectView(toTape.label, (where) => {
        expect(where).to.deep.include(toTape.where);
      });
      cy.get("mat-row").should("contain.text", archivableName);
      cy.get("mat-row").should("not.contain.text", onTapeName);

      selectView(onTape.label, (where) => {
        expect(where).to.deep.include(onTape.where);
      });
      cy.get("mat-row").should("contain.text", onTapeName);
      cy.get("mat-row").should("not.contain.text", archivableName);

      selectView("All", (where) => {
        expect(where).not.to.have.any.keys(
          "datasetlifecycle.archivable",
          "datasetlifecycle.retrievable",
        );
      });
      cy.get("mat-row").should("contain.text", archivableName);
      cy.get("mat-row").should("contain.text", onTapeName);
    });
  });

  describe("view checkbox", () => {
    beforeEach(() => {
      cy.createDataset({
        type: "raw",
        datasetName: mineName,
        owner: Cypress.env("username"),
        datasetlifecycle: {
          ...testData.rawDataset.datasetlifecycle,
          archivable: true,
          retrievable: false,
        },
      });
    });

    it("should be ticked by default and narrow the view with the user's values", () => {
      visitWithConfig({ datasetViews: { modes: [toTapeMine] } });

      selectView(toTape.label, (where) => {
        expect(where).to.deep.include(mineWhere);
      });
      checkbox().should("contain.text", "Only mine");
      checkbox().find("input").should("be.checked");
      cy.get("mat-row").should("contain.text", mineName);
      cy.get("mat-row").should("not.contain.text", archivableName);

      expectListRequest(
        () => checkbox().find("input").click(),
        (where) => {
          expect(where).to.deep.include(toTape.where);
          expect(where).not.to.have.property("$and");
        },
      );
      checkbox().find("input").should("not.be.checked");
      cy.get("mat-row").should("contain.text", mineName);
      cy.get("mat-row").should("contain.text", archivableName);
    });

    it("should start unticked when its default is false", () => {
      visitWithConfig({
        datasetViews: {
          modes: [
            {
              ...toTapeMine,
              checkbox: { ...toTapeMine.checkbox, default: false },
            },
          ],
        },
      });

      selectView(toTape.label, (where) => {
        expect(where).not.to.have.property("$and");
      });
      checkbox().find("input").should("not.be.checked");
      cy.get("mat-row").should("contain.text", archivableName);
    });

    it("should be hidden and not applied for users in an exempt group", () => {
      cy.intercept("GET", "**/useridentities/findOne*").as("identity");
      visitWithConfig({ datasetViews: { modes: [toTapeMine] } });
      cy.wait("@identity").then(({ response }) => {
        const [group] = response.body.profile.accessGroups;
        expect(group, "a group of the e2e user").to.be.a("string");

        visitWithConfig({
          datasetViews: {
            modes: [
              {
                ...toTapeMine,
                checkbox: { ...toTapeMine.checkbox, exemptGroups: [group] },
              },
            ],
          },
        });
      });

      selectView(toTape.label, (where) => {
        expect(where).to.deep.include(toTape.where);
        expect(where).not.to.have.property("$and");
      });
      checkbox().should("not.exist");
      cy.get("mat-row").should("contain.text", archivableName);
    });
  });

  it("should hide the view dropdown when no views are configured", () => {
    visitWithConfig({
      archiveWorkflowEnabled: true,
      datasetViews: { modes: [] },
    });

    cy.get(".dataset-table mat-header-row").should("exist");
    cy.get('[data-cy="dataset-view-modes"]').should("not.exist");
  });

  it("should use the built-in archive views when none are configured", () => {
    visitWithConfig({ archiveWorkflowEnabled: true, datasetViews: undefined });
    openViews();

    [
      "All",
      "Archivable",
      "Retrievable",
      "Work In Progress",
      "System Error",
      "User Error",
    ].forEach((label, i) => {
      cy.get("mat-option").eq(i).should("contain.text", label);
    });
  });
});
