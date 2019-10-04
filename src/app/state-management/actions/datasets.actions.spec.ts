import {
  fetchDatasetsAction,
  fetchDatasetsCompleteAction,
  fetchDatasetsFailedAction,
  fetchFacetCountsAction,
  fetchFacetCountsCompleteAction,
  fetchFacetCountsFailedAction,
  fetchDatasetAction,
  fetchDatasetCompleteAction,
  fetchDatasetFailedAction,
  prefillBatchAction,
  prefillBatchCompleteAction,
  addToBatchAction,
  removeFromBatchAction,
  clearBatchAction,
  saveDatasetAction,
  saveDatasetCompleteAction,
  saveDatasetFailedAction,
  addAttachmentAction,
  addAttachmentCompleteAction,
  addAttachmentFailedAction,
  updateAttachmentCaptionAction,
  updateAttachmentCaptionCompleteAction,
  updateAttachmentCaptionFailedAction,
  removeAttachmentAction,
  removeAttachmentCompleteAction,
  removeAttachmentFailedAction,
  reduceDatasetAction,
  reduceDatasetCompleteAction,
  reduceDatasetFailedAction,
  selectDatasetAction,
  deselectDatasetAction,
  selectAllDatasetsAction,
  clearSelectionAction,
  changePageAction,
  sortByColumnAction,
  setSearchTermsAction,
  setArchiveViewModeAction,
  setPublicViewModeAction,
  prefillFiltersAction,
  clearFacetsAction,
  setTextFilterAction,
  addLocationFilterAction,
  removeLocationFilterAction,
  addGroupFilterAction,
  removeGroupFilterAction,
  addTypeFilterAction,
  removeTypeFilterAction,
  addKeywordFilterAction,
  removeKeywordFilterAction,
  setDateRangeFilterAction,
  addScientificConditionAction,
  removeScientificConditionAction
} from "./datasets.actions";
import { Dataset, Attachment, RawDataset } from "shared/sdk";
import { FacetCounts } from "state-management/state/datasets.store";
import {
  ArchViewMode,
  DatasetFilters,
  ScientificCondition
} from "state-management/models";

