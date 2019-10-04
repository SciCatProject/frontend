import { Action, createReducer, on } from "@ngrx/store";
import {
  initialDatasetState,
  DatasetState
} from "state-management/state/datasets.store";
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
} from "state-management/actions/datasets.actions";
import { ArchViewMode } from "state-management/models";

const reducer = createReducer(
  initialDatasetState,
  on(fetchDatasetsAction, state => ({ ...state, isLoading: true })),
  on(fetchDatasetsCompleteAction, (state, { datasets }) => ({
    ...state,
    datasets,
    isLoading: false
  })),
  on(fetchDatasetsFailedAction, state => ({
    ...state,
    isLoading: false
  })),

  on(fetchFacetCountsAction, state => ({ ...state, isLoading: true })),
  on(fetchFacetCountsCompleteAction, (state, { facetCounts, allCounts }) => ({
    ...state,
    facetCounts,
    totalCount: allCounts,
    isLoading: false
  })),
  on(fetchFacetCountsFailedAction, state => ({
    ...state,
    isLoading: false
  })),

  on(fetchDatasetAction, state => ({ ...state, isLoading: true })),
  on(fetchDatasetCompleteAction, (state, { dataset }) => ({
    ...state,
    currentSet: dataset,
    isLoading: false
  })),
  on(fetchDatasetFailedAction, state => ({
    ...state,
    isLoading: false
  })),

  on(prefillBatchCompleteAction, (state, { batch }) => ({ ...state, batch })),
  on(addToBatchAction, state => {
    const batchedPids = state.batch.map(dataset => dataset.pid);
    const addition = state.selectedSets.filter(
      dataset => batchedPids.indexOf(dataset.pid) === -1
    );
    const batch = [...state.batch, ...addition];
    return { ...state, batch };
  }),
  on(removeFromBatchAction, (state, { dataset }) => {
    const batch = state.batch.filter(
      datasetInBatch => datasetInBatch.pid !== dataset.pid
    );
    return { ...state, batch };
  }),
  on(clearBatchAction, state => ({ ...state, batch: [] })),

  on(saveDatasetAction, state => ({ ...state, isLoading: true })),
  on(saveDatasetCompleteAction, (state, { dataset }) => ({
    ...state,
    currentSet: dataset,
    isLoading: false
  })),
  on(saveDatasetFailedAction, state => ({
    ...state,
    isLoading: false
  })),

  on(addAttachmentAction, state => ({ ...state, isLoading: true })),
  on(addAttachmentCompleteAction, (state, { attachment }) => {
    const attachments = state.currentSet.attachments;
    attachments.push(attachment);

    return {
      ...state,
      currentSet: { ...state.currentSet, attachments },
      isLoading: false
    };
  }),
  on(addAttachmentFailedAction, state => ({
    ...state,
    isLoading: false
  })),

  on(updateAttachmentCaptionAction, state => ({ ...state, isLoading: true })),
  on(updateAttachmentCaptionCompleteAction, (state, { attachment }) => {
    const attachments = state.currentSet.attachments.filter(
      existingAttachment => existingAttachment.id !== attachment.id
    );
    attachments.push(attachment);
    return {
      ...state,
      currentSet: { ...state.currentSet, attachments },
      isLoading: false
    };
  }),
  on(updateAttachmentCaptionFailedAction, state => ({
    ...state,
    isLoading: false
  })),

  on(removeAttachmentAction, state => ({ ...state, isLoading: true })),
  on(removeAttachmentCompleteAction, (state, { attachmentId }) => {
    const attachments = state.currentSet.attachments.filter(
      attachment => attachment.id !== attachmentId
    );
    return {
      ...state,
      currentSet: { ...state.currentSet, attachments },
      isLoading: false
    };
  }),
  on(removeAttachmentFailedAction, state => ({
    ...state,
    isLoading: false
  })),

  on(selectDatasetAction, (state, { dataset }) => {
    const alreadySelected = state.selectedSets.find(
      existing => dataset.pid === existing.pid
    );
    if (alreadySelected) {
      return state;
    } else {
      const selectedSets = state.selectedSets.concat(dataset);
      return { ...state, selectedSets };
    }
  }),
  on(deselectDatasetAction, (state, { dataset }) => {
    const selectedSets = state.selectedSets.filter(
      selectedSet => selectedSet.pid !== dataset.pid
    );
    return { ...state, selectedSets };
  }),

  on(selectAllDatasetsAction, state => ({
    ...state,
    selectedSets: [...state.datasets]
  })),
  on(clearSelectionAction, state => ({ ...state, selectedSets: [] })),

  on(changePageAction, (state, { page, limit }) => {
    const skip = page * limit;
    return { ...state, filters: { ...state.filters, skip, limit } };
  }),
  on(sortByColumnAction, (state, { column, direction }) => {
    const sortField = column + (direction ? ":" + direction : "");
    return { ...state, filters: { ...state.filters, sortField, skip: 0 } };
  }),
  on(setSearchTermsAction, (state, { terms }) => ({
    ...state,
    searchTerms: terms
  })),

  on(setArchiveViewModeAction, (state, { modeToggle }) => {
    let mode = {};

    switch (modeToggle) {
      case ArchViewMode.all:
        mode = {};
        break;
      case ArchViewMode.archivable:
        mode = {
          "datasetlifecycle.archivable": true,
          "datasetlifecycle.retrievable": false
        };
        break;
      case ArchViewMode.retrievable:
        mode = {
          "datasetlifecycle.retrievable": true,
          "datasetlifecycle.archivable": false
        };
        break;
      case ArchViewMode.work_in_progress:
        mode = {
          $or: [
            {
              "datasetlifecycle.retrievable": false,
              "datasetlifecycle.archivable": false,
              "datasetlifecycle.archiveStatusMessage": {
                $ne: "scheduleArchiveJobFailed"
              },
              "datasetlifecycle.retrieveStatusMessage": {
                $ne: "scheduleRetrieveJobFailed"
              }
            }
          ]
        };
        break;
      case ArchViewMode.system_error:
        mode = {
          $or: [
            {
              "datasetlifecycle.retrievable": true,
              "datasetlifecycle.archivable": true
            },
            {
              "datasetlifecycle.archiveStatusMessage":
                "scheduleArchiveJobFailed"
            },
            {
              "datasetlifecycle.retrieveStatusMessage":
                "scheduleRetrieveJobFailed"
            }
          ]
        };
        break;
      case ArchViewMode.user_error:
        mode = {
          $or: [
            {
              "datasetlifecycle.archiveStatusMessage": "missingFilesError"
            }
          ]
        };
        break;
      default: {
        break;
      }
    }
    const filters = { ...state.filters, skip: 0, mode, modeToggle };
    return { ...state, filters, datasetsLoading: true };
  }),
  on(setPublicViewModeAction, (state, { isPublished }) => ({
    ...state,
    filters: { ...state.filters, isPublished }
  })),

  on(prefillFiltersAction, (state, { values }) => {
    const filters = { ...state.filters, ...values };
    const searchTerms = filters.text || "";
    return { ...state, searchTerms, filters, hasPrefilledFilters: true };
  }),
  on(clearFacetsAction, state => {
    const limit = state.filters.limit; // Save limit
    const filters = { ...initialDatasetState.filters, skip: 0, limit };
    return { ...state, filters, searchTerms: "" };
  }),

  on(setTextFilterAction, (state, { text }) => {
    const filters = { ...state.filters, text, skip: 0 };
    return { ...state, filters };
  }),

  on(addLocationFilterAction, (state, { location }) => {
    const creationLocation = state.filters.creationLocation
      .concat(location)
      .filter((val, i, self) => self.indexOf(val) === i); // Unique
    const filters = { ...state.filters, creationLocation, skip: 0 };
    return { ...state, filters };
  }),
  on(removeLocationFilterAction, (state, { location }) => {
    const creationLocation = state.filters.creationLocation.filter(
      existingLocation => existingLocation !== location
    );
    const filters = { ...state.filters, creationLocation, skip: 0 };
    return { ...state, filters };
  }),

  on(addGroupFilterAction, (state, { group }) => {
    const ownerGroup = state.filters.ownerGroup
      .concat(group)
      .filter((val, i, self) => self.indexOf(val) === i); // Unique
    const filters = { ...state.filters, ownerGroup, skip: 0 };
    return { ...state, filters };
  }),
  on(removeGroupFilterAction, (state, { group }) => {
    const ownerGroup = state.filters.ownerGroup.filter(
      existingGroup => existingGroup !== group
    );
    const filters = { ...state.filters, ownerGroup, skip: 0 };
    return { ...state, filters };
  }),

  on(addTypeFilterAction, (state, { datasetType }) => {
    const type = state.filters.type
      .concat(datasetType)
      .filter((val, i, self) => self.indexOf(val) === i); // Unique
    const filters = { ...state.filters, type, skip: 0 };
    return { ...state, filters };
  }),
  on(removeTypeFilterAction, (state, { datasetType }) => {
    const type = state.filters.type.filter(
      existingType => existingType !== datasetType
    );
    const filters = { ...state.filters, type, skip: 0 };
    return { ...state, filters };
  }),

  on(addKeywordFilterAction, (state, { keyword }) => {
    const keywords = state.filters.keywords
      .concat(keyword)
      .filter((val, i, self) => self.indexOf(val) === i); // Unique
    const filters = { ...state.filters, keywords, skip: 0 };
    return { ...state, filters };
  }),
  on(removeKeywordFilterAction, (state, { keyword }) => {
    const keywords = state.filters.keywords.filter(
      existingKeyword => existingKeyword !== keyword
    );
    const filters = { ...state.filters, keywords, skip: 0 };
    return { ...state, filters };
  }),

  on(setDateRangeFilterAction, (state, { begin, end }) => {
    const oldTime = state.filters.creationTime;
    const creationTime = { ...oldTime, begin, end };
    const filters = { ...state.filters, creationTime };
    return { ...state, filters };
  }),

  on(addScientificConditionAction, (state, { condition }) => {
    const currentFilters = state.filters;
    const currentScientific = currentFilters.scientific;
    const filters = {
      ...currentFilters,
      scientific: [...currentScientific, condition]
    };
    return { ...state, filters };
  }),
  on(removeScientificConditionAction, (state, { index }) => {
    const currentFilters = state.filters;
    const scientific = [...currentFilters.scientific];
    scientific.splice(index, 1);
    const filters = { ...currentFilters, scientific };
    return { ...state, filters };
  })
);

export function datasetsReducer(
  state: DatasetState | undefined,
  action: Action
) {
  if (action.type.indexOf("[Dataset]") !== -1) {
    console.log("Action came in! " + action.type);
  }
  return reducer(state, action);
}
