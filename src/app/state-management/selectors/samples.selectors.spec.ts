import * as fromSelectors from "./samples.selectors";
import { SampleState } from "state-management/state/samples.store";
import { SampleInterface, Sample } from "shared/sdk";

const data: SampleInterface = {
  sampleId: "testId",
  ownerGroup: "testGroup",
  attachments: [],
};
const sample = new Sample(data);

const initialSampleState: SampleState = {
  samples: [],
  currentSample: sample,
  datasets: [],
  metadataKeys: [],

  samplesCount: 0,
  datasetsCount: 0,

  hasPrefilledFilters: false,

  sampleFilters: {
    text: "test",
    sortField: "creationTime:desc",
    skip: 0,
    limit: 25,
    characteristics: [],
  },

  datasetFilters: {
    sortField: "createdAt:desc",
    skip: 0,
    limit: 25,
  },
};

describe("Sample Selectors", () => {
  describe("selectSamples", () => {
    it("should select samples", () => {
      expect(fromSelectors.selectSamples.projector(initialSampleState)).toEqual(
        []
      );
    });
  });

  describe("selectMetadataKeys", () => {
    it("should select metadataKeys", () => {
      expect(
        fromSelectors.selectMetadataKeys.projector(initialSampleState)
      ).toEqual([]);
    });
  });

  describe("selectCurrentSample", () => {
    it("should select the current sample", () => {
      expect(
        fromSelectors.selectCurrentSample.projector(initialSampleState)
      ).toEqual(sample);
    });
  });

  describe("selectCurrentSample", () => {
    it("should select the attachments from the current sample", () => {
      expect(
        fromSelectors.selectCurrentAttachments.projector(
          initialSampleState.currentSample
        )
      ).toEqual([]);
    });
  });

  describe("selectDatasets", () => {
    it("should select the datasets related to the current sample", () => {
      expect(
        fromSelectors.selectDatasets.projector(initialSampleState)
      ).toEqual([]);
    });
  });

  describe("selectSamplesCount", () => {
    it("should select samplesCount", () => {
      expect(
        fromSelectors.selectSamplesCount.projector(initialSampleState)
      ).toEqual(0);
    });
  });

  describe("selectDatasetsCount", () => {
    it("should select datasetsCount", () => {
      expect(
        fromSelectors.selectDatasetsCount.projector(initialSampleState)
      ).toEqual(0);
    });
  });

  describe("selectHasPrefilledFilters", () => {
    it("should select hasPrefilledFilters", () => {
      expect(
        fromSelectors.selectHasPrefilledFilters.projector(initialSampleState)
      ).toEqual(false);
    });
  });

  describe("selectFilters", () => {
    it("should select sampleFilters", () => {
      expect(fromSelectors.selectFilters.projector(initialSampleState)).toEqual(
        initialSampleState.sampleFilters
      );
    });
  });

  describe("selectTextFilter", () => {
    it("should select text filter from sampleFilters", () => {
      expect(
        fromSelectors.selectTextFilter.projector(
          initialSampleState.sampleFilters
        )
      ).toEqual("test");
    });
  });

  describe("selectDatasetFilters", () => {
    it("should select datasetFilters", () => {
      expect(
        fromSelectors.selectDatasetFilters.projector(initialSampleState)
      ).toEqual(initialSampleState.datasetFilters);
    });
  });

  describe("selectPage", () => {
    it("should select the current samples page", () => {
      const { skip, limit } = initialSampleState.sampleFilters;
      const page = skip / limit;
      expect(
        fromSelectors.selectPage.projector(initialSampleState.sampleFilters)
      ).toEqual(page);
    });
  });

  describe("selectDatasetsPage", () => {
    it("should select the current datasets page", () => {
      const { skip, limit } = initialSampleState.datasetFilters;
      const page = skip / limit;
      expect(
        fromSelectors.selectDatasetsPage.projector(
          initialSampleState.datasetFilters
        )
      ).toEqual(page);
    });
  });

  describe("selectSamplesPerPage", () => {
    it("should select limit from sampleFilters", () => {
      expect(
        fromSelectors.selectSamplesPerPage.projector(
          initialSampleState.sampleFilters
        )
      ).toEqual(25);
    });
  });

  describe("selectDatasetsPerPage", () => {
    it("should select limit from datasetFilters", () => {
      expect(
        fromSelectors.selectDatasetsPerPage.projector(
          initialSampleState.datasetFilters
        )
      ).toEqual(25);
    });
  });

  describe("selectFullqueryParams", () => {
    it("should select the fullquery params", () => {
      const fullqueryKeys = Object.keys(
        fromSelectors.selectFullqueryParams.projector(
          initialSampleState.sampleFilters
        )
      );
      expect(fullqueryKeys).toContain("query");
    });
  });

  describe("selectDatasetsQueryParams", () => {
    it("should select the datasets query params", () => {
      const { sortField, skip, limit } = initialSampleState.datasetFilters;
      const params = { order: sortField, skip, limit };
      expect(
        fromSelectors.selectDatasetsQueryParams.projector(
          initialSampleState.datasetFilters
        )
      ).toEqual(params);
    });
  });
});
