/// <reference types="Cypress" />

describe("Elastic search", () => {
  const randomText1 =
    "$PDfUCt+qX*5Km=ezGQF ELASTIC_SEARCH_vg+Mgga2#vEe=u!dQ!V+ fp$q6tz8y%hyaHzbx2X+ Vz6shS8ejGCQN3h%TEST 6j2&eqYT7GCR+CpqqD5n";
  const randomText2 =
    "Style never met and those among great. At no or september sportsmen he perfectly happiness attending. ";

  const searchQuery1 = "elast searc";
  const searchQuery2 = "style perfectly";
  const searchQueryIrrelevant = "Christmas";
  const testIndex = "test";

  beforeEach(() => {
    cy.initializeElasticSearch(testIndex);
    cy.createDatasetForElasticSearch(randomText1);
    cy.createDatasetForElasticSearch(randomText2);
  });

  afterEach(() => {
    cy.removeDatasetsForElasticSearch(randomText1);
    cy.removeDatasetsForElasticSearch(randomText2);
    cy.removeElasticSearchIndex(testIndex);
  });

  describe("Elastic search query", () => {
    it("should get relevant dataset with partial text query", () => {
      cy.visit("/datasets");

      cy.get(".dataset-table mat-table mat-header-row").should("exist");

      cy.finishedLoading();

      cy.get('[data-cy="text-search"] input[type="search"]')
        .clear()
        .type(searchQuery1);

      cy.finishedLoading();

      cy.get("mat-row").contains(randomText1).click();

      cy.get('[data-cy="edit-general-information"]').should("exist");

      cy.visit("/datasets");

      cy.finishedLoading();

      cy.get('[data-cy="text-search"] input[type="search"]')
        .clear()
        .type(searchQuery2);

      cy.finishedLoading();

      cy.get("mat-row").contains(randomText2).click();

      cy.get('[data-cy="edit-general-information"]').should("exist");
    });
  });

  it("should not get any dataset with irrelevant text query", () => {
    cy.visit("/datasets");

    cy.get(".dataset-table mat-table mat-header-row").should("exist");

    cy.finishedLoading();

    cy.get('[data-cy="text-search"] input[type="search"]')
      .clear()
      .type(searchQueryIrrelevant);

    cy.finishedLoading();

    cy.get('mat-row:contains("' + randomText1 + '")').should("not.exist");
    cy.get('mat-row:contains("' + randomText2 + '")').should("not.exist");
  });
});
