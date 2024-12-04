import * as fromSelectors from "./samples.selectors";
import { SampleState } from "state-management/state/samples.store";
import { initialUserState } from "state-management/state/user.store";
import { createMock } from "shared/MockStubs";
import { SampleClass } from "@scicatproject/scicat-sdk-ts";

const sample = createMock<SampleClass>({
  sampleId: "testId",
  ownerGroup: "testGroup",
  createdBy: "",
  updatedBy: "",
  createdAt: new Date().toString(),
  updatedAt: new Date().toString(),
  accessGroups: [],
  isPublished: false,
});

const initialSampleState: SampleState = {
  samples: [],
  attachments: [],
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
        [],
      );
    });
  });

  describe("selectMetadataKeys", () => {
    it("should select metadataKeys", () => {
      expect(
        fromSelectors.selectMetadataKeys.projector(initialSampleState),
      ).toEqual([]);
    });
  });

  describe("selectCurrentSample", () => {
    it("should select the current sample", () => {
      expect(
        fromSelectors.selectCurrentSample.projector(initialSampleState),
      ).toEqual(sample);
    });
  });

  describe("selectCurrentSample", () => {
    it("should select the attachments from the current sample", () => {
      expect(
        fromSelectors.selectCurrentAttachments.projector(initialSampleState),
      ).toEqual([]);
    });
  });

  describe("selectDatasets", () => {
    it("should select the datasets related to the current sample", () => {
      expect(
        fromSelectors.selectDatasets.projector(initialSampleState),
      ).toEqual([]);
    });
  });

  describe("selectSamplesCount", () => {
    it("should select samplesCount", () => {
      expect(
        fromSelectors.selectSamplesCount.projector(initialSampleState),
      ).toEqual(0);
    });
  });

  describe("selectDatasetsCount", () => {
    it("should select datasetsCount", () => {
      expect(
        fromSelectors.selectDatasetsCount.projector(initialSampleState),
      ).toEqual(0);
    });
  });

  describe("selectHasPrefilledFilters", () => {
    it("should select hasPrefilledFilters", () => {
      expect(
        fromSelectors.selectHasPrefilledFilters.projector(initialSampleState),
      ).toEqual(false);
    });
  });

  describe("selectFilters", () => {
    it("should select sampleFilters", () => {
      expect(fromSelectors.selectFilters.projector(initialSampleState)).toEqual(
        initialSampleState.sampleFilters,
      );
    });
  });

  describe("selectTextFilter", () => {
    it("should select text filter from sampleFilters", () => {
      expect(
        fromSelectors.selectTextFilter.projector(
          initialSampleState.sampleFilters,
        ),
      ).toEqual("test");
    });
  });

  describe("selectDatasetFilters", () => {
    it("should select datasetFilters", () => {
      expect(
        fromSelectors.selectDatasetFilters.projector(initialSampleState),
      ).toEqual(initialSampleState.datasetFilters);
    });
  });

  describe("selectPage", () => {
    it("should select the current samples page", () => {
      const { skip, limit } = initialSampleState.sampleFilters;
      const page = skip / limit;
      expect(
        fromSelectors.selectPage.projector(initialSampleState.sampleFilters),
      ).toEqual(page);
    });
  });

  describe("selectDatasetsPage", () => {
    it("should select the current datasets page", () => {
      const { skip, limit } = initialSampleState.datasetFilters;
      const page = skip / limit;
      expect(
        fromSelectors.selectDatasetsPage.projector(
          initialSampleState.datasetFilters,
        ),
      ).toEqual(page);
    });
  });

  describe("selectSamplesPerPage", () => {
    it("should select limit from sampleFilters", () => {
      expect(
        fromSelectors.selectSamplesPerPage.projector(
          initialSampleState.sampleFilters,
        ),
      ).toEqual(25);
    });
  });

  describe("selectDatasetsPerPage", () => {
    it("should select limit from datasetFilters", () => {
      expect(
        fromSelectors.selectDatasetsPerPage.projector(
          initialSampleState.datasetFilters,
        ),
      ).toEqual(25);
    });
  });

  describe("selectSamplesPagination", () => {
    it("should select pagination state", () => {
      expect(
        fromSelectors.selectSamplesPagination.projector(
          initialSampleState.samplesCount,
          initialSampleState.sampleFilters.limit,
          fromSelectors.selectPage.projector(initialSampleState.sampleFilters),
        ),
      ).toEqual({ samplesCount: 0, samplesPerPage: 25, currentPage: 0 });
    });
  });

  describe("selectSampleDashboardPageViewModel", () => {
    it("should select sample dashboard page view model state", () => {
      expect(
        fromSelectors.selectSampleDashboardPageViewModel.projector(
          initialSampleState.samples,
          fromSelectors.selectSamplesPagination.projector(
            initialSampleState.samplesCount,
            initialSampleState.sampleFilters.limit,
            fromSelectors.selectPage.projector(
              initialSampleState.sampleFilters,
            ),
          ),
          initialSampleState.sampleFilters,
          initialSampleState.hasPrefilledFilters,
          initialSampleState.sampleFilters.text,
          initialSampleState.metadataKeys,
          initialSampleState.sampleFilters.characteristics,
        ),
      ).toEqual({
        samples: [],
        samplesPagination: {
          samplesCount: 0,
          samplesPerPage: 25,
          currentPage: 0,
        },
        filters: initialSampleState.sampleFilters,
        hasPrefilledFilters: false,
        textFilter: "test",
        metadataKeys: [],
        characteristicsFilter: [],
      });
    });
  });

  describe("selectSampleDetailPageViewModel", () => {
    it("should select sample detail page view model state", () => {
      expect(
        fromSelectors.selectSampleDetailPageViewModel.projector(
          initialSampleState.currentSample,
          initialSampleState.datasets,
          initialSampleState.datasetFilters.limit,
          fromSelectors.selectDatasetsPage.projector(
            initialSampleState.datasetFilters,
          ),
          initialSampleState.datasetsCount,
          fromSelectors.selectCurrentAttachments.projector(initialSampleState),
          initialUserState.currentUser,
        ),
      ).toEqual({
        sample,
        datasets: [],
        datasetsPerPage: 25,
        datasetsPage: 0,
        datasetsCount: 0,
        attachments: [],
        user: undefined,
      });
    });
  });

  describe("selectFullqueryParams", () => {
    it("should select the fullquery params", () => {
      const fullqueryKeys = Object.keys(
        fromSelectors.selectFullqueryParams.projector(
          initialSampleState.sampleFilters,
        ),
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
          initialSampleState.datasetFilters,
        ),
      ).toEqual(params);
    });
  });
});
