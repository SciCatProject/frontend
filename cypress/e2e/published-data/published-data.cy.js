import { testData } from "../../fixtures/testData";

describe("Datasets general", () => {
  const title = "publishedDataTitle";
  const abstract = "publishedDataAbstract";
  const userPublishedDataTitle = "userSpecificPublishedDataTitle";
  const userPublishedDataAbstract = "userSpecificPublishedDataAbstract";
  beforeEach(() => {
    cy.login(Cypress.env("username"), Cypress.env("password"));
  });

  after(() => {
    cy.removeDatasets();
  });

  describe("Published data creation, update and registration", () => {
    it("should be able to create new published data in private state", () => {
      cy.createDataset("raw");

      cy.visit("/datasets");

      cy.get(".dataset-table mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get('[data-cy="text-search"]').clear().type("Cypress");
      cy.get('[data-cy="search-button"]').click();

      cy.isLoading();

      cy.get(".dataset-table mat-row input[type='checkbox']").first().click();

      cy.get("#addToBatchButton").click();

      cy.get("#cartOnHeaderButton").click();

      cy.get("a.button").click();

      cy.get("#publishButton").click();

      cy.get("#titleInput").type(title);

      cy.get("#abstractInput").type(abstract);

      cy.get("#saveAndContinueButton").click();

      cy.get("#doiRow").should("exist");

      cy.get("[data-cy='status']").contains("private");
    });

    it("should prevent leaving published data form unsaved", () => {
      cy.createDataset("raw");

      cy.visit("/datasets");

      cy.get(".dataset-table mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get('[data-cy="text-search"]').clear().type("Cypress");
      cy.get('[data-cy="search-button"]').click();

      cy.isLoading();

      cy.get(".dataset-table mat-row input[type='checkbox']").first().click();

      cy.get("#addToBatchButton").click();

      cy.get("#cartOnHeaderButton").click();

      cy.get("a.button").click();

      cy.get("#publishButton").click();

      cy.get("#titleInput").type(title);

      cy.get("#abstractInput").type(abstract);

      cy.get("#cancelButton").click();

      cy.on("window:confirm", (str) => {
        expect(str).to.equal(
          "You have unsaved changes. Press Cancel to go back and save these changes, or OK to leave without saving.",
        );

        return false;
      });

      cy.get("#saveButton").click();

      cy.get("#cancelButton").click();

      cy.get('[data-cy="batch-table"] mat-row').should("exist");
    });

    it("should be able to edit dataset list after creating the published data", () => {
      cy.createDataset("raw");
      cy.createDataset("raw");

      cy.visit("/datasets");

      cy.get(".dataset-table mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get('[data-cy="text-search"]').clear().type("Cypress");
      cy.get('[data-cy="search-button"]').click();

      cy.isLoading();

      cy.get(".dataset-table mat-row input[type='checkbox']").first().click();

      cy.get("#addToBatchButton").click();

      cy.get("#cartOnHeaderButton").click();

      cy.get("a.button").click();

      cy.get("#publishButton").click();

      cy.get("#titleInput").type(title);

      cy.get("#abstractInput").type(abstract);

      cy.get("#saveButton").click();

      cy.get("#cancelButton").click();

      cy.get('[data-cy="batch-table"] mat-row').should("exist");

      cy.visit("/datasets");

      cy.get(".dataset-table mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get('[data-cy="text-search"]').clear().type("Cypress");
      cy.get('[data-cy="search-button"]').click();

      cy.isLoading();

      cy.get(".dataset-table mat-row input[type='checkbox']").last().click();

      cy.get("#addToBatchButton").click();

      cy.get("#cartOnHeaderButton").click();

      cy.get("a.button").click();

      cy.get('[data-cy="batch-table"] mat-row').its("length").should("eq", 2);

      cy.get("#saveChangesButton").click();

      cy.get('[data-cy="editPublishedDataForm"]').should("exist");
      cy.get("#titleInput").should("have.value", title);
      cy.get("#abstractInput").should("have.value", abstract);
    });

    it("other users should not be able to see private published data that they do not own", () => {
      cy.login(Cypress.env("guestUsername"), Cypress.env("guestPassword"));

      cy.visit("/publishedDatasets");

      cy.get("app-publisheddata-dashboard mat-table mat-header-row").should(
        "exist",
      );

      cy.finishedLoading();

      cy.get('input[formcontrolname="globalSearch"]').clear().type(title);

      cy.isLoading();

      cy.get("app-publisheddata-dashboard mat-table").should(
        "not.contain",
        title,
      );
    });

    it("should not be able to publish invalid private published data", () => {
      cy.visit("/publishedDatasets");

      cy.get("app-publisheddata-dashboard mat-table mat-header-row").should(
        "exist",
      );

      cy.finishedLoading();

      cy.get('input[formcontrolname="globalSearch"]').clear().type(title);

      cy.isLoading();

      cy.get("app-publisheddata-dashboard mat-table mat-row")
        .contains(title)
        .first()
        .click();

      cy.get('[data-cy="status"]').contains("private");

      cy.get('[data-cy="publishButton"]').click();

      cy.get("simple-snack-bar").should(
        "contain",
        'Publishing Failed. metadata requires property "creators"',
      );
    });

    it("admins should be able to edit their private published data", () => {
      const creatorName = "Creator name";
      const resourceType = "resource type";
      const publisherName = "publisher name";
      const publisherIndetifierScheme = "publisher identifier scheme";
      cy.visit("/publishedDatasets");

      cy.get("app-publisheddata-dashboard mat-table mat-header-row").should(
        "exist",
      );

      cy.finishedLoading();

      cy.get('input[formcontrolname="globalSearch"]').clear().type(title);

      cy.isLoading();

      cy.get("app-publisheddata-dashboard mat-table mat-row")
        .contains(title)
        .first()
        .click();

      cy.get('[data-cy="status"]').contains("private");

      cy.get("#editBtn").click();

      cy.get('[data-cy="editPublishedDataForm"]').should("exist");

      cy.get('[data-cy="metadata"]').click();
      cy.get("jsonforms").should("exist");

      cy.get("button.save-and-continue").should("be.disabled");

      cy.get('[aria-label="Add to Creators button"]').click();

      cy.get('[aria-label="Add to Creators button"]')
        .closest(".expand-panel-array-layout")
        .find('input[id^="#/properties/name"]')
        .first()
        .clear()
        .type(creatorName);

      cy.get('[id="#/properties/resourceType"]').clear().type(resourceType);

      cy.get('[ng-reflect-path="publisher"]')
        .parent()
        .find('[id="#/properties/name"]')
        .clear()
        .type(publisherName);

      cy.get('[ng-reflect-path="publisher"]')
        .parent()
        .should("contain", "is a required property");
      cy.get('[ng-reflect-path="publisher"]')
        .parent()
        .find('input[id="#/properties/publisherIdentifierScheme"]')
        .clear()
        .type(publisherIndetifierScheme);

      cy.get("button.save-and-continue").should("not.be.disabled");

      cy.get("button.save-and-continue").click();

      cy.get('[data-cy="status"]').contains("private");

      cy.get('[data-cy="showHideMetadata"]').click();

      cy.get("ngx-json-viewer section").contains("metadata").click();

      cy.get("ngx-json-viewer section").contains(creatorName);
      cy.get("ngx-json-viewer section").contains(publisherName);
      cy.get("ngx-json-viewer section").contains(publisherIndetifierScheme);
      cy.get("ngx-json-viewer section").contains(resourceType);
    });

    it("should be able to edit dataset list after creating the published data", () => {
      const newDatasetName = "Test dataset name";
      cy.createDataset("raw", newDatasetName);
      cy.visit("/publishedDatasets");

      cy.get("app-publisheddata-dashboard mat-table mat-header-row").should(
        "exist",
      );

      cy.finishedLoading();

      cy.get('input[formcontrolname="globalSearch"]').clear().type(title);

      cy.isLoading();

      cy.get("app-publisheddata-dashboard mat-table mat-row")
        .contains(title)
        .first()
        .click();

      cy.get('[data-cy="status"]').contains("private");

      cy.get('[data-cy="editDatasetList"]').click();

      cy.get('[data-cy="batch-table"] mat-row').should("exist");

      cy.get('button[id="changeSelectionButton"]').click();

      cy.url().should("include", "publishedDatasets");
      cy.url().should("include", "datasetList");

      cy.get(".dataset-table mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get('[data-cy="text-search"]').clear().type(newDatasetName);
      cy.get('[data-cy="search-button"]').click();

      cy.isLoading();

      cy.get(".dataset-table mat-row input[type='checkbox']").first().click();

      cy.get("#addToBatchButton").click();

      cy.get("#cartOnHeaderButton").click();

      cy.get("batch-card a.button").click();

      cy.get('[data-cy="batch-table"] mat-row').its("length").should("eq", 2);

      cy.get("#saveChangesButton").click();
    });

    it("should be able to publish their private published data", () => {
      cy.visit("/publishedDatasets");

      cy.get("app-publisheddata-dashboard mat-table mat-header-row").should(
        "exist",
      );

      cy.finishedLoading();

      cy.get('input[formcontrolname="globalSearch"]').clear().type(title);

      cy.isLoading();

      cy.get("app-publisheddata-dashboard mat-table mat-row")
        .contains(title)
        .first()
        .click();

      cy.get('[data-cy="status"]').contains("private");

      cy.get('[data-cy="publishButton"]').click();

      cy.get('[data-cy="status"]').contains("public");
    });

    it("should not be able to edit dataset list on a published data that is public", () => {
      cy.visit("/publishedDatasets");

      cy.get("app-publisheddata-dashboard mat-table mat-header-row").should(
        "exist",
      );

      cy.finishedLoading();

      cy.get('input[formcontrolname="globalSearch"]').clear().type(title);

      cy.isLoading();

      cy.get("app-publisheddata-dashboard mat-table mat-row")
        .contains(title)
        .first()
        .click();

      cy.get('[data-cy="status"]').contains("public");

      cy.get("#editDatasetList").should("not.exist");
    });

    it("other users should be able to see public published data that they do not own", () => {
      cy.login(Cypress.env("guestUsername"), Cypress.env("guestPassword"));
      cy.visit("/publishedDatasets");

      cy.get("app-publisheddata-dashboard mat-table mat-header-row").should(
        "exist",
      );

      cy.finishedLoading();

      cy.get('input[formcontrolname="globalSearch"]').clear().type(title);

      cy.isLoading();

      cy.get("app-publisheddata-dashboard mat-table mat-row").should(
        "contain",
        title,
      );
    });

    it("should be able to register their public published data", () => {
      cy.visit("/publishedDatasets");

      cy.get("app-publisheddata-dashboard mat-table mat-header-row").should(
        "exist",
      );

      cy.finishedLoading();

      cy.get('input[formcontrolname="globalSearch"]').clear().type(title);

      cy.isLoading();

      cy.get("app-publisheddata-dashboard mat-table mat-row")
        .contains(title)
        .first()
        .click();

      cy.get('[data-cy="status"]').contains("public");

      cy.get('[data-cy="registerButton"]').click();

      cy.get('[data-cy="status"]').contains("registered");
    });

    it("regular users should be able to create and edit their private published data but not after it gets public", () => {
      cy.login(Cypress.env("guestUsername"), Cypress.env("guestPassword"));
      const creatorName = "Creator name";
      const resourceType = "resource type";
      const publisherName = "publisher name";
      const publisherIndetifierScheme = "publisher identifier scheme";
      cy.createDataset("raw");

      cy.visit("/datasets");

      cy.get(".dataset-table mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get('[data-cy="text-search"]').clear().type("Cypress");
      cy.get('[data-cy="search-button"]').click();

      cy.isLoading();

      cy.get(".dataset-table mat-row input[type='checkbox']").first().click();

      cy.get("#addToBatchButton").click();

      cy.get("#cartOnHeaderButton").click();

      cy.get("a.button").click();

      cy.get("#publishButton").click();

      cy.get("#titleInput").type(userPublishedDataTitle);

      cy.get("#abstractInput").type(userPublishedDataAbstract);

      cy.get("#saveAndContinueButton").click();

      cy.get("#doiRow").should("exist");

      cy.get("[data-cy='status']").contains("private");

      cy.get("#editBtn").click();

      cy.get('[data-cy="editPublishedDataForm"]').should("exist");

      cy.get('[data-cy="metadata"]').click();
      cy.get("jsonforms").should("exist");

      cy.get("button.save-and-continue").should("be.disabled");

      cy.get('[aria-label="Add to Creators button"]').click();

      cy.get('[aria-label="Add to Creators button"]')
        .closest(".expand-panel-array-layout")
        .find('input[id^="#/properties/name"]')
        .first()
        .clear()
        .type(creatorName);

      cy.get('[id="#/properties/resourceType"]').clear().type(resourceType);

      cy.get('[ng-reflect-path="publisher"]')
        .parent()
        .find('[id="#/properties/name"]')
        .clear()
        .type(publisherName);

      cy.get('[ng-reflect-path="publisher"]')
        .parent()
        .should("contain", "is a required property");
      cy.get('[ng-reflect-path="publisher"]')
        .parent()
        .find('input[id="#/properties/publisherIdentifierScheme"]')
        .clear()
        .type(publisherIndetifierScheme);

      cy.get("button.save-and-continue").should("not.be.disabled");

      cy.get("button.save-and-continue").click();

      cy.get('[data-cy="status"]').contains("private");

      cy.get('[data-cy="publishButton"]').click();

      cy.get('[data-cy="status"]').contains("public");

      cy.get("#editBtn").should("not.exist");
    });

    it("admins should be able to edit public published data", () => {
      const newCreatorName = "new creator name";
      cy.visit("/publishedDatasets");

      cy.get("app-publisheddata-dashboard mat-table mat-header-row").should(
        "exist",
      );

      cy.finishedLoading();

      cy.get('input[formcontrolname="globalSearch"]')
        .clear()
        .type(userPublishedDataTitle);

      cy.isLoading();

      cy.get("app-publisheddata-dashboard mat-table mat-row")
        .contains(userPublishedDataTitle)
        .first()
        .click();

      cy.get('[data-cy="status"]').contains("public");

      cy.get("#editBtn").click();

      cy.get('[data-cy="editPublishedDataForm"]').should("exist");

      cy.get('[data-cy="metadata"]').click();
      cy.get("jsonforms").should("exist");

      cy.get("button.save-and-continue").should("not.be.disabled");

      cy.get('[aria-label="Add to Creators button"]')
        .closest(".expand-panel-array-layout")
        .find("mat-accordion")
        .click();

      cy.get('[aria-label="Add to Creators button"]')
        .closest(".expand-panel-array-layout")
        .find('input[id^="#/properties/name"]')
        .first()
        .clear()
        .type(newCreatorName);

      cy.get("button.save-and-continue").should("not.be.disabled");

      cy.get("button.save-and-continue").click();

      cy.get('[data-cy="status"]').contains("public");

      cy.get('[data-cy="showHideMetadata"]').click();

      cy.get("ngx-json-viewer section").contains("metadata").click();
      cy.get("ngx-json-viewer section").contains(newCreatorName);
    });
  });
});