describe("Dataset Actions", () => {
  describe("#fetchDatasets()", () => {
    it("should create an action", () => {
      const action = fetchDatasetsAction();
      expect({ ...action }).toEqual({ type: "[Dataset] Fetch Datasets" });
    });
  });

  describe("#fetchDatasetsComplete()", () => {
    it("should create an action", () => {
      const datasets = [new Dataset()];
      const action = fetchDatasetsCompleteAction({ datasets });
      expect({ ...action }).toEqual({
        type: "[Dataset] Fetch Datasets Complete",
        datasets
      });
    });
  });

  describe("#fetchDatasetsFailed()", () => {
    it("should create an action", () => {
      const action = fetchDatasetsFailedAction();
      expect({ ...action }).toEqual({
        type: "[Dataset] Fetch Datasets Failed"
      });
    });
  });

  describe("#fetchFacetCounts()", () => {
    it("should create an action", () => {
      const action = fetchFacetCountsAction();
      expect({ ...action }).toEqual({ type: "[Dataset] Fetch Facet Counts" });
    });
  });

  describe("#fetchFacetCountsComplete()", () => {
    it("should create an action", () => {
      const facetCounts: FacetCounts = {};
      const allCounts = 0;
      const action = fetchFacetCountsCompleteAction({ facetCounts, allCounts });
      expect({ ...action }).toEqual({
        type: "[Dataset] Fetch Facet Counts Complete",
        facetCounts,
        allCounts
      });
    });
  });

  describe("#fetchFacetCountsFailed()", () => {
    it("should create an action", () => {
      const action = fetchFacetCountsFailedAction();
      expect({ ...action }).toEqual({
        type: "[Dataset] Fetch Facet Counts Failed"
      });
    });
  });

  describe("#fetchDataset()", () => {
    it("should create an action", () => {
      const pid = "test";
      const action = fetchDatasetAction({ pid });
      expect({ ...action }).toEqual({ type: "[Dataset] Fetch Dataset", pid });
    });
  });

  describe("#fetchDatasetComplete()", () => {
    it("should create an action", () => {
      const dataset = new Dataset();
      const action = fetchDatasetCompleteAction({ dataset });
      expect({ ...action }).toEqual({
        type: "[Dataset] Fetch Dataset Complete",
        dataset
      });
    });
  });

  describe("#fetchDatasetFailed()", () => {
    it("should create an action", () => {
      const action = fetchDatasetFailedAction();
      expect({ ...action }).toEqual({
        type: "[Dataset] Fetch Dataset Failed"
      });
    });
  });

  describe("#prefillBatch()", () => {
    it("should create an action", () => {
      const action = prefillBatchAction();
      expect({ ...action }).toEqual({ type: "[Dataset] Prefill Batch" });
    });
  });

  describe("#prefillBatchComplete()", () => {
    it("should create an action", () => {
      const batch = [new Dataset()];
      const action = prefillBatchCompleteAction({ batch });
      expect({ ...action }).toEqual({
        type: "[Dataset] Prefill Batch Complete",
        batch
      });
    });
  });

  describe("#addToBatch()", () => {
    it("should create an action", () => {
      const action = addToBatchAction();
      expect({ ...action }).toEqual({ type: "[Dataset] Add To Batch" });
    });
  });

  describe("#removeFromBatch()", () => {
    it("should create an action", () => {
      const dataset = new Dataset();
      const action = removeFromBatchAction({ dataset });
      expect({ ...action }).toEqual({
        type: "[Dataset] Remove From Batch",
        dataset
      });
    });
  });

  describe("#clearBatch()", () => {
    it("should create an action", () => {
      const action = clearBatchAction();
      expect({ ...action }).toEqual({ type: "[Dataset] Clear Batch" });
    });
  });

  describe("#saveDataset()", () => {
    it("should create an action", () => {
      const dataset = new RawDataset();
      const metadata = {};
      const action = saveDatasetAction({ dataset, metadata });
      expect({ ...action }).toEqual({
        type: "[Dataset] Save Dataset",
        dataset,
        metadata
      });
    });
  });

  describe("#saveDatasetComplete()", () => {
    it("should create an action", () => {
      const dataset = new Dataset();
      const action = saveDatasetCompleteAction({ dataset });
      expect({ ...action }).toEqual({
        type: "[Dataset] Save Dataset Complete",
        dataset
      });
    });
  });

  describe("#saveDatasetFailed()", () => {
    it("should create an action", () => {
      const action = saveDatasetFailedAction();
      expect({ ...action }).toEqual({
        type: "[Dataset] Save Dataset Failed"
      });
    });
  });

  describe("#addAttachment()", () => {
    it("should create an action", () => {
      const attachment = new Attachment();
      const action = addAttachmentAction({ attachment });
      expect({ ...action }).toEqual({
        type: "[Dataset] Add Attachment",
        attachment
      });
    });
  });

  describe("#addAttachmentComplete()", () => {
    it("should create an action", () => {
      const attachment = new Attachment();
      const action = addAttachmentCompleteAction({ attachment });
      expect({ ...action }).toEqual({
        type: "[Dataset] Add Attachment Complete",
        attachment
      });
    });
  });

  describe("#addAttachmentFailed()", () => {
    it("should create an action", () => {
      const action = addAttachmentFailedAction();
      expect({ ...action }).toEqual({
        type: "[Dataset] Add Attachment Failed"
      });
    });
  });

  describe("#updateAttachmentCaption()", () => {
    it("should create an action", () => {
      const datasetId = "testId";
      const attachmentId = "testId";
      const caption = "test";
      const action = updateAttachmentCaptionAction({
        datasetId,
        attachmentId,
        caption
      });
      expect({ ...action }).toEqual({
        type: "[Dataset] Update Attachment Caption",
        datasetId,
        attachmentId,
        caption
      });
    });
  });

  describe("#updateAttachmentCaptionComplete()", () => {
    it("should create an action", () => {
      const attachment = new Attachment();
      const action = updateAttachmentCaptionCompleteAction({ attachment });
      expect({ ...action }).toEqual({
        type: "[Dataset] Update Attachment Caption Complete",
        attachment
      });
    });
  });

  describe("#updateAttachmentCaptionFailed()", () => {
    it("should create an action", () => {
      const action = updateAttachmentCaptionFailedAction();
      expect({ ...action }).toEqual({
        type: "[Dataset] Update Attachment Action Failed"
      });
    });
  });

  describe("#removeAttachment()", () => {
    it("should create an action", () => {
      const datasetId = "testId";
      const attachmentId = "testId";
      const action = removeAttachmentAction({
        datasetId,
        attachmentId
      });
      expect({ ...action }).toEqual({
        type: "[Dataset] Remove Attachment",
        datasetId,
        attachmentId
      });
    });
  });

  describe("#removeAttachmentComplete()", () => {
    it("should create an action", () => {
      const attachmentId = "testId";
      const action = removeAttachmentCompleteAction({ attachmentId });
      expect({ ...action }).toEqual({
        type: "[Dataset] Remove Attachment Complete",
        attachmentId
      });
    });
  });

  describe("#removeAttachmentFailed()", () => {
    it("should create an action", () => {
      const action = removeAttachmentFailedAction();
      expect({ ...action }).toEqual({
        type: "[Dataset] Remove Attachment Failed"
      });
    });
  });

  describe("#reduceDataset()", () => {
    it("should create an action", () => {
      const dataset = new Dataset();
      const action = reduceDatasetAction({ dataset });
      expect({ ...action }).toEqual({
        type: "[Dataset] Reduce Dataset",
        dataset
      });
    });
  });

  describe("#reduceDatasetComplete()", () => {
    it("should create an action", () => {
      const result = {};
      const action = reduceDatasetCompleteAction({ result });
      expect({ ...action }).toEqual({
        type: "[Dataset] Reduce Dataset Complete",
        result
      });
    });
  });

  describe("#reduceDatasetFailed()", () => {
    it("should create an action", () => {
      const action = reduceDatasetFailedAction();
      expect({ ...action }).toEqual({
        type: "[Dataset] Reduce Dataset Failed"
      });
    });
  });

  describe("#selectDataset()", () => {
    it("should create an action", () => {
      const dataset = new Dataset();
      const action = selectDatasetAction({ dataset });
      expect({ ...action }).toEqual({
        type: "[Dataset] Select Dataset",
        dataset
      });
    });
  });

  describe("#deselectDataset()", () => {
    it("should create an action", () => {
      const dataset = new Dataset();
      const action = deselectDatasetAction({ dataset });
      expect({ ...action }).toEqual({
        type: "[Dataset] Deselect Dataset",
        dataset
      });
    });
  });

  describe("#selectAllDatasets()", () => {
    it("should create an action", () => {
      const action = selectAllDatasetsAction();
      expect({ ...action }).toEqual({
        type: "[Dataset] Select All Datasets"
      });
    });
  });

  describe("#clearSelection()", () => {
    it("should create an action", () => {
      const action = clearSelectionAction();
      expect({ ...action }).toEqual({
        type: "[Dataset] Clear Selection"
      });
    });
  });

  describe("#changePage()", () => {
    it("should create an action", () => {
      const page = 0;
      const limit = 25;
      const action = changePageAction({ page, limit });
      expect({ ...action }).toEqual({
        type: "[Dataset] Change Page",
        page,
        limit
      });
    });
  });

  describe("#sortByColumn()", () => {
    it("should create an action", () => {
      const column = "test";
      const direction = "asc";
      const action = sortByColumnAction({ column, direction });
      expect({ ...action }).toEqual({
        type: "[Dataset] Sort By Column",
        column,
        direction
      });
    });
  });

  describe("#setSearchTerms()", () => {
    it("should create an action", () => {
      const terms = "test";
      const action = setSearchTermsAction({ terms });
      expect({ ...action }).toEqual({
        type: "[Dataset] Set Search Terms",
        terms
      });
    });
  });

  describe("#setArchViewMode()", () => {
    it("should create an action", () => {
      const modeToggle = ArchViewMode.all;
      const action = setArchiveViewModeAction({ modeToggle });
      expect({ ...action }).toEqual({
        type: "[Dataset] Set Archive View Mode",
        modeToggle
      });
    });
  });

  describe("#setPublicViewMode()", () => {
    it("should create an action", () => {
      const isPublished = false;
      const action = setPublicViewModeAction({ isPublished });
      expect({ ...action }).toEqual({
        type: "[Dataset] Set Public View Mode",
        isPublished
      });
    });
  });

  describe("#prefillFilters()", () => {
    it("should create an action", () => {
      const values: Partial<DatasetFilters> = {};
      const action = prefillFiltersAction({ values });
      expect({ ...action }).toEqual({
        type: "[Dataset] Prefill Filters",
        values
      });
    });
  });

  describe("#clearFacets()", () => {
    it("should create an action", () => {
      const action = clearFacetsAction();
      expect({ ...action }).toEqual({
        type: "[Dataset] Clear Facets"
      });
    });
  });

  describe("#setTextFilter()", () => {
    it("should create an action", () => {
      const text = "test";
      const action = setTextFilterAction({ text });
      expect({ ...action }).toEqual({
        type: "[Dataset] Set Text Filter",
        text
      });
    });
  });

  describe("#addLocationFilter()", () => {
    it("should create an action", () => {
      const location = "test";
      const action = addLocationFilterAction({ location });
      expect({ ...action }).toEqual({
        type: "[Dataset] Add Location Filter",
        location
      });
    });
  });

  describe("#removeLocationFilter()", () => {
    it("should create an action", () => {
      const location = "test";
      const action = removeLocationFilterAction({ location });
      expect({ ...action }).toEqual({
        type: "[Dataset] Remove Location Filter",
        location
      });
    });
  });

  describe("#addGroupFilter()", () => {
    it("should create an action", () => {
      const group = "test";
      const action = addGroupFilterAction({ group });
      expect({ ...action }).toEqual({
        type: "[Dataset] Add Group Filter",
        group
      });
    });
  });

  describe("#removeGroupFilter()", () => {
    it("should create an action", () => {
      const group = "test";
      const action = removeGroupFilterAction({ group });
      expect({ ...action }).toEqual({
        type: "[Dataset] Remove Group Filter",
        group
      });
    });
  });

  describe("#addTypeFilter()", () => {
    it("should create an action", () => {
      const datasetType = "test";
      const action = addTypeFilterAction({ datasetType });
      expect({ ...action }).toEqual({
        type: "[Dataset] Add Type Filter",
        datasetType
      });
    });
  });

  describe("#removeTypeFilter()", () => {
    it("should create an action", () => {
      const datasetType = "test";
      const action = removeTypeFilterAction({ datasetType });
      expect({ ...action }).toEqual({
        type: "[Dataset] Remove Type Filter",
        datasetType
      });
    });
  });

  describe("#addKeywordFilter()", () => {
    it("should create an action", () => {
      const keyword = "test";
      const action = addKeywordFilterAction({ keyword });
      expect({ ...action }).toEqual({
        type: "[Dataset] Add Keyword Filter",
        keyword
      });
    });
  });

  describe("#removeKeywordFilter()", () => {
    it("should create an action", () => {
      const keyword = "test";
      const action = removeKeywordFilterAction({ keyword });
      expect({ ...action }).toEqual({
        type: "[Dataset] Remove Keyword Filter",
        keyword
      });
    });
  });

  describe("#setDateRangeFilter()", () => {
    it("should create an action", () => {
      const begin = "testBegin";
      const end = "testEnd";
      const action = setDateRangeFilterAction({ begin, end });
      expect({ ...action }).toEqual({
        type: "[Dataset] Set Date Range Filter",
        begin,
        end
      });
    });
  });

  describe("#addScientificCondition()", () => {
    it("should create an action", () => {
      const condition: ScientificCondition = {
        lhs: "lhsTest",
        relation: "LESS_THAN",
        rhs: "rhsTest"
      };
      const action = addScientificConditionAction({ condition });
      expect({ ...action }).toEqual({
        type: "[Dataset] Add Scientific Condition",
        condition
      });
    });
  });

  describe("#removeScientificCondition()", () => {
    it("should create an action", () => {
      const index = 0;
      const action = removeScientificConditionAction({ index });
      expect({ ...action }).toEqual({
        type: "[Dataset] Remove Scientific Condition",
        index
      });
    });
  });
});
