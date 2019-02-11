import { Action } from "@ngrx/store";
import {
  ADD_ATTACHMENT,
  ADD_ATTACHMENT_COMPLETE,
  ADD_ATTACHMENT_FAILED,
  ADD_GROUP_FILTER,
  ADD_KEYWORD_FILTER,
  ADD_LOCATION_FILTER,
  ADD_SCIENTIFIC_CONDITION,
  ADD_TO_BATCH,
  ADD_TYPE_FILTER,
  AddAttachmentComplete,
  AddGroupFilterAction,
  AddKeywordFilterAction,
  AddLocationFilterAction,
  AddScientificConditionAction,
  AddTypeFilterAction,
  CHANGE_PAGE,
  ChangePageAction,
  CLEAR_BATCH,
  CLEAR_FACETS,
  CLEAR_SELECTION,
  CURRENT_BLOCKS_COMPLETE,
  DATABLOCKS,
  DELETE_ATTACHMENT,
  DELETE_ATTACHMENT_COMPLETE,
  DeleteAttachmentComplete,
  DESELECT_DATASET,
  DeselectDatasetAction,
  FETCH_DATASETS,
  FETCH_DATASETS_COMPLETE,
  FETCH_DATASETS_FAILED,
  FETCH_FACET_COUNTS,
  FETCH_FACET_COUNTS_COMPLETE,
  FETCH_FACET_COUNTS_FAILED,
  FetchDatasetsCompleteAction,
  FetchFacetCountsCompleteAction,
  FILTER_UPDATE,
  FILTER_VALUE_UPDATE,
  PREFILL_BATCH_COMPLETE,
  PREFILL_FILTERS,
  PrefillBatchCompleteAction,
  PrefillFiltersAction,
  REMOVE_FROM_BATCH,
  REMOVE_GROUP_FILTER,
  REMOVE_KEYWORD_FILTER,
  REMOVE_LOCATION_FILTER,
  REMOVE_SCIENTIFIC_CONDITION,
  REMOVE_TYPE_FILTER,
  RemoveFromBatchAction,
  RemoveGroupFilterAction,
  RemoveKeywordFilterAction,
  RemoveLocationFilterAction,
  RemoveScientificConditionAction,
  RemoveTypeFilterAction,
  SAVE_DATASET,
  SAVE_DATASET_COMPLETE,
  SAVE_DATASET_FAILED,
  SEARCH_ID_COMPLETE,
  SearchIDCompleteAction,
  SELECT_ALL_DATASETS,
  SELECT_CURRENT,
  SELECT_DATASET,
  SelectDatasetAction,
  SET_DATE_RANGE,
  SET_SEARCH_TERMS,
  SET_TEXT_FILTER,
  SET_VIEW_MODE,
  SetDateRangeFilterAction,
  SetSearchTermsAction,
  SetTextFilterAction,
  SetViewModeAction,
  SORT_BY_COLUMN,
  SortByColumnAction
} from "state-management/actions/datasets.actions";

import {
  DatasetState,
  initialDatasetState
} from "state-management/state/datasets.store";
import { ArchViewMode } from "state-management/models";

