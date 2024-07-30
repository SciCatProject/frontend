import * as fromDatasetSelectors from "./datasets.selectors";
import { ArchViewMode, Dataset } from "../models";
import { DatasetState } from "../state/datasets.store";

const dataset = new Dataset();

const initialDatasetState: DatasetState = {
  datasets: [],
  selectedSets: [],
  currentSet: dataset,
  relatedDatasets: [],
  relatedDatasetsCount: 0,
  totalCount: 0,

  facetCounts: {},
  metadataKeys: ["test"],
  hasPrefilledFilters: false,
  searchTerms: "run",
  keywordsTerms: "",
  pidTerms: "pid",
  batch: [],

  openwhiskResult: {},

  filters: {
    mode: {},
    modeToggle: ArchViewMode.all,
    text: "",
    creationTime: {
      begin: "2019-10-03",
      end: "2019-10-04",
    },
    type: [],
    creationLocation: [],
    ownerGroup: [],
    skip: 0,
    limit: 30,
    sortField: "creationTime:desc",
    keywords: [],
    scientific: [],
    isPublished: false,
    pid: "",
  },
  pagination: {
    skip: 0,
    limit: 30,
  },
  relatedDatasetsFilters: {
    skip: 0,
    limit: 25,
    sortField: "creationTime:desc",
  },
};

