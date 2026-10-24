// The whole flow of the advanced search on the datasets page, with all four kinds of
// filter: text (contains), list (any of), date (a range) and scientific metadata.

const names = {
  alpha: "Adv Search Alpha",
  beta: "Adv Search Beta",
  gamma: "Adv Search Gamma",
};

// alpha: January 2020, keywords beam and alpha, temperature 25
// beta: June 2021, keywords test and beta, temperature 5
// gamma: March 2022, keyword gamma, temperature 40
const datasets = [
  {
    datasetName: names.alpha,
    description: "alpha run with the beam on",
    keywords: ["beam", "alpha"],
    creationTime: "2020-01-15T10:00:00.000Z",
    temperature: 25,
  },
  {
    datasetName: names.beta,
    description: "beta run for a test",
    keywords: ["test", "beta"],
    creationTime: "2021-06-15T10:00:00.000Z",
    temperature: 5,
  },
  {
    datasetName: names.gamma,
    description: "gamma run",
    keywords: ["gamma"],
    creationTime: "2022-03-15T10:00:00.000Z",
    temperature: 40,
  },
];

const row = (index) => cy.get('[data-cy="condition-row"]').eq(index);
const chips = () => cy.get('[data-cy="condition-chip"]');

const apply = () => {
  cy.intercept({ method: "GET", pathname: "/api/v4/datasets" }).as(
    "datasetList",
  );
  cy.get('[data-cy="condition-apply"]').click();
  cy.get("advanced-search-dialog").should("not.exist");
  cy.wait("@datasetList");
  cy.finishedLoading();
};

const addFilter = () => cy.get('[data-cy="condition-add"]').click();

// the datasets that are in the table, the others are not
const shows = (...shown) => {
  Object.values(names).forEach((name) => {
    if (shown.includes(name)) {
      cy.contains("mat-row", name).should("exist");
    } else {
      cy.contains("mat-row", name).should("not.exist");
    }
  });
};