export function datasetsReducer(
  state: DatasetState = initialDatasetState,
  action: Action
): DatasetState {
  if (action.type.indexOf("[Dataset]") !== -1) {
    console.log("Action came in! " + action.type);
  }

  switch (action.type) {
    case ADD_ATTACHMENT: {
      return { ...state, addingAttachment: true };
    }

    case ADD_ATTACHMENT_COMPLETE: {
      const attachment = (action as AddAttachmentComplete).attachment;
      const attachments = state.currentSet.datasetattachments;
      const attach2 = new Set(attachments);
      attach2.add(attachment);

      return {
        ...state,
        addingAttachment: false,
        currentSet: {
          ...state.currentSet,
          datasetattachments: Array.from(attach2)
        }
      };
    }

    case ADD_ATTACHMENT_FAILED: {
      return { ...state };
    }

    case DELETE_ATTACHMENT: {
      return { ...state, deletingAttachment: true };
    }

    case DELETE_ATTACHMENT_COMPLETE: {
      const attachments = state.currentSet.datasetattachments;
      const attachment_id = (action as DeleteAttachmentComplete).attachment_id;
      const attach2 = attachments.filter(
        attachment => attachment.id !== attachment_id
      );
      console.log("array index", attachment_id);
      return {
        ...state,
        deletingAttachment: false,
        currentSet: { ...state.currentSet, datasetattachments: attach2 }
      };
    }

    case SAVE_DATASET: {
      return { ...state };
    }

    case SAVE_DATASET_COMPLETE: {
      return { ...state, datasetsLoading: false };
    }

    case SAVE_DATASET_FAILED: {
      return { ...state, datasetsLoading: false };
    }

    case FETCH_DATASETS: {
      return { ...state, datasetsLoading: true };
    }

    case FETCH_DATASETS_COMPLETE: {
      const datasets = (action as FetchDatasetsCompleteAction).datasets;
      return { ...state, datasets, datasetsLoading: false };
    }

    case FETCH_DATASETS_FAILED: {
      return { ...state, datasetsLoading: false };
    }

    case FETCH_FACET_COUNTS: {
      return { ...state, facetCountsLoading: true };
    }

    case FETCH_FACET_COUNTS_COMPLETE: {
      const {
        facetCounts,
        allCounts
      } = action as FetchFacetCountsCompleteAction;
      return {
        ...state,
        facetCounts,
        totalCount: allCounts,
        facetCountsLoading: false
      };
    }

    case FETCH_FACET_COUNTS_FAILED: {
      return { ...state, facetCountsLoading: false };
    }

    case FILTER_UPDATE: {
      const f = action["payload"];
      const group = f["ownerGroup"];

      if (group && !Array.isArray(group) && group.length > 0) {
        f["ownerGroup"] = [group];
      }

      const filters = { ...state.filters, ...f };
      alert(JSON.stringify(filters));
      return { ...state, filters, datasetsLoading: true, selectedSets: [] };
    }

    case PREFILL_FILTERS: {
      const { values } = action as PrefillFiltersAction;
      const filters = { ...state.filters, ...values };
      const searchTerms = filters.text || "";
      return { ...state, searchTerms, filters, hasPrefilledFilters: true };
    }

    case SET_SEARCH_TERMS: {
      const { terms } = action as SetSearchTermsAction;
      return { ...state, searchTerms: terms };
    }

    case ADD_LOCATION_FILTER: {
      const { location } = action as AddLocationFilterAction;
      const creationLocation = state.filters.creationLocation
        .concat(location)
        .filter((val, i, self) => self.indexOf(val) === i); // Unique
      const filters = { ...state.filters, creationLocation, skip: 0 };
      return { ...state, filters };
    }

    case REMOVE_LOCATION_FILTER: {
      const { location } = action as RemoveLocationFilterAction;
      const creationLocation = state.filters.creationLocation.filter(
        _ => _ !== location
      );
      const filters = { ...state.filters, creationLocation, skip: 0 };
      return { ...state, filters };
    }

    case ADD_GROUP_FILTER: {
      const { group } = action as AddGroupFilterAction;
      const ownerGroup = state.filters.ownerGroup
        .concat(group)
        .filter((val, i, self) => self.indexOf(val) === i); // Unique
      const filters = { ...state.filters, ownerGroup, skip: 0 };
      return { ...state, filters };
    }

    case REMOVE_GROUP_FILTER: {
      const { group } = action as RemoveGroupFilterAction;
      const ownerGroup = state.filters.ownerGroup.filter(_ => _ !== group);
      const filters = { ...state.filters, ownerGroup, skip: 0 };
      return { ...state, filters };
    }

    case ADD_TYPE_FILTER: {
      const { datasetType } = action as AddTypeFilterAction;
      const type = state.filters.type
        .concat(datasetType)
        .filter((val, i, self) => self.indexOf(val) === i); // Unique
      const filters = { ...state.filters, type, skip: 0 };
      return { ...state, filters };
    }

    case REMOVE_TYPE_FILTER: {
      const { datasetType } = action as RemoveTypeFilterAction;
      const type = state.filters.type.filter(_ => _ !== datasetType);
      const filters = { ...state.filters, type, skip: 0 };
      return { ...state, filters };
    }

    case SET_TEXT_FILTER: {
      const { text } = action as SetTextFilterAction;
      const filters = { ...state.filters, text, skip: 0 };
      return { ...state, filters };
    }

    case ADD_KEYWORD_FILTER: {
      const { keyword } = action as AddKeywordFilterAction;
      const keywords = state.filters.keywords
        .concat(keyword)
        .filter((val, i, self) => self.indexOf(val) === i); // Unique
      const filters = { ...state.filters, keywords, skip: 0 };
      return { ...state, filters };
    }

    case SET_DATE_RANGE: {
      const { begin, end } = action as SetDateRangeFilterAction;
      const oldTime = state.filters.creationTime;
      const creationTime = { ...oldTime, begin, end };
      const filters = { ...state.filters, creationTime };
      return { ...state, filters };
    }

    case REMOVE_KEYWORD_FILTER: {
      const { keyword } = action as RemoveKeywordFilterAction;
      const keywords = state.filters.keywords.filter(_ => _ !== keyword);
      const filters = { ...state.filters, keywords, skip: 0 };
      return { ...state, filters };
    }

    case CLEAR_FACETS: {
      const limit = state.filters.limit; // Save limit
      const filters = { ...initialDatasetState.filters, skip: 0, limit };
      return { ...state, filters, searchTerms: "" };
    }

    case CHANGE_PAGE: {
      const { page, limit } = action as ChangePageAction;
      const skip = page * limit;
      const filters = { ...state.filters, skip, limit };
      return {
        ...state,
        datasetsLoading: true,
        filters
      };
    }

    case SORT_BY_COLUMN: {
      const { column, direction } = action as SortByColumnAction;
      const sortField = column + (direction ? ":" + direction : "");
      const filters = { ...state.filters, sortField, skip: 0 };
      return { ...state, filters, datasetsLoading: true };
    }

    case SET_VIEW_MODE: {
      const modeToggle = (action as SetViewModeAction).modeToggle;
      let mode = {};

      switch (modeToggle) {
        case ArchViewMode.all:
          mode = {};
          break;
        case ArchViewMode.archivable:
          mode = { "datasetlifecycle.archivable": true, "datasetlifecycle.retrievable": false };
          break;
        case ArchViewMode.retrievable:
          mode = { "datasetlifecycle.retrievable": true, "datasetlifecycle.archivable": false };
          break;
        case ArchViewMode.work_in_progress:
          mode = {
            $or: [
              {
                "datasetlifecycle.retrievable": false,
                "datasetlifecycle.archivable": false
              },
              {
                "datasetlifecycle.retrievable": true,
                "datasetlifecycle.archivable": true
              }
            ]
          };
          break;
      }
      const filters = { ...state.filters, mode };
      return { ...state, filters, modeToggle };
    }

    case ADD_SCIENTIFIC_CONDITION: {
      const { condition } = action as AddScientificConditionAction;
      const currentFilters = state.filters;
      const currentScientific = currentFilters.scientific;
      const filters = {
        ...currentFilters,
        scientific: [...currentScientific, condition]
      };
      return { ...state, filters };
    }

    case REMOVE_SCIENTIFIC_CONDITION: {
      const { index } = action as RemoveScientificConditionAction;
      const currentFilters = state.filters;
      const scientific = [...currentFilters.scientific];
      scientific.splice(index, 1);
      const filters = { ...currentFilters, scientific };
      return { ...state, filters };
    }

    case FILTER_VALUE_UPDATE: {
      return { ...state, facetCountsLoading: true };
    }

    case SELECT_CURRENT:
    case CURRENT_BLOCKS_COMPLETE:
    case DATABLOCKS:
    case SEARCH_ID_COMPLETE: {
      const currentSet = (action as SearchIDCompleteAction).dataset;
      return { ...state, currentSet };
    }

    case SELECT_DATASET: {
      const dataset = (action as SelectDatasetAction).dataset;
      const alreadySelected = state.selectedSets.find(
        existing => dataset.pid === existing.pid
      );
      if (alreadySelected) {
        return state;
      } else {
        const selectedSets = state.selectedSets.concat(dataset);
        return { ...state, selectedSets };
      }
    }

    case DESELECT_DATASET: {
      const dataset = (action as DeselectDatasetAction).dataset;
      const selectedSets = state.selectedSets.filter(
        selectedSet => selectedSet.pid !== dataset.pid
      );
      return { ...state, selectedSets };
    }

    case SELECT_ALL_DATASETS: {
      return { ...state, selectedSets: [...state.datasets] };
    }

    case CLEAR_SELECTION: {
      return { ...state, selectedSets: [] };
    }

    case ADD_TO_BATCH: {
      const batchedPids = state.batch.map(dataset => dataset.pid);
      const addition = state.selectedSets.filter(
        dataset => batchedPids.indexOf(dataset.pid) === -1
      );
      const batch = [...state.batch, ...addition];
      return { ...state, batch };
    }

    case REMOVE_FROM_BATCH: {
      const { dataset } = action as RemoveFromBatchAction;
      const batch = state.batch.filter(
        dataset2 => dataset2.pid !== dataset.pid
      );
      return { ...state, batch };
    }

    case CLEAR_BATCH: {
      return { ...state, batch: [] };
    }

    case PREFILL_BATCH_COMPLETE: {
      const { batch } = action as PrefillBatchCompleteAction;
      return { ...state, batch };
    }

    default: {
      return state;
    }
  }
}