describe("test dataset selectors", () => {
  describe("selectDatasets", () => {
    it("should select all datasets", () => {
      expect(
        fromDatasetSelectors.selectDatasets.projector(initialDatasetState),
      ).toEqual([]);
    });
  });

  describe("selectSelectedDatasets", () => {
    it("should select all selected datasets", () => {
      expect(
        fromDatasetSelectors.selectSelectedDatasets.projector(
          initialDatasetState,
        ),
      ).toEqual([]);
    });
  });

  describe("selectMetadataKeys", () => {
    it("should select the array of metadata keys", () => {
      expect(
        fromDatasetSelectors.selectMetadataKeys.projector(initialDatasetState),
      ).toEqual(["test"]);
    });
  });

  describe("selectCurrentDataset", () => {
    it("should select the current dataset", () => {
      expect(
        fromDatasetSelectors.selectCurrentDataset.projector(
          initialDatasetState,
        ),
      ).toEqual(dataset);
    });
  });

  describe("selectCurrentDatasetWithoutFileInfo", () => {
    it("should select the current dataset without origDatablocks", () => {
      const { origdatablocks, ...datasetWithout } = dataset;

      expect(
        fromDatasetSelectors.selectCurrentDatasetWithoutFileInfo.projector(
          dataset,
        ),
      ).toEqual(datasetWithout);
    });
  });

  describe("selectCurrentOrigDatablocks", () => {
    it("should select the origDatablocks from the current dataset", () => {
      expect(
        fromDatasetSelectors.selectCurrentOrigDatablocks.projector(dataset),
      ).toEqual(dataset.origdatablocks);
    });
  });

  describe("selectCurrentDatablocks", () => {
    it("should select the datablocks from the current dataset", () => {
      expect(
        fromDatasetSelectors.selectCurrentDatablocks.projector(dataset),
      ).toEqual(dataset.datablocks);
    });
  });

  describe("selectCurrentAttachments", () => {
    it("should select the attachments from the current dataset", () => {
      expect(
        fromDatasetSelectors.selectCurrentAttachments.projector(dataset),
      ).toEqual(dataset.attachments);
    });
  });

  describe("selectFilters", () => {
    it("should select the dataset filters", () => {
      const filters = initialDatasetState.filters;

      expect(
        fromDatasetSelectors.selectFilters.projector(initialDatasetState),
      ).toEqual(filters);
    });
  });

  describe("selectTextFilter", () => {
    it("should select the text filter", () => {
      expect(
        fromDatasetSelectors.selectTextFilter.projector(
          initialDatasetState.filters,
        ),
      ).toEqual("");
    });
  });

  describe("selectLocationFilter", () => {
    it("should select the creationLocation filter", () => {
      expect(
        fromDatasetSelectors.selectLocationFilter.projector(
          initialDatasetState.filters,
        ),
      ).toEqual([]);
    });
  });

  describe("selectGroupFilter", () => {
    it("should select the ownerGroup filter", () => {
      expect(
        fromDatasetSelectors.selectGroupFilter.projector(
          initialDatasetState.filters,
        ),
      ).toEqual([]);
    });
  });

  describe("selectTypeFilter", () => {
    it("should select the type filter", () => {
      expect(
        fromDatasetSelectors.selectTypeFilter.projector(
          initialDatasetState.filters,
        ),
      ).toEqual([]);
    });
  });

  describe("selectKeywordsFilter", () => {
    it("should select the keywords filter", () => {
      expect(
        fromDatasetSelectors.selectKeywordsFilter.projector(
          initialDatasetState.filters,
        ),
      ).toEqual([]);
    });
  });

  describe("selectCreationTimeFilter", () => {
    it("should select the creationTime filter", () => {
      expect(
        fromDatasetSelectors.selectCreationTimeFilter.projector(
          initialDatasetState.filters,
        ),
      ).toEqual({ begin: "2019-10-03", end: "2019-10-04" });
    });
  });

  describe("selectArchiveViewMode", () => {
    it("should select the modeToggle filter", () => {
      expect(
        fromDatasetSelectors.selectArchiveViewMode.projector(
          initialDatasetState.filters,
        ),
      ).toEqual(ArchViewMode.all);
    });
  });

  describe("selectPublicViewMode", () => {
    it("should select the isPublic filter", () => {
      expect(
        fromDatasetSelectors.selectPublicViewMode.projector(
          initialDatasetState.filters,
        ),
      ).toEqual(false);
    });
  });

  describe("selectHasAppliedFilters", () => {
    it("should return true if filters are applied", () => {
      expect(
        fromDatasetSelectors.selectHasAppliedFilters.projector(
          initialDatasetState.filters,
        ),
      ).toEqual(true);
    });
  });

  describe("selectScientificConditions", () => {
    it("should return the scientific filter", () => {
      expect(
        fromDatasetSelectors.selectScientificConditions.projector(
          initialDatasetState.filters,
        ),
      ).toEqual([]);
    });
  });

  describe("selectLocationFacetCounts", () => {
    it("should return the location facetCounts", () => {
      expect(
        fromDatasetSelectors.selectLocationFacetCounts.projector(
          initialDatasetState.facetCounts,
        ),
      ).toEqual([]);
    });
  });

  describe("selectGroupFacetCounts", () => {
    it("should return the ownerGroup facetCounts", () => {
      expect(
        fromDatasetSelectors.selectGroupFacetCounts.projector(
          initialDatasetState.facetCounts,
        ),
      ).toEqual([]);
    });
  });

  describe("selectTypeFacetCounts", () => {
    it("should return the type facetCounts", () => {
      expect(
        fromDatasetSelectors.selectTypeFacetCounts.projector(
          initialDatasetState.facetCounts,
        ),
      ).toEqual([]);
    });
  });

  describe("selectKeywordFacetCounts", () => {
    it("should return the keywords facetCounts", () => {
      expect(
        fromDatasetSelectors.selectKeywordFacetCounts.projector(
          initialDatasetState.facetCounts,
        ),
      ).toEqual([]);
    });
  });

  describe("selectFullqueryParams", () => {
    it("should return the fullquery params", () => {
      const fullqueryKeys = Object.keys(
        fromDatasetSelectors.selectFullqueryParams.projector(
          initialDatasetState,
        ),
      );
      expect(fullqueryKeys).toContain("query");
    });
  });

  describe("selectFullfacetParams", () => {
    it("should return the fullfacet params", () => {
      const fullfacet =
        fromDatasetSelectors.selectFullfacetParams.projector(
          initialDatasetState,
        );
      const fullfacetKeys = Object.keys(fullfacet);
      expect(fullfacet.facets).toEqual([
        "type",
        "creationLocation",
        "ownerGroup",
        "keywords",
      ]);
      expect(fullfacetKeys).toContain("facets");
    });
  });

  describe("selectTotalSets", () => {
    it("should select total set number", () => {
      expect(
        fromDatasetSelectors.selectTotalSets.projector(initialDatasetState),
      ).toEqual(0);
    });
  });

  describe("selectPage", () => {
    it("should select the current page", () => {
      expect(
        fromDatasetSelectors.selectPage.projector(
          initialDatasetState.pagination,
        ),
      ).toEqual(0);
    });
  });

  describe("selectDatasetsPerPage", () => {
    it("should select the limit filter", () => {
      expect(
        fromDatasetSelectors.selectDatasetsPerPage.projector(
          initialDatasetState.pagination,
        ),
      ).toEqual(30);
    });
  });

  describe("selectSearchTerms", () => {
    it("should select the current search terms", () => {
      expect(
        fromDatasetSelectors.selectSearchTerms.projector(initialDatasetState),
      ).toEqual("run");
    });
  });

  describe("selectKeywordsTerms", () => {
    it("should select the current keywords terms", () => {
      expect(
        fromDatasetSelectors.selectKeywordsTerms.projector(initialDatasetState),
      ).toEqual("");
    });
  });

  describe("selectHasPrefilledFilters", () => {
    it("should return the current state of hasPrefilledFilters", () => {
      expect(
        fromDatasetSelectors.selectHasPrefilledFilters.projector(
          initialDatasetState,
        ),
      ).toEqual(false);
    });
  });

  describe("selectDatasetsInBatch", () => {
    it("should return the current batch", () => {
      expect(
        fromDatasetSelectors.selectDatasetsInBatch.projector(
          initialDatasetState,
        ),
      ).toEqual([]);
    });
  });

  describe("selectDatasetsInBatchIndicator", () => {
    it("should return null if there are zero datasets in batch", () => {
      expect(
        fromDatasetSelectors.selectDatasetsInBatchIndicator.projector([]),
      ).toBeNull();
    });

    it("should return the string '99+' if there are more than 99 datasets in batch", () => {
      expect(
        fromDatasetSelectors.selectDatasetsInBatchIndicator.projector(
          new Array(100),
        ),
      ).toEqual("99+");
    });

    it("should return the stringified array length if the length is between 0 and 100", () => {
      expect(
        fromDatasetSelectors.selectDatasetsInBatchIndicator.projector(
          new Array(5),
        ),
      ).toEqual("5");
    });
  });

  describe("selectOpenwhiskResults", () => {
    it("should return the current openwhisk result", () => {
      expect(
        fromDatasetSelectors.selectOpenwhiskResult.projector(
          initialDatasetState,
        ),
      ).toEqual({});
    });
  });

  describe("selectRelatedDatasets", () => {
    it("should return the current related datasets", () => {
      expect(
        fromDatasetSelectors.selectRelatedDatasetsPageViewModel.projector(
          initialDatasetState,
        ),
      ).toEqual({
        relatedDatasets: [],
        relatedDatasetsCount: 0,
      });
    });
  });

  describe("selectRelatedDatasetsFilters", () => {
    it("should return the current related datasets filters", () => {
      expect(
        fromDatasetSelectors.selectRelatedDatasetsFilters.projector(
          initialDatasetState,
        ),
      ).toEqual({
        skip: 0,
        limit: 25,
        sortField: "creationTime:desc",
      });
    });
  });

  describe("selectRelatedDatasetsCurrentPage", () => {
    it("should return the current related datasets page", () => {
      expect(
        fromDatasetSelectors.selectRelatedDatasetsCurrentPage.projector(
          initialDatasetState.relatedDatasetsFilters,
        ),
      ).toEqual(0);
    });
  });

  describe("selectRelatedDatasetsPerPage", () => {
    it("should return the current related datasets per page", () => {
      expect(
        fromDatasetSelectors.selectRelatedDatasetsPerPage.projector(
          initialDatasetState.relatedDatasetsFilters,
        ),
      ).toEqual(25);
    });
  });

  describe("selectPidTerms", () => {
    it("should select the current pid terms", () => {
      expect(
        fromDatasetSelectors.selectPidTerms.projector(initialDatasetState),
      ).toEqual("pid");
    });
  });
});
