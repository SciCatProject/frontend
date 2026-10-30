import { getHeader } from "../../support/utils";

const headerLabels = () =>
  cy
    .get("dynamic-mat-table mat-header-row.header mat-header-cell")
    .not(".cdk-column-row-checkbox")
    .not(".cdk-column-table-menu")
    .find(".mat-sort-header-content");

const popupLabels = () =>
  cy
    .get('[role="menu"] mat-checkbox.column-config')
    .should("have.length.greaterThan", 0)
    .then(($els) => Cypress._.map($els, (el) => Cypress.$(el).text().trim()));

describe("Datasets column order", () => {
  before(() => {
    cy.login(Cypress.env("username"), Cypress.env("password"));
    cy.createDataset({
      type: "raw",
      dataFileSize: "small",
      datasetName: "Column Order Dataset",
    });
  });

  after(() => {
    cy.removeDatasets();
  });

  // The persistence layer stores the column order per user in localStorage under
  // `scicat.table.<userId>.<tableName>.columns.v<n>`. Other specs (e.g. the
  // datasets personalization) expect default columns, so drop these keys after
  // each test to avoid leaking the reordered state across spec files.
  afterEach(() => {
    cy.window().then((win) => {
      Object.keys(win.localStorage)
        .filter((key) => key.startsWith("scicat.table."))
        .forEach((key) => win.localStorage.removeItem(key));
    });
  });

  beforeEach(() => {
    cy.login(Cypress.env("username"), Cypress.env("password"));
    // ensure a clean default column set for each test
    cy.getCookie("userId").then((userId) => {
      cy.getToken().then((token) => {
        cy.request({
          method: "PATCH",
          url: `${Cypress.env("baseUrl")}/users/${userId.value}/settings/external`,
          headers: getHeader(token),
          body: { fe_dataset_table_columns: [] },
          failOnStatusCode: false,
        });
      });
    });
  });

  it("popup column order matches the table column order", () => {
    cy.visit("/datasets");
    cy.get("dynamic-mat-table mat-table", { timeout: 20000 }).should("exist");
    cy.finishedLoading();

    headerLabels().then(($tableLabels) => {
      const tableLabels = Cypress._.map($tableLabels, (el) =>
        Cypress.$(el).text().trim(),
      );

      cy.openColumnSetting();

      popupLabels().then((popup) => {
        // every visible header should appear in the popup in the same order
        const filteredPopup = popup.filter((l) => tableLabels.includes(l));
        expect(filteredPopup).to.deep.equal(tableLabels);
      });

      cy.get("body").type("{esc}");
    });
  });

  it("reorders the table when dragging a column header and persists after reload", () => {
    cy.visit("/datasets");
    cy.get("dynamic-mat-table mat-table", { timeout: 20000 }).should("exist");
    cy.finishedLoading();

    headerLabels().then(($before) => {
      const original = Cypress._.map($before, (el) =>
        Cypress.$(el).text().trim(),
      );
      cy.wrap(original).as("originalOrder");

      // drag the first draggable column header to the third position
      cy.dragColumnHeader(0, 2);
      cy.finishedLoading();

      headerLabels().then(($after) => {
        const reordered = Cypress._.map($after, (el) =>
          Cypress.$(el).text().trim(),
        );
        expect(reordered).to.not.deep.equal(original);
        expect([...reordered].sort()).to.deep.equal([...original].sort());
        cy.wrap(reordered).as("reorderedOrder");
      });
    });

    // persist across reload
    cy.reload();
    cy.get("dynamic-mat-table mat-table", { timeout: 20000 }).should("exist");
    cy.finishedLoading();

    cy.get("@reorderedOrder").then((reordered) => {
      headerLabels().then(($afterReload) => {
        const afterReload = Cypress._.map($afterReload, (el) =>
          Cypress.$(el).text().trim(),
        );
        expect(afterReload).to.deep.equal(reordered);
      });
    });
  });

  it("reflects a popup drag in the table order", () => {
    cy.visit("/datasets");
    cy.get("dynamic-mat-table mat-table", { timeout: 20000 }).should("exist");
    cy.finishedLoading();

    cy.openColumnSetting();

    popupLabels().then((labelsBefore) => {
      const lastIndex = labelsBefore.length - 1;
      const movedLabel = labelsBefore[lastIndex];

      // drag the last popup column to the front
      cy.dragPopupColumn(lastIndex, 0);

      // auto-save + popup closes after the debounce
      cy.waitForColumnAutoSave();

      headerLabels().then(($tableLabels) => {
        const tableLabels = Cypress._.map($tableLabels, (el) =>
          Cypress.$(el).text().trim(),
        );
        const expected = [
          movedLabel,
          ...labelsBefore.filter((l) => l !== movedLabel),
        ].filter((l) => tableLabels.includes(l));
        expect(tableLabels).to.deep.equal(expected);
      });
    });
  });
});
