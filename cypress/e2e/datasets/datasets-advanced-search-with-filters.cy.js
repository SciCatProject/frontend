// The advanced search together with the other filters of the datasets page: the filters of the
// side panel (set through the address, as in a shared link) and the text search. Every request
// has to be accepted, and the total in the paginator has to be the number of datasets that are
// shown, whichever way the filters are combined.

const names = {
  alpha: "Adv Filter Alpha",
  beta: "Adv Filter Beta",
  gamma: "Adv Filter Gamma",
};

// alpha: January 2020, keywords beam and alpha, temperature 25
// beta: June 2021, keywords test and beta, temperature 5
// gamma: March 2022, keyword gamma, temperature 40
const datasets = [
  {
    datasetName: names.alpha,
    keywords: ["beam", "alpha"],
    creationTime: "2020-01-15T10:00:00.000Z",
    startTime: "2020-01-10T10:00:00.000Z",
    endTime: "2020-01-11T10:00:00.000Z",
    temperature: 25,
  },
  {
    datasetName: names.beta,
    keywords: ["test", "beta"],
    creationTime: "2021-06-15T10:00:00.000Z",
    startTime: "2021-06-10T10:00:00.000Z",
    endTime: "2021-06-11T10:00:00.000Z",
    temperature: 5,
  },
  {
    datasetName: names.gamma,
    keywords: ["gamma"],
    creationTime: "2022-03-15T10:00:00.000Z",
    startTime: "2022-03-10T10:00:00.000Z",
    endTime: "2022-03-11T10:00:00.000Z",
    temperature: 40,
  },
];

// the side panel filter that matches the three datasets and nothing else
const ALL = { keywords: ["beam", "test", "gamma"] };

const temperature = { key: "adv_temperature" };

// each one: the filters of the panel, the text that is searched for, the advanced search
// filters, and the datasets that are left
const scenarios = [
  {
    name: "show the datasets of the panel when there is no advanced filter",
    panel: ALL,
    conditions: [],
    shown: [names.alpha, names.beta, names.gamma],
  },
  {
    name: "take a metadata value over a range",
    panel: ALL,
    conditions: [{ ...temperature, operator: "Between", min: "1", max: "10" }],
    shown: [names.beta],
  },
  {
    name: "take a range with only an upper bound",
    panel: ALL,
    conditions: [{ ...temperature, operator: "Between", max: "10" }],
    shown: [names.beta],
  },
  {
    name: "take a range with only a lower bound",
    panel: ALL,
    conditions: [{ ...temperature, operator: "Between", min: "20" }],
    shown: [names.alpha, names.gamma],
  },
  {
    name: "take a metadata value that is greater than",
    panel: ALL,
    conditions: [{ ...temperature, operator: ">", value: "20" }],
    shown: [names.alpha, names.gamma],
  },
  {
    name: "leave out what a metadata filter with NOT matches",
    panel: ALL,
    conditions: [{ ...temperature, operator: ">", value: "20", exclude: true }],
    shown: [names.beta],
  },
  {
    name: "leave out the keyword that is excluded",
    panel: ALL,
    conditions: [{ field: "Keywords", value: "alpha", exclude: true }],
    shown: [names.beta, names.gamma],
  },
  {
    name: "take a start time",
    panel: ALL,
    conditions: [{ field: "Start time", from: "2021-01-01", to: "2021-12-31" }],
    shown: [names.beta],
  },
  {
    name: "take an end time with only a start",
    panel: ALL,
    conditions: [{ field: "End time", from: "2022-01-01" }],
    shown: [names.gamma],
  },
  {
    name: "take the creation time of the panel and of the advanced search at once",
    panel: {
      ...ALL,
      creationTime: {
        $gte: { $date: "2021-01-01T00:00:00.000Z" },
        $lte: { $date: "2022-12-31T23:59:59.999Z" },
      },
    },
    conditions: [
      { field: "Creation time", from: "2022-01-01", to: "2022-12-31" },
    ],
    shown: [names.gamma],
  },
  {
    name: "take the type of the panel and a text field",
    panel: { ...ALL, type: ["raw"] },
    conditions: [{ field: "Dataset name", value: "adv filter beta" }],
    shown: [names.beta],
  },
  {
    name: "take the text search and a metadata value",
    text: "Alpha",
    conditions: [{ ...temperature, operator: ">", value: "20" }],
    shown: [names.alpha],
  },
  {
    name: "show nothing when the text search and the advanced search do not meet",
    text: "Alpha",
    conditions: [{ ...temperature, operator: "<", value: "10" }],
    shown: [],
  },
  {
    name: "take all of them together",
    panel: ALL,
    text: "Adv Filter",
    conditions: [
      { ...temperature, operator: "Between", max: "30" },
      { field: "Keywords", value: "alpha", exclude: true },
      { field: "Dataset name", value: "adv filter" },
      { field: "Start time", from: "2021-01-01" },
    ],
    shown: [names.beta],
  },
];

const chips = () => cy.get('[data-cy="condition-chip"]');

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

// all requests of the page that were answered, none of them was refused
const requestsAccepted = () => {
  ["@datasetList.all", "@facets.all", "@count.all"].forEach((alias) =>
    cy.get(alias).then((calls) =>
      calls.forEach(({ response }) => {
        expect(response.statusCode).to.eq(200);
      }),
    ),
  );
};

const apply = () => {
  cy.get('[data-cy="condition-apply"]').click();
  cy.get("advanced-search-dialog").should("not.exist");
  cy.wait("@datasetList");
  cy.finishedLoading();
};

describe("Datasets advanced search with the other filters", () => {
  beforeEach(() => {
    cy.login(Cypress.env("username"), Cypress.env("password"));

    datasets.forEach(({ temperature: value, ...dataset }) =>
      cy.createDataset({
        type: "raw",
        dataFileSize: "small",
        ...dataset,
        scientificMetadata: {
          adv_temperature: { type: "number", value, unit: "" },
        },
        isPublished: true,
      }),
    );

    cy.intercept({ method: "GET", pathname: "/api/v4/datasets" }).as(
      "datasetList",
    );
    cy.intercept({ method: "GET", pathname: "/api/v4/datasets/fullfacet" }).as(
      "facets",
    );
    cy.intercept({ method: "GET", pathname: "/api/v4/datasets/count" }).as(
      "count",
    );

    // start without the filters a user may have saved before
    cy.visit("/datasets");
    cy.finishedLoading();
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

  scenarios.forEach(({ name, panel, text, conditions, shown }) => {
    it(`should ${name}`, () => {
      if (panel) {
        const searchQuery = encodeURIComponent(JSON.stringify(panel));
        cy.visit(`/datasets?searchQuery=${searchQuery}`);
        cy.finishedLoading();
      }
      if (text) {
        cy.get('[data-cy="text-search"]').clear().type(text);
        cy.get('[data-cy="search-button"]').click();
        cy.finishedLoading();
      }

      cy.openAdvancedSearch();
      conditions.forEach((condition, index) => {
        if (index > 0) {
          cy.get('[data-cy="condition-add"]').click();
        }
        cy.fillCondition(index, condition);
      });
      if (!conditions.length) {
        // nothing to apply, the dialog is only closed
        cy.get('[data-cy="condition-dialog-close"]').click();
        cy.finishedLoading();
      } else {
        apply();
        chips().should("have.length", conditions.length);
      }

      shows(...shown);
      // the total is counted by the facets or by the datasets, it is the same either way
      cy.get(".mat-mdc-paginator-range-label")
        .first()
        .should("contain", `of ${shown.length}`);
      requestsAccepted();

      cy.removeConditions();
    });
  });
});
