import { Action, createReducer, on } from "@ngrx/store";
import {
  initialDatasetState,
  DatasetState
} from "state-management/state/datasets.store";
import * as fromActions from "state-management/actions/datasets.actions";
import { ArchViewMode } from "state-management/models";

const reducer = createReducer(
  initialDatasetState,
  on(fromActions.fetchDatasetsCompleteAction, (state, { datasets }) => ({
    ...state,
    datasets
  })),

  on(
    fromActions.fetchFacetCountsCompleteAction,
    (state, { facetCounts, allCounts }) => ({
      ...state,
      facetCounts,
      totalCount: allCounts
    })
  ),

  on(fromActions.fetchDatasetCompleteAction, (state, { dataset }) => ({
    ...state,
    currentSet: dataset
  })),

  on(fromActions.prefillBatchCompleteAction, (state, { batch }) => ({
    ...state,
    batch
  })),
  on(fromActions.addToBatchAction, state => {
    const batchedPids = state.batch.map(dataset => dataset.pid);
    const addition = state.selectedSets.filter(
      dataset => batchedPids.indexOf(dataset.pid) === -1
    );
    const batch = [...state.batch, ...addition];
    return { ...state, batch };
  }),
  on(fromActions.removeFromBatchAction, (state, { dataset }) => {
    const batch = state.batch.filter(
      datasetInBatch => datasetInBatch.pid !== dataset.pid
    );
    return { ...state, batch };
  }),
  on(fromActions.clearBatchAction, state => ({ ...state, batch: [] })),

  on(fromActions.addAttachmentCompleteAction, (state, { attachment }) => {
    const attachments = state.currentSet.attachments.filter(
      existingAttachment => existingAttachment.id !== attachment.id
    );
    attachments.push(attachment);
    const currentSet = { ...state.currentSet, attachments };
    return { ...state, currentSet };
  }),

  on(
    fromActions.updateAttachmentCaptionCompleteAction,
    (state, { attachment }) => {
      const attachments = state.currentSet.attachments.filter(
        existingAttachment => existingAttachment.id !== attachment.id
      );
      attachments.push(attachment);
      const currentSet = { ...state.currentSet, attachments };
      return { ...state, currentSet };
    }
  ),

  on(fromActions.removeAttachmentCompleteAction, (state, { attachmentId }) => {
    const attachments = state.currentSet.attachments.filter(
      attachment => attachment.id !== attachmentId
    );
    const currentSet = { ...state.currentSet, attachments };
    return { ...state, currentSet };
  }),

  on(fromActions.selectDatasetAction, (state, { dataset }) => {
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
  on(fromActions.deselectDatasetAction, (state, { dataset }) => {
    const selectedSets = state.selectedSets.filter(
      selectedSet => selectedSet.pid !== dataset.pid
    );
    return { ...state, selectedSets };
  }),

  on(fromActions.selectAllDatasetsAction, state => ({
    ...state,
    selectedSets: [...state.datasets]
  })),
  on(fromActions.clearSelectionAction, state => ({
    ...state,
    selectedSets: []
  })),

  on(fromActions.changePageAction, (state, { page, limit }) => {
    const skip = page * limit;
    const filters = { ...state.filters, skip, limit };
    return { ...state, filters };
  }),
  on(fromActions.sortByColumnAction, (state, { column, direction }) => {
    const sortField = column + (direction ? ":" + direction : "");
    const filters = { ...state.filters, sortField, skip: 0 };
    return { ...state, filters };
  }),
  on(fromActions.setSearchTermsAction, (state, { terms }) => ({
    ...state,
    searchTerms: terms
  })),

  on(fromActions.setArchiveViewModeAction, (state, { modeToggle }) => {
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
    return { ...state, filters };
  }),
  on(fromActions.setPublicViewModeAction, (state, { isPublished }) => ({
    ...state,
    filters: { ...state.filters, isPublished }
  })),

  on(fromActions.prefillFiltersAction, (state, { values }) => {
    const filters = { ...state.filters, ...values };
    const searchTerms = filters.text || "";
    return { ...state, searchTerms, filters, hasPrefilledFilters: true };
  }),
  on(fromActions.clearFacetsAction, state => {
    const limit = state.filters.limit; // Save limit
    const filters = { ...initialDatasetState.filters, skip: 0, limit };
    return { ...state, filters, searchTerms: "" };
  }),

  on(fromActions.setTextFilterAction, (state, { text }) => {
    const filters = { ...state.filters, text, skip: 0 };
    return { ...state, filters };
  }),

  on(fromActions.addLocationFilterAction, (state, { location }) => {
    const creationLocation = state.filters.creationLocation
      .concat(location)
      .filter((val, i, self) => self.indexOf(val) === i); // Unique
    const filters = { ...state.filters, creationLocation, skip: 0 };
    return { ...state, filters };
  }),
  on(fromActions.removeLocationFilterAction, (state, { location }) => {
    const creationLocation = state.filters.creationLocation.filter(
      existingLocation => existingLocation !== location
    );
    const filters = { ...state.filters, creationLocation, skip: 0 };
    return { ...state, filters };
  }),

  on(fromActions.addGroupFilterAction, (state, { group }) => {
    const ownerGroup = state.filters.ownerGroup
      .concat(group)
      .filter((val, i, self) => self.indexOf(val) === i); // Unique
    const filters = { ...state.filters, ownerGroup, skip: 0 };
    return { ...state, filters };
  }),
  on(fromActions.removeGroupFilterAction, (state, { group }) => {
    const ownerGroup = state.filters.ownerGroup.filter(
      existingGroup => existingGroup !== group
    );
    const filters = { ...state.filters, ownerGroup, skip: 0 };
    return { ...state, filters };
  }),

  on(fromActions.addTypeFilterAction, (state, { datasetType }) => {
    const type = state.filters.type
      .concat(datasetType)
      .filter((val, i, self) => self.indexOf(val) === i); // Unique
    const filters = { ...state.filters, type, skip: 0 };
    return { ...state, filters };
  }),
  on(fromActions.removeTypeFilterAction, (state, { datasetType }) => {
    const type = state.filters.type.filter(
      existingType => existingType !== datasetType
    );
    const filters = { ...state.filters, type, skip: 0 };
    return { ...state, filters };
  }),

  on(fromActions.addKeywordFilterAction, (state, { keyword }) => {
    const keywords = state.filters.keywords
      .concat(keyword)
      .filter((val, i, self) => self.indexOf(val) === i); // Unique
    const filters = { ...state.filters, keywords, skip: 0 };
    return { ...state, filters };
  }),
  on(fromActions.removeKeywordFilterAction, (state, { keyword }) => {
    const keywords = state.filters.keywords.filter(
      existingKeyword => existingKeyword !== keyword
    );
    const filters = { ...state.filters, keywords, skip: 0 };
    return { ...state, filters };
  }),

  on(fromActions.setDateRangeFilterAction, (state, { begin, end }) => {
    const oldTime = state.filters.creationTime;
    const creationTime = { ...oldTime, begin, end };
    const filters = { ...state.filters, creationTime };
    return { ...state, filters };
  }),

  on(fromActions.addScientificConditionAction, (state, { condition }) => {
    const currentFilters = state.filters;
    const currentScientific = currentFilters.scientific;
    const filters = {
      ...currentFilters,
      scientific: [...currentScientific, condition]
    };
    return { ...state, filters };
  }),
  on(fromActions.removeScientificConditionAction, (state, { index }) => {
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
