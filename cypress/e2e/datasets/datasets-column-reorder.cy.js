import { getHeader } from "../../support/utils";

const headerLabels = () =>
  cy
    .get("dynamic-mat-table mat-header-row.header mat-header-cell")
    .not(".cdk-column-row-checkbox")
    .not(".cdk-column-table-menu")
    .find(".mat-sort-header-content");

const columnSettingLabels = () =>
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

    headerLabels().then((tableLabels) => {
      cy.wrap(tableLabels).as("tableLabels");

      cy.openColumnSetting();

      columnSettingLabels().then((popupLabels) => {
        // every header should appear in the popup in the same relative order
        const filteredPopup = popupLabels.filter((l) =>
          Array.from(tableLabels).includes(l),
        );
        expect(filteredPopup).to.deep.equal(Array.from(tableLabels));
      });

      cy.get("body").type("{esc}");
    });
  });

  it("reorders the table when dragging a column header and persists after reload", () => {
    cy.visit("/datasets");
    cy.get("dynamic-mat-table mat-table", { timeout: 20000 }).should("exist");
    cy.finishedLoading();

    headerLabels().then((before) => {
      const original = Array.from(before);
      cy.wrap(original).as("originalOrder");

      // drag the first draggable column header to the third position
      cy.dragColumnHeader(0, 2);
      cy.finishedLoading();

      headerLabels().then((after) => {
        const reordered = Array.from(after);
        // order changed and contains the same columns
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
      headerLabels().then((afterReload) => {
        expect(Array.from(afterReload)).to.deep.equal(Array.from(reordered));
      });
    });
  });

  it("reflecting a popup drag in the table order", () => {
    cy.visit("/datasets");
    cy.get("dynamic-mat-table mat-table", { timeout: 20000 }).should("exist");
    cy.finishedLoading();

    cy.openColumnSetting();

    columnSettingLabels().then((popupLabels) => {
      // drag the last popup column to the front
      cy.get('[role="menu"] .dragable-row')
        .last()
        .find("mat-icon")
        .first()
        .then(($handle) => {
          const row = $handle.closest(".dragable-row")[0];
          const sourceRect = row.getBoundingClientRect();
          const firstRow = document.querySelector(
            '[role="menu"] .dragable-row',
          );
          const targetRect = firstRow.getBoundingClientRect();

          const down = new PointerEvent("pointerdown", {
            bubbles: true,
            cancelable: true,
            clientX: sourceRect.left + sourceRect.width / 2,
            clientY: sourceRect.top + sourceRect.height / 2,
            pointerId: 1,
            button: 0,
            buttons: 1,
          });
          $handle[0].dispatchEvent(down);

          const move = new PointerEvent("pointermove", {
            bubbles: true,
            cancelable: true,
            clientX: targetRect.left + targetRect.width / 2,
            clientY: targetRect.top + targetRect.height / 2,
            pointerId: 1,
            button: 0,
            buttons: 1,
          });
          document.dispatchEvent(move);

          const up = new PointerEvent("pointerup", {
            bubbles: true,
            cancelable: true,
            clientX: targetRect.left + targetRect.width / 2,
            clientY: targetRect.top + targetRect.height / 2,
            pointerId: 1,
            button: 0,
            buttons: 0,
          });
          document.dispatchEvent(up);
        });

      // auto-save + popup closes after the debounce
      cy.waitForColumnAutoSave();

      headerLabels().then((tableLabels) => {
        const expected = [
          popupLabels[popupLabels.length - 1],
          ...popupLabels.slice(0, popupLabels.length - 1),
        ].filter((l) => Array.from(tableLabels).includes(l));
        expect(Array.from(tableLabels)).to.deep.equal(expected);
      });
    });
  });
});
