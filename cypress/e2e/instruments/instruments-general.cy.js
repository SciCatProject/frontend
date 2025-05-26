const path = require("path");

import { testData } from "../../fixtures/testData";
import { testConfig } from "../../fixtures/testData";
import { getFormattedFileNamingDate, mergeConfig } from "../../support/utils";

describe("Instruments general", () => {
  beforeEach(() => {
    cy.login(Cypress.env("username"), Cypress.env("password"));
  });

  after(() => {
    cy.removeInstruments();
  });

  describe("Instruments table and details", () => {
    it("should be able to see instrument in a table and visit the instrument details page", () => {
      const instrument = {
        ...testData.instrument,
        name: "Cypress test instrument",
        uniqueName: `Instrument-${Math.floor(1000 + Math.random() * 9000).toString()}`,
      };
      cy.createInstrument(instrument);

      cy.visit("/instruments");

      cy.get("mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get("mat-table mat-row").should("contain", instrument.uniqueName);

      cy.get("mat-cell")
        .contains(instrument.uniqueName)
        .closest("mat-row")
        .contains(instrument.name)
        .click();

      cy.url().should("include", `/instruments`);

      cy.contains(instrument.uniqueName);
    });

    it("instrument should have metadata and if not it should be able to add", () => {
      const metadataName = "Instrument Metadata Name";
      const metadataValue = "instrument metadata value";
      const instrument = {
        ...testData.instrument,
        name: "Cypress test instrument",
        uniqueName: `Instrument-${Math.floor(1000 + Math.random() * 9000).toString()}`,
      };
      cy.createInstrument(instrument);

      cy.visit("/instruments");

      cy.finishedLoading();

      cy.get("mat-cell")
        .contains(instrument.uniqueName)
        .closest("mat-row")
        .contains(instrument.name)
        .click();

      cy.finishedLoading();

      cy.get('[data-cy="instrument-metadata-card"]').should("exist");

      cy.get('[data-cy="instrument-metadata-card"] [role="tab"]')
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

      cy.contains(instrument.name);

      cy.get('[data-cy="instrument-metadata-card"]').contains(metadataName, {
        matchCase: true,
      });
      cy.get('[data-cy="instrument-metadata-card"]').contains(metadataValue, {
        matchCase: true,
      });
    });
  });

  describe("Instruments dynamic material table", () => {
    it("should be able to sort for instrument in the column sort", () => {
      const newInstrument = {
        ...testData.instrument,
        name: "000 Cypress test instrument",
        uniqueName: `Instrument-${Math.floor(1000 + Math.random() * 9000).toString()}`,
      };

      const newInstrument2 = {
        ...testData.instrument,
        name: "001 Cypress test instrument",
        uniqueName: `Instrument-${Math.floor(1000 + Math.random() * 9000).toString()}`,
      };

      cy.createInstrument(newInstrument2);
      cy.createInstrument(newInstrument);

      cy.visit("/instruments");

      cy.get("mat-table mat-row")
        .first()
        .should("not.contain", newInstrument.name);

      cy.get(".mat-sort-header-container").contains("Name").click();

      cy.get("mat-table mat-row").first().should("contain", newInstrument.name);

      cy.reload();

      cy.get("mat-table mat-row").first().should("contain", newInstrument.name);
    });

    it("should be able to download table data as a json", () => {
      const instrument = {
        ...testData.instrument,
        uniqueName: `Instrument-${Math.floor(1000 + Math.random() * 9000).toString()}`,
      };

      cy.createInstrument(instrument);

      cy.visit("/instruments");

      cy.get("dynamic-mat-table table-menu button").click();

      cy.get('[role="menu"] button').contains("Save data").click();

      cy.get('[role="menu"] button').contains("Json file").click();

      const downloadsFolder = Cypress.config("downloadsFolder");
      const tableName = "instrumentsTable";

      cy.readFile(
        path.join(
          downloadsFolder,
          `${tableName}${getFormattedFileNamingDate()}.json`,
        ),
      ).then((actualExport) => {
        const foundInstrument = actualExport.find(
          (instrument) => instrument.uniqueName === instrument.uniqueName,
        );

        expect(foundInstrument).to.exist;
      });
    });

    it("should be able to download table data as a csv", () => {
      const instrument = {
        ...testData.instrument,
        uniqueName: `Instrument-${Math.floor(1000 + Math.random() * 9000).toString()}`,
      };

      cy.createInstrument(instrument);

      cy.visit("/instruments");

      cy.get("dynamic-mat-table table-menu button").click();

      cy.get('[role="menu"] button').contains("Save data").click();

      cy.get('[role="menu"] button').contains("CSV file").click();

      const downloadsFolder = Cypress.config("downloadsFolder");
      const tableName = "instrumentsTable";

      cy.readFile(
        path.join(
          downloadsFolder,
          `${tableName}${getFormattedFileNamingDate()}.csv`,
        ),
      ).then((actualExport) => {
        expect(actualExport).to.contain(instrument.uniqueName);
      });
    });
  });
});
