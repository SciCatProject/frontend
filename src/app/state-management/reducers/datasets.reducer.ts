import { Action } from '@ngrx/store';
import {
    FILTER_UPDATE,

    SELECT_CURRENT,
    FILTER_VALUE_UPDATE,

    CURRENT_BLOCKS_COMPLETE,
    SEARCH_ID_COMPLETE,

    SELECT_DATASET,
    SelectDatasetAction,
    DeselectDatasetAction,
    DESELECT_DATASET,
    CHANGE_PAGE,
    ChangePageAction,
    SORT_BY_COLUMN,
    SortByColumnAction,
    CLEAR_SELECTION,
    SetViewModeAction,
    SET_VIEW_MODE,
    CLEAR_FACETS,
    FETCH_DATASETS_COMPLETE,
    FETCH_FACET_COUNTS_COMPLETE,
    ADD_LOCATION_FILTER,
    AddLocationFilterAction,
    RemoveLocationFilterAction,
    REMOVE_LOCATION_FILTER,
    ADD_GROUP_FILTER,
    AddGroupFilterAction,
    ADD_KEYWORD_FILTER,
    AddKeywordFilterAction,
    REMOVE_GROUP_FILTER,
    RemoveGroupFilterAction,
    REMOVE_KEYWORD_FILTER,
    RemoveKeywordFilterAction,
    SetSearchTermsAction,
    SET_SEARCH_TERMS,
    FETCH_DATASETS,
    FETCH_FACET_COUNTS,
    SetTextFilterAction,
    SET_TEXT_FILTER,
    FetchDatasetsCompleteAction,
    FetchFacetCountsCompleteAction,
    FETCH_FACET_COUNTS_FAILED,
    FETCH_DATASETS_FAILED,
    SET_DATE_RANGE,
    SetDateRangeFilterAction,
    REMOVE_TYPE_FILTER,
    RemoveTypeFilterAction,
    AddTypeFilterAction,
    ADD_TYPE_FILTER,
    PREFILL_FILTERS,
    PrefillFiltersAction,
    SearchIDCompleteAction,
    ADD_TO_BATCH,
    AddToBatchAction,
} from 'state-management/actions/datasets.actions';

import { DatasetState, initialDatasetState } from 'state-management/state/datasets.store';

