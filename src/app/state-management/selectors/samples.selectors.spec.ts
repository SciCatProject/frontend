import * as fromSampleSelectors from "./samples.selectors";

import { SampleState } from "state-management/state/samples.store";

const initialSampleState: SampleState = {
  samples: {},
  selectedSamples: [],
  currentSample: null,
  totalCount: 0,
  submitComplete: false,
  datasets: [],

  addingAttachment: false,
  deletingAttachment: false,

  searchTerms: "",

  samplesLoading: true,
  datasetsLoading: true,
  error: undefined,
  filters: {
    text: "",
    skip: 0,
    limit: 0,
    sortField: "creationTime:desc"
  },
  selectedId: null
};

describe("test Sample Selectors", () => {
  it("should get filters", () => {
    expect(
      fromSampleSelectors.getSampleFilters.projector(initialSampleState)
    ).toEqual("creationTime:desc");
  });
});
