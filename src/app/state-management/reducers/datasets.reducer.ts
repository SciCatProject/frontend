import { Action } from '@ngrx/store';
import { RawDataset } from 'shared/sdk/models';

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
} from 'state-management/actions/datasets.actions';

import { DatasetState, initialDatasetState } from 'state-management/state/datasets.store';
import { DatepickerState } from 'shared/modules/datepicker/datepicker.store';
import { datepickerReducer } from 'shared/modules/datepicker/datepicker.reducer';

export function datasetsReducer(state = initialDatasetState, action: Action) {
    if (action.type.indexOf('[DatePicker]') !== -1) {
        console.log('Action came in! ' + action.type);

        // There must be a more appropriate way to deal with datepicker actions than this
    	return {...state, datepicker: datepickerReducer(state.datepicker, action)};
  	}

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
	
    	case SEARCH_COMPLETE: {
    		const datasets = <RawDataset[]>action['payload'];
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
    		return {...state, filterValues};
    	}
		
		case SELECT_CURRENT:
		case CURRENT_BLOCKS_COMPLETE:
    	case SEARCH_ID_COMPLETE: {
    		const currentSet = <RawDataset>action['payload'];
    		return {...state, currentSet};
    	}
		
		case SELECTED_DATABLOCKS_COMPLETE:
    	case SELECTED_UPDATE: {
    		const selectedSets = <RawDataset[]>action['payload'];
    		return {...state, selectedSets};
    	}
	
    	case TOTAL_UPDATE: {
    		const totalSets = <number>action['payload'];
    		return {...state, totalSets};
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