export function datasetsReducer(state: DatasetState = initialDatasetState, action: Action): DatasetState {
    if (action.type.indexOf('[Dataset]') !== -1) {
        console.log('Action came in! ' + action.type);
    }

    switch (action.type) {
        case FETCH_DATASETS: {
            return {...state, datasetsLoading: true};
        }

        case FETCH_DATASETS_COMPLETE: {
            const datasets = (action as FetchDatasetsCompleteAction).datasets;
            return {...state, datasets, datasetsLoading: false};
        }

        case FETCH_DATASETS_FAILED: {
            return {...state, datasetsLoading: false};
        }

        case FETCH_FACET_COUNTS: {
            return {...state, facetCountsLoading: true};
        }

        case FETCH_FACET_COUNTS_COMPLETE: {
            const {facetCounts, allCounts} = action as FetchFacetCountsCompleteAction;
            return {...state, facetCounts, totalCount: allCounts, facetCountsLoading: false};
        }

        case FETCH_FACET_COUNTS_FAILED: {
            return {...state, facetCountsLoading: false};
        }

        case FILTER_UPDATE: {
            const f = action['payload'];
            const group = f['ownerGroup'];

            if (group && !Array.isArray(group) && group.length > 0) {
                f['ownerGroup'] = [group];
            }

            const filters = {...state.filters, ...f};
            alert(JSON.stringify(filters));
            return {...state, filters, datasetsLoading: true, selectedSets: []};
        }

        case PREFILL_FILTERS: {
            const {values} = (action as PrefillFiltersAction);
            const filters = {...state.filters, ...values};
            const searchTerms = filters.text || '';
            return {...state, searchTerms, filters, hasPrefilledFilters: true};
        }

        case SET_SEARCH_TERMS: {
            const {terms} = (action as SetSearchTermsAction);
            return {...state, searchTerms: terms};
        }

        case ADD_LOCATION_FILTER: {
            const {location} = action as AddLocationFilterAction;
            const creationLocation = state
                    .filters
                    .creationLocation
                    .concat(location)
                    .filter((val, i, self) => self.indexOf(val) === i); // Unique
            const filters = {...state.filters, creationLocation, skip: 0};
            return {...state, filters};
        }

        case REMOVE_LOCATION_FILTER: {
            const {location} = action as RemoveLocationFilterAction;
            const creationLocation = state.filters.creationLocation.filter(_ => _ !== location);
            const filters = {...state.filters, creationLocation, skip: 0};
            return {...state, filters};
        }

        case ADD_GROUP_FILTER: {
            const {group} = action as AddGroupFilterAction;
            const ownerGroup = state
                .filters
                .ownerGroup
                .concat(group)
                .filter((val, i, self) => self.indexOf(val) === i); // Unique
            const filters = {...state.filters, ownerGroup, skip: 0};
            return {...state, filters};
        }

        case REMOVE_GROUP_FILTER: {
            const {group} = action as RemoveGroupFilterAction;
            const ownerGroup = state.filters.ownerGroup.filter(_ => _ !== group);
            const filters = {...state.filters, ownerGroup, skip: 0};
            return {...state, filters};
        }

        case ADD_TYPE_FILTER: {
            const {datasetType} = action as AddTypeFilterAction;
            const type = state
                .filters
                .type
                .concat(datasetType)
                .filter((val, i, self) => self.indexOf(val) === i); // Unique
            const filters = {...state.filters, type, skip: 0};
            return {...state, filters};
        }

        case REMOVE_TYPE_FILTER: {
            const {datasetType} = action as RemoveTypeFilterAction;
            const type = state.filters.type.filter(_ => _ !== datasetType);
            const filters = {...state.filters, type, skip: 0};
            return {...state, filters};
        }

        case SET_TEXT_FILTER: {
            const {text} = action as SetTextFilterAction;
            const filters = {...state.filters, text, skip: 0};
            return {...state, filters};
        }

        case ADD_KEYWORD_FILTER: {
            const {keyword} = action as AddKeywordFilterAction;
            const keywords = state
                .filters
                .keywords
                .concat(keyword)
                .filter((val, i, self) => self.indexOf(val) === i); // Unique
            const filters = {...state.filters, keywords, skip: 0};
            return {...state, filters};
        }

        case SET_DATE_RANGE: {
            const {begin, end} = action as SetDateRangeFilterAction;
            const oldTime = state.filters.creationTime;
            const creationTime = {...oldTime, begin, end};
            const filters = {...state.filters, creationTime};
            return {...state, filters};
        }

        case REMOVE_KEYWORD_FILTER: {
            const {keyword} = action as RemoveKeywordFilterAction;
            const keywords = state.filters.keywords.filter(_ => _ !== keyword);
            const filters = {...state.filters, keywords, skip: 0};
            return {...state, filters};
        }

        case CLEAR_FACETS: {
            const limit = state.filters.limit; // Save limit
            const filters = {...initialDatasetState.filters, skip: 0, limit};
            return {...state, filters, searchTerms: ''};
        }

        case CHANGE_PAGE: {
            const {page, limit} = (action as ChangePageAction);
            const skip = page * limit;
            const filters = {...state.filters, skip, limit};
            return {
                ...state,
                datasetsLoading: true,
                filters
            };
        }

        case SORT_BY_COLUMN: {
            const {column, direction} = action as SortByColumnAction;
            const sortField = column + (direction ? ':' + direction : '');
            const filters = {...state.filters, sortField, skip: 0};
            return {...state, filters, datasetsLoading: true};
        }

        case SET_VIEW_MODE: {
            const {mode} = action as SetViewModeAction;
            const filters = {...state.filters, mode};
            return {...state, filters};
        }

        case FILTER_VALUE_UPDATE: {
            return {...state, facetCountsLoading: true};
        }

        case SELECT_CURRENT:
        case CURRENT_BLOCKS_COMPLETE:
        case SEARCH_ID_COMPLETE: {
            const currentSet = (action as SearchIDCompleteAction).dataset;
            return {...state, currentSet};
        }

        case SELECT_DATASET: {
            const dataset = (action as SelectDatasetAction).dataset;
            const alreadySelected = state.selectedSets.find(existing => dataset.pid === existing.pid);
            if (alreadySelected) {
                return state;
            } else {
                const selectedSets = state.selectedSets.concat(dataset);
                return {...state, selectedSets};
            }
        }

        case DESELECT_DATASET: {
            const dataset = (action as DeselectDatasetAction).dataset;
            const selectedSets = state.selectedSets.filter(selectedSet => selectedSet.pid !== dataset.pid);
            return {...state, selectedSets};
        }

        case CLEAR_SELECTION: {
            return {...state, selectedSets: []};
        }

        case ADD_TO_BATCH: {
            const batchedPids = state.batch.map(dataset => dataset.pid);
            const addition = state.selectedSets.filter(dataset => batchedPids.indexOf(dataset.pid) === -1);
            const batch = [...state.batch, ...addition];
            return {...state, batch};
        }
        default: {
            return state;
        }
    }
}
