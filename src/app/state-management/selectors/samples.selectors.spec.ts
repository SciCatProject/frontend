import * as fromSelectors from "./samples.selectors";
import { SampleState } from "state-management/state/samples.store";
import { SampleInterface, Sample } from "shared/sdk";

const data: SampleInterface = {
  sampleId: "testId",
  ownerGroup: "testGroup",
  attachments: []
};
const sample = new Sample(data);

const initialSampleState: SampleState = {
  samples: [],
  currentSample: sample,
  datasets: [],

  totalCount: 0,

  isLoading: false,

  filters: {
    text: "",
    sortField: "creationTime:desc",
    skip: 0,
    limit: 25
  }
};

describe("Sample Selectors", () => {
  describe("getSamples", () => {
    it("should get samples", () => {
      expect(fromSelectors.getSamples.projector(initialSampleState)).toEqual(
        []
      );
    });
  });

  describe("getCurrentSample", () => {
    it("should get the current sample", () => {
      expect(
        fromSelectors.getCurrentSample.projector(initialSampleState)
      ).toEqual(sample);
    });
  });

  describe("getCurrentSample", () => {
    it("should get the attachments from the current sample", () => {
      expect(
        fromSelectors.getCurrentAttachments.projector(
          initialSampleState.currentSample
        )
      ).toEqual([]);
    });
  });

  describe("getSampleDatasets", () => {
    it("should get the datasets related to the current sample", () => {
      expect(
        fromSelectors.getSampleDatasets.projector(initialSampleState)
      ).toEqual([]);
    });
  });

  describe("getSamplesCount", () => {
    it("should get totalCount", () => {
      expect(
        fromSelectors.getSamplesCount.projector(initialSampleState)
      ).toEqual(0);
    });
  });

  describe("getIsLoading", () => {
    it("should get isLoading", () => {
      expect(fromSelectors.getIsLoading.projector(initialSampleState)).toEqual(
        false
      );
    });
  });

  describe("getFilters", () => {
    it("should get the filters", () => {
      expect(fromSelectors.getFilters.projector(initialSampleState)).toEqual(
        initialSampleState.filters
      );
    });
  });

  describe("getPage", () => {
    it("should get the current samples page", () => {
      const { skip, limit } = initialSampleState.filters;
      const page = skip / limit;
      expect(
        fromSelectors.getPage.projector(initialSampleState.filters)
      ).toEqual(page);
    });
  });

  describe("getSamplesPerPage", () => {
    it("should get limit from filters", () => {
      expect(
        fromSelectors.getSamplesPerPage.projector(initialSampleState.filters)
      ).toEqual(25);
    });
  });

  describe("getFullqueryParams", () => {
    it("should get the fullquery params", () => {
      const { text, sortField, skip, limit } = initialSampleState.filters;
      const limits = { order: sortField, skip, limit };
      const params = { query: JSON.stringify({ text }), limits };
      expect(
        fromSelectors.getFullqueryParams.projector(initialSampleState.filters)
      ).toEqual(params);
    });
  });
});
