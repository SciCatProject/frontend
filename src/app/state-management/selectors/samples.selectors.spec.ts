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

  samplesCount: 0,
  datasetsCount: 0,

  hasPrefilledFilters: false,

  sampleFilters: {
    text: "test",
    sortField: "creationTime:desc",
    skip: 0,
    limit: 25
  },

  datasetFilters: {
    text: "",
    sortField: "createdAt:desc",
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

  describe("getDatasets", () => {
    it("should get the datasets related to the current sample", () => {
      expect(fromSelectors.getDatasets.projector(initialSampleState)).toEqual(
        []
      );
    });
  });

  describe("getSamplesCount", () => {
    it("should get samplesCount", () => {
      expect(
        fromSelectors.getSamplesCount.projector(initialSampleState)
      ).toEqual(0);
    });
  });

  describe("getDatasetsCount", () => {
    it("should get datasetsCount", () => {
      expect(
        fromSelectors.getDatasetsCount.projector(initialSampleState)
      ).toEqual(0);
    });
  });

  describe("getHasPrefilledFilters", () => {
    it("should get hasPrefilledFilters", () => {
      expect(
        fromSelectors.getHasPrefilledFilters.projector(initialSampleState)
      ).toEqual(false);
    });
  });

  describe("getFilters", () => {
    it("should get sampleFilters", () => {
      expect(fromSelectors.getFilters.projector(initialSampleState)).toEqual(
        initialSampleState.sampleFilters
      );
    });
  });

  describe("getTextFilter", () => {
    it("should get text filter from sampleFilters", () => {
      expect(
        fromSelectors.getTextFilter.projector(initialSampleState.sampleFilters)
      ).toEqual("test");
    });
  });

  describe("getDatasetFilters", () => {
    it("should get datasetFilters", () => {
      expect(
        fromSelectors.getDatasetFilters.projector(initialSampleState)
      ).toEqual(initialSampleState.datasetFilters);
    });
  });

  describe("getPage", () => {
    it("should get the current samples page", () => {
      const { skip, limit } = initialSampleState.sampleFilters;
      const page = skip / limit;
      expect(
        fromSelectors.getPage.projector(initialSampleState.sampleFilters)
      ).toEqual(page);
    });
  });

  describe("getDatasetsPage", () => {
    it("should get the current datasets page", () => {
      const { skip, limit } = initialSampleState.datasetFilters;
      const page = skip / limit;
      expect(
        fromSelectors.getDatasetsPage.projector(
          initialSampleState.datasetFilters
        )
      ).toEqual(page);
    });
  });

  describe("getSamplesPerPage", () => {
    it("should get limit from sampleFilters", () => {
      expect(
        fromSelectors.getSamplesPerPage.projector(
          initialSampleState.sampleFilters
        )
      ).toEqual(25);
    });
  });

  describe("getDatasetsPerPage", () => {
    it("should get limit from datasetFilters", () => {
      expect(
        fromSelectors.getDatasetsPerPage.projector(
          initialSampleState.datasetFilters
        )
      ).toEqual(25);
    });
  });

  describe("getFullqueryParams", () => {
    it("should get the fullquery params", () => {
      const { text, sortField, skip, limit } = initialSampleState.sampleFilters;
      const limits = { order: sortField, skip, limit };
      const params = { query: JSON.stringify({ text }), limits };
      expect(
        fromSelectors.getFullqueryParams.projector(
          initialSampleState.sampleFilters
        )
      ).toEqual(params);
    });
  });

  describe("getDatasetsQueryParams", () => {
    it("should get the datasets query params", () => {
      const { sortField, skip, limit } = initialSampleState.datasetFilters;
      const params = { order: sortField, skip, limit };
      expect(
        fromSelectors.getDatasetsQueryParams.projector(
          initialSampleState.datasetFilters
        )
      ).toEqual(params);
    });
  });
});
