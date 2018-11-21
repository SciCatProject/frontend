

import * as fromDatasetSelectors from "./datasets.selectors";

import { DatasetState } from "../state/datasets.store"



const initialDatasetState: DatasetState = {
  datasets: [],
  selectedSets: [],
  currentSet: null,
  facetCounts: {},
  totalCount: 0,

  datasetsLoading: true,
  deletingAttachment: false,
  addingAttachment: false,
  facetCountsLoading: true,
  hasPrefilledFilters: false,

  searchTerms: "",
  keywordsTerms: "",
  batch: [],

  filters: {
    mode: "view",
    text: "",
    creationTime: null,
    type: [],
    creationLocation: [],
    ownerGroup: [],
    skip: 0,
    limit: 30,
    sortField: "creationTime:desc",
    keywords: [],
    scientific: []
  }
};

describe("test dataset selectors", () => {
  it("should get total set number", () => {
    expect(fromDatasetSelectors.getTotalSets.projector(initialDatasetState)).toEqual(false);
  });
});

