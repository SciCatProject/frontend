import * as fromDatasetSelectors from "./datasets.selectors";
import { ArchViewMode } from "../models";
import { DatasetState } from "../state/datasets.store";

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

  searchTerms: "run",
  keywordsTerms: "",
  batch: [],

  result: {},
  resultLoading: false,

  filters: {
    mode: {},
    modeToggle: ArchViewMode.all,
    text: "",
    creationTime: null,
    type: [],
    creationLocation: [],
    ownerGroup: [],
    skip: 0,
    limit: 30,
    sortField: "creationTime:desc",
    keywords: [],
    scientific: [],
    isPublished: false
  }
};

describe("test dataset selectors", () => {
  it("should get total set number", () => {
    expect(
      fromDatasetSelectors.getTotalSets.projector(initialDatasetState)
    ).toEqual(0);
  });
  it("should get total set number", () => {
    expect(
      fromDatasetSelectors.getSearchTerms.projector(initialDatasetState)
    ).toEqual("run");
  });
});
