import { Action } from '@ngrx/store';
import { Dataset } from 'shared/sdk/models';

import {
    FILTER_UPDATE,
    FILTER_UPDATE_COMPLETE,

    SELECT_CURRENT,
    SELECTED_UPDATE,
    TOTAL_UPDATE,
    FILTER_VALUE_UPDATE,

    CURRENT_BLOCKS_COMPLETE,
    SEARCH_ID_COMPLETE,
    SELECTED_DATABLOCKS_COMPLETE,
    SEARCH_COMPLETE,
    ADD_GROUPS_COMPLETE,

    SELECT_DATASET,
    SelectDatasetAction,
    DeselectDatasetAction,
    DESELECT_DATASET,
    GO_TO_PAGE,
    GoToPageAction,
    SORT_BY_COLUMN,
    SortByColumnAction,
    CLEAR_SELECTION,
    SetViewModeAction,
    SET_VIEW_MODE,
} from 'state-management/actions/datasets.actions';

import { DatasetState, initialDatasetState } from 'state-management/state/datasets.store';

export function datasetsReducer(state = initialDatasetState, action: Action) {
    if (action.type.indexOf('[Dataset]') !== -1) {
        console.log('Action came in! ' + action.type);
    }

    switch (action.type) {
        case FILTER_UPDATE: {
            const f = action['payload'];
            const group = f['ownerGroup'];

            if (group && !Array.isArray(group) && group.length > 0) {
                f['ownerGroup'] = [group];
            }

            return {...state, activeFilters: f, loading: true, selectedSets: []};
        }

        case GO_TO_PAGE: {
            const page = (action as GoToPageAction).page;
            const skip = page * state.itemsPerPage2;
            const activeFilters = {...state.activeFilters, skip};
            return {
                ...state,
                activeFilters,
                currentPage2: page
            };
        }

        case SORT_BY_COLUMN: {
            const {column, direction} = action as SortByColumnAction;
            const sortField = column + ' ' + direction;
            const activeFilters = {...state.activeFilters, sortField};
            return {...state, activeFilters};
        }

        case SET_VIEW_MODE: {
            const {mode} = action as SetViewModeAction;
            return {...state, mode};
        }

        case SEARCH_COMPLETE: {
            const datasets = <Dataset[]>action['payload'];
            return {...state, datasets, loading: false};
        }

        case ADD_GROUPS_COMPLETE: {
            const ownerGroup = action['payload'];
            const activeFilters = {...state.activeFilters, ownerGroup};
            return {...state, activeFilters, foo: 10};
        }

        case FILTER_VALUE_UPDATE:
        case FILTER_UPDATE_COMPLETE: {
            const filterValues = action['payload'];
            return {...state, filterValues, loading: false};
        }

        case SELECT_CURRENT:
        case CURRENT_BLOCKS_COMPLETE:
        case SEARCH_ID_COMPLETE: {
            const currentSet = <Dataset>action['payload'];
            return {...state, currentSet};
        }

        case SELECTED_DATABLOCKS_COMPLETE:
        case SELECTED_UPDATE: {
            const selectedSets = <Dataset[]>action['payload'];
            return {...state, selectedSets};
        }

        case TOTAL_UPDATE: {
            const totalSets = <number>action['payload'];
            return {...state, totalSets};
        }

        case SELECT_DATASET: {
            const dataset = (action as SelectDatasetAction).dataset;
            const selectedSets2 = state.selectedSets2.concat(dataset);
            return {...state, selectedSets2};
        }

        case DESELECT_DATASET: {
            const dataset = (action as DeselectDatasetAction).dataset;
            const selectedSets2 = state.selectedSets2.filter(selectedSet => selectedSet.pid !== dataset.pid);
            return {...state, selectedSets2};
        }

        case CLEAR_SELECTION: {
            return {...state, selectedSets2: []};
        }

        // TODO handle failed actions
        default: {
            return state;
        }
    }
}

export const getDatasets = (state: DatasetState) => state.datasets;
export const getActiveFilters = (state: DatasetState) => state.activeFilters;
export const getFilterValues = (state: DatasetState) => state.filterValues;
export const getCurrentSet = (state: DatasetState) => state.currentSet;