describe("Datasets advanced search", () => {
  beforeEach(() => {
    cy.login(Cypress.env("username"), Cypress.env("password"));

    datasets.forEach(({ temperature, ...dataset }) =>
      cy.createDataset({
        type: "raw",
        dataFileSize: "small",
        ...dataset,
        scientificMetadata: {
          adv_temperature: { type: "number", value: temperature, unit: "" },
        },
        isPublished: true,
      }),
    );

    cy.visit("/datasets");
    cy.finishedLoading();

    // start without the filters a user may have saved before
    cy.removeConditions();
  });

  afterEach(() => {
    // the filters are saved with the user settings, a test that failed must not leave any
    // behind: they would filter the datasets of every test that comes after it
    cy.visit("/datasets");
    cy.finishedLoading();
    cy.removeConditions();

    cy.removeDatasets();
  });

  describe("text field, contains", () => {
    it("should find a part of the text, in any case", () => {
      cy.openAdvancedSearch();
      cy.fillCondition(0, { field: "Dataset name", value: "ARCH BET" });
      apply();

      chips()
        .should("have.length", 1)
        .and("contain", 'Dataset name contains "ARCH BET"');
      shows(names.beta);

      cy.removeConditions();
      shows(names.alpha, names.beta, names.gamma);
    });

    it("should look in the description as well", () => {
      cy.openAdvancedSearch();
      cy.fillCondition(0, { field: "Description", value: "the beam" });
      apply();

      shows(names.alpha);

      cy.removeConditions();
    });

    it("should take special characters as they are typed", () => {
      cy.openAdvancedSearch();
      cy.fillCondition(0, { field: "Dataset name", value: "Alpha.*" });
      apply();

      shows();

      cy.removeConditions();
    });

    it("should show how the field is matched, without a key or a unit", () => {
      cy.openAdvancedSearch();
      cy.fillCondition(0, { field: "Description" });

      row(0).find(".static-cell").should("have.length", 2);
      row(0).find(".static-cell").first().should("contain", "—");
      row(0).find(".static-cell").last().should("contain", "Contains");
      row(0).find('[data-cy="condition-key"]').should("not.exist");
      row(0).find('[data-cy="condition-unit"]').should("not.exist");

      cy.get('[data-cy="condition-cancel"]').click();
    });
  });

  describe("list field, any of the values", () => {
    it("should find the datasets with any of the values separated by commas", () => {
      cy.openAdvancedSearch();
      cy.fillCondition(0, { field: "Keywords", value: "beam, gamma" });
      apply();

      chips().should("have.length", 1).and("contain", "Keywords: beam, gamma");
      shows(names.alpha, names.gamma);

      cy.removeConditions();
    });

    it("should need the whole value, not a part of it", () => {
      cy.openAdvancedSearch();
      cy.fillCondition(0, { field: "Keywords", value: "bea" });
      apply();

      shows();

      cy.removeConditions();
    });

    it("should need all of the keywords with a filter for each", () => {
      cy.openAdvancedSearch();
      cy.fillCondition(0, { field: "Keywords", value: "beam" });
      addFilter();
      cy.fillCondition(1, { field: "Keywords", value: "alpha" });
      apply();

      chips().should("have.length", 2);
      shows(names.alpha);

      cy.removeConditions();
    });
  });

  describe("date field, a range", () => {
    it("should find the datasets created between two days", () => {
      cy.openAdvancedSearch();
      cy.fillCondition(0, {
        field: "Creation time",
        from: "2021-01-01",
        to: "2021-12-31",
      });
      apply();

      chips()
        .should("have.length", 1)
        .and("contain", "Creation time: 2021-01-01")
        .and("contain", "2021-12-31");
      shows(names.beta);

      cy.removeConditions();
    });

    it("should take a range with only a start", () => {
      cy.openAdvancedSearch();
      cy.fillCondition(0, { field: "Creation time", from: "2021-01-01" });
      apply();

      shows(names.beta, names.gamma);

      cy.removeConditions();
    });

    it("should take a range with only an end", () => {
      cy.openAdvancedSearch();
      cy.fillCondition(0, { field: "Creation time", to: "2021-01-01" });
      apply();

      shows(names.alpha);

      cy.removeConditions();
    });

    it("should say when there is no date yet or the dates are the wrong way round", () => {
      cy.openAdvancedSearch();
      cy.fillCondition(0, { field: "Creation time" });
      cy.get('[data-cy="condition-apply"]').click();
      cy.get('[data-cy="condition-apply-hint"]').should(
        "contain",
        "yyyy-mm-dd",
      );

      cy.fillCondition(0, { from: "2022-01-01", to: "2021-01-01" });
      cy.get('[data-cy="condition-apply"]').click();
      cy.get('[data-cy="condition-apply-hint"]').should(
        "contain",
        "after the end date",
      );

      cy.fillCondition(0, { to: "2022-12-31" });
      cy.get('[data-cy="condition-apply-hint"]').should("not.exist");
      cy.get('[data-cy="condition-cancel"]').click();
    });
  });

  describe("scientific metadata", () => {
    it("should find a value with an operator", () => {
      cy.openAdvancedSearch();
      cy.fillCondition(0, {
        field: "Scientific metadata",
        key: "adv_temperature",
        operator: ">",
        value: "10",
      });
      apply();

      chips().should("have.length", 1).and("contain", "adv_temperature > 10");
      shows(names.alpha, names.gamma);

      cy.removeConditions();
    });

    it("should find a value between two numbers", () => {
      cy.openAdvancedSearch();
      cy.fillCondition(0, {
        key: "adv_temperature",
        operator: "Between",
        min: "10",
        max: "30",
      });
      apply();

      shows(names.alpha);

      cy.removeConditions();
    });

    it("should be the kind of filter a new filter starts with", () => {
      cy.openAdvancedSearch();

      row(0)
        .find('[data-cy="condition-field"]')
        .should("contain", "Scientific metadata");
      row(0).find('[data-cy="condition-key"]').should("exist");
      row(0).find('[data-cy="condition-operator"]').should("exist");
      row(0).find('[data-cy="condition-value"]').should("exist");
      row(0).find('[data-cy="condition-unit"]').should("exist");
      row(0).find(".static-cell").should("not.exist");

      cy.get('[data-cy="condition-cancel"]').click();
    });

    it("should let the unit be removed again", () => {
      cy.openAdvancedSearch();
      cy.fillCondition(0, {
        key: "adv_temperature",
        value: "10",
        unit: "celsius",
      });
      row(0).find('[data-cy="condition-unit"]').should("have.value", "celsius");

      // removing the unit only clears it, the units are not listed
      row(0).find('[data-cy="condition-unit-clear"]').click();

      row(0).find('[data-cy="condition-unit"]').should("have.value", "");
      row(0).find('[data-cy="condition-unit-clear"]').should("not.exist");
      cy.get("mat-option").should("not.exist");

      apply();

      chips().should("contain", "adv_temperature = 10");
      chips().should("not.contain", "celsius");

      cy.removeConditions();
    });

    it("should narrow the units down by what is typed", () => {
      cy.openAdvancedSearch();
      cy.fillCondition(0, { key: "adv_temperature", value: "10" });

      row(0).find('[data-cy="condition-unit"]').type("cel");
      cy.get("mat-option").should("have.length", 1).and("contain", "celsius");

      cy.get("mat-option").click();
      row(0).find('[data-cy="condition-unit"]').should("have.value", "celsius");

      cy.get('[data-cy="condition-cancel"]').click();
    });
  });

  describe("combining and excluding", () => {
    it("should need all four kinds of filter to match", () => {
      cy.openAdvancedSearch();
      // all three
      cy.fillCondition(0, { field: "Dataset name", value: "Adv Search" });
      addFilter();
      // alpha and beta
      cy.fillCondition(1, { field: "Keywords", value: "beam, test" });
      addFilter();
      // beta and gamma
      cy.fillCondition(2, { field: "Creation time", from: "2020-06-01" });
      addFilter();
      // all three
      cy.fillCondition(3, {
        field: "Scientific metadata",
        key: "adv_temperature",
        operator: ">",
        value: "1",
      });
      apply();

      chips().should("have.length", 4);
      cy.get('[data-cy="condition-count"]').should("contain", "4");
      shows(names.beta);

      cy.removeConditions();
    });

    it("should leave out what an excluded filter matches", () => {
      cy.openAdvancedSearch();
      cy.fillCondition(0, { field: "Dataset name", value: "Adv Search" });
      addFilter();
      cy.fillCondition(1, {
        exclude: true,
        field: "Keywords",
        value: "beam",
      });
      apply();

      chips().should("have.length", 2);
      chips().last().find('[data-cy="condition-chip-not"]').should("exist");
      chips()
        .first()
        .find('[data-cy="condition-chip-not"]')
        .should("not.exist");
      shows(names.beta, names.gamma);

      cy.removeConditions();
    });

    it("should leave out what an excluded metadata filter matches", () => {
      cy.openAdvancedSearch();
      cy.fillCondition(0, {
        exclude: true,
        key: "adv_temperature",
        operator: ">",
        value: "10",
      });
      apply();

      shows(names.beta);

      cy.removeConditions();
    });

    it("should leave out what an excluded date range matches", () => {
      cy.openAdvancedSearch();
      cy.fillCondition(0, {
        exclude: true,
        field: "Creation time",
        from: "2021-01-01",
        to: "2021-12-31",
      });
      apply();

      shows(names.alpha, names.gamma);

      cy.removeConditions();
    });

    it("should leave out nothing again when Exclude is unticked", () => {
      cy.openAdvancedSearch();
      cy.fillCondition(0, {
        exclude: true,
        field: "Keywords",
        value: "beam",
      });
      row(0).find('[data-cy="condition-exclude"]').should("be.checked");
      row(0).find('[data-cy="condition-exclude"]').uncheck();
      apply();

      shows(names.alpha);

      cy.removeConditions();
    });
  });

  describe("editing the filters", () => {
    it("should change a filter from its chip", () => {
      cy.openAdvancedSearch();
      cy.fillCondition(0, { field: "Keywords", value: "beam" });
      apply();
      shows(names.alpha);

      chips().first().click();
      cy.get("advanced-search-dialog").should("be.visible");
      row(0).find('[data-cy="condition-value"]').should("have.value", "beam");
      cy.fillCondition(0, { value: "gamma" });
      apply();

      chips().should("have.length", 1).and("contain", "Keywords: gamma");
      shows(names.gamma);

      cy.removeConditions();
    });

    it("should remove one filter from its chip", () => {
      cy.openAdvancedSearch();
      cy.fillCondition(0, { field: "Keywords", value: "beam, gamma" });
      addFilter();
      cy.fillCondition(1, { field: "Creation time", from: "2021-01-01" });
      apply();
      shows(names.gamma);

      chips().first().find("button").click();

      chips().should("have.length", 1).and("contain", "Creation time");
      shows(names.beta, names.gamma);

      cy.removeConditions();
    });

    it("should remove a filter in the dialog", () => {
      cy.openAdvancedSearch();
      cy.fillCondition(0, { field: "Keywords", value: "beam" });
      addFilter();
      cy.fillCondition(1, { field: "Keywords", value: "gamma" });
      row(0).find('[data-cy="condition-remove"]').click();
      cy.get('[data-cy="condition-row"]').should("have.length", 1);
      apply();

      chips().should("have.length", 1).and("contain", "Keywords: gamma");

      cy.removeConditions();
    });

    it("should clear all the filters with Clear in the strip", () => {
      cy.openAdvancedSearch();
      cy.fillCondition(0, { field: "Keywords", value: "beam" });
      addFilter();
      cy.fillCondition(1, { field: "Dataset name", value: "Alpha" });
      apply();
      chips().should("have.length", 2);

      cy.get('[data-cy="condition-chips-clear"]').click();

      cy.get('[data-cy="condition-applied"]').should("not.exist");
      shows(names.alpha, names.beta, names.gamma);
    });

    it("should keep the filters after the page is loaded again", () => {
      cy.openAdvancedSearch();
      cy.fillCondition(0, { field: "Keywords", value: "beam, test" });
      addFilter();
      cy.fillCondition(1, {
        exclude: true,
        field: "Creation time",
        from: "2021-01-01",
      });
      apply();
      shows(names.alpha);

      cy.reload();
      cy.finishedLoading();

      chips().should("have.length", 2);
      chips().last().find('[data-cy="condition-chip-not"]').should("exist");
      shows(names.alpha);

      cy.removeConditions();
    });
  });

  describe("the dialog", () => {
    it("should keep what was edited when it is closed without applying", () => {
      cy.openAdvancedSearch();
      cy.fillCondition(0, { field: "Keywords", value: "beam" });
      cy.get('[data-cy="condition-cancel"]').click();

      cy.get('[data-cy="condition-draft"]').should("exist");
      chips().should("not.exist");

      cy.openAdvancedSearch();
      row(0).find('[data-cy="condition-value"]').should("have.value", "beam");
      cy.get('[data-cy="condition-apply"]').click();
      cy.get('[data-cy="condition-draft"]').should("not.exist");

      cy.removeConditions();
    });

    it("should start the value over when the kind of field changes", () => {
      cy.openAdvancedSearch();
      cy.fillCondition(0, { field: "Keywords", value: "beam" });

      cy.fillCondition(0, { field: "Creation time" });
      row(0).find('[data-cy="condition-date-range"]').should("exist");
      row(0).find('[data-cy="condition-value"]').should("not.exist");

      cy.fillCondition(0, { field: "Scientific metadata" });
      row(0).find('[data-cy="condition-key"]').should("exist");
      row(0).find('[data-cy="condition-value"]').should("have.value", "");

      cy.get('[data-cy="condition-cancel"]').click();
    });

    it("should explain the filters in the help", () => {
      cy.openAdvancedSearch();
      cy.get('[data-cy="condition-help"] button').click();

      cy.get('[data-cy="info-popup"]')
        .should("contain", "All filters must match")
        .and("contain", "Text")
        .and("contain", "List")
        .and("contain", "Date")
        .and("contain", "Scientific metadata")
        .and("contain", "Exclude");

      cy.get('[data-cy="info-popup"] .popup-close').click();
      cy.get('[data-cy="info-popup"]').should("not.exist");
      cy.get('[data-cy="condition-cancel"]').click();
    });

    it("should clear everything with Clear in the dialog", () => {
      cy.openAdvancedSearch();
      cy.fillCondition(0, { field: "Keywords", value: "beam" });
      apply();
      chips().should("have.length", 1);

      cy.removeConditions();

      chips().should("not.exist");
      shows(names.alpha, names.beta, names.gamma);
    });
  });
});
